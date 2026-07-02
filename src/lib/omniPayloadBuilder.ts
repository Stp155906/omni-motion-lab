import {
  animatorStyleTemplates,
  directorMotionTemplates,
  type MotionTemplate,
} from "./motionTemplates";

export const OMNI_FLASH_MODEL = "gemini-omni-flash-preview";
export const OMNI_FLASH_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/interactions";
export const OMNI_FLASH_ASPECT_RATIO = "9:16";
export const OMNI_FLASH_DURATION_SECONDS = 4;

export type OmniTemplatePayload = {
  id: string;
  category: string;
  subStyle: string;
  apiPayload: {
    prompt: string;
    aspect_ratio: typeof OMNI_FLASH_ASPECT_RATIO;
    duration: typeof OMNI_FLASH_DURATION_SECONDS;
  };
};

export type OmniFlashPayload = {
  model: typeof OMNI_FLASH_MODEL;
  input: string;
  response_format: {
    type: "video";
    aspect_ratio: typeof OMNI_FLASH_ASPECT_RATIO;
    delivery: "inline" | "uri";
  };
  generation_config: {
    video_config: {
      task: "text_to_video";
      duration: typeof OMNI_FLASH_DURATION_SECONDS;
    };
  };
  metadata: {
    template_id: string;
    motion_template_id: string;
    style_template_id: string;
    storybeat_index: number;
  };
};

export type StorybeatRow = {
  index: number;
  text: string;
  startTime?: string;
  endTime?: string;
  columns: Record<string, string>;
};

export type ScenePlanChoice = {
  storybeatIndex: number;
  motionTemplateId?: string;
  styleTemplateId?: string;
  transitionPrompt?: string;
};

export type BatchPayloadPlan = {
  motionTemplateIds: string[];
  styleTemplateIds: string[];
  storybeats: StorybeatRow[];
  includeTransitions?: boolean;
  scenePlans?: ScenePlanChoice[];
};

export const transitionTemplateOptions = [
  {
    id: "match-object",
    title: "Object Match",
    prompt:
      "Use a match-object transition where the hero symbol, light source, or geometric shape aligns with the next scene.",
  },
  {
    id: "foreground-wipe",
    title: "Foreground Wipe",
    prompt:
      "Use parchment, shadow, smoke, or a close foreground object to wipe the frame into the next scene.",
  },
  {
    id: "light-sweep",
    title: "Light Sweep",
    prompt:
      "Use a warm gold light sweep that crosses the lens and motivates the next shot direction.",
  },
  {
    id: "camera-momentum",
    title: "Camera Momentum",
    prompt:
      "Carry the camera direction, speed, and parallax momentum into the next storybeat.",
  },
  {
    id: "portal-push",
    title: "Portal Push",
    prompt:
      "Push through a dark opening, eye, doorway, glyph, or glowing symbol as a portal into the next scene.",
  },
];

export const omniTemplatePayloads: OmniTemplatePayload[] = [
  {
    id: "tpl_macro_zoom_sketch",
    category: "Motion: Macro Zoom",
    subStyle: "Style: Minimal Sketch",
    apiPayload: {
      prompt:
        "An extreme macro close-up of a smooth, glossy head gradient. The camera rapidly pans back in a seamless micro-to-macro zoom, revealing a complete minimalist stick-figure character standing against a pure white whiteboard background. Clean 2D line art, high retention, distraction-free corporate explainer aesthetic.",
      aspect_ratio: OMNI_FLASH_ASPECT_RATIO,
      duration: OMNI_FLASH_DURATION_SECONDS,
    },
  },
  {
    id: "tpl_macro_zoom_vector",
    category: "Motion: Macro Zoom",
    subStyle: "Style: Rich Vector",
    apiPayload: {
      prompt:
        "An extreme macro close-up of a detailed cartoon eye. The camera rapidly zooms out, transitioning into a macro-to-world zoom that reveals a vibrant 2D storybook character with detailed long hair and a colorful dress, standing inside a lush green meadow background with flowing rivers. Highly saturated cartoon illustration.",
      aspect_ratio: OMNI_FLASH_ASPECT_RATIO,
      duration: OMNI_FLASH_DURATION_SECONDS,
    },
  },
  {
    id: "tpl_dolly_zoom_sketch",
    category: "Motion: Dolly Zoom",
    subStyle: "Style: Minimal Sketch",
    apiPayload: {
      prompt:
        "A dramatic kinetic dolly zoom (Vertigo effect). A clean stick-figure character stays fixed in the center frame while the minimalist background dramatically warps and stretches away. Solid black ink outline style on an architectural blueprint background, highly engaging technical aesthetic.",
      aspect_ratio: OMNI_FLASH_ASPECT_RATIO,
      duration: OMNI_FLASH_DURATION_SECONDS,
    },
  },
  {
    id: "tpl_dolly_zoom_vector",
    category: "Motion: Dolly Zoom",
    subStyle: "Style: Rich Vector",
    apiPayload: {
      prompt:
        "A cinematic dolly zoom. The animated cartoon character stands firmly in focus while the rich vector background of a vibrant futuristic city street stretches and skews with dramatic perspective shifts. Flat infographic cartoon styling, clean bold geometric lighting.",
      aspect_ratio: OMNI_FLASH_ASPECT_RATIO,
      duration: OMNI_FLASH_DURATION_SECONDS,
    },
  },
  {
    id: "tpl_orbital_sketch",
    category: "Motion: 360 Orbital Sweep",
    subStyle: "Style: Minimal Sketch",
    apiPayload: {
      prompt:
        "A continuous 360-degree orbital camera sweep rotating dynamically around a minimalist doodle stickman. The camera movement tracking is fast and perfectly smooth. Sharpie marker on a stark, light gray clean background.",
      aspect_ratio: OMNI_FLASH_ASPECT_RATIO,
      duration: OMNI_FLASH_DURATION_SECONDS,
    },
  },
  {
    id: "tpl_orbital_vector",
    category: "Motion: 360 Orbital Sweep",
    subStyle: "Style: Rich Vector",
    apiPayload: {
      prompt:
        "A dynamic 360-degree sweeping orbital camera tracking shot revolving seamlessly around a colorful 2D animated vector character. The lush illustrated forest background parallax-scrolls rapidly with high-speed depth of field blurring. Vibrant modern cartoon aesthetic.",
      aspect_ratio: OMNI_FLASH_ASPECT_RATIO,
      duration: OMNI_FLASH_DURATION_SECONDS,
    },
  },
];

