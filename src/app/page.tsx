import { ArrowUpRight, Menu, Play, Sparkles } from "lucide-react";

import {
  motionTemplates,
  templateSections,
  type MotionTemplate,
  type TemplateSection,
} from "@/lib/motionTemplates";

const featuredSection: TemplateSection = {
  id: "featured-motion",
  eyebrow: "Featured templates",
  title: "Find your perfect reel motion system",
  description:
    "Start with reusable OmniFlash examples that store the motion prompt, visual reference, and beat-level intent.",
  templates: motionTemplates.slice(0, 4),
};

export default function Home() {
  const sections = [featuredSection, ...templateSections];

  return (
    <main className="min-h-screen bg-[#f2f1ef] px-3 py-4 text-[#0d0d0f] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[18px] bg-[#fbfbfa] px-5 pb-10 pt-6 shadow-[0_24px_90px_rgba(15,15,15,0.10)] sm:px-8 sm:pb-14 sm:pt-8 lg:px-10">
        <nav className="flex items-center justify-between gap-4 text-sm font-medium">
          <div className="font-semibold tracking-tight">OmniFlash</div>
          <div className="hidden text-[#4f4b46] md:block">
            Based in: Motion Template Lab
          </div>
          <div className="flex items-center gap-5">
            <a className="hidden transition hover:text-[#b65b23] sm:block" href="#">
              Home
            </a>
            <a className="hidden transition hover:text-[#b65b23] sm:block" href="#">
              Templates
            </a>
            <a className="hidden transition hover:text-[#b65b23] sm:block" href="#">
              Prompts
            </a>
            <a className="hidden transition hover:text-[#b65b23] md:block" href="#">
              API Keys
            </a>
            <button
              type="button"
              aria-label="Open menu"
              className="grid h-10 w-10 place-items-center rounded-full border border-black/10 transition hover:bg-black hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>

        <header className="mt-20 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f0efec] px-4 py-2 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-[#c46325]" />
              Prompt-backed motion library
            </div>
            <h1 className="mt-7 max-w-5xl text-[clamp(3.1rem,8.2vw,6.7rem)] font-semibold leading-[0.94] tracking-normal">
              Choose a motion template for every story beat
            </h1>
          </div>
          <p className="max-w-sm pb-2 text-base leading-7 text-[#4f4b46] lg:justify-self-end">
            Each card is a reusable OmniFlash capability: a visual example,
            9:16 reel frame, and prompt cue you can apply to future scripts.
          </p>
        </header>

        <div className="mt-12 flex flex-col gap-24">
          {sections.map((section, index) => (
            <TemplateCategory
              key={section.id}
              section={section}
              showExperienceBand={index === 1}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

function TemplateCategory({
  section,
  showExperienceBand = false,
}: {
  section: TemplateSection;
  showExperienceBand?: boolean;
}) {
  return (
    <section>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
        <div>
          <span className="inline-flex rounded-full bg-[#f0efec] px-4 py-2 text-xs font-semibold text-[#1d1a17]">
            {section.eyebrow}
          </span>
          <h2 className="mt-7 max-w-3xl text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[0.98] tracking-normal">
            {section.title}
          </h2>
        </div>
        <div className="flex gap-2 lg:justify-end">
          <button
            type="button"
            className="min-h-12 rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:bg-[#c46325]"
          >
            See all templates
          </button>
          <button
            type="button"
            aria-label={`Open all ${section.eyebrow} templates`}
            className="grid h-12 w-12 place-items-center rounded-full bg-black text-white transition hover:bg-[#c46325]"
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mt-5 max-w-2xl text-base leading-7 text-[#57524c]">
        {section.description}
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {section.templates.map((template) => (
          <CompactTemplateCard key={template.id} template={template} />
        ))}
      </div>

      {showExperienceBand ? <PromptMemoryBand /> : null}
    </section>
  );
}

function CompactTemplateCard({ template }: { template: MotionTemplate }) {
  return (
    <article className="group relative isolate overflow-hidden rounded-[8px] bg-black">
      <div className="aspect-[9/16]">
        <video
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          poster={template.posterUrl}
          src={template.videoUrl}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/22 to-transparent" />

      <a
        href={template.sourceUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open stock source for ${template.title}`}
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white text-black shadow-lg transition group-hover:scale-105"
      >
        <ArrowUpRight className="h-4 w-4" />
      </a>

      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/18 px-3 py-1 text-[11px] font-semibold backdrop-blur-md">
          <Play className="h-3 w-3 fill-white" />
          {template.motion}
        </div>
        <h3 className="max-w-[15rem] text-2xl font-semibold leading-none tracking-normal">
          {template.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-5 text-white/80">
          {template.promptCue}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-normal text-white/72">
          <span className="truncate">{template.niche}</span>
          <span className="font-mono">{template.duration}</span>
        </div>
      </div>
    </article>
  );
}

function PromptMemoryBand() {
  const images = motionTemplates.slice(1, 4);

  return (
    <div className="mt-28 grid gap-8 lg:grid-cols-[120px_minmax(0,1fr)]">
      <div>
        <span className="inline-flex rounded-full bg-[#f0efec] px-4 py-2 text-xs font-semibold">
          Live prompts
        </span>
      </div>
      <div>
        <p className="max-w-4xl text-[clamp(2rem,4.3vw,3.8rem)] font-semibold leading-[1.02] tracking-normal">
          Store the exact camera vector, anchor object, and destination style so
          any script beat can mimic the same motion.
        </p>
        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {images.map((template) => (
            <div key={template.id} className="aspect-[9/16] overflow-hidden rounded-[8px] bg-black">
              <video
                src={template.videoUrl}
                poster={template.posterUrl}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
        <div className="mt-9 flex flex-col gap-4 text-sm font-medium sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-sm text-[#2f2b27]">
            Build once, then reuse the prompt recipe across every generated
            scene in the batch.
          </p>
          <div className="flex gap-2">
            <button className="min-h-12 rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:bg-[#c46325]">
              View prompt library
            </button>
            <button
              type="button"
              aria-label="Open prompt library"
              className="grid h-12 w-12 place-items-center rounded-full bg-black text-white transition hover:bg-[#c46325]"
            >
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
