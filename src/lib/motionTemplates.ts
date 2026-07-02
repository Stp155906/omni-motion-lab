export type MotionTemplate = {
  id: string;
  title: string;
  niche: string;
  motion: string;
  promptCue: string;
  duration: string;
  aspectRatio: "9:16";
  videoUrl: string;
  posterUrl: string;
  sourceUrl: string;
  referencePrompt: string;
  featured?: boolean;
};

export type TemplateSection = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  templates: MotionTemplate[];
};

const sampleVideo =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

export const motionTemplates: MotionTemplate[] = [
  {
    id: "omni-macro-pyramid",
    title: "OmniFlash Macro Pyramid Portal",
    niche: "Mystery / history reels",
    motion: "Macro-to-micro portal zoom",
    promptCue:
      "Eye of Horus scrapbook frame pushes through the pupil into a cinematic pyramid reveal.",
    duration: "8s",
    aspectRatio: "9:16",
    videoUrl: "/videos/macro-zoom-to-pyramid-transition.mp4",
    posterUrl: "/videos/macro-zoom-to-pyramid-transition.jpg",
    sourceUrl: "https://www.pexels.com/search/videos/desert/",
    referencePrompt:
      "Continuous multi-planar macro-to-micro zoom, seamless mixed-media transformation. The screen is framed as a luxury scrapbook collage page, featuring a prominent hand-drawn Egyptian Eye of Horus on heavily textured papyrus paper. Static ripped parchment paper borders, elegant gold foil framing tape, and intricate ink compass sketches remain locked to the outermost edges of the screen as a tactile foreground overlay. The camera slowly pushes past this layout directly into the center of the pitch-black pupil. As the zoom intensifies, fine hand-drawn ink hieroglyphic annotations dynamically scribble themselves into existence around the eye, animating with a tactile 12fps stop-motion style. The black void of the pupil smoothly expands, seamlessly morphing into a distant desert horizon line under a blazing sun. The camera breaks completely through the pupil portal into a sweeping, wide 3D cinematic establishing shot of a colossal stone pyramid rising from granular sand dunes, while the hand-drawn scrapbook annotations and ripped paper borders subtly dissolve out at the frame edges. Consistent museum-exhibit golden hour lighting throughout, flawless single-shot depth with no hard cuts.",
    featured: true,
  },
  {
    id: "omni-macro-zoom",
    title: "OmniFlash Macro-to-World Zoom",
    niche: "Faceless explainer",
    motion: "Macro push-in",
    promptCue: "Push into one detail until it becomes a full environment.",
    duration: "6s",
    aspectRatio: "9:16",
    videoUrl: sampleVideo,
    posterUrl:
      "https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg?auto=compress&cs=tinysrgb&w=900",
    sourceUrl: "https://www.pexels.com/search/videos/macro/",
    referencePrompt:
      "Continuous push into one detailed foreground object until the texture becomes a full cinematic environment, keeping a single light source and anchor shape consistent.",
  },
  {
    id: "omni-parchment-wipe",
    title: "OmniFlash Parchment Wipe",
    niche: "Storytelling reels",
    motion: "Foreground reveal",
    promptCue: "A close textured foreground wipe hides the scene change.",
    duration: "7s",
    aspectRatio: "9:16",
    videoUrl: sampleVideo,
    posterUrl:
      "https://images.pexels.com/photos/1424996/pexels-photo-1424996.jpeg?auto=compress&cs=tinysrgb&w=900",
    sourceUrl: "https://www.pexels.com/search/videos/desert%20dunes/",
    referencePrompt:
      "Move the camera past a close textured parchment or wall element, using the foreground occlusion to reveal the next scene without a hard cut.",
  },
  {
    id: "omni-light-morph",
    title: "OmniFlash Golden Light Morph",
    niche: "Luxury product reels",
    motion: "Lighting metamorphosis",
    promptCue: "Preserve one golden light source while the set transforms.",
    duration: "9s",
    aspectRatio: "9:16",
    videoUrl: sampleVideo,
    posterUrl:
      "https://images.pexels.com/photos/698547/pexels-photo-698547.jpeg?auto=compress&cs=tinysrgb&w=900",
    sourceUrl: "https://www.pexels.com/search/videos/golden%20hour/",
    referencePrompt:
      "Preserve one warm golden light source while the surrounding set dissolves into a new layout, keeping luminance direction consistent.",
  },
  {
    id: "omni-orbit-hook",
    title: "OmniFlash Orbit Hook",
    niche: "Avatar-free hooks",
    motion: "Slow crane orbit",
    promptCue: "Orbit around the subject while overlays introduce the hook.",
    duration: "5s",
    aspectRatio: "9:16",
    videoUrl: sampleVideo,
    posterUrl:
      "https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=900",
    sourceUrl: "https://www.pexels.com/search/videos/travel/",
    referencePrompt:
      "Slow crane orbit around the subject while title overlays introduce the hook, with depth layers moving at different speeds.",
  },
  {
    id: "omni-scrapbook-flight",
    title: "OmniFlash Scrapbook Flight",
    niche: "Travel narrative",
    motion: "Layered push-forward",
    promptCue: "Paper layers separate as the camera flies into the memory.",
    duration: "10s",
    aspectRatio: "9:16",
    videoUrl: sampleVideo,
    posterUrl:
      "https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=900",
    sourceUrl: "https://www.pexels.com/search/videos/cinematic/",
    referencePrompt:
      "Layered scrapbook papers separate as the camera pushes forward through the collage into the living scene behind it.",
  },
  {
    id: "omni-product-snap",
    title: "OmniFlash Product Snap-In",
    niche: "Digital product launch",
    motion: "Match action snap",
    promptCue: "Snap from product detail to finished lifestyle scene.",
    duration: "6s",
    aspectRatio: "9:16",
    videoUrl: sampleVideo,
    posterUrl:
      "https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg?auto=compress&cs=tinysrgb&w=900",
    sourceUrl: "https://www.pexels.com/search/videos/product/",
    referencePrompt:
      "Snap from a product detail into a finished lifestyle scene, preserving one shared shape across the transition.",
  },
];

