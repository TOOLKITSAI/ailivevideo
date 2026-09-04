import { describe, expect, it } from 'vitest';
import { filterTools, type ToolDirectoryItem } from '../../src/lib/tool-filters';

const items: ToolDirectoryItem[] = [
  { slug: 'avatar-one', name: 'Avatar One', categorySlugs: ['ai-avatars'], freeAccessStatus: 'trial', apiAvailable: 'yes', realTimeCapability: 'workflow' },
  { slug: 'world-one', name: 'World One', categorySlugs: ['real-time-generative-video'], freeAccessStatus: 'paid', apiAvailable: 'no', realTimeCapability: 'native' },
];

describe('filterTools', () => {
  it('matches name text without case sensitivity', () => {
    expect(filterTools(items, { query: 'AVATAR', category: 'all', freeAccess: false, api: false, realTime: false })).toHaveLength(1);
  });

  it('combines category and capability filters', () => {
    expect(filterTools(items, { query: '', category: 'real-time-generative-video', freeAccess: false, api: false, realTime: true })).toEqual([items[1]]);
  });
});