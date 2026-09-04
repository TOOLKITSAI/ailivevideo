# ailivevideo.net MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and locally verify the English, search-led `ailivevideo.net` MVP with 30 curated tool pages, six category pages, four comparisons, four guides, and the required trust pages.

**Architecture:** A static Astro site lives in `site/` and uses typed content collections for tools, comparisons, and guides. Astro pre-renders every public route; Pagefind creates an on-build search index, while directory filters use a small client-side data set. Cloudflare Pages receives only the generated `site/dist/` output after a separate deployment authorization.

**Tech Stack:** Node.js 22 LTS, npm, Astro, TypeScript, Astro Content Collections, `@astrojs/sitemap`, Pagefind, Vitest, Playwright, plain CSS, Cloudflare Pages.

**Spec:** `docs/superpowers/specs/2026-09-04-ailivevideo-mvp-design.md`

## Global Constraints

- The production origin is exactly `https://ailivevideo.net` and every canonical URL uses a trailing slash.
- The public site language is English only for this release.
- The release contains exactly 30 published tools, six category pages, four comparisons, and four guides.
- Every tool has two or more official sources, a visible verification date, and 500–800 words of unique English body copy.
- Unverified prices display `Check official pricing`; unverified quantitative or market claims are not published.
- The MVP has no database, application server, account system, payments, comments, ratings, CMS, or automated scraping.
- Directory filter states remain client-side state and never create indexable URLs.
- Use Astro static output; do not install or configure `@astrojs/cloudflare` because this release does not use server rendering.
- Use Node.js 22 LTS with a minimum version of 22.12.0 and commit `package-lock.json`.
- Use plain Astro and browser JavaScript; do not add React, Vue, Svelte, Tailwind, or a component library.
- Missing logos render a generated initial mark; do not hotlink third-party logos.
- Deployment, Cloudflare authentication, DNS changes, Web Analytics activation, and Search Console verification require a separate explicit user authorization.
- Release Lighthouse targets for the five representative routes are at least 90 for Performance, Accessibility, Best Practices, and SEO.
- Unless a command block explicitly changes location, npm, npx, build-output, and test commands run from `site/`; Git staging and commit commands run from the workspace root.

---

## Planned File Structure

```text
.
├── .gitignore
├── docs/
│   ├── analytics/90-day-scorecard.md
│   ├── deploy/cloudflare-pages.md
│   ├── research/tool-source-ledger.md
│   └── superpowers/
│       ├── plans/2026-09-04-ailivevideo-mvp.md
│       └── specs/2026-09-04-ailivevideo-mvp-design.md
└── site/
    ├── .nvmrc
    ├── astro.config.mjs
    ├── package.json
    ├── package-lock.json
    ├── playwright.config.ts
    ├── tsconfig.json
    ├── vitest.config.ts
    ├── public/
    │   ├── _headers
    │   ├── favicon.svg
    │   └── robots.txt
    ├── scripts/
    │   ├── check-built-site.mjs
    │   └── check-content.ts
    ├── src/
    │   ├── components/
    │   │   ├── Breadcrumbs.astro
    │   │   ├── DirectorySearch.astro
    │   │   ├── Footer.astro
    │   │   ├── Header.astro
    │   │   ├── JsonLd.astro
    │   │   ├── SeoHead.astro
    │   │   └── ToolCard.astro
    │   ├── content.config.ts
    │   ├── data/
    │   │   ├── categories.ts
    │   │   ├── comparisons/*.md
    │   │   ├── guides/*.md
    │   │   └── tools/*.md
    │   ├── layouts/
    │   │   ├── ArticleLayout.astro
    │   │   └── BaseLayout.astro
    │   ├── lib/
    │   │   ├── content-relations.ts
    │   │   ├── content.ts
    │   │   ├── seo.ts
    │   │   └── tool-filters.ts
    │   ├── pages/
    │   │   ├── about.astro
    │   │   ├── affiliate-disclosure.astro
    │   │   ├── editorial-policy.astro
    │   │   ├── index.astro
    │   │   ├── privacy.astro
    │   │   ├── terms.astro
    │   │   ├── categories/[slug].astro
    │   │   ├── compare/[slug].astro
    │   │   ├── guides/[slug].astro
    │   │   └── tools/
    │   │       ├── [slug].astro
    │   │       └── index.astro
    │   └── styles/global.css
    └── tests/
        ├── e2e/
        │   ├── content-routes.spec.ts
        │   ├── directory.spec.ts
        │   ├── homepage.spec.ts
        │   └── seo.spec.ts
        └── unit/
            ├── built-site.test.ts
            ├── content-relations.test.ts
            ├── content-schema.test.ts
            ├── seo.test.ts
            └── tool-filters.test.ts
```

`src/content.config.ts` owns frontmatter contracts. `src/lib/content.ts` owns collection queries and sorting. `src/lib/content-relations.ts` owns cross-entry validation without importing Astro. `scripts/check-content.ts` is the release gate for counts, body length, evidence, and relationships. Page components never reimplement these rules.

---

### Task 1: Initialize the repository, Astro project, and test harness

**Files:**
- Create: `.gitignore`
- Create: `site/.nvmrc`
- Create: `site/astro.config.mjs`
- Create: `site/vitest.config.ts`
- Create: `site/playwright.config.ts`
- Create: `site/tests/unit/project-config.test.ts`
- Modify: `site/package.json`
- Commit: `site/package-lock.json`

**Interfaces:**
- Produces: npm scripts `dev`, `build`, `check`, `test:unit`, `test:e2e`, `validate:content`, and `release:check`.
- Produces: static build output in `site/dist/`.

- [ ] **Step 1: Initialize version control and scaffold the minimal project**

Run from the workspace root:

```powershell
git init
npm create astro@latest site -- --template minimal --install --no-git --yes
```

Expected: `site/package.json` exists and `npm --prefix site run build` succeeds.

- [ ] **Step 2: Install only the approved runtime and test dependencies**

```powershell
Set-Location site
npm install @astrojs/sitemap pagefind gray-matter
npm install --save-dev vitest @playwright/test @astrojs/check tsx lighthouse
npx playwright install chromium
```

- [ ] **Step 3: Add deterministic runtime and ignore rules**

Write `site/.nvmrc`:

```text
22
```

Write `.gitignore`:

```gitignore
.superpowers/
output/
tmp/
qa_render/
site/node_modules/
site/.astro/
site/dist/
site/playwright-report/
site/test-results/
site/ailivevideo-release.zip
```

- [ ] **Step 4: Write the failing project configuration test**

```ts
// site/tests/unit/project-config.test.ts
import { describe, expect, it } from 'vitest';
import config from '../../astro.config.mjs';

describe('Astro project configuration', () => {
  it('uses the production origin and trailing slashes', () => {
    expect(config.site).toBe('https://ailivevideo.net');
    expect(config.trailingSlash).toBe('always');
    expect(config.output).toBe('static');
  });
});
```

Write `site/vitest.config.ts`:

```ts
/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: { include: ['tests/unit/**/*.test.ts'] },
});
```

Run:

```powershell
npx vitest run tests/unit/project-config.test.ts
```

Expected: FAIL because the scaffold does not yet contain the production origin, trailing slash policy, and explicit static output.

- [ ] **Step 5: Configure Astro and sitemap generation**

```js
// site/astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const excludedPaths = new Set([
  '/affiliate-disclosure/',
  '/privacy/',
  '/terms/',
]);

export default defineConfig({
  site: 'https://ailivevideo.net',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({ filter: (page) => !excludedPaths.has(new URL(page).pathname) }),
  ],
});
```

