# Journal — www.ziggo.nl replica

## extract (replica Phase 1)

- 2026-11-25: crawl.mjs over the 33 planned pages (`--pages`, `--dynamics`, concurrency 3): 33/33 live, 0 failed, no bot wall; real Chrome headless. No capture gaps (no locale roots).
- Vision check (thumbnails): 33 rendered; artefact on every page = third-party chat pre-form `aside.dimelo-form` open over the right edge (gate captures dismiss it on both sides). Lazy carousels empty on netflix/disneyplus; blurred lazy images on televisie/ziggo-sport.
- Style census 1440+360 over all 33 (two passes: first run hit run-bg's 900 s deadline after 23 pages; the remaining 11 in `_computed-styles-2.json`).
- Fonts self-hosted from the source @font-face: Ziggo Headline 400/700, Vodafone Ziggo text 300/400/700 (+italics), ziggo-ui-icon-v22 (all proprietary). Logo from scene7 SVG.
- Page types: landing 6 · program 4 · article 13 · channel 7 · streaming 2 · listing 1 (channel/streaming added to the catalog for this site).
- First-page-first two-track opening not used: the full-prep extract finished before a Track A could start, so the run goes sequentially with home as the first archetype.
- Descriptive spec written (current/PRODUCT.md, DESIGN.md, DESIGN.json, _brand-extraction.json, brand-review.html); 20 module candidates; typed slots on every page record.
- Header contract: chrome-explore (1440 + 390) → stardust/chrome/header-contract.json; 12/14 states, still TRUNCATED at a 2500-request budget (image-heavy home) — recorded as is.
- cap-probe over the 6 archetype URLs → DESIGN.json extensions.breakpoints: contentMaxWidth 1600 (module/shell), shell fluid on 5 of 6 archetypes (alles-in-1 and zenderoverzicht cap the shell at 1600).

## preserve-direction (replica Phase 2)

- Full-prep branch: current/PRODUCT.md, DESIGN.md, DESIGN.json promoted verbatim to the root. direction.md written (preserve mode). Register empty — pure replica (hands-off adopts no audit finding). No --target-breakpoints.
- Dynamics: detect over 6 archetype URLs (69 findings) + header contract rows → curated stardust/dynamic-features.md (20 rows, every row dispositioned) and dynamic-features-plan.md. Interim assumptions A1–A7 recorded (order flow/availability API, prices, help search, tags/consent/chat, account links, locale).
- Archetypes: landing=index, program=alles-in-1, article=televisie-voicecontrol, channel=televisie-zenders-npo-1, streaming=televisie-extra-zenders-streamingdiensten-netflix, listing=televisie-zenderoverzicht.

## recreate: index

- Archetype landing=index → stardust/prototypes/index-proposed.html; shared canon split: assets/canon.css (tokens, @font-face, type ramp, buttons, header+droplets/drawer, toptask tiles, card-v2 USP cards, card carousel, plan cards + USP list, media carousel, article carousel, footer, motion) + assets/canon.js; page modules in assets/index.css (hero, why, plans, One splash, ent-head, swimming lane, Priority band). 99 media files harvested to assets/media (source basenames).
- Specs: source-spec capture 1440/360 (--main "#main-content" --dismiss ".dimelo-form"); compare cleared to 0 section height deltas, ≤2px offset (remaining node lines = marquee phase, sr-only, image clip classification).
- Gate flags (both sides): --main "#main-content" --consent "#onetrust-accept-btn-handler" --dismiss ".dimelo-form". Frozen references mask the marquee rows (1440 3852:396, 360 5292:356).
- 1440: 3 rounds → pixel 9.84% aligned PASS, Δh 2, offsets 4px, Clipped 0, units PASS; content-diff reds (header role swaps) fixed after cap and verified standalone 0 red / 0 nothing-lost → rounds decide accept-residual.
- 360: 3 rounds → pixel 2.53% PASS, Δh 0, content-diff 0/0, Clipped 0; units/chrome fixes verified standalone → accept-residual.
- gate-all prototype --only index: PASS at 1440 (9.82%) and 360 (2.53%).
- Residuals: Priority background video (blob/MSE stream, poster stands in) 66.9% band @1440 / 26.1% @360; winacties photo sub-pixel band 17% @1440; cap-probe 2560 module-5 classification (widths equal); logo signature (.svg extension).
- Motion: observed/implemented droplet enter/leave + backdrop, scroll-up fixed navbar, hover scales, marquee + pause toggle; post-motion pixel returned to gated value (10.04/2.77 unaligned).
- State: index → approved (hands-off). Note: impeccable hook ignores added in .impeccable/config.json (icon font, tile gradient icon — both source-faithful).

## recreate: alles-in-1

- Archetype program=alles-in-1 → stardust/prototypes/alles-in-1-proposed.html (generated from captured strings by stardust/.work/aio/gen.mjs; header/footer reused verbatim from index); imports canon.css/canon.js unchanged, page modules in assets/alles-in-1.css + alles-in-1.js (hero band, sticky page sections, category pills, availability card, Vodafone benefits, product cards + ribbons, product-campaign bands, ESPN note, contract-promo cards, hardware/switch cards, FAQ, desktop basket, mobile order bar, terms, contact band, interactions tabs). ~55 media harvested from the page's own responses.
- Specs: source-spec 1440/360; compare cleared to 0 section deltas, ≤5px total offset (residual node lines = radio/image clip classification, input placeholder pairing, mobile fixed bar not paired).
- Gate flags as index. 1440: 3 rounds → pixel 0.32% aligned, Δh -2, content-diff 0/0, Clipped 0; iter3 unit pairing fixed after cap → accept-residual. 360: 3 rounds → 1.99% aligned but 16 ±1px sub-pixel steps; phase fixes after cap → accept-residual.
- gate-all prototype --only alles-in-1: PASS 1440 (0.32%, 5px, Δh -3) and 360 (0.83%, 8px, Δh 0); units (product-cards, contract-promo-cards) ok. cap-probe 2560 PASS (after stretching card content + pad/2 gutters).
- Capture state: configurator selection/basket frozen as captured (host-bound); desktop campaign band image 404s on live → same missing ref keeps the gradient fallback; A/B-hidden ESPN block kept hidden.
- Motion: observed/implemented accordion slide .3s, card selection outline/pulse/shine + radio pop, hover colours, interactions slide-out; header via canon. canon.css not changed (index not re-gated).
- State: alles-in-1 → approved (hands-off).

## recreate: televisie-voicecontrol

- Archetype article=televisie-voicecontrol → stardust/prototypes/televisie-voicecontrol-proposed.html (generated from captured strings by stardust/.work/vc/gen.mjs; header/footer reused verbatim from index); imports canon.css/canon.js unchanged + new shared layer assets/modules.css/modules.js (accordion + interactions, moved out of alles-in-1.css/js; alles-in-1 links them), page modules in assets/televisie-voicecontrol.css/.js (60vh photo hero, sticky subnav + mobile toggle, breadcrumb-v2, media/text rows on a --pad/2 grid, stretched grouping columns, mediabox cards, FAQ). 10 media files harvested from the page's scene7 renditions.
- Specs: source-spec 1440/360; compare 0 section deltas, offset 1px/0px; 2 residual node lines = image radius not seen by the instrument on live (clip ancestor 5 levels up; measure.mjs confirms 24px clip).
- Gate flags as index. 1440: iter1 1.52% (nothing-lost: breadcrumb aria-labels) → iter2 PASS 1.89% → iter3 post-motion red (desktop-hidden toggle glyph) fixed after cap, standalone content-diff 0/0 → accept-residual. 360: reference force-frozen (Roboto dead-face variance from a third-party widget, noise 0.64%); 3 rounds pixel 1.39% aligned, Δh 0, content 0/0; only the canon logo signature → accept-residual.
- gate-all prototype --only televisie-voicecontrol,alles-in-1: PASS 1440 (1.51%, Δh -1) and 360 (1.39%, Δh 0); alles-in-1 unchanged (0.32% / 0.83%) after the modules split. cap-probe 2560 PASS 0/11.
- Capture state: chat tab "Niet beschikbaar" (offline orb) as captured; GIF demos frame-variant on both sides.
- Motion: observed/implemented accordion slide .3s + active title colour, sticky subnav fixed-top + scrollspy underline, interactions slide-out, hover colours; header via canon (scroll-morph threshold advisory, as alles-in-1).
- State: televisie-voicecontrol → approved (hands-off).

## recreate: televisie-zenders-npo-1

- Archetype channel=televisie-zenders-npo-1 → stardust/prototypes/televisie-zenders-npo-1-proposed.html (generated from captured strings by stardust/.work/npo1/gen.mjs; header/footer reused verbatim from index); imports canon.css/canon.js + modules.css/modules.js unchanged, page modules in assets/televisie-zenders-npo-1.css only (20vh ziggo-gradient hero, 8/4 text + channel info block — column-reverse on mobile, light social-share band, single-item interactions). Channel logo harvested as assets/media/001_nederland_1-1.svg.
- Specs: source-spec 1440/360; compare 0 section deltas, offset 1px (footer +1) / 0px, 0 node lines.
- Gate flags as index. 1440: iter1 --full PASS 0.31% aligned, Δh -1, content-diff 0/0, Clipped 0, chrome quiet; iter2 (post-motion --full) confirmation identical. 360: iter1/iter2 pixel 0.54% aligned, Δh 0, content-diff 0/0, Clipped 0; only the canon logo signature (chrome-parity) → rounds decide accept-residual after 2 rounds.
- visual-diff IMAGERY GAP 6 vs 2 = four 0×0 analytics beacons on live (justified). Live icon-ziggo-go/tv-zender/replay-tv have no glyph rule on the source → empty spans, replicated as captured.
- gate-all prototype --only televisie-zenders-npo-1: PASS 1440 (0.31%, 1px, Δh -1) and 360 (0.54%, 2px, Δh 0). cap-probe 2560 PASS 0/5.
- Motion: observed/implemented primary-button + interactions hover colours, interactions slide-out .3s (:hover, as article); share/link hovers dead on live; header static on this page.
- Shared layers unchanged (no re-gate of earlier archetypes needed). State: televisie-zenders-npo-1 → approved (hands-off).

## recreate: televisie-extra-zenders-streamingdiensten-netflix

- Archetype streaming=televisie-extra-zenders-streamingdiensten-netflix → stardust/prototypes/televisie-extra-zenders-streamingdiensten-netflix-proposed.html (generated from captured strings by stardust/.work/netflix/gen.mjs; header/footer reused verbatim from index); imports canon.css/canon.js + modules.css/modules.js unchanged and reuses televisie-voicecontrol.css/.js as-is (grid, 60vh hero, breadcrumb, sticky subnav, FAQ); page modules in assets/televisie-extra-zenders-streamingdiensten-netflix.css only (check-list hero, icon features, video band, how-to cards, tier cards, TV-app cards, contact cards). 18 media files harvested from the page's scene7 renditions.
- Specs: source-spec 1440/360; compare 0 section deltas, offset 1px/4px; 6 residual node lines = image radius on a live clip ancestor 5–7 levels up (measure.mjs: 24px on the grouping boxes).
- Gate flags as index. 1440: iter1 0.15% (content reds = live chat now "Start een chat", missing link titles + Interacties nav label) → titles/label fixed, chat busy state accepted as captured (accepted.json owner entries) → iter2 --full PASS 0.15%, Δh -1, 0/0 → iter3 confirm. 360: iter1/iter2 0.76% aligned, Δh 0, content 0/0, only the canon logo signature → iter3 pass → accept-residual.
- Units declared (streaming-tier-cards, streaming-app-cards): tier price span fixed after iter3; gate-all prototype --only: PASS 1440 (0.15%, 1px, Δh -1, units off 0) and 360 (0.76%, 4px, Δh 0, units off 0). cap-probe 2560 PASS 0/12.
- Capture state: chat button busy ("We zijn momenteel in gesprek…") as extracted/frozen; video band = the scene7 VideoViewer iframe embedded as on live; live has no interactions side tab on this page (empty Interacties nav kept).
- Motion: observed/implemented accordion slide .3s, sticky subnav fixed-top + scrollspy, header scroll-morph, button/crumb hovers; subnav/accordion hovers dead on live.
- Shared layers unchanged (no re-gate of earlier archetypes needed). State: televisie-extra-zenders-streamingdiensten-netflix → approved (hands-off).

## recreate: televisie-zenderoverzicht

- Archetype listing=televisie-zenderoverzicht → stardust/prototypes/televisie-zenderoverzicht-proposed.html (generated by stardust/.work/zenderoverzicht/gen.mjs; 172 channel rows extracted from the settled DOM to channels.json; header/footer reused verbatim from index); imports canon.css/canon.js + modules.css/modules.js unchanged, page modules in assets/televisie-zenderoverzicht.css/.js only (gradient hero, category-links pill grid, info notification, search bar, action bar — fixed bottom bar on mobile, filter/sort panels closed at rest, channel rows, FAQ). 167 channel logos + 4 option icons harvested to assets/media/zenders/ (source basenames).
- Specs: source-spec 1440/360; compare 0 section deltas, offset 1px (footer +1) / 0px, 0 node lines (fixes off the compare: "Abonnementsdienst" p margin-bottom 1rem on 13 rows, acc-group margin 16, action-bar <a> without button padding).
- Gate flags as index. 1440: iter1 --full pixel 0.03% but 🟡 nothing-lost (filter/sort panel strings) → panels authored → iter2 --full PASS 0.03%, Δh -1, content 0/0, Clipped 0 → iter3 post-motion confirmation identical, units channel-rows 172 off 0. 360: 3 rounds pixel 0.03% aligned, Δh 0, content 0/0, Clipped 0; only the canon logo signature (chrome-parity) → rounds decide accept-residual.
- cap-probe 2560 PASS 0/4. gate-all prototype --only: PASS 1440 (0.03%, 1px, Δh -1) and 360 (0.03%, 2px, Δh 0). Prototype table over all six archetypes: 6/6 PASS at 1440 and at 360 (earlier archetypes unchanged).
- Capture state: all 172 channels as hydrated, panels closed, notification open; search/filter/sort are client-only over the authored list (dynamic-features row 7); row buttons keep their aria-labels (channel detail modal content was not captured).
- Motion: observed/implemented filter/sort panel .3s height slide, accordion slide + 0s chevron flip, header scroll-morph via canon, hovers (row, category link, action item, search button); action-bar active class has no style on live (dead).
- Shared layers unchanged. State: televisie-zenderoverzicht → approved (hands-off).

## Migrate plan — archetypes placed, variance probed, render units planned (2026-11-25)

- migrate.mjs render of the 6 approved archetypes (branch A, fidelityTier archetype, --canon-css stardust/prototypes/assets/canon.css) → stardust/migrated/; modules[] recorded per archetype (hero-band, faq-accordion, interactions, + template modules). Broken internal links = pages not yet migrated.
- sibling-variance (1440, gate flags as recreate) → stardust/migrate/variance/<template>.json: landing exit 2 (hub pages compose differently — SECTIONS/hero/card), program 2 (hero/faq), article 2 (hero clusters/breadcrumb), channel 0 (clone as-is), streaming 2 (hero/faq). Deltas become block variants on sibling content at render, never per-page forks.
- stardust/migrate/progress.json: plan done; render units pending (run after each template's C-archetype unit): landing 5, program 3, article-1 6, article-2 6, channel 6, streaming 1; listing has no siblings.

## A-inventory — coverage built for 33 pages, 6 templates (2026-11-25)

- `inventory.mjs --state` (archetypes-only): 6 pending archetypes + 27 content-pending siblings. State siblings had no `representative`, so the first pass grouped archetypes under their own slugs and siblings under their type (11 templates); `representative` (= the type's approved archetype slug, the id migrate's sibling render also writes as `template`) added to the 27 siblings, re-run → 6 templates: index 6, alles-in-1 4, televisie-voicecontrol 13, televisie-zenders-npo-1 7, netflix 2, zenderoverzicht 1.
- rollout.json DA coordinates: aemcoder/50ca44c6 ref main, liveHost main--50ca44c6--aemcoder.aem.live. DA auth via `--token-file "$ADOBE_IMS_TOKEN_FILE"` (list 200).

## B-block — 23 distinct blocks, one conversion point each (2026-11-25)

- `blocks.mjs`: 23 module blocks, 217 instances; most reused hero-band ×33, interactions ×27, faq-accordion ×20. `plan.mjs`: representative-first order voicecontrol → npo-1 → index → alles-in-1 → netflix → zenderoverzicht; each block converts on exactly one archetype, siblings reuse.

## B2-dynamic — dynamic surface re-verified, no new rows (2026-11-25)

- Fresh detect on the 6 archetypes: 67 findings, all mapped onto the 20 curated rows (new ad hosts fold into row 15); 5/5 first-party APIs host-bound on the target as assumed (A1/A4 interim). Listings contract: none.

## C-deliver: foundation — styles, fonts, header, footer live; frozen (2026-11-25)

- C0 subagent: runtime contract, styles/fonts (VodafoneZiggo Text, ZiggoHeadline, icon font — proprietary, licensing alert in fonts/LICENSING.md + conversion log), favicon, header/footer blocks, /nav + /footer (Robots noindex), /index shell with its 9 modules + `one-band`; published; lint clean.
- Main foundation gate on the preview origin (pub1): header crop 99.51 % / 98.15 %, footer crop 99.10 % / 98.57 % (1440/360), chrome parity quiet but 1 icon-filename signature at 360 (accepted residual). Index body 1440 14.49 % aligned (FAIL → archetype-landing unit), 360 2.93 % PASS.
- Capture flag for published gates: `--main main` (live `main#main-content`, EDS `main`); `#main-content` zeroes the build side.
- Open: `one-band` block has no blocks.json row; search overlay (row 7) not built; priority video poster-only.

## C-deliver: archetype-article — voicecontrol live, 0.94 % / 0.57 % (2026-11-25)

- 6 new blocks (sticky-subnav, breadcrumb, media-text, mediabox-cards, faq-accordion, interactions = contact tabs) + hero-band `.hero-band.article` variant section. gate-all row PASS at 1440/360; 3 rounds; 4 accepted residuals (source buttons hold duplicate mobile/desktop labels). davids-model-lint 1 🔴 on the source's literal "<TV zender>" placeholder text, kept verbatim.

## C-deliver: archetype-landing — index 9.81 % / 2.73 % (2026-11-25)

- Fix rounds on hero-band/one-band background fill, 360 line heights (Δh 12 → 0), content-diff 🔴 494 → 107 (rest = frozen header glyph classes → foundation-requests.md). units.json gained EDS class names. gate-all row PASS both widths; residuals: priority video vs poster, auto-scrolling lane logos, 1 broken live logo. `one-band` still has no blocks.json row.

## C-deliver: archetype-channel — npo-1 live, 0.34 % / 0.61 % (2026-11-25)

- New blocks channel-info-card + social-share (content-driven, sibling-ready), `.hero-band.channel` variant appended. gate-all row PASS both widths; rounds 2/1; 4 accepted residuals (chrome icon class = existing foundation request, sr-only share labels, live chat status, scripts.js title attr). whatsapp:// share link kept verbatim (lint exception logged).

## C-deliver: archetype-program — alles-in-1 live, 0.44 % / 1.14 % (2026-11-25)

- New blocks bundle-builder (row-kind keyed configurator + basket + mobile order bar), address-checker, contact-band; variants hero-band.program, faq-accordion.program, interactions.online (additive). gate-all row PASS both widths; rounds 3/2. Foundation request: 105 px under footer for the fixed order bar (scoped override in bundle-builder.css meanwhile). interactions block-roundtrip 2 🔴 (missing CTA) pre-existing on voicecontrol too — for C-final.
- Render units article-1, article-2, channel, landing done (all siblings forked, content docs authored, media staged under .work/migrate/<unit>/assets).

## C-deliver: archetype-streaming — netflix live, 0.15 % / 0.77 % (2026-11-25)

- New blocks streaming-tier-table, streaming-service-cards(.steps), streaming-features(.contact), video-band, streaming-hero; additive variants breadcrumb.light, sticky-subnav.start, faq-accordion.streaming. gate-all row PASS both widths; presence.json marks the live chat label session-variable. 5 accepted residuals. Render unit program done (3 siblings).

## C-deliver: cluster-channel — 6/6 channel siblings live, gate-all 6/6 PASS both widths (2026-11-25)

- Logos uploaded; sbs6 intro-lead section style (Δh 51 → 0 at 360), rtl-5 call tab authored. Render unit streaming done (disneyplus doc needs video-band eyebrow/h2 support before deploy).
- Remaining units: archetype-listing (zenderoverzicht), cluster-article (12), cluster-landing (5), cluster-program (3), cluster-streaming (1), gate-all, final. Block needs per cluster: stardust/.work/rollout/cluster-*/render-report.md (article: render-article-1-report.md).

## C-deliver: archetype-listing — zenderoverzicht live, 0.13 % / 0.24 % (2026-11-25)

- New block channel-overview (172 authored rows; client search/filter/sort per dynamics row 7); listing variants on hero-band + faq-accordion; 171 logos uploaded (13 raster/oversize SVGs → 288 px PNG). gate-all row PASS both widths, rounds 2.

## C-deliver: cluster-streaming — disneyplus live, gate-all 2/2 PASS both widths (2026-11-25)

- Per-page gates at the round cap recorded accept-residual (1440 4.21 %, 360 3.27 % → 2.38 % in gate-all after the 360 icon/tier-tabs fix 7ae2f83); residual Δh 42–44 px logged.
- Foundation request: header logo signature + build-only link titles (all templates).

## C-deliver: cluster-program — 3/3 package pages live, gate-all 3/3 PASS both widths (2026-11-25)

- Variants on bundle-builder, address-checker, faq-accordion, hero-band (article.compact); worst kabel-tv 0.88 % / 1.34 %; page content clean (0 lost, 0 clipped); residuals are the frozen-chrome request already filed.

## C-deliver: cluster-landing — 5/5 live; 360 fidelity open on 3 pages (2026-11-25)

- 17 blocks gained variants; gate-all 5/5 PASS at 1440, 2/5 at 360 (televisie 8.88 %, internet pass). Open at 360: extra-zenders 11.58 % (sr price words visible), ziggo-sport 10.98 %, espn 17.8 % (mobile hero crop / carousel layout). Unit stays running with a resume note.

## C-deliver: cluster-article batch 1 — 6/6 live; fidelity open (2026-11-25)

- 6 TV feature pages published; gate-all 4/6 PASS at 1440, 1/6 at 360. Open: mobile spacing of media-text duo / mediabox-cards / hero; kijkprofielen and online-tv-kijken heights at 1440. Batch 2 (6 pages) pending. Foundation request: :check: icon glyph.

## C-deliver: cluster-landing — done, gate-all 5/5 PASS at 1440 and 360 (2026-11-26)

- 360 fix pass on espn (3.68 %), ziggo-sport (6.82 %), extra-zenders (4.80 %): sr-only price words hidden, mobile hero/carousel/gradient/FAQ layouts; ziggo-sport F1 picture re-uploaded, extra-zenders ribbon emphasis; both docs republished. 1440 unchanged or better. Residuals: per-breakpoint card art, plan-card equal heights.

## C-deliver: cluster-article batch 2 — 6/6 live; 360 fidelity open (2026-11-26)

- 4k-uhd, digitale-kabel-tv-en-radio, digitale-radio, mediaboxen, ziggo-go, tv-apps published; new table block (apps). 1440 rounds closed accept-residual (worst ziggo-go 10.00 % Δh −191); 360 one round (worst ziggo-go 27.5 %), fixes deployed ungated. Next: 360 pub2, gate-all over all 12 article pages, batch-1 360 fix pass.

## C-deliver: cluster-article — done, gate-all 1440 11/13 and 360 9/13 PASS, 4 residuals decided (2026-11-26)

- 360 r2 off the pub2 / gate-all lines (e925c1d, 17a07e2; terugkijken/ziggo-go/tv-apps republished with hero-band `fit`): icon rows, intro note, lone-lead intros, half-rule crop and steps cards below 768 took hoofdmenu 13.15→7.93 %, terugkijken 12.45→7.25 %, tv-apps 10.84→7.82 %, digitale-radio 9.53→5.19 %, ziggo-go 22.7→15.61 %, online-tv-kijken 16.31→11.6 %; accept-residual on ziggo-go, online-tv-kijken, kijkprofielen, makkelijk-zoeken (360) and kijkprofielen, online-tv-kijken (1440); frozen header/footer icon reds filed as a foundation request.

## C-deliver: gate-all — 33/33 PASS at 1440 and 360 on the published origin (2026-11-26)

- Fixes off source-spec compare lines (c1b8071, 3d30e8f, 8171611, bf4af61, 02681c9, f4f1e59; kijkprofielen, online-tv-kijken, ziggo-go, makkelijk-zoeken republished): kijkprofielen 14.05→0.86 % @1440 / 11.84→2.21 % @360, online-tv-kijken 11.53→2.8 / 11.6→5.53, ziggo-go 9.83→5.86 / 15.61→4.56 (mobile CTA label "Over Ziggo GO" carried as authored content with the source's orientation show/hide; hero-band no longer turns a copy paragraph with an inline link into a CTA), makkelijk-zoeken 360 10.67→8.49; full roster 1440 33/33 (worst index 9.81 %), 360 33/33 (worst internet 8.93 %), no article page regressed; coverage updated from both summaries (33 gate rows pass).

## C-deliver: final — foundation queue applied, 33/33 PASS at 1440 and 360 (2026-11-26)

- Foundation requests applied once at C-final (552be9b): header/footer icon spans gain `icon-<name>`, seven landing glyphs join the styles.css glyph map; program footer padding and media-text check icon stay scoped block overrides; the header logo/link-title note is nav-document content and was left. Re-frozen. Archetypes re-gated on the published origin 6/6 at both widths; full roster 33/33 PASS at 1440 (worst index 9.81 %) and 360; coverage updated from both summaries. Wide 2560 report: 27/33, four pages over 10 % (streaming overview 19.43 %, index 17.1 %, internet 14.62 %, espn 14.8 %) — reported, not a delivery criterion.

## D-site: assembly — sitemap served 33 = assembled 33, / 200 (2026-11-26)

- Source root serves a page, so `/` is the delivered `index` document (200 on aem.live); no `/` row needed. No source redirects among the 33 planned pages (extract 33/33 live, no `stardust/redirects.tsv`), so no redirects sheet rows to wire. `/nav` and `/footer` published with `Robots: noindex`; `assemble.mjs --verify-origin` exit 0.

## D2-dynamic: parity — 10/10 replayed checks PASS on aem.live (2026-11-26)

- `stardust/dynamics/parity.json`: 20 features, 10 checks (header menus, drawer, accordions, no page errors on 33 pages, scene7 showreel playback 30 requests, channel overview 422 rows, address checker form, listings, bundle builder, images) all PASS; 10 rows interim / decided-out on assumptions A1–A7, unchanged. No search-query row (no site search on the planned pages), so no query index needed.

## E-full-site: verify — 33/33 verified on aem.live (2026-11-26)

- First pass 21/33: 150 absolute www.ziggo.nl links to delivered pages localized (`localize-links.mjs`, check PASS) and 22 root-relative links to 15 out-of-plan targets (tv-gids, hbo-max, videoland, prime-video, viaplay, zenderoverzicht/regionaal…) repointed to the source host; 11 pages republished (deploy-batch 11/11 live). Five archetype rows read 404 because verify served their migrate-tree `…/index.html` as a folder index (`/alles-in-1/`) while the delivered document is the leaf `content/alles-in-1.html`; those rows now carry `deliveredHtml` (migrate path kept as `migratedTree`). Re-run 33/33 verified; no `restoreAtDelivery` entries; parity replay covers video playback and page errors.

## E2-link-audit: links — 0 internal hrefs off 200, out-of-plan targets on the source (2026-11-26)

- 35 published documents (33 pages + nav + footer): 19 distinct internal hrefs, all 200 on aem.live; `localize-links.mjs --check` PASS; 15 out-of-plan targets (22 links) repointed to www.ziggo.nl, all 200 there; decision recorded in `stardust/direction.md`.

## F-optimize: quality sweep — 0 open findings, health 100 (2026-11-26)

- run-1 over 33 published pages: 0 P1, 25 P2 `ai-search/jsonld` (source carries BreadcrumbList / FAQPage / Organization+WebSite JSON-LD the delivery had dropped), 8 source-parity (channel pages and zenderoverzicht have none on the source either).
- Fix: `stardust/scripts/jsonld-port.mjs` ports the captured JSON-LD verbatim into a `JSON-LD` metadata row (EDS renders it as `<script type="application/ld+json">`); the source's raw newlines inside FAQ answer strings were escaped so it parses. 25 pages republished (deploy-batch 25/25 live). run-2: 0 open, 25 fixed, gate PASS. Metadata-only change: no layout effect on the pixel gates.

## G-aem: autofix — nothing to apply (2026-11-26)

- `autofix-aem.mjs --project . --dry-run`: 0 candidates (optimize run-2 left 0 open findings); no project edits, no re-deploy. Content drafts would not be applied in a replica anyway (verbatim content).

## H-report: summary — 33/33 verified, health 100, pixel 33/33 at 1440 and 360 (2026-11-26)

```
rollout — https://www.ziggo.nl/ → aem-eds (main--50ca44c6--aemcoder.aem.live)
Pages       33 total · 33 verified · 0 deployed · 0 pending · 0 content-pending · 0 stale · 0 failed
Templates   6 (landing 6/6 · program 4/4 · article 13/13 · channel 7/7 · streaming 2/2 · listing 1/1 incl. archetypes)
Blocks      23 total · 23 converted · 0 pending
Quality     health 100/100 · open P1 0 / P2 0 / P3 0 (25 P2 fixed; 8 source-parity informational)
Pixel table prototypes 6/6 PASS · deployed 33/33 PASS (pixel-only 33/33) at 1440 and at 360 — gates/{prototypes,all}-{1440,360}/summary.md
To deliver  none
Content     0 pages awaiting content track
```

- Dynamics: 10/10 replayed checks PASS (`stardust/qa/dynamics-report.md`); 8 features interim on owner actions A1–A6 (help search routing, chat widget, prices API, hreflang, tag manager/consent, data catalogue), 2 decided-out (Mijn Ziggo, order flow link to the source).
- Learnings: 1 entry (`stardust/learnings.md`, JSON-LD at delivery).

## I-dashboard: done verdict — library published, header parity PASS (2026-11-26)

- done-check gaps on entry: `header_parity:unchecked`, `library_missing`. `da-library.mjs`: 23 block documents + 6 templates, sheets and the config library tab written (exit 0).
- Header contract: published compare-1 FAIL 18 errors (scroll lock at 390/1440, motion durations and the mobile drawer's motion, the mobile drawer's "Direct naar" quick links, drawer/group geometry). Header block fixed from source-measured values (body scroll lock, 300 ms droplet slide, 200/300 ms drawer motion, drawer-level quick list from the authored quick links, 355 px drawer, group row heights); closed header 0 px diff at 1440/1024/768/390/360. compare-2 (published, `--max-requests 0`) PASS: 0 errors, 2 source budget warnings. Spot gate-all at 360 after the push: npo-2 0.59 %, tv-start 1.19 %, both PASS.
- Dashboard refreshed; done-check complete once this phase ends.
