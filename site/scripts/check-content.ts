import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { join, parse } from 'node:path';
import matter from 'gray-matter';
import { validateArticleRelations, validateToolRelations, type ComparisonRelationRecord, type GuideRelationRecord, type ToolRelationRecord } from '../src/lib/content-relations';

interface ContentEntry {
  slug: string;
  data: Record<string, unknown>;
  body: string;
}

async function readEntries(directory: string): Promise<ContentEntry[]> {
  if (!existsSync(directory)) return [];
  const files = await readdir(directory, { withFileTypes: true });
  const entries = await Promise.all(files
    .filter((file) => file.isFile() && file.name.endsWith('.md'))
    .map(async (file) => {
      const parsed = matter(await readFile(join(directory, file.name), 'utf8'));
      return { slug: parse(file.name).name, data: parsed.data, body: parsed.content };
    }));
  return entries;
}

function published(entries: ContentEntry[]): ContentEntry[] {
  return entries.filter((entry) => entry.data.editorialStatus === 'published');
}

function isHttpsUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function englishWordCount(body: string): number {
  return body.match(/[A-Za-z]+(?:['-][A-Za-z]+)*/g)?.length ?? 0;
}

const dataDirectory = join(process.cwd(), 'src', 'data');
const [toolEntries, comparisonEntries, guideEntries] = await Promise.all([
  readEntries(join(dataDirectory, 'tools')),
  readEntries(join(dataDirectory, 'comparisons')),
  readEntries(join(dataDirectory, 'guides')),
]);

const tools = published(toolEntries);
const comparisons = published(comparisonEntries);
const guides = published(guideEntries);
const strict = !process.argv.includes('--allow-partial') && process.env.npm_config_allow_partial !== 'true';
const issues: string[] = [];

for (const tool of tools) {
  const sources = Array.isArray(tool.data.officialSources) ? tool.data.officialSources : [];
  const uniqueHttpsSources = new Set(sources.filter(isHttpsUrl));
  if (uniqueHttpsSources.size < 2) issues.push(`${tool.slug}: requires two unique HTTPS officialSources`);

  const words = englishWordCount(tool.body);
  if (words < 500 || words > 800) issues.push(`${tool.slug}: expected 500-800 English body words, found ${words}`);
}

const relations: ToolRelationRecord[] = tools.map((tool) => ({
  slug: tool.slug,
  categories: Array.isArray(tool.data.categories) ? tool.data.categories.filter((category): category is string => typeof category === 'string') : [],
  alternatives: Array.isArray(tool.data.alternatives) ? tool.data.alternatives.filter((alternative): alternative is string => typeof alternative === 'string') : [],
}));
issues.push(...validateToolRelations(relations, strict));

const comparisonRelations: ComparisonRelationRecord[] = comparisons.flatMap((comparison) =>
  typeof comparison.data.toolA === 'string' && typeof comparison.data.toolB === 'string'
    ? [{ slug: comparison.slug, toolA: comparison.data.toolA, toolB: comparison.data.toolB }]
    : [],
);
const guideRelations: GuideRelationRecord[] = guides.map((guide) => ({
  slug: guide.slug,
  relatedTools: Array.isArray(guide.data.relatedTools)
    ? guide.data.relatedTools.filter((tool): tool is string => typeof tool === 'string')
    : [],
}));
issues.push(...validateArticleRelations(relations, comparisonRelations, guideRelations));

if (strict && comparisons.length !== 4) issues.push(`expected 4 published comparisons, found ${comparisons.length}`);
if (strict && guides.length !== 4) issues.push(`expected 4 published guides, found ${guides.length}`);

if (issues.length > 0) {
  for (const issue of issues) console.error(`CONTENT_ERROR ${issue}`);
  process.exit(1);
}

console.log(`CONTENT_OK tools=${tools.length} comparisons=${comparisons.length} guides=${guides.length}`);
