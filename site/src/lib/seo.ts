export interface SoftwareApplicationSource {
  name: string;
  description: string;
  officialUrl: string;
}

export function softwareApplicationJsonLd(
  tool: SoftwareApplicationSource,
  canonicalUrl: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: canonicalUrl,
    sameAs: tool.officialUrl,
  };
}

export function serializeJsonForScript(value: unknown): string {
  return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, (character) => {
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