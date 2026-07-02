import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  OMNI_FLASH_ENDPOINT,
  planBatchPayloads,
  parseStorybeatCsv,
  type ScenePlanChoice,
  type OmniFlashPayload,
} from "@/lib/omniPayloadBuilder";

export const runtime = "nodejs";

type BatchRequest = {
  motionTemplateId?: string;
  motionTemplateIds?: string[];
  styleTemplateId?: string;
  styleTemplateIds?: string[];
  includeTransitions?: boolean;
  scenePlans?: ScenePlanChoice[];
  csvText?: string;
};

type BatchResult = {
  index: number;
  storybeat: string;
  status: "payload_ready" | "completed" | "failed";
  videoUrl?: string;
  downloadName?: string;
  interactionId?: string;
  error?: string;
  payload: OmniFlashPayload;
};

export async function POST(request: Request) {
  const body = (await request.json()) as BatchRequest;
  const motionTemplateIds = normalizeTemplateIds(
    body.motionTemplateIds,
    body.motionTemplateId,
  );
  const styleTemplateIds = normalizeTemplateIds(
    body.styleTemplateIds,
    body.styleTemplateId,
  );
  const csvText = body.csvText;

  if (motionTemplateIds.length === 0 || styleTemplateIds.length === 0 || !csvText?.trim()) {
    return Response.json(
      {
        error:
          "Select at least one motion template, one style template, and upload csvText to generate a batch.",
      },
      { status: 400 },
    );
  }

  const storybeats = parseStorybeatCsv(csvText);

  if (storybeats.length === 0) {
    return Response.json(
      { error: "No storybeat rows were found in the uploaded script." },
      { status: 400 },
    );
  }

  const payloads = planBatchPayloads({
    motionTemplateIds,
    styleTemplateIds,
    storybeats,
    includeTransitions: body.includeTransitions ?? true,
    scenePlans: body.scenePlans ?? [],
  });

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return Response.json({
      mode: "payload_preview",
      message:
        "GEMINI_API_KEY is not set. Add it to .env.local to execute real Omni Flash generations.",
      results: payloads.map<BatchResult>((payload, index) => ({
        index,
        storybeat: storybeats[index].text,
        status: "payload_ready",
        payload,
      })),
    });
  }

  const results = await runBatchGenerations({
    apiKey,
    payloads,
    storybeats: storybeats.map((row) => row.text),
  });

  return Response.json({
    mode: "executed",
    results,
  });
}

function normalizeTemplateIds(templateIds?: string[], fallbackTemplateId?: string) {
  const ids = templateIds?.length ? templateIds : fallbackTemplateId ? [fallbackTemplateId] : [];

  return [...new Set(ids.filter((id) => id.trim().length > 0))];
}

async function runBatchGenerations({
  apiKey,
  payloads,
  storybeats,
}: {
  apiKey: string;
  payloads: OmniFlashPayload[];
  storybeats: string[];
}) {
  const results: BatchResult[] = [];

  for (const [index, payload] of payloads.entries()) {
    try {
      const response = await fetch(OMNI_FLASH_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(stripMetadata(payload)),
      });

      const data = (await response.json()) as Record<string, unknown>;

      if (!response.ok) {
        throw new Error(extractErrorMessage(data, response.status));
      }

      const video = extractVideoOutput(data);

      if (!video?.data) {
        throw new Error("Omni Flash response did not include inline video data.");
      }

      const downloadName = `omniflash-${Date.now()}-${index + 1}.mp4`;
      const videoUrl = await saveGeneratedVideo(video.data, downloadName);

      results.push({
        index,
        storybeat: storybeats[index],
        status: "completed",
        videoUrl,
        downloadName,
        interactionId: typeof data.id === "string" ? data.id : undefined,
        payload,
      });
    } catch (error) {
      results.push({
        index,
        storybeat: storybeats[index],
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown generation error",
        payload,
      });
    }
  }

  return results;
}

function stripMetadata(payload: OmniFlashPayload) {
  return {
    model: payload.model,
    input: payload.input,
    response_format: payload.response_format,
    generation_config: payload.generation_config,
  };
}

function extractVideoOutput(data: Record<string, unknown>) {
  const outputVideo = getObject(data.output_video);

  if (typeof outputVideo?.data === "string") {
    return {
      data: outputVideo.data,
      mimeType:
        typeof outputVideo.mime_type === "string"
          ? outputVideo.mime_type
          : "video/mp4",
    };
  }

  const steps = Array.isArray(data.steps) ? data.steps : [];

  for (const step of steps) {
    const content = getObject(step)?.content;

    if (!Array.isArray(content)) continue;

    for (const item of content) {
      const contentItem = getObject(item);

      if (contentItem?.type === "video" && typeof contentItem.data === "string") {
        return {
          data: contentItem.data,
          mimeType:
            typeof contentItem.mime_type === "string"
              ? contentItem.mime_type
              : "video/mp4",
        };
      }
    }
  }

  return null;
}

async function saveGeneratedVideo(base64Data: string, fileName: string) {
  const generatedDir = path.join(process.cwd(), "public", "generated");
  await mkdir(generatedDir, { recursive: true });
  await writeFile(path.join(generatedDir, fileName), Buffer.from(base64Data, "base64"));

  return `/generated/${fileName}`;
}

function extractErrorMessage(data: Record<string, unknown>, status: number) {
  const error = getObject(data.error);
  const message = typeof error?.message === "string" ? error.message : undefined;

  return message ?? `Omni Flash request failed with HTTP ${status}`;
}

function getObject(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}
