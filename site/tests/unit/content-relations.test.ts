import { describe, expect, it } from 'vitest';
import { validateArticleRelations, validateToolRelations, type ToolRelationRecord } from '../../src/lib/content-relations';

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

describe('validateArticleRelations', () => {
  it('reports missing tools used by articles', () => {
    const tools = [{ slug: 'heygen', categories: ['ai-avatars'], alternatives: ['heygen', 'heygen'] }];
    const comparisons = [{ slug: 'heygen-vs-synthesia', toolA: 'heygen', toolB: 'synthesia' }];
    const guides = [{ slug: 'avatar-guide', relatedTools: ['heygen', 'tavus'] }];
    const issues = validateArticleRelations(tools, comparisons, guides);
    expect(issues).toContain('heygen-vs-synthesia: unknown tool synthesia');
    expect(issues).toContain('avatar-guide: unknown tool tavus');
  });
});
