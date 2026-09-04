import { CATEGORY_SLUGS } from '../data/categories';

export interface ToolRelationRecord {
  slug: string;
  categories: string[];
  alternatives: string[];
}

export function validateToolRelations(tools: ToolRelationRecord[], strict: boolean): string[] {
  const issues: string[] = [];
  const slugs = new Set(tools.map((tool) => tool.slug));

  for (const tool of tools) {
    for (const alternative of tool.alternatives) {
      if (!slugs.has(alternative)) issues.push(`${tool.slug}: unknown alternative ${alternative}`);
    }
  }

  if (strict && tools.length !== 30) issues.push(`expected 30 published tools, found ${tools.length}`);
  if (strict) {
    for (const category of CATEGORY_SLUGS) {
      if (!tools.some((tool) => tool.categories.includes(category))) issues.push(`category ${category} has no published tools`);
    }
  }

  return issues;
}

export interface ComparisonRelationRecord {
  slug: string;
  toolA: string;
  toolB: string;
}

export interface GuideRelationRecord {
  slug: string;
  relatedTools: string[];
}

export function validateArticleRelations(
  tools: Pick<ToolRelationRecord, 'slug'>[],
  comparisons: ComparisonRelationRecord[],
  guides: GuideRelationRecord[],
): string[] {
  const issues: string[] = [];
  const toolSlugs = new Set(tools.map((tool) => tool.slug));

  for (const comparison of comparisons) {
    for (const toolSlug of [comparison.toolA, comparison.toolB]) {
      if (!toolSlugs.has(toolSlug)) issues.push(`${comparison.slug}: unknown tool ${toolSlug}`);
    }
  }

  for (const guide of guides) {
    for (const toolSlug of guide.relatedTools) {
      if (!toolSlugs.has(toolSlug)) issues.push(`${guide.slug}: unknown tool ${toolSlug}`);
    }
  }

  return issues;
}