Configure `site/package.json` scripts:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && pagefind --site dist",
    "preview": "astro preview",
    "check": "astro check",
    "test:unit": "vitest run",
    "test:e2e": "playwright test",
    "validate:content": "tsx scripts/check-content.ts",
    "release:check": "npm run validate:content && npm run check && npm run test:unit && npm run build && node scripts/check-built-site.mjs && npm run test:e2e"
  }
}
```

- [ ] **Step 6: Add Playwright configuration and verify the harness**

```ts
// site/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://127.0.0.1:4321', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1',
    port: 4321,
    reuseExistingServer: !process.env.CI,
  },
});
```

Run:

```powershell
npm run test:unit
npm run check
npm run build
```

Expected: all commands exit with code 0 and `dist/index.html` exists.

- [ ] **Step 7: Commit the foundation**

```powershell
git add .gitignore docs site
git commit -m "chore: initialize ailivevideo Astro site"
```

---

### Task 2: Define categories and typed content collections

**Files:**
- Create: `site/src/data/categories.ts`
- Create: `site/src/content.config.ts`
- Create: `site/tests/unit/content-schema.test.ts`

**Interfaces:**
- Produces: `CATEGORY_SLUGS`, `CategorySlug`, `CATEGORIES`.
- Produces: Astro collections named `tools`, `comparisons`, and `guides`.
- Produces: shared frontmatter keys consumed by every content query and route.

- [ ] **Step 1: Write the failing schema tests**

```ts
// site/tests/unit/content-schema.test.ts
import { describe, expect, it } from 'vitest';
import { toolSchema } from '../../src/content.config';

