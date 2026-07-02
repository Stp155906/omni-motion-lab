import Database from "better-sqlite3";
import { afterEach, describe, expect, it } from "vitest";

import {
  createProject,
  ensureSchema,
  listProjects,
  markProjectReady,
  seedDemoProjects,
  updatePlatformStatus,
} from "./db";

let db: Database.Database | null = null;

function testDb() {
  db = new Database(":memory:");
  ensureSchema(db);
  return db;
}

afterEach(() => {
  db?.close();
  db = null;
});

describe("creator project database", () => {
  it("seeds today's short-form projects with per-platform statuses", () => {
    const database = testDb();

    seedDemoProjects(database);

    const projects = listProjects(database);
    expect(projects).toHaveLength(3);
    expect(projects[0]?.title).toBe("5 hooks for cozy desk setups");
    expect(projects[0]?.platformStatuses).toEqual({
      "YouTube Shorts": "ready",
      TikTok: "needs_caption",
      "Facebook Reels": "draft",
    });
  });

  it("creates a project with draft statuses for every publishing platform", () => {
    const database = testDb();

    const project = createProject(database, {
      title: "Three sunrise b-roll ideas",
      niche: "Travel micro-vlogs",
      script: "Open on a quiet street, cut to sunrise, close with a packing tip.",
      voiceoverFilePath: "/Users/me/audio/sunrise.wav",
      sceneImageFolderPath: "/Users/me/scenes/sunrise",
      finalMp4Path: "/Users/me/renders/sunrise.mp4",
      platformCaptions: "Soft morning reset in 15 seconds.",
      hashtags: "#travel #shorts #sunrise",
    });

    expect(project.id).toBeGreaterThan(0);
    expect(project.platformStatuses).toEqual({
      "YouTube Shorts": "draft",
      TikTok: "draft",
      "Facebook Reels": "draft",
    });
  });

  it("marks a project ready by moving every platform into the publishing queue", () => {
    const database = testDb();
    const project = createProject(database, {
      title: "Batch content day",
      niche: "Creator workflow",
      script: "Show the batch plan, record setup, and export checklist.",
      voiceoverFilePath: "",
      sceneImageFolderPath: "",
      finalMp4Path: "",
      platformCaptions: "A calmer way to batch short videos.",
      hashtags: "#creatorworkflow #contenttips",
    });

    updatePlatformStatus(database, project.id, "TikTok", "ready");
    const readyProject = markProjectReady(database, project.id);

    expect(readyProject.readyToPublish).toBe(true);
    expect(readyProject.platformStatuses).toEqual({
      "YouTube Shorts": "queued",
      TikTok: "queued",
      "Facebook Reels": "queued",
    });
  });
});
