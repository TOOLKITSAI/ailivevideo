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
