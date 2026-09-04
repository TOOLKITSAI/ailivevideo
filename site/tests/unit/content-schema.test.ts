import { describe, expect, it } from 'vitest';
import { toolSchema } from '../../src/content.config';

const validTool = {
  name: 'Example Tool',
  description: 'A concise search description for the example tool.',
  officialUrl: 'https://example.com/',
  categories: ['ai-avatars'],
  oneLineVerdict: 'A clear verdict grounded in official product information.',
  bestFor: 'Teams testing an AI avatar workflow',
  capabilities: ['Avatar video', 'Interactive rendering'],
  realTimeDefinition: 'The vendor describes interactive rendering but publishes no latency guarantee.',
  pricingModel: 'Check official pricing',
  freeAccessStatus: 'unknown',
  apiAvailable: 'unknown',
  realTimeCapability: 'unknown',
  pros: ['Clear workflow', 'Official documentation'],
  cons: ['No public latency SLA', 'Pricing requires confirmation'],
  alternatives: ['another-tool', 'third-tool'],
  officialSources: ['https://example.com/', 'https://example.com/docs/'],
  lastVerified: new Date('2026-09-04'),
  editorialStatus: 'published',
};

describe('toolSchema', () => {
  it('accepts a fully sourced tool', () => {
    expect(toolSchema.safeParse(validTool).success).toBe(true);
  });

  it('rejects a tool with fewer than two official sources', () => {
    expect(toolSchema.safeParse({ ...validTool, officialSources: ['https://example.com/'] }).success).toBe(false);
  });

  it('rejects an unknown category', () => {
    expect(toolSchema.safeParse({ ...validTool, categories: ['video'] }).success).toBe(false);
  });
});