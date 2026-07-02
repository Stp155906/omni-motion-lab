"use client";

import { useState, type ChangeEvent, type DragEvent } from "react";
import {
  ArrowUpRight,
  Check,
  Download,
  FileText,
  LoaderCircle,
  Menu,
  Play,
  SlidersHorizontal,
  Sparkles,
  UploadCloud,
  WandSparkles,
} from "lucide-react";

import {
  animatorStyleTemplates,
  directorMotionTemplates,
  type MotionTemplate,
} from "@/lib/motionTemplates";

const csvMappings = [
  { label: "Storybeat", value: "storybeat", apiParam: "storybeat" },
  { label: "Prompt Cue", value: "prompt_cue", apiParam: "promptCue" },
  {
    label: "Visual Reference",
    value: "visual_reference",
    apiParam: "visualReference",
  },
  { label: "Duration", value: "duration_seconds", apiParam: "duration" },
];

type BatchResult = {
  index: number;
  storybeat: string;
  status: "payload_ready" | "completed" | "failed";
  videoUrl?: string;
  downloadName?: string;
  interactionId?: string;
  error?: string;
  payload: {
    input: string;
    metadata: {
      template_id: string;
    };
  };
};

function toggleTemplateId(currentIds: string[], templateId: string) {
  if (currentIds.includes(templateId)) {
    return currentIds.length === 1
      ? currentIds
      : currentIds.filter((currentId) => currentId !== templateId);
  }

  return [...currentIds, templateId];
}

export function OmniMotionDashboard() {
  const [selectedMotionIds, setSelectedMotionIds] = useState([
    directorMotionTemplates[0].id,
  ]);
  const [selectedStyleIds, setSelectedStyleIds] = useState([
    animatorStyleTemplates[0].id,
  ]);
  const [includeTransitions, setIncludeTransitions] = useState(true);
  const [scriptFileName, setScriptFileName] = useState("");
  const [scriptText, setScriptText] = useState("");
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);
  const [batchMode, setBatchMode] = useState("");
  const [generationError, setGenerationError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedMotions = directorMotionTemplates.filter((template) =>
    selectedMotionIds.includes(template.id),
  );
  const selectedStyles = animatorStyleTemplates.filter((template) =>
    selectedStyleIds.includes(template.id),
  );

  async function handleFile(file?: File) {
    if (!file) return;

    setScriptFileName(file.name);
    setScriptText(await file.text());
    setBatchResults([]);
    setGenerationError("");
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    void handleFile(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    void handleFile(event.dataTransfer.files?.[0]);
  }

  async function handleGenerateBatch() {
    setGenerationError("");
    setBatchResults([]);

    if (!scriptText.trim()) {
      setGenerationError("Upload a .CSV or .TXT storybeat script first.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/omniflash/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          motionTemplateIds: selectedMotionIds,
          styleTemplateIds: selectedStyleIds,
          includeTransitions,
          csvText: scriptText,
        }),
      });
      const data = (await response.json()) as {
        mode?: string;
        message?: string;
        error?: string;
        results?: BatchResult[];
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Batch generation failed.");
      }

      setBatchMode(data.mode ?? "");
      setBatchResults(data.results ?? []);

      if (data.message) {
        setGenerationError(data.message);
      }
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : "Batch generation failed.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f2f1ef] px-3 py-4 text-[#0d0d0f] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[18px] bg-[#fbfbfa] px-5 pb-10 pt-6 shadow-[0_24px_90px_rgba(15,15,15,0.10)] sm:px-8 sm:pb-14 sm:pt-8 lg:px-10">
        <nav className="flex items-center justify-between gap-4 text-sm font-medium">
          <div className="font-semibold tracking-tight">OmniFlash</div>
          <div className="hidden text-[#4f4b46] md:block">
            Based in: Motion Template Lab
          </div>
          <div className="flex items-center gap-5">
            <a className="hidden transition hover:text-[#b65b23] sm:block" href="#director">
              Director
            </a>
            <a className="hidden transition hover:text-[#b65b23] sm:block" href="#animator">
              Animator
            </a>
            <a className="hidden transition hover:text-[#b65b23] sm:block" href="#batch">
              Batch
            </a>
            <a className="hidden transition hover:text-[#b65b23] md:block" href="#batch">
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
            Pair one Director motion with one Animator style, then ingest
            storybeat scripts for bulk Omniflash generation.
          </p>
        </header>

        <div className="mt-12 flex flex-col gap-24">
          <TemplateCategory
            id="director"
            eyebrow="The Director"
            title="Find your perfect reel motion system"
            description="Technical camera movement recipes for controlling how every generated scene moves."
            templates={directorMotionTemplates}
            selectedTemplateIds={selectedMotionIds}
            onToggleTemplate={(templateId) =>
              setSelectedMotionIds((current) => toggleTemplateId(current, templateId))
            }
          />

          <TemplateCategory
            id="animator"
            eyebrow="The Animator"
            title="Choose the visual style wrapper"
            description="Aesthetic treatments that sit on top of the selected camera system and keep batches consistent."
            templates={animatorStyleTemplates}
            selectedTemplateIds={selectedStyleIds}
            onToggleTemplate={(templateId) =>
              setSelectedStyleIds((current) => toggleTemplateId(current, templateId))
            }
          />

          <BulkScriptIngestor
            selectedMotions={selectedMotions}
            selectedStyles={selectedStyles}
            includeTransitions={includeTransitions}
            scriptFileName={scriptFileName}
            batchMode={batchMode}
            batchResults={batchResults}
            generationError={generationError}
            isGenerating={isGenerating}
            onToggleTransitions={() => setIncludeTransitions((current) => !current)}
            onFileChange={handleFileChange}
            onDrop={handleDrop}
            onGenerateBatch={handleGenerateBatch}
          />
        </div>
      </div>
    </main>
  );
}

