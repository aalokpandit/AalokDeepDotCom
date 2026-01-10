import Link from "next/link";

export const metadata = {
  title: "Resume | Aalok Deep Pandit",
  description: "Download or view Aalok's resume PDF.",
};

export default function ResumePage() {
  const resumeUrl = process.env.NEXT_PUBLIC_RESUME_URL || "/resume/AalokDeepPanditResume.pdf";

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-serif font-bold text-slate-900 mb-4">Resume</h1>
      <p className="text-slate-600 mb-8">Choose how you would like to access the resume PDF.</p>

      <div className="mt-6">
        <a
          href={resumeUrl}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          View Resume (PDF)
        </a>
      </div>

      <div className="mt-10 text-sm text-slate-500">
        <p>
          If the link does not work, return to the <Link href="/" className="underline hover:text-blue-600">homepage</Link>.
        </p>
      </div>
    </main>
  );
}