const validTool = {
  name: 'Example Tool',
  description: 'A concise search description for the example tool.',
  officialUrl: 'https://example.com/',
  categories: ['ai-avatars'],
  oneLineVerdict: 'A clear verdict grounded in official product information.',
  bestFor: 'Teams testing an AI avatar workflow',
  capabilities: ['Avatar video'],
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
```

Run:

```powershell
npm run test:unit -- tests/unit/content-schema.test.ts
```

Expected: FAIL because the categories and exported schema do not exist.

- [ ] **Step 2: Implement the fixed six-category taxonomy**

```ts
// site/src/data/categories.ts
export const CATEGORY_SLUGS = [
  'ai-avatars',
  'real-time-generative-video',
  'ai-video-agents',
  'live-translation-dubbing',
  'streaming-production-automation',
  'ai-live-shopping',
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const CATEGORIES: Record<CategorySlug, { name: string; description: string }> = {
  'ai-avatars': { name: 'AI Avatars & Digital Humans', description: 'Avatar and digital-human platforms used in live or interactive video workflows.' },
  'real-time-generative-video': { name: 'Real-Time Generative Video', description: 'Models and products that generate or transform video at interactive or faster-than-playback speeds.' },
  'ai-video-agents': { name: 'AI Video Agents', description: 'Conversational visual agents designed to respond to users through generated video.' },
  'live-translation-dubbing': { name: 'Live Translation & Dubbing', description: 'Live captioning, interpretation, translation, and speech localization tools.' },
  'streaming-production-automation': { name: 'Streaming Production & Automation', description: 'Production and automation software used to operate AI-assisted live video.' },
  'ai-live-shopping': { name: 'AI Live Shopping', description: 'Live-commerce platforms with automation, personalization, or AI-assisted selling workflows.' },
};
```

- [ ] **Step 3: Implement collection schemas**

Create `site/src/content.config.ts` with `glob()` loaders rooted at `src/data/tools`, `src/data/comparisons`, and `src/data/guides`. Export `toolSchema` for direct tests.

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORY_SLUGS } from './data/categories';

const sourceUrl = z.string().url();
const status = z.enum(['draft', 'reviewed', 'published']);

export const toolSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(40).max(170),
  officialUrl: sourceUrl,
  categories: z.array(z.enum(CATEGORY_SLUGS)).min(1).max(3),
  oneLineVerdict: z.string().min(30).max(180),
  bestFor: z.string().min(10).max(120),
  capabilities: z.array(z.string().min(3)).min(2).max(8),
  realTimeDefinition: z.string().min(30),
  pricingModel: z.string().min(3),
  freeAccessStatus: z.enum(['free', 'trial', 'paid', 'unknown']),
  apiAvailable: z.enum(['yes', 'no', 'unknown']),
  realTimeCapability: z.enum(['native', 'near-real-time', 'workflow', 'none', 'unknown']),
  pros: z.array(z.string().min(5)).min(2).max(5),
  cons: z.array(z.string().min(5)).min(2).max(5),
  alternatives: z.array(z.string()).min(2).max(5),
  officialSources: z.array(sourceUrl).min(2).max(8),
  affiliateUrl: sourceUrl.optional(),
  lastVerified: z.coerce.date(),
  editorialStatus: status,
  featured: z.boolean().default(false),
});

const articleFields = {
  title: z.string().min(20).max(100),
  description: z.string().min(40).max(170),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  officialSources: z.array(sourceUrl).min(2),
  editorialStatus: status,
};

const tools = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/data/tools' }), schema: toolSchema });
const comparisons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/comparisons' }),
  schema: z.object({ ...articleFields, toolA: z.string(), toolB: z.string() }),
});
const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/guides' }),
  schema: z.object({ ...articleFields, relatedTools: z.array(z.string()).min(2).max(8) }),
});

export const collections = { tools, comparisons, guides };
```

- [ ] **Step 4: Run tests and Astro type checks**

```powershell
npm run test:unit -- tests/unit/content-schema.test.ts
npm run check
```

Expected: both commands pass.

- [ ] **Step 5: Commit the content contracts**

```powershell
git add site/src/content.config.ts site/src/data/categories.ts site/tests/unit/content-schema.test.ts
git commit -m "feat: define curated content schemas"
```

---

### Task 3: Add cross-content validation and the release content gate

**Files:**
- Create: `site/src/lib/content-relations.ts`
- Create: `site/scripts/check-content.ts`
- Create: `site/tests/unit/content-relations.test.ts`

**Interfaces:**
- Produces: `validateToolRelations(tools, strict): string[]`.
- Consumes: Markdown frontmatter from `src/data/tools/*.md`.
- Produces: `npm run validate:content -- --allow-partial` for content batches and strict `npm run validate:content` for release.

- [ ] **Step 1: Write relation tests for exact counts, alternatives, and category coverage**

```ts
// site/tests/unit/content-relations.test.ts
import { describe, expect, it } from 'vitest';
import { validateToolRelations, type ToolRelationRecord } from '../../src/lib/content-relations';

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
```

Run:

```powershell
npm run test:unit -- tests/unit/content-relations.test.ts
```

Expected: FAIL because the validator does not exist.

- [ ] **Step 2: Implement the pure relation validator**

```ts
// site/src/lib/content-relations.ts
import { CATEGORY_SLUGS } from '../data/categories';

export interface ToolRelationRecord {
  slug: string;
  categories: string[];
  alternatives: string[];
}

export function validateToolRelations(tools: ToolRelationRecord[], strict: boolean): string[] {
  const issues: string[] = [];
  const slugs = new Set(tools.map((tool) => tool.slug));

  for (const tool of tools) {
    for (const alternative of tool.alternatives) {
      if (!slugs.has(alternative)) issues.push(`${tool.slug}: unknown alternative ${alternative}`);
    }
  }

  if (strict && tools.length !== 30) issues.push(`expected 30 published tools, found ${tools.length}`);
  if (strict) {
    for (const category of CATEGORY_SLUGS) {
      if (!tools.some((tool) => tool.categories.includes(category))) issues.push(`category ${category} has no published tools`);
    }
  }
  return issues;
}
```

- [ ] **Step 3: Implement the Markdown release checker**

`site/scripts/check-content.ts` must:

1. Treat an absent content directory as an empty collection, then read every `src/data/tools/*.md` file with `gray-matter`.
2. Select entries whose `editorialStatus` is `published`.
3. Derive each slug from its filename.
4. Require two unique HTTPS `officialSources`.
5. Count English body words and require 500–800.
6. Run `validateToolRelations(records, !process.argv.includes('--allow-partial'))`.
7. In strict mode require exactly four published comparison files and four published guide files.
8. Print every issue and exit with status 1; print counts and exit 0 when clean.

Use this exit block exactly:

```ts
if (issues.length > 0) {
  for (const issue of issues) console.error(`CONTENT_ERROR ${issue}`);
  process.exit(1);
}

console.log(`CONTENT_OK tools=${tools.length} comparisons=${comparisons.length} guides=${guides.length}`);
```

- [ ] **Step 4: Verify both modes**

```powershell
npm run test:unit -- tests/unit/content-relations.test.ts
npm run validate:content -- --allow-partial
```

Expected: PASS with zero content files. Then run strict mode:

```powershell
npm run validate:content
```

Expected: FAIL with explicit count messages because launch content has not been written.

- [ ] **Step 5: Commit the content gate**

```powershell
git add site/src/lib/content-relations.ts site/scripts/check-content.ts site/tests/unit/content-relations.test.ts
git commit -m "test: enforce launch content quality"
```

---

### Task 4: Build the accessible site shell and visual system

**Files:**
- Create: `site/src/styles/global.css`
- Create: `site/src/components/Header.astro`
- Create: `site/src/components/Footer.astro`
- Create: `site/src/layouts/BaseLayout.astro`
- Modify: `site/src/pages/index.astro`
- Create: `site/tests/e2e/homepage.spec.ts`

**Interfaces:**
- Produces: `BaseLayout` props `{ title, description, canonicalPath, noindex? }`.
- Produces: site-wide skip link, header, main landmark, and footer.

- [ ] **Step 1: Write the failing shell test**

```ts
// site/tests/e2e/homepage.spec.ts
import { expect, test } from '@playwright/test';

test('homepage exposes the primary navigation and landmarks', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'AI Live Video', exact: true })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
});
```

Run `npm run build && npm run test:e2e -- tests/e2e/homepage.spec.ts`.

Expected: FAIL because the default Astro page has no approved shell.

- [ ] **Step 2: Implement the visual tokens**

In `global.css`, define neutral light surfaces, `#635bff` as the only brand accent, system fonts, a 72rem content width, visible keyboard focus, and breakpoints at 48rem and 64rem. Include reusable classes for `.container`, `.button`, `.tool-grid`, `.article-grid`, `.eyebrow`, and `.sr-only`. Do not add animation other than a reduced-motion-safe 120ms color transition.

Use these root tokens:

```css
:root {
  --color-bg: #fbfcff;
  --color-surface: #ffffff;
  --color-text: #151821;
  --color-muted: #636b7a;
  --color-border: #e3e6ed;
  --color-accent: #635bff;
  --color-accent-strong: #4f46e5;
  --radius-sm: 0.5rem;
  --radius-md: 0.875rem;
  --shadow-soft: 0 0.75rem 2rem rgb(24 30 48 / 8%);
}
```

- [ ] **Step 3: Implement semantic header, footer, and layout**

The primary navigation labels must be exactly `Tools`, `Categories`, `Compare`, and `Guides`. The footer links must include `About`, `Editorial Policy`, `Affiliate Disclosure`, `Privacy`, and `Terms`. The brand link accessible name must be `AI Live Video`.

`BaseLayout.astro` imports `global.css`, renders a skip link to `#main-content`, uses `<html lang="en">`, and passes SEO props to the head component added in Task 10. Until Task 10 exists, render a normal `<title>` and description meta tag directly.

- [ ] **Step 4: Replace the scaffold homepage with a shell fixture**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="AI Live Video" description="Curated AI live video tools and practical guides." canonicalPath="/">
  <h1>Find the right AI live video tool</h1>
</BaseLayout>
```

- [ ] **Step 5: Build and run the shell test**

```powershell
npm run build
npm run test:e2e -- tests/e2e/homepage.spec.ts
```

Expected: PASS at desktop and no console errors.

- [ ] **Step 6: Commit the shell**

```powershell
git add site/src/styles site/src/components/Header.astro site/src/components/Footer.astro site/src/layouts/BaseLayout.astro site/src/pages/index.astro site/tests/e2e/homepage.spec.ts
git commit -m "feat: add accessible site shell"
```

---

### Task 5: Implement collection queries and directory filtering

**Files:**
- Create: `site/src/lib/content.ts`
- Create: `site/src/lib/tool-filters.ts`
- Create: `site/src/components/ToolCard.astro`
- Create: `site/src/components/DirectorySearch.astro`
- Create: `site/src/pages/tools/index.astro`
- Create: `site/tests/unit/tool-filters.test.ts`
- Create: `site/tests/e2e/directory.spec.ts`

**Interfaces:**
- Produces: `getPublishedTools(): Promise<CollectionEntry<'tools'>[]>` sorted by name.
- Produces: `filterTools(items, filters): ToolDirectoryItem[]`.
- Consumes: published `tools` collection entries.

- [ ] **Step 1: Write failing unit tests for the filter contract**

```ts
// site/tests/unit/tool-filters.test.ts
import { describe, expect, it } from 'vitest';
import { filterTools, type ToolDirectoryItem } from '../../src/lib/tool-filters';

const items: ToolDirectoryItem[] = [
  { slug: 'avatar-one', name: 'Avatar One', categorySlugs: ['ai-avatars'], freeAccessStatus: 'trial', apiAvailable: 'yes', realTimeCapability: 'workflow' },
  { slug: 'world-one', name: 'World One', categorySlugs: ['real-time-generative-video'], freeAccessStatus: 'paid', apiAvailable: 'no', realTimeCapability: 'native' },
];

it('matches name text without case sensitivity', () => {
  expect(filterTools(items, { query: 'AVATAR', category: 'all', freeAccess: false, api: false, realTime: false })).toHaveLength(1);
});

it('combines category and capability filters', () => {
  expect(filterTools(items, { query: '', category: 'real-time-generative-video', freeAccess: false, api: false, realTime: true })).toEqual([items[1]]);
});
```

Run `npm run test:unit -- tests/unit/tool-filters.test.ts`.

Expected: FAIL because the module does not exist.

- [ ] **Step 2: Implement the pure filter function**

```ts
// site/src/lib/tool-filters.ts
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
```

- [ ] **Step 3: Add collection queries and cards**

`content.ts` must return only `editorialStatus === 'published'`, sort tools with `localeCompare`, and expose category-specific and featured queries. `ToolCard.astro` displays the generated initial mark, name, verdict, best-for text, category label, and a single detail-page link.

- [ ] **Step 4: Build the client-side directory control**

`DirectorySearch.astro` receives serialized directory records, renders a text input, category select, three checkboxes, a result count with `aria-live="polite"`, and a tool grid. Filter changes update existing DOM cards and never change the URL. The empty state contains a `Clear filters` button and links to the six categories.

- [ ] **Step 5: Write and run the directory E2E test**

```ts
// site/tests/e2e/directory.spec.ts
import { expect, test } from '@playwright/test';

test('directory controls are keyboard accessible', async ({ page }) => {
  await page.goto('/tools/');
  const search = page.getByRole('searchbox', { name: 'Search tools' });
  await search.focus();
  await expect(search).toBeFocused();
  await expect(page.getByRole('combobox', { name: 'Category' })).toBeVisible();
  await expect(page.getByText(/tools found/i)).toBeVisible();
});
```

Run:

```powershell
npm run test:unit -- tests/unit/tool-filters.test.ts
npm run build
npm run test:e2e -- tests/e2e/directory.spec.ts
```

Expected: PASS even before launch content exists; the result count may be zero.

- [ ] **Step 6: Commit the directory**

```powershell
git add site/src/lib/content.ts site/src/lib/tool-filters.ts site/src/components/ToolCard.astro site/src/components/DirectorySearch.astro site/src/pages/tools site/tests/unit/tool-filters.test.ts site/tests/e2e/directory.spec.ts
git commit -m "feat: add searchable tool directory"
```

---

### Task 6: Generate tool detail pages and software metadata

**Files:**
- Create: `site/src/components/Breadcrumbs.astro`
- Create: `site/src/pages/tools/[slug].astro`
- Create: `site/src/lib/seo.ts`
- Create: `site/tests/unit/seo.test.ts`

**Interfaces:**
- Produces: `softwareApplicationJsonLd(tool, canonicalUrl)`.
- Produces: one static `/tools/[slug]/` route per published tool.
- Consumes: `getPublishedTools()` and alternative slugs.

- [ ] **Step 1: Write the failing structured-data test**

```ts
// site/tests/unit/seo.test.ts
import { expect, it } from 'vitest';
import { softwareApplicationJsonLd } from '../../src/lib/seo';

it('does not invent ratings or numeric offers', () => {
  const json = softwareApplicationJsonLd({ name: 'Example', description: 'Example description', officialUrl: 'https://example.com/' }, 'https://ailivevideo.net/tools/example/');
  expect(json['@type']).toBe('SoftwareApplication');
  expect(json.url).toBe('https://ailivevideo.net/tools/example/');
  expect(json).not.toHaveProperty('aggregateRating');
  expect(json).not.toHaveProperty('offers');
});
```

Run `npm run test:unit -- tests/unit/seo.test.ts`.

Expected: FAIL because `seo.ts` does not exist.

- [ ] **Step 2: Implement the JSON-LD builder**

`softwareApplicationJsonLd` returns `@context`, `@type`, `name`, `description`, `url`, and `sameAs`. It must not emit rating, review count, price, operating system, or application category unless the content schema gains verified source fields for them.

- [ ] **Step 3: Implement tool detail routing**

`getStaticPaths()` loads published tools and returns `{ params: { slug: entry.id }, props: { tool: entry } }`. The page renders every section in the spec, shows official sources as numbered outbound links, renders `lastVerified` in ISO date form, resolves alternative slugs to existing tool cards, and uses `Check official pricing` whenever `pricingModel` is not verified.

- [ ] **Step 4: Verify type safety and zero-content builds**

```powershell
npm run test:unit -- tests/unit/seo.test.ts
npm run check
npm run build
```

Expected: PASS; no tool route exists until published content is added.

- [ ] **Step 5: Commit tool pages**

```powershell
git add -- site/src/components/Breadcrumbs.astro 'site/src/pages/tools/[slug].astro' site/src/lib/seo.ts site/tests/unit/seo.test.ts
git commit -m "feat: generate sourced tool detail pages"
```

---

### Task 7: Generate the six category pages

**Files:**
- Create: `site/src/pages/categories/[slug].astro`
- Modify: `site/src/lib/content.ts`
- Create: `site/tests/e2e/content-routes.spec.ts`

**Interfaces:**
- Produces: six static category routes from `CATEGORIES`.
- Consumes: `getToolsByCategory(category: CategorySlug)`.

- [ ] **Step 1: Write the failing category route test**

```ts
// site/tests/e2e/content-routes.spec.ts
import { expect, test } from '@playwright/test';

test('all six category routes render unique headings', async ({ page }) => {
  const paths = [
    '/categories/ai-avatars/',
    '/categories/real-time-generative-video/',
    '/categories/ai-video-agents/',
    '/categories/live-translation-dubbing/',
    '/categories/streaming-production-automation/',
    '/categories/ai-live-shopping/',
  ];
  for (const path of paths) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
});
```

Run `npm run build && npm run test:e2e -- tests/e2e/content-routes.spec.ts`.

Expected: FAIL because the category routes do not exist.

- [ ] **Step 2: Add category queries and static paths**

Add this exact query interface to `content.ts`:

```ts
export async function getToolsByCategory(category: CategorySlug) {
  return (await getPublishedTools()).filter((tool) => tool.data.categories.includes(category));
}
```

Generate static paths from `Object.entries(CATEGORIES)`, not from the current tool set, so all six pages exist before every content batch is present.

- [ ] **Step 3: Implement category page content**

Each page renders the category name, category description, tool count, tool grid, one explanation of what belongs in the category, and links to related comparisons and guides when those entries exist. Empty development-state pages state that curated listings are being prepared; strict release validation prevents an empty category from shipping.

- [ ] **Step 4: Run the category checks**

```powershell
npm run build
npm run test:e2e -- tests/e2e/content-routes.spec.ts
```

Expected: PASS for all six paths.

- [ ] **Step 5: Commit category routes**

```powershell
git add site/src/pages/categories site/src/lib/content.ts site/tests/e2e/content-routes.spec.ts
git commit -m "feat: add AI live video category hubs"
```

---

### Task 8: Generate comparison and guide routes

**Files:**
- Create: `site/src/layouts/ArticleLayout.astro`
- Create: `site/src/pages/compare/[slug].astro`
- Create: `site/src/pages/guides/[slug].astro`
- Modify: `site/src/lib/content.ts`
- Modify: `site/scripts/check-content.ts`

**Interfaces:**
- Produces: static routes for published `comparisons` and `guides`.
- Consumes: comparison `toolA` and `toolB`; guide `relatedTools`.

- [ ] **Step 1: Add failing route-unit expectations**

Extend `content-relations.test.ts` with cases that reject a comparison whose tool slug is missing and a guide whose related tool slug is missing:

```ts
import { validateArticleRelations } from '../../src/lib/content-relations';

it('reports missing tools used by articles', () => {
  const tools = [{ slug: 'heygen', categories: ['ai-avatars'], alternatives: ['heygen', 'heygen'] }];
  const comparisons = [{ slug: 'heygen-vs-synthesia', toolA: 'heygen', toolB: 'synthesia' }];
  const guides = [{ slug: 'avatar-guide', relatedTools: ['heygen', 'tavus'] }];
  const issues = validateArticleRelations(tools, comparisons, guides);
  expect(issues).toContain('heygen-vs-synthesia: unknown tool synthesia');
  expect(issues).toContain('avatar-guide: unknown tool tavus');
});
```

Run the file and confirm both new assertions fail.

- [ ] **Step 2: Extend relation validation**

Add exported types `ComparisonRelationRecord` and `GuideRelationRecord`, plus `validateArticleRelations(tools, comparisons, guides): string[]`. Messages must identify the article slug and missing tool slug, for example `heygen-vs-synthesia: unknown tool synthesia`.

Update `scripts/check-content.ts` to parse comparison and guide frontmatter and append every result from `validateArticleRelations()` before its exit decision.

- [ ] **Step 3: Implement the article layout and static routes**

`ArticleLayout.astro` renders the title, description, published and updated dates, breadcrumbs, main Markdown content, official source list, and a related-tool section. Both route files filter to `editorialStatus === 'published'`, render the collection entry with Astro's `render()`, and supply the related tool records to the layout.

- [ ] **Step 4: Verify unit tests, type checks, and build**

```powershell
npm run test:unit -- tests/unit/content-relations.test.ts
npm run check
npm run build
```

Expected: PASS with zero article routes until launch content is added.

- [ ] **Step 5: Commit article routing**

```powershell
git add site/src/layouts/ArticleLayout.astro site/src/pages/compare site/src/pages/guides site/src/lib/content.ts site/src/lib/content-relations.ts site/scripts/check-content.ts site/tests/unit/content-relations.test.ts
git commit -m "feat: add comparison and guide routes"
```

---

### Task 9: Implement the approved search-led homepage

**Files:**
- Modify: `site/src/pages/index.astro`
- Modify: `site/src/styles/global.css`
- Modify: `site/tests/e2e/homepage.spec.ts`

**Interfaces:**
- Consumes: featured published tools, six categories, latest comparisons, and latest guides.
- Produces: homepage search that submits to Pagefind and links to `/tools/` when empty.

- [ ] **Step 1: Add failing homepage hierarchy assertions**

```ts
test('homepage follows the approved search-led hierarchy', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Find the right AI live video tool' })).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'Search AI live video tools' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Featured tools' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Learn about AI live video' })).toBeVisible();
});
```

Run the homepage E2E test and confirm it fails on the missing sections.

- [ ] **Step 2: Implement the hero and search-first content order**

Use the approved copy:

```text
Eyebrow: Curated and independently reviewed
Heading: Find the right AI live video tool
Description: Explore curated tools for avatars, live shopping, translation and real-time video generation.
Search label: Search AI live video tools
```

Render sections in this exact order: hero search, popular categories, featured tools, featured comparison, latest guides, editorial-method note.

- [ ] **Step 3: Make development and production content states explicit**

If no tool is marked `featured`, show the first four published tools alphabetically. If fewer than four tools exist during development, render only available records without filler cards. Strict release validation guarantees 30 published records before release.

- [ ] **Step 4: Test at desktop and mobile widths**

Add a mobile Playwright project using `devices['iPhone 13']`. Run:

```powershell
npm run build
npm run test:e2e -- tests/e2e/homepage.spec.ts
```

Expected: PASS in desktop Chromium and the mobile project; no horizontal scroll at 390 pixels.

- [ ] **Step 5: Commit the homepage**

```powershell
git add site/src/pages/index.astro site/src/styles/global.css site/tests/e2e/homepage.spec.ts site/playwright.config.ts
git commit -m "feat: build search-led homepage"
```

---

### Task 10: Add canonical metadata, JSON-LD, sitemap rules, and robots directives

**Files:**
- Create: `site/src/components/SeoHead.astro`
- Create: `site/src/components/JsonLd.astro`
- Modify: `site/src/layouts/BaseLayout.astro`
- Modify: `site/src/layouts/ArticleLayout.astro`
- Modify: `site/src/lib/seo.ts`
- Create: `site/public/robots.txt`
- Create: `site/tests/e2e/seo.spec.ts`

**Interfaces:**
- Produces: `canonicalUrl(pathname): string`, `breadcrumbJsonLd(items)`, `websiteJsonLd()`, `articleJsonLd(article)`.
- Produces: exactly one canonical and one page description per public page.

- [ ] **Step 1: Write failing metadata tests**

```ts
// site/tests/e2e/seo.spec.ts
import { expect, test } from '@playwright/test';

test('homepage has canonical and website structured data', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://ailivevideo.net/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('script[type="application/ld+json"]')).toContainText('WebSite');
});