function TemplateCategory({
  id,
  eyebrow,
  title,
  description,
  templates,
  selectedTemplateIds,
  onToggleTemplate,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  templates: MotionTemplate[];
  selectedTemplateIds: string[];
  onToggleTemplate: (templateId: string) => void;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
        <div>
          <span className="inline-flex rounded-full bg-[#f0efec] px-4 py-2 text-xs font-semibold text-[#1d1a17]">
            {eyebrow}
          </span>
          <h2
            id={`${id}-heading`}
            className="mt-7 max-w-3xl text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[0.98] tracking-normal"
          >
            {title}
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
            aria-label={`Open all ${eyebrow} templates`}
            className="grid h-12 w-12 place-items-center rounded-full bg-black text-white transition hover:bg-[#c46325]"
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mt-5 max-w-2xl text-base leading-7 text-[#57524c]">
        {description}
      </p>

      <div
        className="-mx-5 mt-8 overflow-x-auto overscroll-x-contain px-5 pb-5 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10"
        aria-label={`${eyebrow} scrollable template row`}
      >
        <div className="grid snap-x snap-mandatory auto-cols-[minmax(17rem,78vw)] grid-flow-col gap-3 sm:auto-cols-[minmax(18rem,42vw)] lg:auto-cols-[17.5rem] xl:auto-cols-[18rem]">
          {templates.map((template) => (
            <SelectableTemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplateIds.includes(template.id)}
              onSelect={() => onToggleTemplate(template.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SelectableTemplateCard({
  template,
  isSelected,
  onSelect,
}: {
  template: MotionTemplate;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      className={`group relative isolate snap-start overflow-hidden rounded-[8px] bg-black transition ${
        isSelected
          ? "ring-2 ring-[#c46325] ring-offset-4 ring-offset-[#fbfbfa]"
          : "ring-1 ring-black/5"
      }`}
    >
      <button
        type="button"
        aria-pressed={isSelected}
        onClick={onSelect}
        className="block w-full text-left"
      >
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
      </button>

      <span
        className={`absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full shadow-lg transition ${
          isSelected
            ? "bg-[#c46325] text-white"
            : "bg-white text-black group-hover:scale-105"
        }`}
        aria-hidden="true"
      >
        {isSelected ? <Check className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
      </span>
    </article>
  );
}

function BulkScriptIngestor({
  selectedMotions,
  selectedStyles,
  includeTransitions,
  scriptFileName,
  batchMode,
  batchResults,
  generationError,
  isGenerating,
  onToggleTransitions,
  onFileChange,
  onDrop,
  onGenerateBatch,
}: {
  selectedMotions: MotionTemplate[];
  selectedStyles: MotionTemplate[];
  includeTransitions: boolean;
  scriptFileName: string;
  batchMode: string;
  batchResults: BatchResult[];
  generationError: string;
  isGenerating: boolean;
  onToggleTransitions: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDrop: (event: DragEvent<HTMLLabelElement>) => void;
  onGenerateBatch: () => void;
}) {
  return (
    <section id="batch" aria-labelledby="batch-heading">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
        <div>
          <span className="inline-flex rounded-full bg-[#f0efec] px-4 py-2 text-xs font-semibold text-[#1d1a17]">
            Turboscribe Layout
          </span>
          <h2
            id="batch-heading"
            className="mt-7 max-w-3xl text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[0.98] tracking-normal"
          >
            Ingest scripts and generate in bulk
          </h2>
        </div>
        <p className="max-w-sm text-base leading-7 text-[#57524c] lg:justify-self-end">
          Drop structured storybeat scripts, map columns to Omniflash API
          parameters, and send the whole batch with the selected motion recipe.
        </p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
        <label
          onDragOver={(event) => event.preventDefault()}
          onDrop={onDrop}
          className="flex min-h-[24rem] cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-black/18 bg-[#f0efec] px-6 py-10 text-center transition hover:border-[#c46325] hover:bg-[#ece7df]"
        >
          <input
            type="file"
            accept=".csv,.txt,text/csv,text/plain"
            className="sr-only"
            onChange={onFileChange}
          />
          <span className="grid h-16 w-16 place-items-center rounded-full bg-black text-white">
            <UploadCloud className="h-7 w-7" />
          </span>
          <span className="mt-6 text-2xl font-semibold tracking-normal">
            {scriptFileName || "Drop .CSV or .TXT storybeat scripts"}
          </span>
          <span className="mt-3 max-w-md text-sm leading-6 text-[#57524c]">
            Use rows for each storybeat, then map your prompt cue and visual
            reference columns before generation.
          </span>
          <span className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-black px-6 text-sm font-semibold text-white">
            <FileText className="h-4 w-4" />
            Choose script file
          </span>
        </label>

        <aside className="rounded-[8px] bg-black p-6 text-white">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-white/12">
              <SlidersHorizontal className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-2xl font-semibold leading-none tracking-normal">
                Batch configuration
              </h3>
              <p className="mt-2 text-sm text-white/62">
                One motion plus one style is active.
              </p>
            </div>
          </div>

          <dl className="mt-8 grid gap-3 text-sm">
            <div className="rounded-[8px] bg-white/8 p-4">
              <dt className="text-white/55">Selected Motions</dt>
              <dd className="mt-1 text-lg font-semibold">
                {formatSelectedTemplates(selectedMotions)}
              </dd>
            </div>
            <div className="rounded-[8px] bg-white/8 p-4">
              <dt className="text-white/55">Selected Styles</dt>
              <dd className="mt-1 text-lg font-semibold">
                {formatSelectedTemplates(selectedStyles)}
              </dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={onToggleTransitions}
            aria-pressed={includeTransitions}
            className={`mt-4 flex w-full items-center justify-between rounded-[8px] border p-4 text-left transition ${
              includeTransitions
                ? "border-[#c46325] bg-[#c46325]/18"
                : "border-white/10 bg-white/6"
            }`}
          >
            <span>
              <span className="block text-sm font-semibold">
                Transition prompts
              </span>
              <span className="mt-1 block text-sm leading-5 text-white/58">
                Add previous and next storybeat context so each scene is built
                to flow into the next one.
              </span>
            </span>
            <span
              className={`ml-4 grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                includeTransitions ? "bg-[#c46325] text-white" : "bg-white/12"
              }`}
            >
              {includeTransitions ? <Check className="h-4 w-4" /> : null}
            </span>
          </button>

          <div className="mt-8">
            <h4 className="text-sm font-semibold uppercase tracking-normal text-white/70">
              CSV to Omniflash API
            </h4>
            <div className="mt-4 grid gap-3">
              {csvMappings.map((mapping) => (
                <label
                  key={mapping.apiParam}
                  className="grid gap-2 rounded-[8px] border border-white/10 bg-white/6 p-3 text-sm"
                >
                  <span className="text-white/58">{mapping.label}</span>
                  <select
                    defaultValue={mapping.value}
                    className="min-h-11 rounded-[8px] border border-white/12 bg-black px-3 text-white outline-none transition focus:border-[#c46325]"
                    aria-label={`Map ${mapping.label}`}
                  >
                    <option value="storybeat">storybeat</option>
                    <option value="prompt_cue">prompt_cue</option>
                    <option value="visual_reference">visual_reference</option>
                    <option value="duration_seconds">duration_seconds</option>
                    <option value="caption">caption</option>
                  </select>
                </label>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm leading-6 text-[#57524c]">
          Current recipe pool: {selectedMotions.length} motion
          {selectedMotions.length === 1 ? "" : "s"} with {selectedStyles.length} style
          {selectedStyles.length === 1 ? "" : "s"}, rotated across storybeat
          rows{includeTransitions ? " with transition continuity prompts" : ""}.
        </p>
        <button
          type="button"
          onClick={onGenerateBatch}
          disabled={isGenerating}
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-black px-7 text-sm font-semibold text-white transition hover:bg-[#c46325] disabled:cursor-wait disabled:bg-black/55"
        >
          {isGenerating ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <WandSparkles className="h-4 w-4" />
          )}
          {isGenerating ? "Generating batch..." : "Generate Batch via Omniflash API"}
        </button>
      </div>

      {generationError ? (
        <p className="mt-4 rounded-[8px] bg-[#f0efec] px-4 py-3 text-sm font-medium text-[#8a3f16]">
          {generationError}
        </p>
      ) : null}

      {batchResults.length > 0 ? (
        <div className="mt-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-2xl font-semibold tracking-normal">
                Generated batch rows
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#57524c]">
                {batchMode === "payload_preview"
                  ? "Preview mode built the exact API payloads. Add GEMINI_API_KEY to execute real videos."
                  : "Completed Omni Flash rows return as local downloadable MP4 files."}
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {batchResults.map((result) => (
              <article
                key={`${result.index}-${result.payload.metadata.template_id}`}
                className="rounded-[8px] border border-black/10 bg-[#f0efec] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase text-[#8b8177]">
                      Storybeat {result.index + 1} · {result.status}
                    </p>
                    <h4 className="mt-2 text-lg font-semibold leading-tight">
                      {result.storybeat}
                    </h4>
                  </div>
                  {result.videoUrl ? (
                    <a
                      href={result.videoUrl}
                      download={result.downloadName}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-black text-white transition hover:bg-[#c46325]"
                      aria-label={`Download video for storybeat ${result.index + 1}`}
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>

                {result.videoUrl ? (
                  <video
                    src={result.videoUrl}
                    className="mt-4 aspect-[9/16] max-h-[24rem] w-full rounded-[8px] bg-black object-cover"
                    controls
                    playsInline
                  />
                ) : (
                  <p className="mt-4 line-clamp-4 rounded-[8px] bg-white/70 p-3 font-mono text-xs leading-5 text-[#3c3731]">
                    {result.payload.input}
                  </p>
                )}

                {result.error ? (
                  <p className="mt-3 text-sm font-medium text-[#8a3f16]">
                    {result.error}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function formatSelectedTemplates(templates: MotionTemplate[]) {
  if (templates.length === 1) {
    return templates[0].title;
  }

  return `${templates.length} selected: ${templates
    .map((template) => template.title)
    .join(", ")}`;
}
