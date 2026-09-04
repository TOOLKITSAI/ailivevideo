import { describe, expect, it } from 'vitest';
import { validateToolRelations, type ToolRelationRecord } from '../../src/lib/content-relations';

const tool = (slug: string, categories: string[], alternatives: string[]): ToolRelationRecord => ({ slug, categories, alternatives });

describe('validateToolRelations', () => {
  it('reports a missing alternative', () => {
    expect(validateToolRelations([tool('one', ['ai-avatars'], ['missing', 'one'])], false)).toContain('one: unknown alternative missing');
  });

  it('requires 30 tools and every category in strict mode', () => {
    const issues = validateToolRelations([tool('one', ['ai-avatars'], ['one', 'one'])], true);
    expect(issues).toContain('expected 30 published tools, found 1');
    expect(issues).toContain('category real-time-generative-video has no published tools');
  });
});