test('filter controls do not create crawlable query URLs', async ({ page }) => {
  await page.goto('/tools/');
  await page.getByRole('checkbox', { name: 'API available' }).check();
  await expect(page).toHaveURL('http://127.0.0.1:4321/tools/');
});
```

Run the SEO E2E test and confirm canonical or structured-data assertions fail.

- [ ] **Step 2: Implement canonical and JSON-LD helpers**

Normalize every canonical path with exactly one leading slash and one trailing slash. Serialize JSON-LD with `JSON.stringify()` and escape `<` as `\u003c` before using `set:html`. Never concatenate untrusted Markdown into a script tag.

- [ ] **Step 3: Integrate metadata by page type**

Use `WebSite` on the homepage, `ItemList` on the directory and category pages, `SoftwareApplication` on tool pages, `Article` on comparison and guide pages, and `BreadcrumbList` on every non-home route. Do not add `FAQPage`, `AggregateRating`, or fabricated `Offer` data.

- [ ] **Step 4: Add crawler instructions**

```text
# site/public/robots.txt
User-agent: *
Allow: /

Sitemap: https://ailivevideo.net/sitemap-index.xml
```

- [ ] **Step 5: Run SEO tests and inspect generated sitemap**

```powershell
npm run build
npm run test:e2e -- tests/e2e/seo.spec.ts
Select-String -Path dist/sitemap-0.xml -Pattern '/privacy/','/terms/','/affiliate-disclosure/'
```

Expected: E2E tests pass and the final command returns no excluded legal URLs.

- [ ] **Step 6: Commit SEO infrastructure**

```powershell
git add site/src/components/SeoHead.astro site/src/components/JsonLd.astro site/src/layouts site/src/lib/seo.ts site/public/robots.txt site/tests/e2e/seo.spec.ts
git commit -m "feat: add static SEO infrastructure"
```

---

### Task 11: Add Pagefind search without a service dependency

**Files:**
- Create: `site/src/components/SiteSearch.astro`
- Modify: `site/src/pages/index.astro`
- Modify: `site/src/layouts/BaseLayout.astro`
- Modify: `site/tests/e2e/homepage.spec.ts`

**Interfaces:**
- Consumes: Pagefind's generated `/pagefind/pagefind.js` bundle after `npm run build`.
- Produces: accessible result links to indexed tool, category, comparison, and guide pages.

- [ ] **Step 1: Add a failing search behavior test**

After at least one published content entry exists, the test searches a known tool name and expects a link to its tool route. Before content batches, add a structural assertion that the input and live result container exist and the no-results message is accessible.

```ts
await expect(page.getByRole('searchbox', { name: 'Search AI live video tools' })).toBeVisible();
await expect(page.locator('[aria-live="polite"][data-search-results]')).toHaveCount(1);
```

- [ ] **Step 2: Implement lazy Pagefind loading**

On first focus, import `/pagefind/pagefind.js`, call `init()`, debounce input by 150ms, request at most eight results, and render title, excerpt, and URL. Display `No matching tools or guides` for a completed empty search. If the import fails in the development server, show `Search is available in the production preview` without throwing a console error.

- [ ] **Step 3: Scope the indexed page body**

Add `data-pagefind-body` to the main content area, `data-pagefind-ignore` to header/footer navigation, and page metadata filters for content type and category where available. Confirm that navigation text is absent from result excerpts.

- [ ] **Step 4: Build and inspect the search bundle**

```powershell
npm run build
Test-Path dist/pagefind/pagefind.js
```

Expected: `True`.

- [ ] **Step 5: Commit search**

```powershell
git add site/src/components/SiteSearch.astro site/src/pages/index.astro site/src/layouts/BaseLayout.astro site/tests/e2e/homepage.spec.ts
git commit -m "feat: add static Pagefind search"
```

---

### Task 12: Add trust and legal pages

**Files:**
- Create: `site/src/pages/about.astro`
- Create: `site/src/pages/editorial-policy.astro`
- Create: `site/src/pages/affiliate-disclosure.astro`
- Create: `site/src/pages/privacy.astro`
- Create: `site/src/pages/terms.astro`
- Modify: `site/tests/e2e/content-routes.spec.ts`

**Interfaces:**
- Produces: visible editorial methodology and source standards.
- Produces: legal pages excluded from sitemap as specified in Task 1.

- [ ] **Step 1: Add failing trust-page route tests**

Add these assertions to `content-routes.spec.ts`:

```ts
test('trust and legal pages are available', async ({ page }) => {
  for (const path of ['/about/', '/editorial-policy/', '/affiliate-disclosure/', '/privacy/', '/terms/']) {
    expect((await page.goto(path))?.status()).toBe(200);
  }
  await page.goto('/editorial-policy/');
  await expect(page.getByRole('main')).toContainText(/official sources/i);
  await expect(page.getByRole('main')).toContainText(/last verified/i);
  await expect(page.getByRole('main')).toContainText(/corrections/i);
  await page.goto('/affiliate-disclosure/');
  await expect(page.getByRole('main')).toContainText(/do not determine our editorial conclusions/i);
});
```

Run the route test and confirm the five requests fail before the pages are created.

- [ ] **Step 2: Write the five pages in plain English**

The About page states the site's scope and audience. Editorial Policy defines inclusion, evidence, corrections, and update practices. Affiliate Disclosure explains link disclosure without claiming current partnerships. Privacy lists Cloudflare Web Analytics as the only planned analytics service and states that activation occurs only after configuration. Terms covers informational use, external links, trademarks, and no warranty.

- [ ] **Step 3: Run route and sitemap tests**

```powershell
npm run build
npm run test:e2e -- tests/e2e/content-routes.spec.ts tests/e2e/seo.spec.ts
```

Expected: all routes pass and the three excluded legal pages remain absent from the sitemap.

- [ ] **Step 4: Commit trust pages**

```powershell
git add site/src/pages/about.astro site/src/pages/editorial-policy.astro site/src/pages/affiliate-disclosure.astro site/src/pages/privacy.astro site/src/pages/terms.astro site/tests/e2e/content-routes.spec.ts
git commit -m "content: add editorial and legal pages"
```

---

### Task 13: Research and publish the avatar tool batch

**Files:**
- Create: `docs/research/tool-source-ledger.md`
- Create: `site/src/data/tools/heygen.md`
- Create: `site/src/data/tools/synthesia.md`
- Create: `site/src/data/tools/d-id.md`
- Create: `site/src/data/tools/akool.md`
- Create: `site/src/data/tools/deepbrain-ai.md`

**Interfaces:**
- Produces: five published tool records in `ai-avatars`.
- Produces: source-ledger rows used for later price and link maintenance.

- [ ] **Step 1: Create the source ledger structure**

Use columns `Slug`, `Official homepage`, `Pricing source`, `Capability source`, `Verified UTC date`, `Reviewer note`. Record only first-party URLs. A vendor without two accessible official sources cannot enter the launch set.

- [ ] **Step 2: Verify and record sources for all five tools**

Open each official homepage, pricing page, and documentation or feature page. Record the date, whether the product explicitly supports live or interactive use, and whether public pricing exists. Do not copy marketing superlatives as facts.

- [ ] **Step 3: Write the five Markdown entries**

Each file must use the Task 2 schema, contain 500–800 unique English words, list two to five real alternatives, and explain whether live video is native, near-real-time, or a workflow integration. Set `editorialStatus: published` only after every source link has been opened and checked.

- [ ] **Step 4: Run partial validation and build**

```powershell
npm run validate:content -- --allow-partial
npm run check
npm run build
```

Expected: PASS; five tool detail routes exist.

- [ ] **Step 5: Commit the avatar batch**

```powershell
git add docs/research/tool-source-ledger.md site/src/data/tools/heygen.md site/src/data/tools/synthesia.md site/src/data/tools/d-id.md site/src/data/tools/akool.md site/src/data/tools/deepbrain-ai.md
git commit -m "content: publish AI avatar tool profiles"
```

---

### Task 14: Research and publish the video-agent tool batch

**Files:**
- Modify: `docs/research/tool-source-ledger.md`
- Create: `site/src/data/tools/tavus.md`
- Create: `site/src/data/tools/simli.md`
- Create: `site/src/data/tools/anam.md`
- Create: `site/src/data/tools/soul-machines.md`
- Create: `site/src/data/tools/uneeq.md`

**Interfaces:**
- Produces: five published tool records in `ai-video-agents`.

- [ ] **Step 1: Verify two or more first-party sources per tool**

Record canonical product, documentation, and pricing URLs in the ledger. Explicitly distinguish conversational latency claims from avatar rendering quality and note when no public latency SLA exists.

- [ ] **Step 2: Write the five complete tool profiles**

Use only confirmed capabilities. Alternatives must resolve to slugs already present in Tasks 13–14 so partial relation validation succeeds.

- [ ] **Step 3: Validate and build**

```powershell
npm run validate:content -- --allow-partial
npm run build
```

Expected: PASS with ten published tool routes.

- [ ] **Step 4: Commit the video-agent batch**

```powershell
git add docs/research/tool-source-ledger.md site/src/data/tools/tavus.md site/src/data/tools/simli.md site/src/data/tools/anam.md site/src/data/tools/soul-machines.md site/src/data/tools/uneeq.md
git commit -m "content: publish AI video agent profiles"
```

---

### Task 15: Research and publish the real-time generation batch

**Files:**
- Modify: `docs/research/tool-source-ledger.md`
- Create: `site/src/data/tools/minimax-h3-max.md`
- Create: `site/src/data/tools/pixverse-r1.md`
- Create: `site/src/data/tools/runway.md`
- Create: `site/src/data/tools/decart.md`
- Create: `site/src/data/tools/world-labs.md`

**Interfaces:**
- Produces: five published tool records in `real-time-generative-video`.

- [ ] **Step 1: Verify product availability and latency definitions**

For every tool, record whether the cited figure is model inference, backend processing, end-to-end response, frame rate, or marketing language. State geographic, queue, duration, resolution, and access limitations when official material provides them.

- [ ] **Step 2: Write the five complete tool profiles**

Use `native` only for a product that continuously responds at interactive frame rates, `near-real-time` for faster-than-playback or low-latency clip generation, and `workflow` for tools that participate in a live production process without continuous generation.

- [ ] **Step 3: Validate and build**

```powershell
npm run validate:content -- --allow-partial
npm run build
```

Expected: PASS with fifteen published tool routes.

- [ ] **Step 4: Commit the generation batch**

```powershell
git add docs/research/tool-source-ledger.md site/src/data/tools/minimax-h3-max.md site/src/data/tools/pixverse-r1.md site/src/data/tools/runway.md site/src/data/tools/decart.md site/src/data/tools/world-labs.md
git commit -m "content: publish real-time generation profiles"
```

---

### Task 16: Research and publish the live translation batch

**Files:**
- Modify: `docs/research/tool-source-ledger.md`
- Create: `site/src/data/tools/wordly.md`
- Create: `site/src/data/tools/interprefy.md`
- Create: `site/src/data/tools/kudo.md`
- Create: `site/src/data/tools/ai-media-lexi.md`
- Create: `site/src/data/tools/syncwords.md`

**Interfaces:**
- Produces: five published tool records in `live-translation-dubbing`.

- [ ] **Step 1: Verify language, caption, audio, and platform support**

Use first-party pages to distinguish live captions, translated captions, interpreted audio, dubbed speech, and post-production localization. Do not describe caption-only products as live dubbing.

- [ ] **Step 2: Write the five complete tool profiles**

Include the delivery format, supported live workflow, pricing visibility, API status, and known constraints. Link alternatives to published slugs within the current 20-tool set.

- [ ] **Step 3: Validate and build**

```powershell
npm run validate:content -- --allow-partial
npm run build
```

Expected: validation and build pass with twenty published tool routes.

- [ ] **Step 4: Commit the translation batch**

```powershell
git add docs/research/tool-source-ledger.md site/src/data/tools/wordly.md site/src/data/tools/interprefy.md site/src/data/tools/kudo.md site/src/data/tools/ai-media-lexi.md site/src/data/tools/syncwords.md
git commit -m "content: publish live translation profiles"
```

---

### Task 17: Research and publish the streaming-production batch

**Files:**
- Modify: `docs/research/tool-source-ledger.md`
- Create: `site/src/data/tools/restream.md`
- Create: `site/src/data/tools/streamyard.md`
- Create: `site/src/data/tools/obs-studio.md`
- Create: `site/src/data/tools/streamlabs.md`
- Create: `site/src/data/tools/veed-live.md`

**Interfaces:**
- Produces: five published tool records in `streaming-production-automation`.

- [ ] **Step 1: Verify each product's current production role**

Record official evidence for multistreaming, studio production, automation, captions, integrations, or AI-assisted features. State plainly when a product is supporting infrastructure rather than a generative video model.

- [ ] **Step 2: Write the five complete tool profiles**

Keep the category relevance explicit in `oneLineVerdict` and `realTimeDefinition`. Do not use generic streaming popularity as the reason for inclusion.

- [ ] **Step 3: Validate and build**

```powershell
npm run validate:content -- --allow-partial
npm run build
```

Expected: validation and build pass with twenty-five published tool routes.

- [ ] **Step 4: Commit the production batch**

```powershell
git add docs/research/tool-source-ledger.md site/src/data/tools/restream.md site/src/data/tools/streamyard.md site/src/data/tools/obs-studio.md site/src/data/tools/streamlabs.md site/src/data/tools/veed-live.md
git commit -m "content: publish streaming production profiles"
```

---

### Task 18: Research and publish the live-shopping batch

**Files:**
- Modify: `docs/research/tool-source-ledger.md`
- Create: `site/src/data/tools/firework.md`
- Create: `site/src/data/tools/bambuser.md`
- Create: `site/src/data/tools/commentsold.md`
- Create: `site/src/data/tools/channelize.md`
- Create: `site/src/data/tools/livescale.md`

**Interfaces:**
- Produces: five published tool records in `ai-live-shopping`.
- Completes: the exact 30-tool inventory.

- [ ] **Step 1: Verify commerce and AI functionality**

Use first-party sources to distinguish hosted live shopping, shoppable video, chat automation, product recommendation, clipping, and AI-presenter features. Avoid treating ordinary video commerce as AI unless the vendor documents the AI function.

- [ ] **Step 2: Write the five complete tool profiles**

Set alternatives across the complete 30-tool inventory. Revisit earlier entries and replace any provisional alternative lists so every referenced slug exists.

- [ ] **Step 3: Run partial validation and route-count checks**

```powershell
npm run validate:content -- --allow-partial
npm run build
(Get-ChildItem -Path dist/tools -Directory).Count
```

Expected: `30` tool directories, excluding the directory index file.

- [ ] **Step 4: Commit the live-shopping batch**

```powershell
git add docs/research/tool-source-ledger.md site/src/data/tools
git commit -m "content: complete thirty-tool launch directory"
```

---

### Task 19: Write and publish the four comparison pages

**Files:**
- Create: `site/src/data/comparisons/heygen-vs-synthesia.md`
- Create: `site/src/data/comparisons/tavus-vs-d-id.md`
- Create: `site/src/data/comparisons/restream-vs-streamyard.md`
- Create: `site/src/data/comparisons/firework-vs-bambuser.md`

**Interfaces:**
- Produces: four published comparison routes.
- Consumes: verified tool data and official source ledger.

- [ ] **Step 1: Define one distinct decision question per comparison**

Use these angles: avatar video production, conversational video interaction, browser-based live production, and enterprise live shopping. Each page must state who should choose each tool and when neither is the right fit.

- [ ] **Step 2: Write evidence-backed comparison content**

Use the schemas from Task 2. Compare only dimensions supported by the cited official sources. Do not use invented scores or declare an overall winner without a specific user context.

- [ ] **Step 3: Validate article relationships and routes**

```powershell
npm run validate:content -- --allow-partial
npm run check
npm run build
```

Expected: four comparison directories exist under `dist/compare/`.

- [ ] **Step 4: Commit comparisons**

```powershell
git add site/src/data/comparisons
git commit -m "content: publish launch tool comparisons"
```

---

### Task 20: Write and publish the four search guides

**Files:**
- Create: `site/src/data/guides/what-is-ai-live-video.md`
- Create: `site/src/data/guides/how-to-create-ai-live-video.md`
- Create: `site/src/data/guides/ai-avatar-for-live-streaming.md`
- Create: `site/src/data/guides/ai-live-shopping-guide.md`

**Interfaces:**
- Produces: four published guide routes.
- Consumes: two to eight published tool slugs per guide.

- [ ] **Step 1: Map each guide to one search intent**

Respectively target definition, implementation process, avatar selection, and live-commerce workflow. Give each page a distinct title, description, outline, and set of related tools.

- [ ] **Step 2: Write original guide content**

Open with a direct answer, use descriptive headings, define “real-time” precisely, link to relevant category and tool pages, and cite official sources for product-specific claims. Avoid generic AI history and keyword repetition.

- [ ] **Step 3: Run strict content validation**

```powershell
npm run validate:content
```

Expected: `CONTENT_OK tools=30 comparisons=4 guides=4`.

- [ ] **Step 4: Build the guide routes**

```powershell
npm run build
```

Expected: four guide directories exist under `dist/guides/`.

- [ ] **Step 5: Commit guides**

```powershell
git add site/src/data/guides
git commit -m "content: publish AI live video launch guides"
```

---

### Task 21: Add release route, link, and metadata validation

**Files:**
- Create: `site/scripts/check-built-site.mjs`
- Create: `site/tests/unit/built-site.test.ts`
- Modify: `site/tests/e2e/content-routes.spec.ts`
- Modify: `site/tests/e2e/directory.spec.ts`
- Modify: `site/tests/e2e/homepage.spec.ts`
- Modify: `site/tests/e2e/seo.spec.ts`

**Interfaces:**
- Consumes: completed `site/dist/`.
- Produces: `inspectBuiltSite(root: string, options: { enforceReleaseCounts: boolean }): Promise<string[]>`.
- Produces: a nonzero exit code for missing routes, duplicate canonical URLs, broken internal links, missing metadata, or placeholder copy.

- [ ] **Step 1: Write a failing built-site checker fixture test**

Create the fixture test:

```ts
// site/tests/unit/built-site.test.ts
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { inspectBuiltSite } from '../../scripts/check-built-site.mjs';

