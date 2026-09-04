---
name: Decart Lucy
description: Decart Lucy transforms a live video feed with generated characters, objects, environments, styles, and effects.
officialUrl: https://decart.ai/lucy
categories: [real-time-generative-video]
oneLineVerdict: A native live-transformation system for teams that need generative changes to an existing video stream as it runs.
bestFor: Enterprises, brands, creators, and developers prototyping live video transformation and interactive media
capabilities: [Character swaps, Object edits, Background transformation, Style changes, Visual effects, Live stream transformation]
realTimeDefinition: "Native: Lucy is described as continuously transforming live video; Decart’s numerical timing claims are vendor product claims, not a public SLA."
pricingModel: Pay-as-you-go realtime API pricing; Lucy 2.1 realtime 720p is listed at 0.02 USD per active generation second.
freeAccessStatus: unknown
apiAvailable: yes
realTimeCapability: native
pros: [Continuous live transformation, Broad edit categories, Explicit live-stream use cases]
cons: [Version-specific timing claims conflict, API usage is metered, No public SLA]
alternatives: [pixverse-r1, minimax-h3-max, runway, world-labs]
officialSources: [https://decart.ai/lucy, https://decart.ai/publications/lucy-2-introducing-sota-video-generation-in-realtime, https://docs.platform.decart.ai/getting-started/pricing, https://docs.platform.decart.ai/models/realtime/lucy-2.1]
lastVerified: 2026-09-04
editorialStatus: published
featured: false
---

## Decart Lucy at a glance

Decart’s current relevant product is Lucy, not a conventional prompt-to-MP4 generator. Lucy takes an existing camera, game, or other live video stream and changes what appears in it while the stream is running. The official product page names character swaps, objects, backgrounds, styles, visual effects, and attribute changes. Its use cases include shopping, advertising, live streaming, social platforms, and gaming. That makes the core design question unusually concrete: what real feed should be transformed, and what changes are permitted while viewers are watching?

This is native real-time behavior under the site’s definition because it is continuous stream transformation. The product does not wait for a finished clip before the next interaction. Decart’s Lucy 2 publication likewise describes a continuously generated scene, guided by text prompts and reference images while video is streaming. It claims that a stream can run indefinitely and presents character, clothing, product, environment, and motion changes as live operations. Those are product capabilities worth testing against the intended feed, not shortcuts around creative review or consent.

## A careful latency reading

Lucy has more numerical timing language than many live-video products, but it requires unusually careful labeling. Decart’s current Lucy page displays “sub-40 ms latency,” “100 FPS continuous generation,” and “edits appear before the frame completes.” The same page also states “under 200 ms” with generation at 22 FPS at 512 by 768 by 3. The Lucy 2 announcement says 30 fps at 1080p with “near-zero latency.” The announcement further describes an optimized WebRTC pipeline and a goal of glass-to-glass operation within real-time bounds.

None of these pages provides a public test protocol, geography, queue condition, availability target, or contractual performance commitment. Accordingly, the sub-40 ms, under-200 ms, and near-zero phrases are recorded as **vendor product claims**, not verified model-inference, backend-processing, or end-to-end SLA figures. The 100 FPS, 22 FPS, and 30 fps values are **frame-rate claims** tied to stated product contexts, not a general promise. The conflict between figures is a reason to measure the exact route, resolution, source feed, effect, transport, and viewer geography before publishing a timing expectation.

## Live-production controls

Treat Lucy as a live graphics system with generative behavior. Define what an operator can change, which reference inputs are approved, how a sensitive or mistaken edit is stopped, and who can override the model. A retailer should establish product-placement approval and accuracy checks; a streamer needs a broadcast-delay and moderation plan; a game experiment needs a response when an effect breaks scene readability. Keep a clean unmodified feed and a conventional effects fallback ready, because a live audience should not be exposed to a systems failure while the production team debates a recovery.

Test stability as well as speed. Use a representative camera or encoded stream, scenes with people and products, abrupt movement, different lighting, a rapid prompt change, an interrupted input, and a long session. Capture source resolution, rendered resolution, processing path, visible delay, frame cadence, dropped frames, artifacts, reconnection behavior, and operator workload. Include consent and disclosure for transformed people, particularly for character swaps and apparel changes.

Platform documentation adds a public Lucy 2.1 realtime API: it connects a camera stream through WebRTC at 1280 by 720, and pricing lists 0.02 USD per active generation second. New accounts receive evaluation credits, but no durable free-plan allowance is published, so free access remains unknown. Those 720p API details do not validate the older product-page 100 FPS or Lucy 2 30 FPS claims. No geographic, queue, or service-level guarantee is published.

Choose Lucy when the work starts from a live feed that must become editable in motion. Compare PixVerse R1 for a generated, persistent interactive world; MiniMax H3 Max and Runway for discrete rendered clips; and World Labs for spatial-world creation that is generated before it is explored.

