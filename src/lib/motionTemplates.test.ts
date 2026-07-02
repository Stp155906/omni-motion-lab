import { describe, expect, it } from "vitest";

import {
  animatorStyleTemplates,
  directorMotionTemplates,
  motionTemplates,
  templateSections,
} from "./motionTemplates";

describe("motion template examples", () => {
  it("provides OmniFlash-ready 9:16 template cards", () => {
    expect(motionTemplates.length).toBeGreaterThanOrEqual(6);
    expect(motionTemplates.every((template) => template.aspectRatio === "9:16"))
      .toBe(true);
    expect(
      motionTemplates.every((template) =>
        template.title.toLowerCase().includes("omni"),
      ),
    ).toBe(true);
    expect(
      motionTemplates.every((template) =>
        template.sourceUrl.includes("pexels"),
      ),
    ).toBe(true);
    expect(motionTemplates.every((template) => template.videoUrl.endsWith(".mp4")))
      .toBe(true);
  });

  it("groups templates into category rows for browsing", () => {
    expect(templateSections.length).toBeGreaterThanOrEqual(3);
    expect(templateSections.every((section) => section.templates.length === 4))
      .toBe(true);
    expect(
      templateSections.some((section) =>
        section.title.toLowerCase().includes("faceless"),
      ),
    ).toBe(true);
  });

  it("stores the provided macro pyramid template as the first reusable example", () => {
    expect(motionTemplates[0]?.id).toBe("omni-macro-pyramid");
    expect(motionTemplates[0]?.videoUrl).toBe(
      "/videos/macro-zoom-to-pyramid-transition.mp4",
    );
    expect(motionTemplates[0]?.posterUrl).toBe(
      "/videos/macro-zoom-to-pyramid-transition.jpg",
    );
    expect(motionTemplates[0]?.referencePrompt).toContain(
      "Continuous multi-planar macro-to-micro zoom",
    );
    expect(motionTemplates[0]?.referencePrompt).toContain(
      "colossal stone pyramid rising from granular sand dunes",
    );
  });

  it("defines the production dashboard director motion row", () => {
    expect(directorMotionTemplates.map((template) => template.title)).toEqual([
      "Macro-Micro Zoom",
      "Orbital Track",
      "Dolly Zoom",
      "Whip Pan",
    ]);
    expect(directorMotionTemplates.every((template) => template.aspectRatio === "9:16"))
      .toBe(true);
    expect(directorMotionTemplates[0]?.videoUrl).toBe(
      "/videos/macro-zoom-to-pyramid-transition.mp4",
    );
  });

  it("defines the production dashboard animator style row", () => {
    expect(animatorStyleTemplates.map((template) => template.title)).toEqual([
      "Scrapbook Animation",
      "Stick Figure Simplicity",
      "Hyperrealism Cinematography",
      "Cyberpunk Neon",
    ]);
    expect(animatorStyleTemplates.every((template) => template.aspectRatio === "9:16"))
      .toBe(true);
  });
});