let fixtureRoot = '';
afterEach(async () => fixtureRoot && rm(fixtureRoot, { recursive: true, force: true }));

it('reports a broken root-relative link', async () => {
  fixtureRoot = await mkdtemp(join(tmpdir(), 'ailivevideo-check-'));
  await writeFile(join(fixtureRoot, 'index.html'), '<meta name="description" content="Fixture"><link rel="canonical" href="https://ailivevideo.net/"><a href="/missing/">Missing</a>');
  expect(await inspectBuiltSite(fixtureRoot, { enforceReleaseCounts: false })).toContain('broken internal link /missing/');
});
```

Run `npm run test:unit -- tests/unit/built-site.test.ts` and expect failure because the checker does not exist. Export `inspectBuiltSite(root, options)` from `check-built-site.mjs` without running the CLI branch during import.

- [ ] **Step 2: Implement the built-site inspection**

Walk `dist/**/*.html`, parse canonical and internal `href` values, and verify:

- one canonical per indexable page;
- one non-empty description meta tag;
- no unfinished placeholder markers matching `T(?:BD|ODO)`, lorem ipsum, `example.com`, or internal citation tokens;
- every root-relative internal link resolves to an HTML file;
- exactly 30 tool detail routes, six category routes, four comparison routes, and four guide routes;
- legal pages exist but the three excluded legal URLs are absent from the sitemap;
- every tool page contains `Last verified`, `Official sources`, and JSON-LD.

Use Node's built-in filesystem and URL APIs; do not add an HTML parser dependency for these bounded checks.

- [ ] **Step 3: Expand E2E behavior checks**

Test a known tool search result, each filter, clear filters, one tool detail page, one category page, one comparison, one guide, keyboard navigation, missing-logo fallback, and the no-results state. Fail tests on uncaught page errors and console messages of type `error`.

- [ ] **Step 4: Run the complete release gate**

```powershell
npm run release:check
```

Expected: all commands pass and the built-site checker reports the exact release counts.

- [ ] **Step 5: Commit release validation**

```powershell
git add site/scripts/check-built-site.mjs site/tests/unit/built-site.test.ts site/tests/e2e
git commit -m "test: add full static release gate"
```

---

### Task 22: Perform visual, accessibility, and Lighthouse verification

**Files:**
- Create: `docs/qa/launch-verification.md`
- Modify: UI or content files only when a recorded defect requires a fix.

**Interfaces:**
- Consumes: locally served production build.
- Produces: screenshots and measured results for representative routes.

- [ ] **Step 1: Start the built site and verify representative widths**

Check `/`, `/tools/`, `/tools/heygen/`, `/categories/ai-avatars/`, and `/guides/what-is-ai-live-video/` at 360, 768, and 1440 CSS pixels. Record pass or a concrete defect for overflow, clipping, heading hierarchy, focus visibility, text contrast, and link clarity.

- [ ] **Step 2: Run Lighthouse against the five representative routes**

Start `npm run preview -- --host 127.0.0.1` in a separate terminal, create `../docs/qa/lighthouse/`, and run:

```powershell
npx lighthouse http://127.0.0.1:4321/ --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=../docs/qa/lighthouse/home.json --chrome-flags="--headless"
npx lighthouse http://127.0.0.1:4321/tools/ --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=../docs/qa/lighthouse/tools.json --chrome-flags="--headless"
npx lighthouse http://127.0.0.1:4321/tools/heygen/ --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=../docs/qa/lighthouse/heygen.json --chrome-flags="--headless"
npx lighthouse http://127.0.0.1:4321/categories/ai-avatars/ --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=../docs/qa/lighthouse/category.json --chrome-flags="--headless"
npx lighthouse http://127.0.0.1:4321/guides/what-is-ai-live-video/ --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=../docs/qa/lighthouse/guide.json --chrome-flags="--headless"
```

Record Performance, Accessibility, Best Practices, and SEO scores in `docs/qa/launch-verification.md`. Every score must be at least 90; fix the measured cause and rerun the affected URL if it is lower.

- [ ] **Step 3: Verify the full keyboard flow**

Navigate from the skip link through the header, homepage search, directory filters, first tool card, source links, and footer without a pointer. Confirm focus order follows document order and every interactive control has a visible focus state.

- [ ] **Step 4: Run the release gate after all visual fixes**

```powershell
npm run release:check
```

Expected: PASS after the final visual edit.

- [ ] **Step 5: Commit verified release state**

```powershell
git add docs/qa/launch-verification.md site
git commit -m "test: verify responsive launch experience"
```

---

### Task 23: Prepare the Cloudflare Pages deployment handoff

**Files:**
- Create: `docs/analytics/90-day-scorecard.md`
- Create: `docs/deploy/cloudflare-pages.md`
- Create: `site/public/_headers`
- Modify: `site/package.json`

**Interfaces:**
- Produces: an auditable deployment runbook and immutable local `dist/` artifact.
- Does not perform: login, remote repository creation, upload, DNS change, analytics activation, or Search Console verification.

- [ ] **Step 1: Add static security headers**

```text
# site/public/_headers
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Frame-Options: SAMEORIGIN
```

Do not add a Content Security Policy until the final Pagefind and analytics scripts are known, because an untested policy can silently break search or analytics.

- [ ] **Step 2: Write the deployment runbook with exact Pages settings**

Document:

```text
Production branch: main
Root directory: site
Build command: npm run build
Build output directory: dist
Node version: 22
Custom domain: ailivevideo.net
Canonical redirect: www.ailivevideo.net → https://ailivevideo.net/$1
```

Include post-deploy checks for HTTPS, redirect behavior, canonical URLs, `robots.txt`, sitemap, Pagefind search, six category routes, one tool route, one comparison, and one guide. Add separate post-authorization sections for enabling Cloudflare Web Analytics, verifying `https://ailivevideo.net` in Google Search Console, submitting `sitemap-index.xml`, and recording the launch baseline in the 90-day scorecard.

