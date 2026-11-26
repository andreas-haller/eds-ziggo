<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-11-25T15:24:24.672Z · input stardust/current/_dynamics.json (6 pages, 67 findings) · target probe https://main--50ca44c6--aemcoder.aem.live · reconciled against stardust/migrated -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · target = the delivery form (widget where no authored rows remain) · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | target | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-api-prod-dcat-ziggo-io | A | unknown third-party host api.prod.dcat.ziggo.io | 6/6 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-unknown-third-party-host-c-amazon-adsystem-com | A | unknown third-party host c.amazon-adsystem.com | 6/6 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 3 | a-unknown-third-party-host-deploy-mopinion-com | A | unknown third-party host deploy.mopinion.com | 6/6 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 4 | a-unknown-third-party-host-alb-reddit-com | A | unknown third-party host alb.reddit.com | 6/6 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 5 | a-unknown-third-party-host-px-ads-linkedin-com | A | unknown third-party host px.ads.linkedin.com | 6/6 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 6 | a-unknown-third-party-host-vodafoneziggo-blueconic-net | A | unknown third-party host vodafoneziggo.blueconic.net | 6/6 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 7 | a-unknown-third-party-host-www-google-com | A | unknown third-party host www.google.com | 6/6 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 8 | a-unknown-third-party-host-aax-eu-amazon-adsystem-com | A | unknown third-party host aax-eu.amazon-adsystem.com | 6/6 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 9 | a-unknown-third-party-host-featureassets-org | A | unknown third-party host featureassets.org | 6/6 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 10 | a-unknown-third-party-host-sl-11a463aaedf44600a99367660fd6fa | A | unknown third-party host sl-11a463aaedf44600a99367660fd6fa70.ecs.us-east-1.on.aws | 6/6 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 11 | a-unknown-third-party-host-c-clicktale-net | A | unknown third-party host c.clicktale.net | 6/6 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 12 | a-unknown-third-party-host-cacheorcheck-mopinion-com | A | unknown third-party host cacheorcheck.mopinion.com | 6/6 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 13 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 6/6 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 14 | a-unknown-third-party-host-ziggo-dimelochat-com | A | unknown third-party host ziggo.dimelochat.com | 5/6 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 15 | a-unknown-third-party-host-prodregistryv2-org | A | unknown third-party host prodregistryv2.org | 3/6 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 16 | a-unknown-third-party-host-vodafoneziggo-scene7-com | A | unknown third-party host vodafoneziggo.scene7.com | 2/6 | static-snapshot | — | needs-human-capture | delivered-by-capture | inspect | inspect the XHR, add a vendor row | output already carries "vodafoneziggo.scene7.com" |
| 17 | a-unknown-third-party-host-s7mbrstream-g1-scene7-com | A | unknown third-party host s7mbrstream-g1.scene7.com | 2/6 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 18 | a-first-party-api-get-services-dynamicmediaurls | A | first-party API GET /services/dynamicmediaurls | 2/6 (reach 3/33) | data-fed | block | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 19 | a-unknown-third-party-host-k-aeu1-clicktale-net | A | unknown third-party host k-aeu1.clicktale.net | 2/6 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 20 | a-first-party-api-get-services-blueriq-b2c-info | A | first-party API GET /services/blueriq/b2c/info | 1/6 (reach 4/33) | data-fed | block | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 21 | a-first-party-api-get-services-blueriq-b2c-calc | A | first-party API GET /services/blueriq/b2c/calc | 1/6 (reach 4/33) | data-fed | block | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 22 | a-first-party-api-get-services-product-b2c-hardware | A | first-party API GET /services/product/b2c/hardware | 1/6 (reach 2/33) | data-fed | block | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 23 | cr-client-framework-vue | CR | client framework vue | 6/6 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 24 | f-form-text-name-text-zip-no-action-js-wired-6-fields | F | form "text:name+text:zip" → no action (JS-wired) (6 fields) | 6/6 | rebuild-native | block | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 25 | f-form-text-zipcode-text-housenumber-no-action-js-wired-4-fi | F | form "text:zipcode+text:houseNumber" → no action (JS-wired) (4 fields) | 1/6 | rebuild-native | block | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 26 | f-form-less-control-group-in-section-vfz-sticky-page-section | F | form-less control group in section.vfz-sticky-page-section__wrapper (6 controls) | 1/6 | rebuild-native | widget | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 27 | i18n-locale-variants-nl | I18N | locale variants nl | 1/6 | rebuild-native | runtime | needs-business-decision | delivered-by-capture | locale-tree | scope of the locale trees | output already carries "https://www.ziggogo.tv/nl/" |
| 28 | i18n-locale-variants-nl-nl | I18N | locale variants nl,nl | 1/6 | rebuild-native | runtime | needs-business-decision | delivered-by-capture | locale-tree | scope of the locale trees | output already carries "https://www.netflix.com/nl" |
| 29 | l-listing-candidate-vfz-toptask-vfz-spacing-top-xl-6-cards | L | listing candidate vfz-toptask vfz-spacing-top--xl (6 cards) | 1/6 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 30 | l-listing-candidate-vfz-carousel-wrapper-vfz-carousel-wrappe | L | listing candidate vfz-carousel__wrapper vfz-carousel__wrapper--center (6 cards) | 1/6 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 31 | l-listing-candidate-vfz-swimming-lane-strip-28-cards | L | listing candidate vfz-swimming-lane__strip (28 cards) | 1/6 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 32 | l-listing-candidate-vfz-swimming-lane-strip-27-cards | L | listing candidate vfz-swimming-lane__strip (27 cards) | 1/6 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 33 | m-modal-trigger-aria-haspopup-chrome-only-button-content | M | modal trigger aria-haspopup (chrome only) → button:content | 6/6 (reach 792/33) | rebuild-native | runtime | self | delivered-by-capture | chrome-interaction | none (the header contract is the spec) | output already carries "Pakketten" |
| 34 | s-first-party-api-get-services-articlesearch | S | first-party API GET /services/articleSearch | 1/6 (reach 1/33) | data-fed | block | needs-business-decision | pending | off-origin-data | datasource ownership / same-origin routing on production | **dead on target (404)** |
| 35 | s-site-search-form-js-submitted | S | site search form → (JS-submitted) | 1/6 (reach 1/33) | index-backed | widget | self | pending | search-index-backed | none (corpus = the migrated pages; second corpora stay out) |  |
| 36 | t-consent-onetrust | T | consent: OneTrust | 6/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 37 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 6/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 38 | t-unknown-third-party-host-www-vodafone-nl | T | unknown third-party host www.vodafone.nl | 6/6 | embed-passthrough | embed | needs-business-decision | delivered-by-capture | consent-gated-tags | which tags run on the new host; property ids | output already carries "www.vodafone.nl" |
| 39 | t-analytics-google-analytics-ads | T | analytics: Google Analytics / Ads | 6/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 40 | t-unknown-third-party-host-s-pinimg-com | T | unknown third-party host s.pinimg.com | 6/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 41 | t-unknown-third-party-host-www-redditstatic-com | T | unknown third-party host www.redditstatic.com | 6/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 42 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 6/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 43 | t-unknown-third-party-host-sc-static-net | T | unknown third-party host sc-static.net | 6/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 44 | t-unknown-third-party-host-cdn-blueconic-net | T | unknown third-party host cdn.blueconic.net | 6/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 45 | t-unknown-third-party-host-cdnssl-clicktale-net | T | unknown third-party host cdnssl.clicktale.net | 6/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 46 | t-unknown-third-party-host-www-dwin1-com | T | unknown third-party host www.dwin1.com | 6/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 47 | t-unknown-third-party-host-tr-snapchat-com | T | unknown third-party host tr.snapchat.com | 6/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 48 | t-unknown-third-party-host-pixel-tapad-com | T | unknown third-party host pixel.tapad.com | 6/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 49 | t-unknown-third-party-host-www-linkedin-com | T | unknown third-party host www.linkedin.com | 6/6 | embed-passthrough | embed | needs-business-decision | delivered-by-capture | consent-gated-tags | which tags run on the new host; property ids | output already carries "www.linkedin.com" |
| 50 | t-analytics-session-replay | T | analytics: session replay | 6/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 51 | t-unknown-third-party-host-lantern-roeyecdn-com | T | unknown third-party host lantern.roeyecdn.com | 6/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 52 | t-unknown-third-party-host-px4-ads-linkedin-com | T | unknown third-party host px4.ads.linkedin.com | 6/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 53 | t-unknown-third-party-host-www-facebook-com | T | unknown third-party host www.facebook.com | 6/6 | embed-passthrough | embed | needs-business-decision | delivered-by-capture | consent-gated-tags | which tags run on the new host; property ids | output already carries "www.facebook.com" |
| 54 | t-unknown-third-party-host-analytics-ipv6-tiktokw-us | T | unknown third-party host analytics-ipv6.tiktokw.us | 6/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 55 | t-unknown-third-party-host-lantern-roeye-com | T | unknown third-party host lantern.roeye.com | 6/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 56 | t-unknown-third-party-host-tr6-snapchat-com | T | unknown third-party host tr6.snapchat.com | 6/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 57 | t-unknown-third-party-host-collect-mopinion-com | T | unknown third-party host collect.mopinion.com | 6/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 58 | t-feedback-survey-voc-badge | T | feedback: survey / VoC badge | 6/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 59 | t-unknown-third-party-host-fonts-mopinion-com | T | unknown third-party host fonts.mopinion.com | 6/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 60 | t-unknown-third-party-host-gstatic-mopinion-com | T | unknown third-party host gstatic.mopinion.com | 6/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 61 | t-unknown-third-party-host-vodafoneziggo-scene7-com | T | unknown third-party host vodafoneziggo.scene7.com | 4/6 | embed-passthrough | embed | needs-business-decision | delivered-by-capture | consent-gated-tags | which tags run on the new host; property ids | output already carries "vodafoneziggo.scene7.com" |
| 62 | t-unknown-third-party-host-ziggo-dimelochat-com | T | unknown third-party host ziggo.dimelochat.com | 1/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 63 | v-video-vimeo | V | video: Vimeo | 6/6 | embed-passthrough | content | self | pending | media-as-url | none (player ids are public) |  |
| 64 | v-iframe-without-src-runtime-injected-embed | V | iframe without src (runtime-injected embed) | 6/6 | embed-passthrough | embed | needs-human-capture | pending | embed-passthrough | resolve the runtime src from a rendered capture |  |
| 65 | x-sign-in-account-links | X | sign-in / account links | 6/6 | decided-out | — | needs-backend | delivered-by-capture | decided-out | auth / commerce on the new host? | output already carries "https://account.ziggo.nl/account/inlogge" |
| 66 | x-commerce-signals-cart-true-prices-4 | X | commerce signals (cart: true, prices: 4) | 1/6 | decided-out | — | needs-backend | pending | decided-out | auth / commerce on the new host? |  |
| 67 | x-commerce-signals-cart-true-prices-7 | X | commerce signals (cart: true, prices: 7) | 1/6 | decided-out | — | needs-backend | pending | decided-out | auth / commerce on the new host? |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 4 row(s) — read-settings, settled-dom-snapshot, search-index-backed, media-as-url.
- **One owner decision batch:** 52 row(s) — inspect the XHR, add a vendor row · which tier for the target host; consumer on the migrated pages? · production endpoint; interim capture ships now · index-driven or editorially curated? · datasource ownership / same-origin routing on production · CMP domain script reuse on the new host.
- **Already delivered by the capture pipeline:** 9 row(s) — no work.
- **Host-bound on the target:** 5 of 5 probed API paths — the off-origin data work.

## Phases

- **tags** — 27
- **detect** — 18
- **off-origin data** — 5
- **listings** — 4
- **forms** — 3
- **register** — 3
- **locale wave** — 2
- **capture** — 1
- **interactive** — 1
- **search** — 1
- **media** — 1
- **embeds** — 1
