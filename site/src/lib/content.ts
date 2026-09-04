import { getCollection, type CollectionEntry } from 'astro:content';
import type { CategorySlug } from '../data/categories';

export async function getPublishedTools(): Promise<CollectionEntry<'tools'>[]> {
  const tools = await getCollection('tools', ({ data }) => data.editorialStatus === 'published');
  return tools.sort((first, second) => first.data.name.localeCompare(second.data.name, 'en'));
}

export async function getPublishedToolsByCategory(category: CategorySlug): Promise<CollectionEntry<'tools'>[]> {
  const tools = await getPublishedTools();
  return tools.filter((tool) => tool.data.categories.includes(category));
}

export async function getFeaturedTools(): Promise<CollectionEntry<'tools'>[]> {
  const tools = await getPublishedTools();
  return tools.filter((tool) => tool.data.featured);
}