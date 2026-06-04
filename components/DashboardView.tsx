import { AlertTriangle, ArrowRight, CircleGauge, Sparkles } from 'lucide-react';

export interface AnalysisResult {
  techStack: string[];
  architectureType: string;
  summary: string;
  onboardingSteps: string[];
  potentialRisks: string[];
  complexityScore: number;
}

type DashboardViewProps = {
  analysis: AnalysisResult;
  projectName?: string;
};

function clampScore(score: number) {
  return Math.min(100, Math.max(0, score));
}

function getScoreTone(score: number) {
  if (score < 35) {
    return 'from-emerald-400 to-cyan-400';
  }

  if (score < 70) {
    return 'from-amber-300 to-orange-400';
  }

  return 'from-rose-400 to-orange-500';
}

export function DashboardView({ analysis, projectName = 'RepoBoard Project' }: DashboardViewProps) {
  const score = clampScore(analysis.complexityScore);
  const circumference = 2 * Math.PI * 44;
  const offset = circumference - (score / 100) * circumference;

  return (
    <section className="grid gap-4 lg:grid-cols-12 lg:auto-rows-[minmax(180px,auto)]">
      <article className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-white/20 lg:col-span-7">
        <div className="flex h-full flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              Analysis Overview
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {projectName}
              </h2>
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
                {analysis.architectureType}
              </p>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
              {analysis.summary}
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-zinc-950/70 px-5 py-4">
            <div className="relative h-28 w-28 shrink-0">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="fill-none stroke-white/10"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className={`fill-none bg-gradient-to-r ${getScoreTone(score)} stroke-current text-cyan-300 transition-all duration-500`}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <CircleGauge className="mb-1 h-4 w-4 text-cyan-300" />
                <span className="text-2xl font-semibold text-white">{score}</span>
                <span className="text-[10px] uppercase tracking-[0.24em] text-zinc-400">
                  Complexity
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Complexity Score</p>
              <p className="max-w-[12rem] text-sm leading-6 text-zinc-300">
                A quick gauge of how much architectural overhead the codebase appears to have.
              </p>
            </div>
          </div>
        </div>
      </article>

      <article className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-white/20 lg:col-span-5">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Tech Stack</p>
            <h3 className="mt-1 text-lg font-semibold text-white">Frameworks and tooling</h3>
          </div>
          <div className="rounded-full border border-cyan-400/15 bg-cyan-400/10 p-2 text-cyan-200">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {analysis.techStack.length > 0 ? (
            analysis.techStack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-zinc-950/70 px-3 py-1.5 text-sm text-zinc-200 transition hover:border-cyan-400/25 hover:bg-cyan-400/10 hover:text-white"
              >
                {item}
              </span>
            ))
          ) : (
            <span className="text-sm text-zinc-500">No stack signals detected.</span>
          )}
        </div>
      </article>

      <article className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-white/20 lg:col-span-6">
        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Summary</p>
        <h3 className="mt-1 text-lg font-semibold text-white">Plain-English project overview</h3>
        <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base">
          {analysis.summary}
        </p>
      </article>

      <article className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-white/20 lg:col-span-6">
        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Quick-Start</p>
        <h3 className="mt-1 text-lg font-semibold text-white">Onboarding steps</h3>

        <ol className="mt-5 space-y-3">
          {analysis.onboardingSteps.length > 0 ? (
            analysis.onboardingSteps.map((step, index) => (
              <li
                key={`${step}-${index}`}
                className="flex gap-4 rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-400/15 bg-cyan-400/10 text-sm font-semibold text-cyan-200">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-zinc-300">{step}</p>
              </li>
            ))
          ) : (
            <li className="text-sm text-zinc-500">No onboarding steps were produced.</li>
          )}
        </ol>
      </article>

      <article className="rounded-[1.75rem] border border-amber-400/15 bg-amber-400/10 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 lg:col-span-12">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-2 text-amber-100">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-amber-100/70">
                  Architecture & Risks
                </p>
                <h3 className="mt-1 text-lg font-semibold text-amber-50">
                  Watch these implementation signals
                </h3>
              </div>
              <span className="inline-flex items-center rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-medium text-amber-100">
                {analysis.potentialRisks.length} flagged items
              </span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {analysis.potentialRisks.length > 0 ? (
                analysis.potentialRisks.map((risk) => (
                  <div
                    key={risk}
                    className="rounded-2xl border border-amber-200/10 bg-zinc-950/60 px-4 py-3 text-sm leading-6 text-zinc-200"
                  >
                    {risk}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-amber-200/10 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-200 md:col-span-2">
                  No major risks were identified from the available repository context.
                </div>
              )}
            </div>
          </div>
        </div>
      </article>

      <article className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-white/20 lg:col-span-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Workspace Context</p>
            <h3 className="mt-1 text-lg font-semibold text-white">What the dashboard is showing</h3>
          </div>
          <div className="text-sm text-zinc-400">
            Built for {projectName}
          </div>
        </div>
      </article>
    </section>
  );
}