import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const TRUST_ROUTES = ['/privacy/', '/terms/', '/affiliate-disclosure/', '/about/', '/editorial-policy/'];
const ERROR_ROUTES = ['/404/', '/404.html'];
const PLACEHOLDER = /\b(?:TBD|TODO)\b|lorem ipsum|example\.com|\[(?:citation|cite|source)(?::[^\]]*)?\]/i;
const ASSET_EXTENSION = /\.(?:avif|css|gif|ico|jpe?g|js|json|map|mp3|mp4|pdf|png|svg|txt|webp|woff2?)$/i;

const slash = (value) => value.split(path.sep).join('/');
const routeFor = (relative) => `/${slash(relative).replace(/\/index\.html$/, '/').replace(/^index\.html$/, '')}`.replace(/\/+/g, '/');

async function htmlFiles(root) {
  const files = [];
  async function visit(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(target);
      else if (entry.isFile() && entry.name.endsWith('.html')) files.push(target);
    }
  }
  await visit(root);
  return files;
}

function attributes(tag) {
  const values = {};
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    values[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? '';
  }
  return values;
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((match) => attributes(match[0]));
}

function isIndexable(html) {
  return !tags(html, 'meta').some((meta) => meta.name?.toLowerCase() === 'robots' && /\bnoindex\b/i.test(meta.content ?? ''));
}

function visibleText(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ');
}

function isSoftwareApplication(value) {
  if (Array.isArray(value)) return value.some(isSoftwareApplication);
  if (!value || typeof value !== 'object') return false;
  if (value['@type'] === 'SoftwareApplication' || (Array.isArray(value['@type']) && value['@type'].includes('SoftwareApplication'))) return true;
  return isSoftwareApplication(value['@graph']);
}

function targetExists(root, pathname) {
  const normalized = path.posix.normalize(`/${pathname}`).replace(/^\/+/, '');
  const candidates = (!normalized || normalized === '.')
    ? ['index.html']
    : normalized.endsWith('.html')
    ? [normalized]
    : [path.posix.join(normalized, 'index.html'), `${normalized}.html`];
  return candidates.some((candidate) => {
    return existsSync(path.join(root, candidate));
  });
}

function internalLinks(html) {
  return tags(html, 'a').map((anchor) => anchor.href).filter((href) => href?.startsWith('/') && !href.startsWith('//'));
}

export async function inspectBuiltSite(root, options = { enforceReleaseCounts: false }) {
  const files = await htmlFiles(root);
  const pages = await Promise.all(files.map(async (file) => ({
    file,
    relative: slash(path.relative(root, file)),
    html: await readFile(file, 'utf8'),
  })));
  const errors = [];
  const canonicals = new Map();

  for (const page of pages) {
    if (isIndexable(page.html)) {
      const canonicalTags = tags(page.html, 'link').filter((link) => link.rel?.toLowerCase().split(/\s+/).includes('canonical'));
      if (canonicalTags.length !== 1) errors.push(`${page.relative}: ${canonicalTags.length ? 'duplicate canonical' : 'missing canonical'}`);
      else {
        const canonical = canonicalTags[0].href?.trim();
        if (!canonical) errors.push(`${page.relative}: empty canonical`);
        else if (canonicals.has(canonical)) canonicals.get(canonical).push(page.relative);
        else canonicals.set(canonical, [page.relative]);
      }
      const descriptions = tags(page.html, 'meta').filter((meta) => meta.name?.toLowerCase() === 'description');
      if (descriptions.length !== 1) errors.push(`${page.relative}: ${descriptions.length ? 'duplicate meta description' : 'missing meta description'}`);
      else if (!descriptions[0].content?.trim()) errors.push(`${page.relative}: empty meta description`);
    }
    const h1Count = tags(page.html, 'h1').length;
    if (h1Count !== 1) errors.push(`${page.relative}: expected exactly one H1, found ${h1Count}`);
    const placeholders = [...page.html.matchAll(new RegExp(PLACEHOLDER.source, 'gi'))].map((match) => match[0]);
    for (const placeholder of placeholders) errors.push(`${page.relative}: unfinished placeholder ${placeholder}`);    for (const href of internalLinks(page.html)) {
      let pathname;
      try { pathname = decodeURIComponent(new URL(href, 'https://ailivevideo.net').pathname); } catch { errors.push(`${page.relative}: invalid internal link ${href}`); continue; }
      if (!ASSET_EXTENSION.test(pathname) && !targetExists(root, pathname)) errors.push(`${page.relative}: broken internal link ${href}`);
    }
  }

  for (const [canonical, relatives] of [...canonicals.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    for (const relative of relatives.slice(1).sort()) errors.push(`${relative}: duplicate canonical ${canonical}`);
  }

  if (options.enforceReleaseCounts) {
    const routes = new Set(pages.map((page) => routeFor(page.relative)));
    const count = (prefix) => [...routes].filter((route) => route.startsWith(prefix)).length;
    const toolCount = count('/tools/') - (routes.has('/tools/') ? 1 : 0);
    const actual = [[toolCount, 30, 'tool detail routes'], [count('/categories/'), 6, 'category routes'], [count('/compare/'), 4, 'comparison routes'], [count('/guides/'), 4, 'guide routes']];
    for (const [found, expected, label] of actual) if (found !== expected) errors.push(`release counts: expected ${expected} ${label}, found ${found}`);
    for (const route of TRUST_ROUTES) if (!routes.has(route)) errors.push(`release routes: missing ${route}`);
    let sitemap = '';
    try { sitemap = await readFile(path.join(root, 'sitemap-0.xml'), 'utf8'); } catch { errors.push('sitemap: missing sitemap-0.xml'); }
    for (const route of TRUST_ROUTES) if (!sitemap.includes(`https://ailivevideo.net${route}`)) errors.push(`sitemap: indexable trust page missing ${route}`);
    for (const route of ERROR_ROUTES) if (sitemap.includes(`https://ailivevideo.net${route}`)) errors.push(`sitemap: error route present ${route}`);
    for (const page of pages.filter((page) => routeFor(page.relative).startsWith('/tools/') && routeFor(page.relative) !== '/tools/')) {
      const text = visibleText(page.html);
      if (!/Last verified/i.test(text)) errors.push(`${page.relative}: missing visible Last verified`);
      if (!/Official sources/i.test(text)) errors.push(`${page.relative}: missing visible Official sources`);
      const schemas = [...page.html.matchAll(/<script\b[^>]*type\s*=\s*(?:"application\/ld\+json"|'application\/ld\+json')[^>]*>([\s\S]*?)<\/script>/gi)];
      let validSchema = false;
      for (const schema of schemas) { try { validSchema ||= isSoftwareApplication(JSON.parse(schema[1])); } catch {} }
      if (!validSchema) errors.push(`${page.relative}: missing valid SoftwareApplication JSON-LD`);
    }
  }

  return errors;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(process.argv[2] ?? 'dist');
  const errors = await inspectBuiltSite(root, { enforceReleaseCounts: true });
  if (errors.length) {
    console.error(`Built-site release check failed (${errors.length} violations):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log('Built-site release check passed: 30 tools, 6 categories, 4 comparisons, 4 guides.');
  }
}