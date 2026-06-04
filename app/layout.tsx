import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/navbar';

export const metadata: Metadata = {
  title: 'RepoBoard',
  description: 'A modern developer dashboard for saved repositories.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(63,63,70,0.18),_transparent_35%),linear-gradient(to_bottom,_rgba(24,24,27,0.98),_rgba(9,9,11,1))]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35" />
          <Navbar />
          <main className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
