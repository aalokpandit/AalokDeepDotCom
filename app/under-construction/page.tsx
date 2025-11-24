import Link from "next/link";

export default function UnderConstructionIndex() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl text-center space-y-6">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Under Construction</p>
        <h1 className="text-4xl md:text-5xl font-serif">This section is under construction.</h1>
  <p className="text-lg text-slate-300 leading-relaxed">We are reworking this area. Please check back soon.</p>

        <div className="flex justify-center gap-4 pt-4">
          <Link href="/" className="px-6 py-3 rounded-full bg-white text-slate-900 font-semibold">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
