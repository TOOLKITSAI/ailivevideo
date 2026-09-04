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