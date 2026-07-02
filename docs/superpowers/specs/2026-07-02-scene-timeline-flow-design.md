# Scene Timeline Generation Flow Design

## Goal

Build a creator workflow where a short-form script becomes a timeline of editable scene cards before any paid video generation runs. Each scene card represents one storybeat window and lets the user choose the visual style, style-specific motion template, and transition-out template that carries the story into the next scene.

## Core Workflow

1. The user uploads or pastes a script with timestamp windows, CSV rows, or plain storybeat lines.
2. The app parses the script into ordered scene rows.
3. The user chooses a project style, such as Conspiracy Scrapbook Pyramid.
4. Each scene receives default selections for style, motion, and transition based on the project style.
5. The user reviews and edits each scene in a horizontal or stacked timeline.
6. The app shows a visual preflight for every scene before generation:
   - narration/storybeat text
   - extracted visual keywords
   - selected style
   - selected motion
   - selected transition-out
   - compiled prompt preview
7. The user generates selected scenes or the full batch.
8. Generated 4-second clips are saved and returned to the dashboard.
9. Later, generated clips can be stitched into a final short with FFmpeg.

## Scene Card Model

Each scene card should include:

- `sceneIndex`
- `startTime`
- `endTime`
- `storybeatText`
- `visualKeywords`
- `styleTemplateId`
- `motionTemplateId`
- `transitionTemplateId`
- `nextSceneContext`
- `compiledPrompt`
- `generationStatus`
- `videoUrl`

The transition belongs to the exit of the current scene, not globally to the project. In UI language, this should read as `Transition to next scene`.

## Style-Aware Template Library

Styles are master systems. A style owns the visual language and narrows which motions and transitions make sense.

A style template should store:

- title
- master visual prompt
- visual keywords
- allowed motion template ids
- allowed transition template ids
- reference image/video examples

A motion template should store:

- title
- style compatibility
- camera movement prompt
- visual example
- prompt cue

A transition template should store:

- title
- style compatibility
- transition-out prompt
- best used when

Example:

```text
Style: Conspiracy Scrapbook Pyramid
Motion options:
- Desert Establishing Push
- Macro Eye of Horus Zoom
- Glowing Pyramid Apex Reveal
- Corridor Descent Track

Transition options:
- Compass Spin Wipe
- Pupil Portal Push
- Gold Light Sweep
- Parchment Foreground Wipe
```

## Prompt Compiler

For each scene, the backend compiles a prompt from:

```text
[Style master prompt]
[Selected motion prompt]
[Current storybeat narration]
[Visual keywords]
[Transition-out prompt]
[Next scene context]
[Global constraints]
```

Global constraints:

- aspect ratio: `9:16`
- duration: `4`
- model: `gemini-omni-flash-preview`
- output: one independent scene clip

The transition section should explicitly instruct the model to end the current scene in a way that prepares the next scene, using shared object, lighting, direction, foreground wipe, portal, or camera momentum.

## API Strategy

Use Gemini Omni Flash through the Interactions API for developer automation. Keep the API key server-side in `GEMINI_API_KEY`.

Default generation mode:

- Generate each scene as its own 4-second clip.
- Use prompt-level transition continuity.
- Return MP4 clips to the dashboard.

Future optional mode:

- Use `previous_interaction_id` for stateful iterative editing when we want one generated clip to build directly from a prior interaction. This should be treated as a separate advanced mode because it is less convenient for retrying individual scene failures.

## Visual Preflight

Before generation, users should be able to inspect the full scene plan without spending credits.

Version 1 preflight:

- text prompt preview
- visual keyword list
- style/motion/transition labels

Version 2 preflight:

- one still storyboard frame per scene
- user approval before full 4-second video generation

## Testing

Automated tests should cover:

- timestamp-window parsing
- plain CSV parsing
- style-aware default scene plans
- per-scene motion and transition overrides
- prompt compiler includes next-scene transition context
- API preview mode returns payloads without requiring `GEMINI_API_KEY`

Manual checks should cover:

- upload the pyramid activation script
- confirm scenes parse into timeline rows
- change motion and transition for one scene
- generate payload preview
- confirm prompt contains style, motion, transition, storybeat text, and next-scene context

## First Implementation Slice

The next implementation should focus on the non-paid preview flow:

1. Add a style library structure.
2. Filter motion and transition dropdowns by selected style.
3. Improve the scene planner UI so it reads as a timeline.
4. Add visual keyword extraction per scene.
5. Add a prompt preview panel per scene.
6. Keep generation in preview mode until the full flow feels right.
