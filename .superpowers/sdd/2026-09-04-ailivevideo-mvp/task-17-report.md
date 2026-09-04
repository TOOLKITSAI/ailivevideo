# Task 17 report

## Research

All five tools were checked on current first-party pages on 2026-09-04. Restream is browser Studio/relay infrastructure with documented Studio asset API. StreamYard is a browser studio and cloud multistream service; public API status is unknown. OBS Studio and Streamlabs Desktop are local desktop encoders, not browser studios; OBS documents an extensibility API while Streamlabs production API status is unknown. VEED still documents meeting multistreaming and automatic recording on its current meeting page, although the former dedicated live URL could not be opened; no candidate substitution was needed.

Exact sources are the URL sets in the corresponding source-ledger rows and frontmatter. Pricing/free/API are recorded only where supported: Restream free/yes; StreamYard free/unknown; OBS free/yes; Streamlabs free/unknown; VEED free/unknown. AI clips, backgrounds, recording enhancement, or automation are described as bounded production assistance, never as proof of real-time generative video.

## Content review

All profiles are published in `streaming-production-automation` and alternatives resolve within the 25-tool set: Restream [streamyard, obs-studio, streamlabs, veed-live]; StreamYard [restream, obs-studio, streamlabs, veed-live]; OBS Studio [streamlabs, restream, streamyard, veed-live]; Streamlabs [obs-studio, restream, streamyard, veed-live]; VEED Live [streamyard, restream, obs-studio, streamlabs].

## Verification

- `npm run validate:content -- --allow-partial`: PASS (`CONTENT_OK tools=25 comparisons=0 guides=0`).
- `npm run check`: PASS (0 errors; existing inline-script hint and absent comparison/guide warnings only).
- `npm run build`: PASS; generated all five requested tool routes and Pagefind completed.
- `git diff --check`: PASS.
- Body words: Restream 553; StreamYard 555; OBS Studio 550; Streamlabs Desktop 551; VEED Live 603.
