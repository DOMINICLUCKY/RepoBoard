import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Analysis, { type AnalysisResult } from '../../../models/Analysis';

type GitHubRepoDetails = {
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
  default_branch: string;
  private: boolean;
};

type GitHubContentEntry = {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string | null;
  git_url: string | null;
  download_url: string | null;
  type: 'file' | 'dir' | 'symlink' | 'submodule';
};

type GitHubFileResponse = GitHubContentEntry & {
  content?: string;
  encoding?: string;
};

type RepoPayload = {
  repoUrl: string;
  owner: string;
  repo: string;
  repository: {
    name: string;
    fullName: string;
    description: string | null;
    stars: number;
    primaryLanguage: string | null;
    htmlUrl: string;
    defaultBranch: string;
  };
  rootTree: Array<{
    name: string;
    path: string;
    type: string;
    size: number;
  }>;
  packageJson: {
    exists: boolean;
    name: string | null;
    version: string | null;
    description: string | null;
    scripts: Record<string, string>;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    peerDependencies: Record<string, string>;
    optionalDependencies: Record<string, string>;
  } | null;
  readme: {
    exists: boolean;
    name: string | null;
    content: string | null;
  } | null;
  fetchedAt: string;
};

const GITHUB_REPO_URL_PATTERN =
  /^https:\/\/github\.com\/([^/\s?#]+)\/([^/\s?#]+?)(?:\.git)?\/?$/i;

function sanitizeText(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, ' ').trim();
  return cleaned.length > 0 ? cleaned : null;
}

function parseRepoUrl(repoUrl: string) {
  const trimmedUrl = sanitizeText(repoUrl);

  if (!trimmedUrl) {
    return null;
  }

  const match = trimmedUrl.match(GITHUB_REPO_URL_PATTERN);

  if (!match) {
    return null;
  }

  return {
    repoUrl: trimmedUrl,
    owner: match[1],
    repo: match[2].replace(/\.git$/i, ''),
  };
}

function getGitHubHeaders() {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'RepoBoard',
  };

  const token = process.env.GITHUB_TOKEN ?? process.env.GITHUB_API_TOKEN;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function fetchGitHubJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: getGitHubHeaders() });
  const rawBody = await response.text();
  let payload: any = null;

  if (rawBody) {
    try {
      payload = JSON.parse(rawBody);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const message = sanitizeText(payload?.message) ?? 'GitHub request failed.';
    const error = new Error(message);
    (error as Error & { status?: number; githubMessage?: string }).status = response.status;
    (error as Error & { status?: number; githubMessage?: string }).githubMessage = message;
    throw error;
  }

  return payload as T;
}

async function fetchGitHubFile(
  owner: string,
  repo: string,
  filePath: 'package.json' | 'README.md',
) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

  const response = await fetch(url, { headers: getGitHubHeaders() });

  if (response.status === 404) {
    return null;
  }

  const rawBody = await response.text();
  let payload: any = null;

  if (rawBody) {
    try {
      payload = JSON.parse(rawBody);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const message = sanitizeText(payload?.message) ?? 'GitHub file request failed.';
    const error = new Error(message);
    (error as Error & { status?: number; githubMessage?: string }).status = response.status;
    (error as Error & { status?: number; githubMessage?: string }).githubMessage = message;
    throw error;
  }

  return payload as GitHubFileResponse;
}

function decodeGitHubFileContent(file: GitHubFileResponse | null) {
  if (!file?.content || file.encoding !== 'base64') {
    return null;
  }

  return Buffer.from(file.content.replace(/\n/g, ''), 'base64').toString('utf8');
}

function sanitizeRootTree(rootContents: GitHubContentEntry[]) {
  return rootContents.map((entry) => ({
    name: sanitizeText(entry.name) ?? entry.name,
    path: sanitizeText(entry.path) ?? entry.path,
    type: entry.type,
    size: entry.size,
  }));
}

function sanitizePackageJson(content: string | null) {
  if (!content) {
    return null;
  }

  try {
    const parsed = JSON.parse(content) as Record<string, any>;

    return {
      exists: true,
      name: sanitizeText(parsed.name),
      version: sanitizeText(parsed.version),
      description: sanitizeText(parsed.description),
      scripts: parsed.scripts && typeof parsed.scripts === 'object' ? parsed.scripts : {},
      dependencies: parsed.dependencies && typeof parsed.dependencies === 'object' ? parsed.dependencies : {},
      devDependencies:
        parsed.devDependencies && typeof parsed.devDependencies === 'object' ? parsed.devDependencies : {},
      peerDependencies:
        parsed.peerDependencies && typeof parsed.peerDependencies === 'object' ? parsed.peerDependencies : {},
      optionalDependencies:
        parsed.optionalDependencies && typeof parsed.optionalDependencies === 'object'
          ? parsed.optionalDependencies
          : {},
    };
  } catch {
    return null;
  }
}

