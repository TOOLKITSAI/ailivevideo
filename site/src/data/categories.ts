export const CATEGORY_SLUGS = [
  'ai-avatars',
  'real-time-generative-video',
  'ai-video-agents',
  'live-translation-dubbing',
  'streaming-production-automation',
  'ai-live-shopping',
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const CATEGORIES: Record<CategorySlug, { name: string; description: string }> = {
  'ai-avatars': { name: 'AI Avatars & Digital Humans', description: 'Avatar and digital-human platforms used in live or interactive video workflows.' },
  'real-time-generative-video': { name: 'Real-Time Generative Video', description: 'Models and products that generate or transform video at interactive or faster-than-playback speeds.' },
  'ai-video-agents': { name: 'AI Video Agents', description: 'Conversational visual agents designed to respond to users through generated video.' },
  'live-translation-dubbing': { name: 'Live Translation & Dubbing', description: 'Live captioning, interpretation, translation, and speech localization tools.' },
  'streaming-production-automation': { name: 'Streaming Production & Automation', description: 'Production and automation software used to operate AI-assisted live video.' },
  'ai-live-shopping': { name: 'AI Live Shopping', description: 'Live-commerce platforms with automation, personalization, or AI-assisted selling workflows.' },
};