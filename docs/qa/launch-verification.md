# Launch verification — Task 22

## Scope and environment

- Worktree: `D:\Users\Rick\Documents\ChatGPT\AI Live Video\.worktrees\ailivevideo-mvp`
- Base SHA: `49386204fcd9e31ae6f649c86be62f91becbeff2`
- Verification date: 2026-09-05 (Asia/Shanghai; Lighthouse fetch timestamps are UTC)
- Fresh production build: `npm run build` passed twice: initial baseline and after the measured heading correction. Both runs completed Astro build and Pagefind successfully.
- Preview: fresh `npm run preview -- --host 127.0.0.1 --port 4321`, bound to `127.0.0.1:4321`; the listener command line was verified as this worktree before replacement/stopping.
- Tools: Playwright 1.57.0 / Chromium (headless); Lighthouse 12.8.2; Chrome `C:\Program Files\Google\Chrome\Application\chrome.exe`.
- DevTools-MCP limitation: the `cloudflare:web-perf` workflow's Chrome DevTools MCP trace APIs are not configured here. No DevTools trace is claimed. This verification uses the approved Lighthouse CLI + Playwright/Chromium fallback.

## Responsive, semantic, and visual evidence

Every listed URL returned HTTP 200. For each screenshot, Playwright confirmed `scrollWidth == innerWidth`, no rendered element crossed the viewport boundary, exactly one H1, no heading-level jump, standard `header/nav/main/footer` landmarks, no unnamed visible interactive controls, and no page or console error. The initial Tab target was the visible skip link with `rgb(99, 91, 255) solid 3px` outline. Screenshot capture is reproducible visual-layout evidence. This verification subagent could not use `view_image` (Windows sandbox-helper setup error) or CUA (two browser-surface initialization exits); the controller therefore used a contact-sheet/base64 fallback to directly inspect all 15 original PNGs, grouped by route at 360/768/1440. All five groups passed visual review: no horizontal clipping, overlap, truncation, anomalous empty space, or card misalignment; responsive hierarchy, article/card/source/footer layout, spacing, and link readability were clear at every width.

| Route | 360px | 768px | 1440px |
| --- | --- | --- | --- |
| `/` | PASS — [home-360](screenshots/home-360.png) | PASS — [home-768](screenshots/home-768.png) | PASS — [home-1440](screenshots/home-1440.png) |
| `/tools/` | PASS — [tools-360](screenshots/tools-360.png) | PASS — [tools-768](screenshots/tools-768.png) | PASS — [tools-1440](screenshots/tools-1440.png) |
| `/tools/heygen/` | PASS — [heygen-360](screenshots/heygen-360.png) | PASS — [heygen-768](screenshots/heygen-768.png) | PASS — [heygen-1440](screenshots/heygen-1440.png) |
| `/categories/ai-avatars/` | PASS — [category-360](screenshots/category-360.png) | PASS — [category-768](screenshots/category-768.png) | PASS — [category-1440](screenshots/category-1440.png) |
| `/guides/what-is-ai-live-video/` | PASS after rerun — [guide-360](screenshots/guide-360.png) | PASS after rerun — [guide-768](screenshots/guide-768.png) | PASS after rerun — [guide-1440](screenshots/guide-1440.png) |

## Lighthouse CLI (fresh preview)

All scores are out of 100. Raw JSON is tracked in `docs/qa/lighthouse/`; each run used only Performance, Accessibility, Best Practices, and SEO.

| Route | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS | Speed Index |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- |
| `/` | 100 | 100 | 100 | 100 | 0.8s | 0.9s | 0ms | 0 | 0.8s |
| `/tools/` | 100 | 100 | 100 | 100 | 0.8s | 0.9s | 0ms | 0 | 0.8s |
| `/tools/heygen/` | 100 | 100 | 100 | 100 | 0.8s | 0.9s | 0ms | 0 | 0.8s |
| `/categories/ai-avatars/` | 100 | 100 | 100 | 100 | 0.8s | 0.9s | 0ms | 0 | 0.8s |
| `/guides/what-is-ai-live-video/` | 100 | 100 | 100 | 100 | 0.8s | 0.9s | 0ms | 0 | 0.8s |

## Keyboard-only path

Pass. No pointer was used. The tested focus order was: homepage skip link → `#main-content` → header Tools link → homepage search → tools skip link → header Tools link → tools search filter → category select (ArrowDown changed it to `real-time-generative-video`, yielding 5 cards) → first visible tool-card “View details” link → HeyGen “Source 1” link → footer “About” link. Every control had a visible focus indicator and accessible name. Homepage search is focusable and announced `Search is available in the production preview` in this local preview; this is a preview-only Pagefind message, not an inaccessible control or focus trap.

## Measured defect and rerun

Initial guide captures at 360, 768, and 1440 found two H1 elements: the `ArticleLayout` article-title H1 followed by the guide Markdown H1 “What is AI live video?”. The body H1 in `site/src/data/guides/what-is-ai-live-video.md` was changed to H2. A fresh build/preview and all 15 checks were rerun; final results have one H1 at every route and width. No other UI/content change was made.

## Artifacts and gate

Tracked raw evidence: `docs/qa/screenshots/*.png` (15 files) and `docs/qa/lighthouse/{home,tools,heygen,category,guide}.json`. Ignored reproducibility details: `.superpowers/sdd/2026-09-04-ailivevideo-mvp/task-22-artifacts/{browser-checks.json,browser-checks-final.json,keyboard-check.json}` and `task-22-report.md`. The screenshot directory was moved from the accidental `site/docs/qa/screenshots` location to this worktree-level directory; `site/docs/qa/screenshots` no longer exists.

`npm run release:check`: PASS (exit 0). It completed content validation, Astro check (0 errors; 2 existing hints), 26 unit tests, production build + Pagefind, built-site check, and Playwright E2E. Pagefind completed successfully in this task; no intermittent host-binary failure reproduced. The task-owned preview was stopped before the gate and no listener remains afterward.