import { AnalysisResult } from '@/components/DashboardView';
import { Clock, Eye } from 'lucide-react';

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

type RecentScansProps = {
  scans: RecentScan[];
};

export function RecentScans({ scans }: RecentScansProps) {
  if (scans.length === 0) {
    return (
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-lg shadow-black/20 backdrop-blur-sm">
        <Eye className="mx-auto mb-3 h-8 w-8 text-zinc-500" />
        <p className="text-sm text-zinc-400">No analyses yet. Analyze a repository to get started.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white">Recent Scans</h3>
        <p className="mt-1 text-sm text-zinc-400">Your latest repository analyses</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {scans.map((scan) => (
          <a
            key={scan.id}
            href={scan.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-400/25 hover:bg-white/8"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white truncate">
                  {scan.owner}/{scan.repoName}
                </p>
                <p className="mt-1 truncate text-xs text-zinc-400">{scan.architectureType || 'Unknown'}</p>
              </div>
              {scan.complexityScore && (
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-400/15 bg-cyan-400/10 text-xs font-semibold text-cyan-200">
                  {scan.complexityScore}
                </span>
              )}
            </div>

            {scan.summary && (
              <p className="mt-3 line-clamp-2 text-xs leading-5 text-zinc-300">{scan.summary}</p>
            )}

            <div className="mt-3 flex items-center gap-1 text-xs text-zinc-500">
              <Clock className="h-3 w-3" />
              <span>{new Date(scan.analyzedAt).toLocaleDateString()}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
