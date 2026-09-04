import { expect, it } from 'vitest';
import { softwareApplicationJsonLd } from '../../src/lib/seo';

it('does not invent ratings or numeric offers', () => {
  const json = softwareApplicationJsonLd(
    {
      name: 'Example',
      description: 'Example description',
      officialUrl: 'https://example.com/',
    },
    'https://ailivevideo.net/tools/example/',
  );

  expect(json['@type']).toBe('SoftwareApplication');
  expect(json.url).toBe('https://ailivevideo.net/tools/example/');
  expect(json).not.toHaveProperty('aggregateRating');
  expect(json).not.toHaveProperty('offers');
});