const motionCategoryByTemplateId: Record<string, string> = {
  "director-macro-micro-zoom": "Motion: Macro Zoom",
  "director-orbital-track": "Motion: 360 Orbital Sweep",
  "director-dolly-zoom": "Motion: Dolly Zoom",
  "director-whip-pan": "Motion: Whip Pan",
};

const styleCategoryByTemplateId: Record<string, string> = {
  "animator-scrapbook-animation": "Style: Rich Vector",
  "animator-stick-figure-simplicity": "Style: Minimal Sketch",
  "animator-hyperrealism-cinematography": "Style: Rich Vector",
  "animator-cyberpunk-neon": "Style: Rich Vector",
};

export function findTemplatePayload(
  motionTemplateId: string,
  styleTemplateId: string,
) {
  const category = motionCategoryByTemplateId[motionTemplateId];
  const subStyle = styleCategoryByTemplateId[styleTemplateId];

  return omniTemplatePayloads.find(
    (template) =>
      template.category === category && template.subStyle === subStyle,
  );
}

export function buildOmniFlashPayload({
  motionTemplateId,
  styleTemplateId,
  storybeat,
  storybeatIndex,
  transitionPrompt,
  delivery = "inline",
}: {
  motionTemplateId: string;
  styleTemplateId: string;
  storybeat: string;
  storybeatIndex: number;
  transitionPrompt?: string;
  delivery?: "inline" | "uri";
}): OmniFlashPayload {
  const motionTemplate = getTemplateById(directorMotionTemplates, motionTemplateId);
  const styleTemplate = getTemplateById(animatorStyleTemplates, styleTemplateId);
  const templatePayload = findTemplatePayload(motionTemplateId, styleTemplateId);
  const cameraMotionPrompt =
    templatePayload?.apiPayload.prompt ??
    [
      motionTemplate.referencePrompt,
      styleTemplate.referencePrompt,
      "Render as a single continuous 9:16 short-form video template.",
    ].join(" ");

  const transitionText = transitionPrompt
    ? ` Transition continuity: ${transitionPrompt}`
    : "";

  return {
    model: OMNI_FLASH_MODEL,
    input: `${cameraMotionPrompt} based on the user script: ${storybeat}.${transitionText}`,
    response_format: {
      type: "video",
      aspect_ratio: OMNI_FLASH_ASPECT_RATIO,
      delivery,
    },
    generation_config: {
      video_config: {
        task: "text_to_video",
        duration: OMNI_FLASH_DURATION_SECONDS,
      },
    },
    metadata: {
      template_id: templatePayload?.id ?? "custom_motion_style_prompt",
      motion_template_id: motionTemplate.id,
      style_template_id: styleTemplate.id,
      storybeat_index: storybeatIndex,
    },
  };
}

export function planBatchPayloads({
  motionTemplateIds,
  styleTemplateIds,
  storybeats,
  includeTransitions = true,
  scenePlans = [],
}: BatchPayloadPlan) {
  const motionPool = ensureTemplatePool(motionTemplateIds, "motion");
  const stylePool = ensureTemplatePool(styleTemplateIds, "style");
  const scenePlanByIndex = new Map(
    scenePlans.map((scenePlan) => [scenePlan.storybeatIndex, scenePlan]),
  );

  return storybeats.map((storybeat, index) => {
    const scenePlan = scenePlanByIndex.get(storybeat.index);

    return buildOmniFlashPayload({
      motionTemplateId:
        scenePlan?.motionTemplateId ?? motionPool[index % motionPool.length],
      styleTemplateId: scenePlan?.styleTemplateId ?? stylePool[index % stylePool.length],
      storybeat: storybeat.text,
      storybeatIndex: storybeat.index,
      transitionPrompt: includeTransitions
        ? buildTransitionPrompt({
            previousStorybeat: storybeats[index - 1]?.text,
            currentStorybeat: storybeat.text,
            nextStorybeat: storybeats[index + 1]?.text,
            selectedTransition: scenePlan?.transitionPrompt,
          })
        : undefined,
    });
  });
}

