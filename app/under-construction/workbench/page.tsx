import Link from "next/link";

const section = {
  title: "The Workbench",
  description: "Engineering portfolio, code experiments, and build logs.",
};

export default function UnderConstruction() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl text-center space-y-6">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Under Construction</p>
        <h1 className="text-4xl md:text-5xl font-serif">{section.title} is still growing.</h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          {section.description} I&apos;m actively shaping this space to make it meaningful, thoughtful, and worth your
          time. Please check back soon for updates — or follow along on social for early drops.
        </p>

        <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 space-y-2">
          <p className="font-semibold text-slate-200">What to expect:</p>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• Fresh stories, notes, and experiments</li>
            <li>• Visuals and references from work in progress</li>
            <li>• Ways to connect, collaborate, or explore together</li>
          </ul>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center pt-4">
          <Link
            href="/"
            className="px-6 py-3 rounded-full bg-white text-slate-900 font-semibold hover:-translate-y-0.5 transition-transform"
          >
            ← Back to home
          </Link>
          <a
            href="mailto:aalok@aalokdeep.com"
            className="px-6 py-3 rounded-full border border-slate-600 text-slate-100 hover:-translate-y-0.5 transition-transform"
          >
            Contact Aalok
          </a>
        </div>
      </div>
    </main>
  );
}
