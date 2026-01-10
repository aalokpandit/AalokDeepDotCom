// Version: 2025-11-28 - Deployment verification
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    const headshotUrl = process.env.NEXT_PUBLIC_HEADSHOT_URL || '/images/AalokPanditHeadshot.png';
    
    return (
    <div className="flex items-center justify-center p-6">
      <div className="max-w-3xl w-full space-y-12 py-8">
        {/* --- Header Section: Photo + Intro --- */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Photo Column */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="relative w-40 h-40 md:w-48 md:h-48">
              <Image
                src={headshotUrl}
                alt="Aalok Deep Pandit"
                fill
                className="object-cover rounded-2xl shadow-sm rotate-2 hover:rotate-0 transition-transform duration-300"
                priority
              />
            </div>
          </div>

          {/* Text Column */}
          <div className="space-y-5 text-center md:text-left">
            <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
              Welcome to Aalok&apos;s Corner of the Internet!
            </h1>

            <div className="space-y-4 text-lg leading-relaxed text-slate-600 font-light">
              <p>
                I&apos;m <strong>Aalok</strong>, a technologist and lifelong learner based in Los Angeles.
                My work lies at the intersection of platform engineering, product thinking, and the balance of art and
                science.
              </p>
              <p>
                This website serves as my <strong>digital garden</strong>, where I catalog my experiments, share insights
                on technology - particularly cloud infrastructure, APIs, and AI - and showcase the moments I capture through
                photography.
              </p>
              <p>
                I believe in <strong>learning in public</strong>, so I share my journey not as an expert, but as a fellow
                traveler. Join me as we explore technology, product development, and the world together, aiming for growth
                and understanding along the way.
              </p>
            </div>
          </div>
        </div>

                {/* --- The "Hub" Navigation Links --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-200 pt-10">
          <HubLink
            href="https://workbench.aalokdeep.com"
            icon="🛠️"
            title="The Workbench"
            description="Project portfolio, code experiments & build logs."
          />
          <HubLink
            href="https://journal.aalokdeep.com"
            icon="✍️"
            title="The Journal"
            description="Reflections on product, philosophy, and learning."
          />
          <HubLink
            href="/coming-soon?feature=The+Gallery"
            icon="📷"
            title="The Gallery"
            description="Visual stories and photography from LA & beyond."
          />
        </div>
      </div>
    </div>
  );
}

// Reusable Card Component for the Links
function HubLink({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="group block p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200"
    >
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
        {title} <span>→</span>
      </h3>
      <p className="text-sm text-slate-500 mt-2 leading-relaxed">{description}</p>
    </Link>
  );
}

