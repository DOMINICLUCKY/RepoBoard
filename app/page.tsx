'use client';

import { FormEvent, useMemo, useState } from 'react';
import { ArrowRight, Github, Loader2, Sparkles, RotateCw } from 'lucide-react';
import { DashboardView, type AnalysisResult } from '@/components/DashboardView';
import { RecentScans } from '@/components/RecentScans';
import { generateMockAnalysis } from '@/lib/mockAnalysis';

type RepoData = {
  url: string;
  owner: string;
  repository: string;
};

type RecentScan = {
  id: string;
  repoUrl: string;
  owner: string;
  repoName: string;
  analyzedAt: string;
  architectureType: string | null;
  complexityScore: number | null;
  summary: string | null;
};

const GITHUB_URL_PATTERN =
  /^https:\/\/github\.com\/(?!-)([A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?)\/([A-Za-z0-9._-]+?)(?:\.git)?\/?$/i;

export default function HomePage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [currentRepo, setCurrentRepo] = useState<RepoData | null>(null);
  const [loadingStage, setLoadingStage] = useState(0);
  const [recentScans, setRecentScans] = useState<RecentScan[]>([
    {
      id: '1',
      repoUrl: 'https://github.com/facebook/react',
      owner: 'facebook',
      repoName: 'react',
      analyzedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      architectureType: 'UI Library',
      complexityScore: 72,
      summary: 'A JavaScript library for building user interfaces with components',
    },
    {
      id: '2',
      repoUrl: 'https://github.com/vercel/next.js',
      owner: 'vercel',
      repoName: 'next.js',
      analyzedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      architectureType: 'React Framework',
      complexityScore: 78,
      summary: 'Production-grade React framework with SSR and API routes',
    },
  ]);

  const loadingSteps = useMemo(
    () => ['Validating repository', 'Scanning architecture', 'Preparing onboarding brief'],
    [],
  );

  const validateGithubUrl = (value: string) => {
    const trimmed = value.trim();
    const match = trimmed.match(GITHUB_URL_PATTERN);

    if (!match) {
      return null;
    }

    return {
      url: trimmed,
      owner: match[1],
      repository: match[2].replace(/\.git$/i, ''),
    } satisfies RepoData;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedRepo = validateGithubUrl(repoUrl);

    if (!parsedRepo) {
      setAnalysis(null);
      setError('Enter a valid public GitHub repository URL, like https://github.com/owner/repo.');
      return;
    }

    setError('');
    setIsLoading(true);
    setAnalysis(null);
    setCurrentRepo(parsedRepo);

    try {
      setLoadingStage(0);

      const loadingTimer = window.setInterval(() => {
        setLoadingStage((currentStage) => (currentStage + 1) % loadingSteps.length);
      }, 900);

      // Try to fetch from API, fallback to mock data if it fails
      let result: AnalysisResult;
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ repoUrl: parsedRepo.url }),
        });

        if (!response.ok) {
          throw new Error('API request failed');
        }

        result = await response.json();
      } catch {
        // Fallback to mock analysis
        result = generateMockAnalysis(parsedRepo.owner, parsedRepo.repository);
      }

      window.clearInterval(loadingTimer);

      // Add to recent scans
      const newScan: RecentScan = {
        id: Date.now().toString(),
        repoUrl: parsedRepo.url,
        owner: parsedRepo.owner,
        repoName: parsedRepo.repository,
        analyzedAt: new Date().toISOString(),
        architectureType: result.architectureType,
        complexityScore: result.complexityScore,
        summary: result.summary,
      };

      setRecentScans((prev) => [newScan, ...prev].slice(0, 5));
      setAnalysis(result);
      setRepoUrl('');
    } catch {
      setError('The analysis request failed. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingStage(0);
    }
  };

  if (analysis && currentRepo) {
    return (
      <section className="space-y-10 pb-20">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-white">
              {currentRepo.owner}/{currentRepo.repository}
            </h2>
            <p className="mt-1 text-sm text-zinc-400">Analysis complete</p>
          </div>
          <button
            onClick={() => {
              setAnalysis(null);
              setCurrentRepo(null);
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
          >
            <RotateCw className="h-4 w-4" />
            New Analysis
          </button>
        </div>

        <DashboardView analysis={analysis} projectName={`${currentRepo.owner}/${currentRepo.repository}`} />

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-lg shadow-black/20 backdrop-blur-sm">
          <RecentScans scans={recentScans} />
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-12">
      <div className="mx-auto flex min-h-[calc(100vh-14rem)] max-w-4xl flex-col justify-center gap-10 rounded-[2rem] border border-white/10 bg-white/5 px-6 py-10 shadow-2xl shadow-black/20 backdrop-blur-sm sm:px-10 lg:px-14">
      <div className="mx-auto max-w-3xl space-y-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
          <Sparkles className="h-3.5 w-3.5" />
          AI Onboarding Workspace
        </div>
        <h1 className="bg-gradient-to-r from-white via-cyan-100 to-slate-300 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
          RepoBoard
        </h1>
        <p className="mx-auto max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
          Instant AI Developer Onboarding & Architecture Analysis
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl space-y-4">
        <label htmlFor="github-repo" className="block text-sm font-medium text-zinc-200">
          Public GitHub repository URL
        </label>

        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-950/70 p-3 shadow-lg shadow-black/20 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-zinc-400">
            <Github className="h-5 w-5 text-zinc-500" />
            <input
              id="github-repo"
              type="url"
              value={repoUrl}
              onChange={(event) => {
                setRepoUrl(event.target.value);
                if (error) {
                  setError('');
                }
              }}
              placeholder="https://github.com/owner/repo"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
              autoComplete="off"
              spellCheck={false}
              inputMode="url"
              aria-invalid={Boolean(error)}
              aria-describedby="github-repo-help github-repo-error"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing
              </>
            ) : (
              <>
                Analyze Repo
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        <p id="github-repo-help" className="text-sm text-zinc-500">
          Only public GitHub repositories are accepted.
        </p>

        {error ? (
          <p id="github-repo-error" className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </p>
        ) : null}

        {isLoading ? (
          <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/8 p-5">
            <div className="space-y-4">
              <div className="h-3 w-40 animate-pulse rounded-full bg-white/10" />
              <div className="space-y-3">
                <div className="h-24 animate-pulse rounded-xl bg-white/8" />
                <div className="flex items-center gap-3 text-sm text-cyan-100">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.75)]" />
                  <span>{loadingSteps[loadingStage]}</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </form>
      </div>

      {recentScans.length > 0 && (
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-lg shadow-black/20 backdrop-blur-sm">
          <RecentScans scans={recentScans} />
        </div>
      )}
    </section>
  );
}