- [ ] **Step 3: Create the 90-day measurement scorecard**

Create `docs/analytics/90-day-scorecard.md` with rows for launch day, day 30, day 60, and day 90. Each row records indexed URLs out of 46 traffic pages, non-brand queries with impressions, monthly organic clicks, pages receiving non-brand clicks, the leading category, and the action selected from the spec's review rules. The day-90 target row must show `≥80%`, `≥30`, `≥100`, and `≥10` for the four core metrics.

- [ ] **Step 4: Re-run the release gate with deployment files present**

```powershell
npm run release:check
```

Expected: PASS with `_headers` included in `dist/`.

- [ ] **Step 5: Commit the deployment-ready state**

```powershell
git add docs/analytics/90-day-scorecard.md docs/deploy/cloudflare-pages.md site/public/_headers site/package.json site/package-lock.json
git commit -m "docs: prepare Cloudflare Pages deployment"
```

- [ ] **Step 6: Produce the immutable handoff archive**

Run from `site/` after the deployment-ready commit:

```powershell
npm run release:check
Compress-Archive -Path dist\* -DestinationPath ailivevideo-release.zip -Force
Get-FileHash ailivevideo-release.zip -Algorithm SHA256
git -C .. rev-parse HEAD
git -C .. status --short -- site docs
```