export function parseStorybeatCsv(input: string): StorybeatRow[] {
  if (hasTimestampBlocks(input)) {
    return parseTimestampedStorybeats(input);
  }

  const rows = parseCsvRows(input.trim());

  if (rows.length === 0) {
    return [];
  }

  const [firstRow, ...bodyRows] = rows;
  const hasHeader = firstRow.some((cell) => normalizeColumn(cell) === "storybeat");
  const headers = hasHeader
    ? firstRow.map((cell) => normalizeColumn(cell) || "column")
    : ["storybeat"];
  const dataRows = hasHeader ? bodyRows : rows;

  return dataRows
    .map((row, rowIndex) => {
      const columns = Object.fromEntries(
        headers.map((header, columnIndex) => [header, row[columnIndex] ?? ""]),
      );
      const text =
        columns.storybeat ||
        columns.prompt_cue ||
        columns.prompt ||
        row.filter(Boolean).join(" ");

      return {
        index: rowIndex,
        text: text.trim(),
        columns,
      };
    })
    .filter((row) => row.text.length > 0);
}

function getTemplateById(templates: MotionTemplate[], templateId: string) {
  const template = templates.find((candidate) => candidate.id === templateId);

  if (!template) {
    throw new Error(`Unknown template id: ${templateId}`);
  }

  return template;
}

function ensureTemplatePool(templateIds: string[], type: "motion" | "style") {
  if (templateIds.length === 0) {
    throw new Error(`Select at least one ${type} template.`);
  }

  return templateIds;
}

function buildTransitionPrompt({
  previousStorybeat,
  currentStorybeat,
  nextStorybeat,
  selectedTransition,
}: {
  previousStorybeat?: string;
  currentStorybeat: string;
  nextStorybeat?: string;
  selectedTransition?: string;
}) {
  const previousCue = previousStorybeat
    ? `Previous scene: ${previousStorybeat}.`
    : "Begin from a clean opening frame.";
  const nextCue = nextStorybeat
    ? `Next scene: ${nextStorybeat}.`
    : "End on a clean hold frame.";

  return [
    previousCue,
    `Current scene must clearly express: ${currentStorybeat}.`,
    nextCue,
    selectedTransition ? `Selected transition: ${selectedTransition}` : "",
    "Design the last half-second to visually motivate the next shot using matching motion direction, foreground occlusion, light sweep, object match, or camera momentum. Avoid hard cuts inside the generated clip.",
  ]
    .filter(Boolean)
    .join(" ");
}

function normalizeColumn(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function parseCsvRows(input: string) {
  if (!input) return [];

  const rows: string[][] = [];
  let currentCell = "";
  let currentRow: string[] = [];
  let insideQuotes = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const nextChar = input[index + 1];

    if (char === '"' && nextChar === '"') {
      currentCell += '"';
      index += 1;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }
      currentRow.push(currentCell.trim());
      if (currentRow.some((cell) => cell.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = "";
    } else {
      currentCell += char;
    }
  }

  currentRow.push(currentCell.trim());
  if (currentRow.some((cell) => cell.length > 0)) {
    rows.push(currentRow);
  }

  return rows;
}

function hasTimestampBlocks(input: string) {
  return /^\s*\*{0,2}\d{1,2}:\d{2}\*{0,2}\s*$/m.test(input);
}

function parseTimestampedStorybeats(input: string): StorybeatRow[] {
  const lines = input.split(/\r?\n/);
  const blocks: Array<{ startTime: string; lines: string[] }> = [];
  let currentBlock: { startTime: string; lines: string[] } | null = null;

  for (const line of lines) {
    const time = extractTimestamp(line);

    if (time) {
      if (currentBlock) {
        blocks.push(currentBlock);
      }
      currentBlock = { startTime: time, lines: [] };
      continue;
    }

    if (!currentBlock) continue;

    const cleanedLine = line.trim();

    if (!cleanedLine || cleanedLine === "---") continue;

    currentBlock.lines.push(cleanedLine);
  }

  if (currentBlock) {
    blocks.push(currentBlock);
  }

  return blocks
    .map((block, index) => {
      const text = block.lines.join(" ").replace(/\s+/g, " ").trim();
      const endTime = blocks[index + 1]?.startTime;
      const columns: Record<string, string> = {
        storybeat: text,
        start_time: block.startTime,
      };

      if (endTime) {
        columns.end_time = endTime;
      }

      return {
        index,
        text,
        startTime: block.startTime,
        endTime,
        columns,
      };
    })
    .filter((row) => row.text.length > 0);
}

function extractTimestamp(line: string) {
  const match = line.trim().match(/^\*{0,2}(\d{1,2}:\d{2})\*{0,2}$/);

  return match?.[1];
}
