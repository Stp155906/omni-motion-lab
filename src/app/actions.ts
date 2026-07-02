"use server";

import { revalidatePath } from "next/cache";

import {
  createProject,
  getDb,
  markProjectReady,
  type Platform,
} from "@/lib/db";

export async function createProjectAction(formData: FormData) {
  createProject(getDb(), {
    title: readField(formData, "title"),
    niche: readField(formData, "niche"),
    script: readField(formData, "script"),
    voiceoverFilePath: readField(formData, "voiceoverFilePath"),
    sceneImageFolderPath: readField(formData, "sceneImageFolderPath"),
    finalMp4Path: readField(formData, "finalMp4Path"),
    platformCaptions: readField(formData, "platformCaptions"),
    hashtags: readField(formData, "hashtags"),
  });

  revalidatePath("/");
}

export async function markReadyAction(formData: FormData) {
  markProjectReady(getDb(), Number(readField(formData, "projectId")));
  revalidatePath("/");
}

export async function generateScenePromptsAction(formData: FormData) {
  logPlaceholder("generate-scene-prompts", formData);
}

export async function importGeneratedImagesAction(formData: FormData) {
  logPlaceholder("import-generated-images", formData);
}

export async function createFinalMp4Action(formData: FormData) {
  logPlaceholder("create-final-mp4-with-ffmpeg", formData);
}

export async function previewVideoAction(formData: FormData) {
  logPlaceholder("preview-video", formData);
}

export async function uploadPlatformAction(formData: FormData) {
  logPlaceholder("upload-placeholder", formData);
}

function readField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function logPlaceholder(action: string, formData: FormData) {
  const projectId = readField(formData, "projectId");
  const platform = readField(formData, "platform") as Platform | "";

  console.log("[creator-dashboard]", {
    action,
    projectId,
    platform,
    at: new Date().toISOString(),
  });
}
