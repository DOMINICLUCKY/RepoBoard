import Link from 'next/link';
import { CircleDot, LayoutGrid } from 'lucide-react';

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-3 text-sm font-semibold tracking-[0.18em] text-zinc-100 uppercase"
          aria-label="RepoBoard home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_0_24px_rgba(34,211,238,0.12)] transition group-hover:border-cyan-300/50 group-hover:bg-cyan-400/15">
            <LayoutGrid className="h-4 w-4" />
          </span>
          <span className="leading-none">RepoBoard</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-200">
            <CircleDot className="h-3.5 w-3.5 fill-emerald-300 text-emerald-300" />
            <span>System online</span>
          </div>

          <Link
            href="#saved-repositories"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            Saved Repositories
          </Link>
        </div>
      </div>
    </header>
  );
}
