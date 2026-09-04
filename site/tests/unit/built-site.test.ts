import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { inspectBuiltSite } from '../../scripts/check-built-site.mjs';

const roots: string[] = [];

async function fixture(files: Record<string, string>) {
  const root = await mkdtemp(join(tmpdir(), 'ailivevideo-built-site-'));
  roots.push(root);
  for (const [file, contents] of Object.entries(files)) {
    const target = join(root, file);
    await mkdir(join(target, '..'), { recursive: true });
    await writeFile(target, contents, 'utf8');
  }
  return root;
}

function page({ canonical = 'https://ailivevideo.net/', description = 'A complete fixture page.', body = '' } = {}) {
  return `<!doctype html><html><head>
    <link rel="canonical" href="${canonical}">
    <meta name="description" content="${description}">
  </head><body>${body}</body></html>`;
}

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

it('reports a broken root-relative link from a built page', async () => {
  const root = await fixture({
    'index.html': page({ body: '<a href="/missing/">Missing route</a>' }),
  });

  await expect(inspectBuiltSite(root, { enforceReleaseCounts: false }))
    .resolves.toContain('index.html: broken internal link /missing/');
});

it('returns metadata, duplicate canonical, and placeholder violations together', async () => {
  const root = await fixture({
    'index.html': '<!doctype html><html><head></head><body>TODO</body></html>',
    'duplicate/index.html': page(),
    'duplicate-two/index.html': page(),
  });

  await expect(inspectBuiltSite(root, { enforceReleaseCounts: false })).resolves.toEqual([
    'index.html: missing canonical',
    'index.html: missing meta description',
    'index.html: unfinished placeholder TODO',
    'duplicate-two/index.html: duplicate canonical https://ailivevideo.net/',
  ]);
});
it('accepts an existing root-relative HTML route after query and hash removal', async () => {
  const root = await fixture({
    'index.html': page({ body: '<a href="/tools/example/?source=nav#details">Example</a>' }),
    'tools/example/index.html': page({ canonical: 'https://ailivevideo.net/tools/example/' }),
  });

  await expect(inspectBuiltSite(root, { enforceReleaseCounts: false })).resolves.toEqual([]);
});
it('reports a root link when the built root index is absent', async () => {
  const root = await fixture({
    'tools/only/index.html': page({ canonical: 'https://ailivevideo.net/tools/only/', body: '<a href="/">Home</a>' }),
  });

  await expect(inspectBuiltSite(root, { enforceReleaseCounts: false }))
    .resolves.toContain('tools/only/index.html: broken internal link /');
});

it('reports placeholders found in complete HTML, including attributes and comments', async () => {
  const root = await fixture({
    'index.html': page({ body: '<!-- [citation: pending] --><div data-note="TODO">Ready</div><a href="/ok/" title="lorem ipsum">OK</a>' }),
    'ok/index.html': page({ canonical: 'https://ailivevideo.net/ok/' }),
  });

  const errors = await inspectBuiltSite(root, { enforceReleaseCounts: false });
  expect(errors).toContain('index.html: unfinished placeholder [citation: pending]');
  expect(errors).toContain('index.html: unfinished placeholder TODO');
  expect(errors).toContain('index.html: unfinished placeholder lorem ipsum');
});