Expected: a SHA-256 digest, the deployment-ready commit hash, and no uncommitted changes under `site/` or `docs/`. The archive remains ignored and is not committed.

- [ ] **Step 7: Stop for explicit external authorization**

Report that the local release passed, provide the commit hash and archive digest, and ask the user whether to connect a Git host and Cloudflare Pages. Do not run `wrangler login`, create a remote repository, upload the build, modify DNS, enable analytics, or verify Search Console within this task.

---

## Execution Checkpoints

1. **Foundation checkpoint — after Task 5:** static shell and empty searchable directory build successfully.
2. **Page-system checkpoint — after Task 12:** every route type, SEO primitive, search, and trust page works with partial content.
3. **Content checkpoint — after Task 20:** strict validation reports exactly 30 tools, four comparisons, and four guides.
4. **Release checkpoint — after Task 22:** release gate and visual/Lighthouse verification pass.
5. **External-action checkpoint — after Task 23:** wait for authorization before any deployment or DNS change.

## Primary Implementation References

- Astro project scaffolding: <https://github.com/withastro/astro/blob/main/packages/create-astro/README.md>
- Astro content collections: <https://docs.astro.build/en/guides/content-collections/>
- Astro testing: <https://docs.astro.build/en/guides/testing/>
- Astro sitemap integration: <https://docs.astro.build/en/guides/integrations-guide/sitemap/>
- Pagefind build-time indexing: <https://pagefind.app/docs/>
- Cloudflare Pages Astro deployment: <https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/>
- Cloudflare Pages build configuration: <https://developers.cloudflare.com/pages/configuration/build-configuration/>
