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
  columns: Record<string, string>;
};

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
  delivery = "inline",
}: {
  motionTemplateId: string;
  styleTemplateId: string;
  storybeat: string;
  storybeatIndex: number;
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

  return {
    model: OMNI_FLASH_MODEL,
    input: `${cameraMotionPrompt} based on the user script: ${storybeat}.`,
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

export function parseStorybeatCsv(input: string): StorybeatRow[] {
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