export const templateSections: TemplateSection[] = [
  {
    id: "faceless-hooks",
    eyebrow: "Faceless hooks",
    title: "Find your perfect faceless opener",
    description:
      "Fast first-three-second motion patterns for scroll-stopping hook scenes.",
    templates: [
      {
        id: "omni-question-burst",
        title: "OmniFlash Question Burst",
        niche: "Educational reels",
        motion: "Text-card impact",
        promptCue: "Bold question appears as the camera rushes through b-roll.",
        duration: "5s",
        aspectRatio: "9:16",
        videoUrl: sampleVideo,
        posterUrl:
          "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=900",
        sourceUrl: "https://www.pexels.com/search/videos/content%20creator/",
        referencePrompt:
          "Bold question appears as the camera rushes through supporting b-roll with fast parallax layers.",
      },
      {
        id: "omni-problem-reveal",
        title: "OmniFlash Problem Reveal",
        niche: "Tips / how-to",
        motion: "Push-forward reveal",
        promptCue: "Scene opens on a problem, then tracks into the solution.",
        duration: "6s",
        aspectRatio: "9:16",
        videoUrl: sampleVideo,
        posterUrl:
          "https://images.pexels.com/photos/3760809/pexels-photo-3760809.jpeg?auto=compress&cs=tinysrgb&w=900",
        sourceUrl: "https://www.pexels.com/search/videos/workflow/",
        referencePrompt:
          "Scene opens on a visual problem, then tracks forward into the solution using a clean foreground reveal.",
      },
      {
        id: "omni-fast-cut-loop",
        title: "OmniFlash Fast Cut Loop",
        niche: "Listicle reels",
        motion: "Rhythmic montage",
        promptCue: "Four b-roll beats loop around a single repeatable action.",
        duration: "7s",
        aspectRatio: "9:16",
        videoUrl: sampleVideo,
        posterUrl:
          "https://images.pexels.com/photos/5053834/pexels-photo-5053834.jpeg?auto=compress&cs=tinysrgb&w=900",
        sourceUrl: "https://www.pexels.com/search/videos/social%20media/",
        referencePrompt:
          "Four b-roll beats loop around one repeated action, timed as a rapid montage for retention.",
      },
      {
        id: "omni-proof-snap",
        title: "OmniFlash Proof Snap",
        niche: "Case study reels",
        motion: "Before-after snap",
        promptCue: "Before frame snaps into proof while the camera keeps moving.",
        duration: "6s",
        aspectRatio: "9:16",
        videoUrl: sampleVideo,
        posterUrl:
          "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=900",
        sourceUrl: "https://www.pexels.com/search/videos/results/",
        referencePrompt:
          "Before frame snaps into proof while camera movement continues, creating a seamless result reveal.",
      },
    ],
  },
  {
    id: "cinematic-transitions",
    eyebrow: "Cinematic transitions",
    title: "Build scene-to-scene continuity",
    description:
      "Movement recipes for chaining generated clips with cleaner handoffs.",
    templates: [
      {
        id: "omni-eye-match",
        title: "OmniFlash Eye Match",
        niche: "Story reels",
        motion: "Match action zoom",
        promptCue: "Push into an eye or object until it becomes the next frame.",
        duration: "8s",
        aspectRatio: "9:16",
        videoUrl: sampleVideo,
        posterUrl:
          "https://images.pexels.com/photos/2690323/pexels-photo-2690323.jpeg?auto=compress&cs=tinysrgb&w=900",
        sourceUrl: "https://www.pexels.com/search/videos/close%20up/",
        referencePrompt:
          "Push into an eye or circular object until its dark center becomes the next scene.",
      },
      {
        id: "omni-shadow-pass",
        title: "OmniFlash Shadow Pass",
        niche: "Mystery reels",
        motion: "Occlusion wipe",
        promptCue: "A shadow crosses lens to cover the generated transition.",
        duration: "7s",
        aspectRatio: "9:16",
        videoUrl: sampleVideo,
        posterUrl:
          "https://images.pexels.com/photos/167684/pexels-photo-167684.jpeg?auto=compress&cs=tinysrgb&w=900",
        sourceUrl: "https://www.pexels.com/search/videos/shadow/",
        referencePrompt:
          "A moving shadow crosses the lens, hiding the generated transition as the scene changes underneath.",
      },
      {
        id: "omni-archway-pass",
        title: "OmniFlash Archway Pass",
        niche: "Travel reels",
        motion: "Portal pass-through",
        promptCue: "Camera moves through an arch and lands in a new location.",
        duration: "9s",
        aspectRatio: "9:16",
        videoUrl: sampleVideo,
        posterUrl:
          "https://images.pexels.com/photos/220769/pexels-photo-220769.jpeg?auto=compress&cs=tinysrgb&w=900",
        sourceUrl: "https://www.pexels.com/search/videos/archway/",
        referencePrompt:
          "Camera passes through an arch or doorway that expands into the edges of the next environment.",
      },
      {
        id: "omni-dust-track",
        title: "OmniFlash Dust Track",
        niche: "Adventure reels",
        motion: "Physics tracking",
        promptCue: "Dust particles prove movement as the camera tracks forward.",
        duration: "8s",
        aspectRatio: "9:16",
        videoUrl: sampleVideo,
        posterUrl:
          "https://images.pexels.com/photos/1001435/pexels-photo-1001435.jpeg?auto=compress&cs=tinysrgb&w=900",
        sourceUrl: "https://www.pexels.com/search/videos/dust/",
        referencePrompt:
          "Dust motes and sand particles move realistically through light shafts as the camera tracks forward.",
      },
    ],
  },
  {
    id: "product-reveals",
    eyebrow: "Product reveals",
    title: "Turn assets into selling scenes",
    description:
      "Template rows for offers, digital products, affiliate clips, and launches.",
    templates: [
      {
        id: "omni-offer-glow",
        title: "OmniFlash Offer Glow",
        niche: "Digital products",
        motion: "Light sweep reveal",
        promptCue: "A warm sweep reveals the template, offer, or final result.",
        duration: "6s",
        aspectRatio: "9:16",
        videoUrl: sampleVideo,
        posterUrl:
          "https://images.pexels.com/photos/5632381/pexels-photo-5632381.jpeg?auto=compress&cs=tinysrgb&w=900",
        sourceUrl: "https://www.pexels.com/search/videos/product%20video/",
        referencePrompt:
          "A warm light sweep reveals the product, offer, or final result while preserving brand color accents.",
      },
      {
        id: "omni-pack-flip",
        title: "OmniFlash Pack Flip",
        niche: "Template packs",
        motion: "Card flip stack",
        promptCue: "A stack of assets flips forward into a polished mockup.",
        duration: "7s",
        aspectRatio: "9:16",
        videoUrl: sampleVideo,
        posterUrl:
          "https://images.pexels.com/photos/6476589/pexels-photo-6476589.jpeg?auto=compress&cs=tinysrgb&w=900",
        sourceUrl: "https://www.pexels.com/search/videos/mockup/",
        referencePrompt:
          "A stack of assets flips forward into a polished mockup, with each card locking into place.",
      },
      {
        id: "omni-screen-dive",
        title: "OmniFlash Screen Dive",
        niche: "SaaS demos",
        motion: "Interface dive",
        promptCue: "Camera dives through a screen into the final workflow.",
        duration: "8s",
        aspectRatio: "9:16",
        videoUrl: sampleVideo,
        posterUrl:
          "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=900",
        sourceUrl: "https://www.pexels.com/search/videos/laptop/",
        referencePrompt:
          "Camera dives through a screen or interface element into the finished workflow behind it.",
      },
      {
        id: "omni-checkout-pop",
        title: "OmniFlash Checkout Pop",
        niche: "Launch reels",
        motion: "Pop-in sequence",
        promptCue: "Offer elements pop into place with a clean purchase cue.",
        duration: "5s",
        aspectRatio: "9:16",
        videoUrl: sampleVideo,
        posterUrl:
          "https://images.pexels.com/photos/6956903/pexels-photo-6956903.jpeg?auto=compress&cs=tinysrgb&w=900",
        sourceUrl: "https://www.pexels.com/search/videos/shopping/",
        referencePrompt:
          "Offer elements pop into place in sequence, ending on a clean checkout or call-to-action frame.",
      },
    ],
  },
];
