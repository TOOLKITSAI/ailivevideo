export const SITE_URL = "https://ailivevideo.net";
export interface SoftwareApplicationSource {
  name: string;
  description: string;
  officialUrl: string;
}
export interface BreadcrumbItem {
  name: string;
  url?: string;
}
export interface ArticleSource {
  title: string;
  description: string;
  canonicalUrl: string;
  publishedAt: Date;
  updatedAt: Date;
}
export function canonicalUrl(pathname: string): string {
  const path = pathname.split(/[?#]/, 1)[0].replace(/^\/+|\/+$/g, "");
  return new URL(path ? `/${path}/` : "/", SITE_URL).toString();
}
export function softwareApplicationJsonLd(
  tool: SoftwareApplicationSource,
  url: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url,
    sameAs: tool.officialUrl,
  };
}
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AI Live Video",
    url: canonicalUrl("/"),
  };
}
export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}
export function articleJsonLd(article: ArticleSource) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: article.canonicalUrl,
    mainEntityOfPage: article.canonicalUrl,
    datePublished: article.publishedAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
  };
}
export function itemListJsonLd(name: string, items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { url: item.url } : {}),
    })),
  };
}
export function serializeJsonForScript(value: unknown): string {
  return JSON.stringify(value).replace(
    /[<>&\u2028\u2029]/g,
    (character) =>
      ({
        "<": "\\u003c",
        ">": "\\u003e",
        "&": "\\u0026",
        "\u2028": "\\u2028",
        "\u2029": "\\u2029",
      })[character] ?? character,
  );
}
