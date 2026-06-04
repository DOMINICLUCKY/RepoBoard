import type { AnalysisResult } from '@/components/DashboardView';

const mockAnalyses: Record<string, AnalysisResult> = {
  'nextjs/next.js': {
    techStack: ['React 18', 'TypeScript', 'Node.js', 'Webpack', 'Turbopack', 'PostgreSQL'],
    architectureType: 'Monorepo with Hybrid Rendering',
    summary:
      'Next.js is a production-grade React framework for full-stack web applications with built-in SSR, SSG, and API routes. The codebase demonstrates enterprise-scale TypeScript patterns with extensive test coverage and CI/CD integration.',
    onboardingSteps: [
      'Clone the repository and run `npm install`',
      'Review the contributing guidelines in CONTRIBUTING.md',
      'Set up the development environment with `npm run dev`',
      'Explore the `/examples` directory to understand feature implementations',
      'Run the test suite with `npm test` to verify your setup',
      'Check out the GitHub Discussions for open questions and feature requests',
    ],
    potentialRisks: [
      'Large monorepo with complex dependency graph; be careful with breaking changes',
      'Heavy TypeScript usage requires familiarity with advanced type patterns',
      'Continuous deployment pipeline; test thoroughly before pushing',
      'Performance-sensitive code in rendering engine; profiling recommended before optimization',
    ],
    complexityScore: 78,
  },
  'vercel/next.js': {
    techStack: ['React 18', 'TypeScript', 'Node.js', 'Webpack', 'Turbopack', 'PostgreSQL'],
    architectureType: 'Monorepo with Hybrid Rendering',
    summary:
      'Next.js is a production-grade React framework for full-stack web applications with built-in SSR, SSG, and API routes. The codebase demonstrates enterprise-scale TypeScript patterns with extensive test coverage and CI/CD integration.',
    onboardingSteps: [
      'Clone the repository and run `npm install`',
      'Review the contributing guidelines in CONTRIBUTING.md',
      'Set up the development environment with `npm run dev`',
      'Explore the `/examples` directory to understand feature implementations',
      'Run the test suite with `npm test` to verify your setup',
    ],
    potentialRisks: [
      'Large monorepo with complex dependency graph',
      'Heavy TypeScript usage requires familiarity with advanced type patterns',
    ],
    complexityScore: 78,
  },
  'facebook/react': {
    techStack: ['JavaScript', 'JSX', 'Babel', 'Webpack', 'Flow', 'Jest'],
    architectureType: 'UI Library with Component Architecture',
    summary:
      'React is a JavaScript library for building user interfaces with reusable components and efficient rendering. The architecture emphasizes reconciliation algorithms and unidirectional data flow patterns.',
    onboardingSteps: [
      'Fork and clone the React repository',
      'Run `npm install` to set up dependencies',
      'Build React using `npm run build`',
      'Run tests with `npm test` to ensure everything works',
      'Read the React contribution guide for pull request guidelines',
      'Start with small issues labeled "good first issue"',
    ],
    potentialRisks: [
      'Core library changes can have wide ecosystem impact',
      'Performance is critical; all optimizations need profiling data',
      'Backward compatibility requirements are strict',
      'Complex reconciliation logic requires deep React knowledge',
    ],
    complexityScore: 72,
  },
  'default': {
    techStack: ['Node.js', 'JavaScript/TypeScript', 'Git'],
    architectureType: 'Unknown Architecture',
    summary:
      'This repository appears to be a software project. Analyze the README and package.json to understand its purpose, dependencies, and architecture patterns.',
    onboardingSteps: [
      'Clone the repository to your local machine',
      'Read the README.md file thoroughly',
      'Review the CONTRIBUTING.md file if available',
      'Install dependencies using the appropriate package manager',
      'Set up the development environment following local setup instructions',
      'Run tests to verify the setup is correct',
    ],
    potentialRisks: [
      'Repository structure not immediately clear',
      'May require additional documentation review',
      'Dependencies may have security vulnerabilities',
      'Build and deployment process may be complex',
    ],
    complexityScore: 45,
  },
};

export function generateMockAnalysis(owner: string, repo: string): AnalysisResult {
  const key = `${owner}/${repo}`.toLowerCase();
  return mockAnalyses[key] || mockAnalyses['default'];
}
