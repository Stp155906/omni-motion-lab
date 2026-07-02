import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";

export const PLATFORMS = [
  "YouTube Shorts",
  "TikTok",
  "Facebook Reels",
] as const;

export const STATUS_LABELS = [
  "draft",
  "needs_caption",
  "ready",
  "queued",
  "published",
  "failed",
] as const;

export type Platform = (typeof PLATFORMS)[number];
export type UploadStatus = (typeof STATUS_LABELS)[number];

export type ProjectInput = {
  title: string;
  niche: string;
  script: string;
  voiceoverFilePath: string;
  sceneImageFolderPath: string;
  finalMp4Path: string;
  platformCaptions: string;
  hashtags: string;
};

export type VideoProject = ProjectInput & {
  id: number;
  readyToPublish: boolean;
  createdAt: string;
  updatedAt: string;
  platformStatuses: Record<Platform, UploadStatus>;
};

type ProjectRow = {
  id: number;
  title: string;
  niche: string;
  script: string;
  voiceover_file_path: string;
  scene_image_folder_path: string;
  final_mp4_path: string;
  platform_captions: string;
  hashtags: string;
  ready_to_publish: number;
  created_at: string;
  updated_at: string;
};

type StatusRow = {
  platform: Platform;
  status: UploadStatus;
};

let database: Database.Database | null = null;

export function getDb() {
  if (!database) {
    const dbPath =
      process.env.CREATOR_DASHBOARD_DB_PATH ??
      path.join(process.cwd(), "data", "creator-dashboard.sqlite");
    mkdirSync(path.dirname(dbPath), { recursive: true });
    database = new Database(dbPath);
    ensureSchema(database);
    seedDemoProjects(database);
  }

  return database;
}

