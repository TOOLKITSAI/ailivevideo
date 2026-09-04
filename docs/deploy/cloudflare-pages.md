# Cloudflare Pages deployment handoff

## Status and boundary

This is a local preparation handoff, verified on 2026-09-05. It does not assert that a Cloudflare account, Pages project, Git repository, DNS zone, custom domain, redirect, Web Analytics property, or Search Console property already exists. This task did not log in, create or connect a project or repository, upload a build, alter DNS, add a domain or redirect rule, enable analytics, verify Search Console, or submit a sitemap.

Keep this file with the deployment-ready commit and the local ZIP. The release record, commit identifier, archive checksum, and build results are recorded in the ignored task report for the operator who receives this handoff.

## What is already prepared locally

- The static Astro build publishes `site/public/_headers` into `site/dist/_headers`.
- The approved baseline has four headers only: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and `X-Frame-Options`. It intentionally has no Content-Security-Policy or HSTS until Pagefind, future analytics, and production HTTPS/custom-domain behaviour are tested together.
- `site/.nvmrc` specifies Node 22. Current Cloudflare Pages documentation also supports `NODE_VERSION=22` in the project build environment; set that value explicitly in the dashboard as a visible deployment setting.

## Preflight before any external action

1. Confirm the checkout is the deployment-ready commit recorded in the task report, and that `git status --short -- site docs` prints no tracked changes.
2. Confirm `site/ailivevideo-release.zip` exists locally, its recorded SHA-256 and byte size match, and it remains untracked. This ZIP is a recovery artifact, not an upload instruction.
3. From `site/`, run `npm run release:check` and require exit code 0. Confirm `dist/_headers` matches `public/_headers` byte-for-byte.
4. Inspect configuration and repository settings for secrets. This static site should not require a secret for the documented build. Do not place credentials in the repository, ZIP, build logs, or browser source.
5. Confirm `main` contains the intended commit before authorizing a Git-connected production deployment.

## External deployment steps — authorization required

These steps require a user with the relevant Cloudflare and Git permissions. Follow them only after separate authorization.

1. Create or select the Git repository and push the reviewed `main` branch. Cloudflare requires a pushed branch before it can be selected as the production branch.
2. In Cloudflare, open **Workers & Pages**, create a **Pages** project, select the repository, then set the following values in the build setup.

   | Setting | Value |
   | --- | --- |
   | Production branch | `main` |
   | Root directory | `site` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Node version | `22` — set `NODE_VERSION` to `22`; the committed `site/.nvmrc` also specifies `22` |

3. Save and deploy. Review the first build log before treating it as production: it must finish successfully and build the static `dist` directory.

## Custom domain and canonical hostname — authorization required

1. In the Pages project, open **Custom domains**, choose **Set up a domain**, and add `ailivevideo.net`.
2. `ailivevideo.net` is an apex domain. Cloudflare’s Pages guidance requires it to be a zone in the same Cloudflare account and requires its nameservers to point to Cloudflare; Cloudflare then creates the needed CNAME. Do not manually add a Pages CNAME before completing the Pages custom-domain flow, because Cloudflare documents that this can fail to resolve.
3. Before changing nameservers, record the current registrar/DNS configuration and make a rollback contact and change window. Check existing CAA records: restrictive CAA settings can prevent certificate issuance.
4. After the apex domain is active, configure the canonical hostname redirect in **Rules** → **Redirect Rules** → **Create rule** → **Single Redirect**. Use the current hostname-redirect workflow, not a Pages `_redirects` file: Pages `_redirects` does not support domain-level redirects.

   | Redirect setting | Value |
   | --- | --- |
   | Incoming request | Wildcard pattern `http*://www.ailivevideo.net/*` |
   | Target URL | `https://ailivevideo.net/${2}` |
   | Status code | `301` |
   | Preserve query string | Enabled |

   In this Cloudflare wildcard pattern, the second capture is the path, so the destination implements `www.ailivevideo.net` → `https://ailivevideo.net/$1` in the requested business notation while preserving both path and query string. Test it with a path and query before announcing launch.

## Post-deploy acceptance checks

Perform these checks from a clean browser session after DNS and certificate activation complete.

1. `https://ailivevideo.net/` loads over HTTPS; page canonical URLs use the apex and trailing slashes.
2. `https://www.ailivevideo.net/tools/heygen/?ref=handoff` returns a 301 and reaches `https://ailivevideo.net/tools/heygen/?ref=handoff`, preserving the path and query.
3. Check `/robots.txt` and `/sitemap-index.xml` on the apex. Confirm the robots sitemap reference points to the apex.
4. Search Pagefind for **HeyGen** and confirm an expected result appears.
5. Open all six category routes: `/categories/ai-avatars/`, `/categories/real-time-generative-video/`, `/categories/ai-video-agents/`, `/categories/live-translation-dubbing/`, `/categories/streaming-production-automation/`, and `/categories/ai-live-shopping/`.
6. Open one tool (`/tools/heygen/`), one comparison (`/compare/heygen-vs-synthesia/`), and one guide (`/guides/what-is-ai-live-video/`). Verify the browser has no page or console errors.
7. Inspect a normal HTML response and confirm the four planned headers are present. Confirm no unreviewed CSP or HSTS was introduced.

## Recovery notes

If the first Pages deployment fails, stop and preserve the build log, current commit, and prior DNS state; correct the local build/configuration and redeploy only after review. If a DNS or custom-domain change is unhealthy, use the recorded DNS configuration to restore the prior verified service. Cloudflare warns that changing a Pages DNS entry away and back can leave the custom domain inactive until it reactivates; prefer a reviewed redirect/origin-rule plan for a temporary traffic diversion rather than casually changing DNS. Do not delete a Pages project while its custom-domain DNS record is active.

## Only after separate authorization: measurement and search

### Cloudflare Web Analytics

Enable Web Analytics through the Pages project only after authorization, then verify that the collection method does not require a change to the approved header baseline. Record the activation date and the first valid traffic baseline in the scorecard.

### Google Search Console

After the apex is serving, add and verify the URL-prefix property `https://ailivevideo.net` in Google Search Console using a method available to the authorized owner. Then use the Sitemaps report to submit `https://ailivevideo.net/sitemap-index.xml`. Sitemap submission is a discovery hint, not a guarantee of crawling or indexing. Record the launch baseline in [the 90-day scorecard](../analytics/90-day-scorecard.md).

## Current official sources

Verified 2026-09-05 against first-party documentation:

- Cloudflare Pages: [Build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/), [Build image and Node selection](https://developers.cloudflare.com/pages/configuration/build-image/), [Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/), [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/), and [custom HTTP headers](https://developers.cloudflare.com/pages/how-to/add-custom-http-headers/).
- Cloudflare Rules: [redirect requests to a different hostname](https://developers.cloudflare.com/rules/url-forwarding/examples/redirect-all-different-hostname/). The Pages [redirects documentation](https://developers.cloudflare.com/pages/configuration/redirects/) explicitly records that `_redirects` does not support domain-level redirects.
- Google Search Central: [How to use Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start) and [build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).