function sanitizeReadme(file: GitHubFileResponse | null) {
  if (!file) {
    return null;
  }

  return {
    exists: true,
    name: sanitizeText(file.name),
    content: decodeGitHubFileContent(file),
  };
}

function isRateLimitError(error: unknown) {
  return (
    error instanceof Error &&
    ((error as Error & { status?: number }).status === 403 ||
      /rate limit|secondary rate limit/i.test(error.message))
  );
}

function isPrivateOrMissingRepo(error: unknown) {
  return error instanceof Error && (error as Error & { status?: number }).status === 404;
}

function getAnthropicHeaders() {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return null;
  }

  return {
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json',
    'user-agent': 'RepoBoard',
  };
}

const CLAUDE_SYSTEM_PROMPT = `You are an Elite Enterprise Solutions Architect.

Your job is to analyze a GitHub repository payload and return a single strict JSON object only.

Rules:
- Output must be valid JSON.
- Output must be a single, un-nested JSON object.
- Do not wrap the JSON in markdown fences.
- Do not add commentary, headings, bullets, or prose.
- Do not include any keys outside the required interface.
- Use concise but meaningful strings.
- Complexity score must be an integer from 1 to 100.
- Infer the architecture from the repository metadata, root file tree, package.json, and README context.

Target interface:
{
  "techStack": string[],
  "architectureType": string,
  "summary": string,
  "onboardingSteps": string[],
  "potentialRisks": string[],
  "complexityScore": number
}`;

function buildClaudeUserPrompt(payload: RepoPayload) {
  return [
    'Analyze the following aggregated GitHub repository payload and return the analysis object exactly matching the required interface.',
    'Repository payload JSON:',
    JSON.stringify(payload, null, 2),
    'Return only the JSON object and ensure every field is populated from the available repository evidence.',
  ].join('\n\n');
}

function extractJsonObject(text: string) {
  const trimmed = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error('Claude response did not contain JSON.');
  }

  return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
}

function isAnalysisResult(value: unknown): value is AnalysisResult {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as AnalysisResult;

  return (
    Array.isArray(candidate.techStack) &&
    candidate.techStack.every((item) => typeof item === 'string') &&
    typeof candidate.architectureType === 'string' &&
    typeof candidate.summary === 'string' &&
    Array.isArray(candidate.onboardingSteps) &&
    candidate.onboardingSteps.every((item) => typeof item === 'string') &&
    Array.isArray(candidate.potentialRisks) &&
    candidate.potentialRisks.every((item) => typeof item === 'string') &&
    Number.isInteger(candidate.complexityScore) &&
    candidate.complexityScore >= 1 &&
    candidate.complexityScore <= 100
  );
}

async function runClaudeAnalysis(payload: RepoPayload): Promise<AnalysisResult> {
  const headers = getAnthropicHeaders();

  if (!headers) {
    throw new Error('Anthropic API key is not configured.');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1200,
      temperature: 0,
      system: CLAUDE_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: buildClaudeUserPrompt(payload),
        },
      ],
    }),
  });

  const responseText = await response.text();
  let responsePayload: any = null;

  if (responseText) {
    try {
      responsePayload = JSON.parse(responseText);
    } catch {
      responsePayload = null;
    }
  }

  if (!response.ok) {
    const message = sanitizeText(responsePayload?.error?.message ?? responsePayload?.message) ??
      'Anthropic request failed.';
    const error = new Error(message);
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }

  const textBlock = Array.isArray(responsePayload?.content)
    ? responsePayload.content.find((block: { type?: string; text?: string }) => block?.type === 'text' && typeof block.text === 'string')
    : null;

  if (!textBlock?.text) {
    throw new Error('Claude returned an empty response.');
  }

  const parsed = extractJsonObject(textBlock.text);

  if (!isAnalysisResult(parsed)) {
    throw new Error('Claude response did not match the required analysis schema.');
  }

  return {
    techStack: parsed.techStack.map((item) => item.trim()).filter(Boolean),
    architectureType: parsed.architectureType.trim(),
    summary: parsed.summary.trim(),
    onboardingSteps: parsed.onboardingSteps.map((item) => item.trim()).filter(Boolean),
    potentialRisks: parsed.potentialRisks.map((item) => item.trim()).filter(Boolean),
    complexityScore: parsed.complexityScore,
  };
}

