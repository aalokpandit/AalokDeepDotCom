import Link from "next/link";

export function generateStaticParams() {
  return [
    { section: "workbench" },
    { section: "journal" },
    { section: "gallery" },
  ];
}

export default function SectionFallback({ params }: { params: { section: string } }) {
  const { section } = params;

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl text-center space-y-6">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Under Construction</p>
        <h1 className="text-2xl font-semibold">{section} — Redirected</h1>
        <p className="text-sm text-slate-400">This path now maps to a static page. Use one of the links below.</p>

        <div className="flex justify-center gap-4 pt-4">
          <Link href="/under-construction/workbench" className="underline">
            Workbench
          </Link>
          <Link href="/under-construction/journal" className="underline">
            Journal
          </Link>
          <Link href="/under-construction/gallery" className="underline">
            Gallery
          </Link>
        </div>
      </div>
    </main>
  );
}

