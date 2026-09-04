export interface ToolDirectoryItem {
  slug: string;
  name: string;
  categorySlugs: string[];
  freeAccessStatus: 'free' | 'trial' | 'paid' | 'unknown';
  apiAvailable: 'yes' | 'no' | 'unknown';
  realTimeCapability: 'native' | 'near-real-time' | 'workflow' | 'none' | 'unknown';
}

export interface ToolFilters {
  query: string;
  category: string;
  freeAccess: boolean;
  api: boolean;
  realTime: boolean;
}

export function filterTools(items: ToolDirectoryItem[], filters: ToolFilters): ToolDirectoryItem[] {
  const query = filters.query.trim().toLocaleLowerCase('en');
  return items.filter((item) =>
    (!query || item.name.toLocaleLowerCase('en').includes(query)) &&
    (filters.category === 'all' || item.categorySlugs.includes(filters.category)) &&
    (!filters.freeAccess || item.freeAccessStatus === 'free' || item.freeAccessStatus === 'trial') &&
    (!filters.api || item.apiAvailable === 'yes') &&
    (!filters.realTime || item.realTimeCapability === 'native' || item.realTimeCapability === 'near-real-time')
  );
}

export function serializeDirectoryTools(items: ToolDirectoryItem[]): string {
  return JSON.stringify(items).replace(/[<>&\u2028\u2029]/g, (character) => {
    const escaped: Record<string, string> = {
      '<': '\\u003c',
      '>': '\\u003e',
      '&': '\\u0026',
      '\u2028': '\\u2028',
      '\u2029': '\\u2029',
    };
    return escaped[character];
  });
}