export async function POST(request: NextRequest) {
  let body: { repoUrl?: unknown };

  try {
    body = (await request.json()) as { repoUrl?: unknown };
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body. Expected a repoUrl string.' },
      { status: 400 },
    );
  }

  if (typeof body.repoUrl !== 'string') {
    return NextResponse.json(
      { error: 'repoUrl must be provided as a string.' },
      { status: 400 },
    );
  }

  const parsedRepo = parseRepoUrl(body.repoUrl);

  if (!parsedRepo) {
    return NextResponse.json(
      { error: 'Invalid GitHub repository URL. Use https://github.com/owner/repo.' },
      { status: 400 },
    );
  }

  const { owner, repo, repoUrl } = parsedRepo;

  try {
    // Try to connect to MongoDB, but don't fail if it's not available
    let recentAnalysis = null;
    try {
      await dbConnect();

      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      recentAnalysis = await Analysis.findOne({
        owner,
        repoName: repo,
        analyzedAt: { $gte: twentyFourHoursAgo },
      })
        .sort({ analyzedAt: -1 })
        .lean();

      if (recentAnalysis?.analysis) {
        return NextResponse.json(recentAnalysis.analysis, { status: 200 });
      }
    } catch {
      // Database not available, continue with fresh analysis
    }

    const [repoDetails, rootContents, packageFile, readmeFile] = await Promise.all([
      fetchGitHubJson<GitHubRepoDetails>(`https://api.github.com/repos/${owner}/${repo}`),
      fetchGitHubJson<GitHubContentEntry[]>(`https://api.github.com/repos/${owner}/${repo}/contents`),
      fetchGitHubFile(owner, repo, 'package.json'),
      fetchGitHubFile(owner, repo, 'README.md'),
    ]);

    const packageJsonContent = decodeGitHubFileContent(packageFile);
    const sanitizedPackageJson = sanitizePackageJson(packageJsonContent);
    const sanitizedReadme = sanitizeReadme(readmeFile);

    const payload: RepoPayload = {
      repoUrl,
      owner,
      repo,
      repository: {
        name: sanitizeText(repoDetails.name) ?? repoDetails.name,
        fullName: sanitizeText(repoDetails.full_name) ?? repoDetails.full_name,
        description: sanitizeText(repoDetails.description),
        stars: repoDetails.stargazers_count,
        primaryLanguage: sanitizeText(repoDetails.language),
        htmlUrl: repoDetails.html_url,
        defaultBranch: sanitizeText(repoDetails.default_branch) ?? repoDetails.default_branch,
      },
      rootTree: sanitizeRootTree(rootContents),
      packageJson: sanitizedPackageJson
        ? {
            ...sanitizedPackageJson,
            exists: true,
          }
        : null,
      readme: sanitizedReadme,
      fetchedAt: new Date().toISOString(),
    };

    const analysisResult = await runClaudeAnalysis(payload);

    // Save to MongoDB if available
    try {
      await dbConnect();
      await Analysis.create({
        repoUrl,
        owner,
        repoName: repo,
        analyzedAt: new Date(),
        analysis: analysisResult,
      });
    } catch {
      // Database save failed, but still return the analysis
    }

    return NextResponse.json(analysisResult, { status: 200 });
  } catch (error) {
    if (isRateLimitError(error)) {
      return NextResponse.json(
        {
          error:
            'GitHub API rate limit exceeded. Try again later or configure a GITHUB_TOKEN for higher limits.',
        },
        { status: 429 },
      );
    }

    if (isPrivateOrMissingRepo(error)) {
      return NextResponse.json(
        {
          error:
            'Repository not found or unavailable. The repository may be private, deleted, or the URL may be incorrect.',
        },
        { status: 404 },
      );
    }

    if (error instanceof Error && error.message === 'Anthropic API key is not configured.') {
      return NextResponse.json(
        { error: 'Anthropic API key is missing. Set ANTHROPIC_API_KEY in the server environment.' },
        { status: 500 },
      );
    }

    if (error instanceof Error && error.message.includes('Claude response did not match the required analysis schema.')) {
      return NextResponse.json(
        { error: 'The AI response could not be parsed into the expected analysis format.' },
        { status: 502 },
      );
    }

    const message = error instanceof Error ? sanitizeText(error.message) : null;

    return NextResponse.json(
      {
        error: message ?? 'Failed to analyze the repository.',
      },
      { status: 500 },
    );
  }
}