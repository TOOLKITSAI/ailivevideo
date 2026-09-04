import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORY_SLUGS } from './data/categories';

const sourceUrl = z.string().url();
const status = z.enum(['draft', 'reviewed', 'published']);

export const toolSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(40).max(170),
  officialUrl: sourceUrl,
  categories: z.array(z.enum(CATEGORY_SLUGS)).min(1).max(3),
  oneLineVerdict: z.string().min(30).max(180),
  bestFor: z.string().min(10).max(120),
  capabilities: z.array(z.string().min(3)).min(2).max(8),
  realTimeDefinition: z.string().min(30),
  pricingModel: z.string().min(3),
  freeAccessStatus: z.enum(['free', 'trial', 'paid', 'unknown']),
  apiAvailable: z.enum(['yes', 'no', 'unknown']),
  realTimeCapability: z.enum(['native', 'near-real-time', 'workflow', 'none', 'unknown']),
  pros: z.array(z.string().min(5)).min(2).max(5),
  cons: z.array(z.string().min(5)).min(2).max(5),
  alternatives: z.array(z.string()).min(2).max(5),
  officialSources: z.array(sourceUrl).min(2).max(8),
  affiliateUrl: sourceUrl.optional(),
  lastVerified: z.coerce.date(),
  editorialStatus: status,
  featured: z.boolean().default(false),
});

const articleFields = {
  title: z.string().min(20).max(100),
  description: z.string().min(40).max(170),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  officialSources: z.array(sourceUrl).min(2),
  editorialStatus: status,
};

const tools = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/data/tools' }), schema: toolSchema });
const comparisons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/comparisons' }),
  schema: z.object({ ...articleFields, toolA: z.string(), toolB: z.string() }),
});
const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/guides' }),
  schema: z.object({ ...articleFields, relatedTools: z.array(z.string()).min(2).max(8) }),
});

export const collections = { tools, comparisons, guides };