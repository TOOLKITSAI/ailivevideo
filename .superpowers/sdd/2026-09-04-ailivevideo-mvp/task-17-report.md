# Task 17 report

## Evidence and classification

Original publication: `9c2da2874fd8e6f9882c34cf9a082eb7762da143` (`content: publish streaming production profiles`). Every profile is published in `streaming-production-automation`; its frontmatter `officialSources` set exactly equals the three URLs in the corresponding ledger row. These are production infrastructure profiles, not real-time generative-video models.

### Restream

- URLs: https://restream.io/ ; https://restream.io/pricing ; https://developers.restream.io/studio/
- Browser Studio and cloud relay, not a desktop encoder or generator. The API documents browser-Studio assets including captions, brands, QR codes, tickers, fonts, and audio; pricing establishes plan-dependent multistreaming and recording.
- Constraints: plan limits apply; asset API does not prove arbitrary broadcast control. Captions are producer-managed graphics, not ASR, translation, or compliance output.
- Free/API: `free` / `yes`. Words: 559. Alternatives: `streamyard`, `obs-studio`, `streamlabs`, `veed-live`.

### StreamYard

- URLs: https://streamyard.com/ ; https://streamyard.com/pricing ; https://streamyard.com/multistreaming
- Browser guest/show studio and cloud multistream infrastructure, not a desktop encoder or generator. Sources establish browser participation, cloud distribution, direct/RTMP destinations, layouts, recording, and plan-dependent limits.
- Constraints: browser permissions and participant connectivity matter; AI clips/backgrounds are assistance, not live generation; no public production API is established.
- Free/API: `free` / `unknown`. Words: 555. Alternatives: `restream`, `obs-studio`, `streamlabs`, `veed-live`.

### OBS Studio

- URLs: https://obsproject.com/ ; https://obsproject.com/help ; https://obsproject.com/kb/obs-studio-overview
- Free local desktop encoder/mixer, not browser infrastructure, hosted multistreaming, or generation. Sources establish capture/mixing, scenes, filters, Studio Mode, Multiview, recording, streaming, and plug-in/script API.
- Constraints: local hardware, encoding, upload capacity, and rehearsal are operator responsibilities; OBS alone supplies neither browser guests nor cloud relay.
- Free/API: `free` / `yes`. Words: 550. Alternatives: `streamlabs`, `restream`, `streamyard`, `veed-live`.

### Streamlabs Desktop

- URLs: https://streamlabs.com/desktop-app ; https://streamlabs.com/pricing ; https://support.streamlabs.com/hc/en-us/articles/4401775698971-How-to-Multistream-The-Ultimate-Guide-to-Multistreaming
- Creator desktop encoder with cloud-assisted distribution, not browser-only infrastructure or a generator. Sources establish local scenes/sources, alerts/widgets, recording, guest camera, Dual Output, and plan-dependent multistreaming.
- Constraints: hardware/network remain dependencies; expanded multistreaming requires Ultra; widgets and integrations do not establish a public production API.
- Free/API: `free` / `unknown`. Words: 551. Alternatives: `obs-studio`, `restream`, `streamyard`, `veed-live`.

### VEED Live

- URLs: https://www.veed.io/ ; https://www.veed.io/pricing ; https://www.veed.io/use-cases/meetings-communication
- Browser meeting-to-live-stream and recording workflow, not a desktop encoder/full broadcast mixer or real-time generator. The current meeting page establishes multi-platform streaming, automatic recording, screen/webcam recording, presentations, annotations, and recording-oriented editing context.
- Constraints: no cited evidence for complex routing, advanced audio buses, replay, live translated audio, caption compliance, or a public live-workflow API. Free creation/editing is stated, while live-specific price/destination allowance is unclear.
- Free/API: `free` / `unknown`. Words: 596. Alternatives: `streamyard`, `restream`, `obs-studio`, `streamlabs`.

The previous dedicated VEED `/tools/live-streaming` URL could not be opened and is not used. The accessible current meeting page explicitly supports keeping VEED: it says meetings can stream live to multiple platforms and are automatically recorded. No candidate substitution or source-set expansion was needed.

## Changed files

- `docs/research/tool-source-ledger.md` (original publication; retained unchanged in review fix)
- `site/src/data/tools/restream.md` (review fix: narrowed caption wording to cited Studio API)
- `site/src/data/tools/streamyard.md` (original publication)
- `site/src/data/tools/obs-studio.md` (original publication)
- `site/src/data/tools/streamlabs.md` (original publication)
- `site/src/data/tools/veed-live.md` (review fix: removed uncited recorder-page/AI-tool claims)
- `.superpowers/sdd/2026-09-04-ailivevideo-mvp/task-17-report.md`

## Verification

- `npm run validate:content -- --allow-partial`: PASS (`CONTENT_OK tools=25 comparisons=0 guides=0`).`r`n- `npm run check`: PASS (0 errors; only existing inline-script hint and expected empty-collection warnings).`r`n- `npm run build`: PASS; all five new tool routes generated and Pagefind completed.`r`n- `git diff --check`: PASS.`r`n- Body-word counts: Restream 559; StreamYard 555; OBS Studio 550; Streamlabs Desktop 551; VEED Live 596.`r`n- Exact frontmatter-to-ledger source-set comparison: PASS for all five profiles.