export function ensureSchema(db: Database.Database) {
  db.pragma("foreign_keys = ON");
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      niche TEXT NOT NULL,
      script TEXT NOT NULL,
      voiceover_file_path TEXT NOT NULL DEFAULT '',
      scene_image_folder_path TEXT NOT NULL DEFAULT '',
      final_mp4_path TEXT NOT NULL DEFAULT '',
      platform_captions TEXT NOT NULL DEFAULT '',
      hashtags TEXT NOT NULL DEFAULT '',
      ready_to_publish INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS platform_statuses (
      project_id INTEGER NOT NULL,
      platform TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (project_id, platform),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
  `);
}

export function seedDemoProjects(db: Database.Database) {
  const count = db.prepare("SELECT COUNT(*) as count FROM projects").get() as {
    count: number;
  };

  if (count.count > 0) {
    return;
  }

  const seed = db.transaction(() => {
    const cozy = createProject(db, {
      title: "5 hooks for cozy desk setups",
      niche: "Home office / creator desk",
      script:
        "Start with a fast before shot, show the cable cleanup, add warm light, reveal the final setup, close with the hook: save this for your Sunday reset.",
      voiceoverFilePath: "/Users/shantaliaz/Creator/audio/cozy-desk.wav",
      sceneImageFolderPath: "/Users/shantaliaz/Creator/scenes/cozy-desk",
      finalMp4Path: "/Users/shantaliaz/Creator/renders/cozy-desk.mp4",
      platformCaptions:
        "A tiny desk reset that makes filming short videos feel easier.",
      hashtags: "#desksetup #creatorworkflow #shorts",
    });
    updatePlatformStatus(db, cozy.id, "YouTube Shorts", "ready");
    updatePlatformStatus(db, cozy.id, "TikTok", "needs_caption");

    const skincare = createProject(db, {
      title: "Morning skincare in 20 seconds",
      niche: "Beauty routines",
      script:
        "Show cleanser, serum texture, moisturizer, sunscreen, and a final natural-light closeup with product names on screen.",
      voiceoverFilePath: "/Users/shantaliaz/Creator/audio/skincare.wav",
      sceneImageFolderPath: "/Users/shantaliaz/Creator/scenes/skincare",
      finalMp4Path: "",
      platformCaptions:
        "A simple morning routine with clean transitions and no clutter.",
      hashtags: "#skincareroutine #beautytok #reels",
    });
    updatePlatformStatus(db, skincare.id, "TikTok", "ready");

    createProject(db, {
      title: "AI prompt pack teaser",
      niche: "Digital products",
      script:
        "Open with the result, flash three prompt examples, show the template library, then close with a launch date card.",
      voiceoverFilePath: "",
      sceneImageFolderPath: "/Users/shantaliaz/Creator/scenes/prompt-pack",
      finalMp4Path: "",
      platformCaptions:
        "A quick peek at the prompt pack I use to plan faster videos.",
      hashtags: "#digitalproducts #aitools #contentcreator",
    });
  });

  seed();
}

export function createProject(
  db: Database.Database,
  input: ProjectInput,
): VideoProject {
  const insert = db.prepare(`
    INSERT INTO projects (
      title,
      niche,
      script,
      voiceover_file_path,
      scene_image_folder_path,
      final_mp4_path,
      platform_captions,
      hashtags
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = insert.run(
    input.title.trim(),
    input.niche.trim(),
    input.script.trim(),
    input.voiceoverFilePath.trim(),
    input.sceneImageFolderPath.trim(),
    input.finalMp4Path.trim(),
    input.platformCaptions.trim(),
    input.hashtags.trim(),
  );

  const projectId = Number(result.lastInsertRowid);
  const insertStatus = db.prepare(`
    INSERT INTO platform_statuses (project_id, platform, status)
    VALUES (?, ?, 'draft')
  `);
  for (const platform of PLATFORMS) {
    insertStatus.run(projectId, platform);
  }

  return getProject(db, projectId);
}

export function listProjects(db: Database.Database): VideoProject[] {
  const rows = db
    .prepare(
      `SELECT * FROM projects ORDER BY ready_to_publish DESC, id ASC`,
    )
    .all() as ProjectRow[];

  return rows.map((row) => mapProject(db, row));
}

export function getPublishingQueue(db: Database.Database) {
  const projects = listProjects(db);

  return PLATFORMS.map((platform) => ({
    platform,
    projects: projects.filter((project) =>
      ["ready", "queued"].includes(project.platformStatuses[platform]),
    ),
  }));
}

export function markProjectReady(
  db: Database.Database,
  projectId: number,
): VideoProject {
  db.prepare(
    `UPDATE projects
     SET ready_to_publish = 1, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
  ).run(projectId);

  const update = db.prepare(`
    UPDATE platform_statuses
    SET status = 'queued', updated_at = CURRENT_TIMESTAMP
    WHERE project_id = ? AND platform = ?
  `);
  for (const platform of PLATFORMS) {
    update.run(projectId, platform);
  }

  return getProject(db, projectId);
}

export function updatePlatformStatus(
  db: Database.Database,
  projectId: number,
  platform: Platform,
  status: UploadStatus,
) {
  db.prepare(`
    UPDATE platform_statuses
    SET status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE project_id = ? AND platform = ?
  `).run(status, projectId, platform);
}

function getProject(db: Database.Database, projectId: number): VideoProject {
  const row = db
    .prepare(`SELECT * FROM projects WHERE id = ?`)
    .get(projectId) as ProjectRow | undefined;

  if (!row) {
    throw new Error(`Project ${projectId} was not found.`);
  }

  return mapProject(db, row);
}

function mapProject(db: Database.Database, row: ProjectRow): VideoProject {
  const statuses = db
    .prepare(
      `SELECT platform, status FROM platform_statuses WHERE project_id = ?`,
    )
    .all(row.id) as StatusRow[];

  const platformStatuses = Object.fromEntries(
    PLATFORMS.map((platform) => [
      platform,
      statuses.find((status) => status.platform === platform)?.status ??
        "draft",
    ]),
  ) as Record<Platform, UploadStatus>;

  return {
    id: row.id,
    title: row.title,
    niche: row.niche,
    script: row.script,
    voiceoverFilePath: row.voiceover_file_path,
    sceneImageFolderPath: row.scene_image_folder_path,
    finalMp4Path: row.final_mp4_path,
    platformCaptions: row.platform_captions,
    hashtags: row.hashtags,
    readyToPublish: row.ready_to_publish === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    platformStatuses,
  };
}
