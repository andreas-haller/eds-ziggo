# Dynamic features — www.ziggo.nl

Curated from `stardust/dynamics/dynamic-features.generated-plan.md` (69 draft rows, 6 archetype URLs probed, reach rolled up over 33 pages). Hands-off run: every non-`self` row ships its interim tier and its decision is recorded as a named assumption below, never as `decided-out`.

## Listings contract
none — no index-backed listing block in scope. The four "listing candidates" (toptask tiles, entertainment carousel, swimming-lane strips) are editorially curated card sets on single pages: authored rows in blocks, no query index.

## Features
| # | id | feature | class | reach | disposition | target | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | chrome-menu | header mega menu "Producten" + flyouts (hover/click) | M | 33/33 | rebuild-native | runtime | self | planned | chrome-interaction | none — header contract is the spec | stardust/chrome/header-contract.json |
| 2 | chrome-drawer | mobile header drawer "Menu" with drill-down | M | 33/33 | rebuild-native | runtime | self | planned | chrome-interaction | none — header contract is the spec | header-contract.json @390 |
| 3 | m-modal-trigger-aria-haspopup | accordions / disclosure (FAQ, commands, "Dit zit er in je pakket") | M | 33/33 | rebuild-native | block | self | planned | chrome-interaction | none | _dynamics.json triggers 25/page |
| 4 | cr-client-framework-vue | Vue-hydrated page sections (settled DOM) | CR | 33/33 | static-snapshot | content | self | planned | settled-dom-snapshot | none — settled DOM captured on every page, no empty main | pages/*.html |
| 5 | a-cms-app-settings-object-datalayer | dataLayer settings object | A | 33/33 | static-snapshot | content | self | planned | read-settings | none — keys only name vendors/ids; nothing rendered from it | _dynamics.json |
| 6 | v-video-vimeo | Vimeo players | V | 2/6 | embed-passthrough | content | self | planned | media-as-url | none (player ids public) | _dynamics.json media |
| 7 | s-site-search-form | site search (zenderoverzicht channel filter + header search) | S | 1/33 | index-backed | widget | self | planned | search-index-backed | corpus = migrated pages; channel filter = client-only over the authored channel list | zenderoverzicht form |
| 8 | s-first-party-api-articlesearch | /services/articleSearch (help-article search) | S | 1/33 | data-fed | block | needs-business-decision | interim | off-origin-data | ASSUMPTION A1: interim = links to source help pages; owner decides same-origin routing | _dynamics.json |
| 9 | f-form-address-checker | "Check je beschikbaarheid" postcode + huisnummer checker | F | 5/33 | rebuild-native | block | needs-backend | interim | forms | ASSUMPTION A2: UI rebuilt; submit hands off to the source order flow (www.ziggo.nl) until the owner wires the availability API | alles-in-1, tv-internet, kabel-tv, tv-start |
| 10 | f-form-chat-prechat | third-party chat pre-form (Dimelo) name + zip | F | 33/33 | embed-passthrough | embed | needs-business-decision | interim | consent-gated-tags | ASSUMPTION A3: chat widget not loaded on the new host until the owner re-enables the Dimelo script; excluded from gates (`--dismiss .dimelo-form`) | aside.dimelo-form |
| 11 | f-form-less-control-group-sticky | bundle builder control group (sticky section) | F | 4/33 | rebuild-native | widget | needs-backend | interim | forms | ASSUMPTION A2 (same order flow handoff) | alles-in-1 |
| 12 | a-first-party-api-blueriq-dynamicmedia-hardware | /services/blueriq/b2c/{info,calc}, /services/product/b2c/hardware, /services/dynamicmediaurls | A | 4/33 | data-fed | block | needs-business-decision | interim | off-origin-data | ASSUMPTION A4: prices/offers ship as the captured static snapshot (authored rows); owner decides live price feed | alles-in-1, tv-internet |
| 13 | l-listing-candidates | toptask tiles, carousel, swimming lanes | L | 3/33 | static-snapshot | block | self | planned | listing-index-backed | editorially curated — authored rows (reason: one page each, no index) | _dynamics.json |
| 14 | i18n-locale-variants-nl | hreflang nl / nl-nl | I18N | 33/33 | static-snapshot | content | needs-business-decision | interim | locale-tree | ASSUMPTION A5: single Dutch locale; no locale tree | hreflang |
| 15 | t-tags-consent-analytics | OneTrust, GTM, GA/Ads, ad pixels (Amazon, LinkedIn, Reddit, Pinterest, Bing, Meta, Snap, Awin), session replay (Clicktale), BlueConic, Mopinion feedback, featureassets/prodregistry | T/A | 33/33 | embed-passthrough | embed | needs-business-decision | interim | consent-gated-tags | ASSUMPTION A6: martech not requested — nothing loads on the new host; scaffolded off | 54 third-party hosts |
| 16 | v-iframe-runtime-injected | runtime-injected iframes (tag/consent frames) | V | 33/33 | embed-passthrough | embed | needs-human-capture | interim | embed-passthrough | covered by A6 (tag frames, no content) | _dynamics.json |
| 17 | a-dcat-api | api.prod.dcat.ziggo.io (customer data catalogue) | A | 33/33 | embed-passthrough | embed | needs-business-decision | interim | inspect | covered by A6 (no rendered content depends on it) | _dynamics.json |
| 18 | x-sign-in-account-links | "Mijn Ziggo" sign-in / account links | X | 33/33 | static-snapshot | content | needs-backend | interim | decided-out | ASSUMPTION A7: links kept pointing at the source host (www.ziggo.nl/mijn-ziggo) | header |
| 19 | x-commerce-signals | cart / order flow, price signals | X | 2/33 | static-snapshot | content | needs-backend | interim | decided-out | ASSUMPTION A2/A7: order CTAs link to the source order flow | alles-in-1, tv-internet |
| 20 | v-scene7-media | scene7 dynamic media images/streams | A | 33/33 | static-snapshot | content | self | planned | media-as-url | none — images self-hosted from the capture | media inventory |

## Decision batch
One message to the owner (recorded, hands-off — interim tiers ship):
- **Backend / order flow (A2, A4):** availability check, bundle builder and live prices — wire the production availability/price APIs on the new host, or keep the hand-off to the current order flow.
- **Help search (A1):** route /services/articleSearch same-origin, or keep links to the current help pages.
- **Tags and consent (A3, A6):** which tags, CMP (OneTrust domain script) and the Dimelo chat run on the new host.
- **Account / commerce (A7):** "Mijn Ziggo" and checkout stay on the current host.
- **Locale (A5):** Dutch only.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| — | none: no owner statement yet; every external dependency ships its interim tier | — |

## Pre-import verification (rollout B2, 2026-11-25)
Fresh `dynamics-detect.mjs` over the 6 archetype URLs (`--from-state`, `--reach stardust/current`) → 67 findings; `dynamics-plan.mjs --target-origin https://main--50ca44c6--aemcoder.aem.live --migrated stardust/migrated` → self 4 · owner batch 52 · delivered 9 · host-bound 5/5. Every finding maps to an existing row: first-party `/services/*` APIs → rows 8, 12 (host-bound on the target, as assumed); forms → 9, 10, 11; listing candidates → 13; search → 7; consent/tags/pixels/third-party hosts (incl. newly seen tiktokw.us, tapad, roeye/lantern, dwin1) → 15–17; scene7 → 20; Vimeo → 6; hreflang → 14. No new rows; listings contract unchanged (none).
