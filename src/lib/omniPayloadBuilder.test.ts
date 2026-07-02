import { describe, expect, it } from "vitest";

import {
  OMNI_FLASH_ASPECT_RATIO,
  OMNI_FLASH_DURATION_SECONDS,
  OMNI_FLASH_MODEL,
  buildOmniFlashPayload,
  findTemplatePayload,
  planBatchPayloads,
  parseStorybeatCsv,
} from "./omniPayloadBuilder";

describe("Omni Flash payload builder", () => {
  it("maps selected dashboard cards to the imported template dictionary", () => {
    const template = findTemplatePayload(
      "director-dolly-zoom",
      "animator-stick-figure-simplicity",
    );

    expect(template?.id).toBe("tpl_dolly_zoom_sketch");
  });

  it("builds one constrained text-to-video payload per storybeat", () => {
    const payload = buildOmniFlashPayload({
      motionTemplateId: "director-orbital-track",
      styleTemplateId: "animator-stick-figure-simplicity",
      storybeat: "The founder discovers the hidden system.",
      storybeatIndex: 2,
    });

    expect(payload.model).toBe(OMNI_FLASH_MODEL);
    expect(payload.response_format.aspect_ratio).toBe(OMNI_FLASH_ASPECT_RATIO);
    expect(payload.generation_config.video_config.duration).toBe(
      OMNI_FLASH_DURATION_SECONDS,
    );
    expect(payload.generation_config.video_config.task).toBe("text_to_video");
    expect(payload.input).toContain("based on the user script:");
    expect(payload.input).toContain("The founder discovers the hidden system.");
    expect(payload.metadata.template_id).toBe("tpl_orbital_sketch");
    expect(payload.metadata.storybeat_index).toBe(2);
  });

  it("parses storybeat CSV rows with quoted commas", () => {
    const rows = parseStorybeatCsv(
      'storybeat,visual_reference\n"Open with a question, then reveal proof",ref-01\nShow the payoff,ref-02',
    );

    expect(rows).toEqual([
      {
        index: 0,
        text: "Open with a question, then reveal proof",
        columns: {
          storybeat: "Open with a question, then reveal proof",
          visual_reference: "ref-01",
        },
      },
      {
        index: 1,
        text: "Show the payoff",
        columns: {
          storybeat: "Show the payoff",
          visual_reference: "ref-02",
        },
      },
    ]);
  });

  it("rotates selected template pools and adds transition context per storybeat", () => {
    const storybeats = parseStorybeatCsv(
      "storybeat\nOpen on the ancient symbol\nReveal the desert portal\nLand on the pyramid",
    );
    const payloads = planBatchPayloads({
      motionTemplateIds: [
        "director-macro-micro-zoom",
        "director-dolly-zoom",
      ],
      styleTemplateIds: [
        "animator-stick-figure-simplicity",
        "animator-scrapbook-animation",
      ],
      storybeats,
      includeTransitions: true,
    });

    expect(payloads.map((payload) => payload.metadata.motion_template_id)).toEqual([
      "director-macro-micro-zoom",
      "director-dolly-zoom",
      "director-macro-micro-zoom",
    ]);
    expect(payloads.map((payload) => payload.metadata.style_template_id)).toEqual([
      "animator-stick-figure-simplicity",
      "animator-scrapbook-animation",
      "animator-stick-figure-simplicity",
    ]);
    expect(payloads[0].input).toContain("Transition continuity:");
    expect(payloads[0].input).toContain("Begin from a clean opening frame");
    expect(payloads[1].input).toContain("Previous scene: Open on the ancient symbol");
    expect(payloads[1].input).toContain("Next scene: Land on the pyramid");
    expect(payloads[2].input).toContain("End on a clean hold frame");
  });
});
