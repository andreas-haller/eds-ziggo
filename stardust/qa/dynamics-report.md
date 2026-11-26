# Dynamics parity check — https://main--50ca44c6--aemcoder.aem.live — 2026-11-26T05:11:37.997Z

Replayed 10 checks over 20 features · pass 10 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| header mega menu Producten + flyouts | M | done | dom-count | PASS | 3 × header [aria-haspopup="true"] (min 1) |  |
| mobile header drawer Menu | M | done | dom-count | PASS | 24 × header [aria-expanded] (min 2) |  |
| accordions / disclosure | M | done | dom-count | PASS | 11 × main details, main [aria-expanded] (min 1) |  |
| hydrated sections, settled DOM | CR | done | no-page-errors | PASS | none on 33 page(s) |  |
| streaming showreel video players (scene7 viewer) | V | done | video-plays | PASS | iframe/video: true · no <video> · playback requests 30 (ok) | vodafoneziggo.scene7.com:200×24 :200×3 s7mbrstream-g1.scene7.com:200×2 s7mbrstream-g1.scene7.com:206×4 |
| zenderoverzicht channel list filter | S | done | dom-count | PASS | 422 × .channel-overview li (min 20) |  |
| postcode + huisnummer checker | F | interim | dom-count | PASS | 3 × form.addr-form input (min 2) |  |
| toptask tiles, carousel, swimming lanes | L | done | dom-count | PASS | 118 × .toptask-tiles a, .swimming-lane a (min 3) |  |
| bundle builder control group | F | interim | dom-count | PASS | 1 × .bundle-builder (min 1) |  |
| scene7 images | A | done | dom-count | PASS | 246 × main picture img (min 3) |  |

## Features without checks

- help-article search (S) — interim · owner: A1: same-origin routing of /services/articleSearch
- chat pre-form (F) — interim · owner: A3: re-enable chat widget on the new host
- prices / hardware APIs (A) — interim · owner: A4: live prices API routing
- hreflang nl (I18N) — interim · owner: A5: single Dutch locale
- consent, analytics and ad tags (T/A) — interim · owner: A6: tag manager / consent container on the new host
- runtime-injected tag frames (V) — interim · owner: A6
- customer data catalogue API (A) — interim · owner: A6
- Mijn Ziggo sign-in links (X) — decided-out · owner: A7: links point at www.ziggo.nl/mijn-ziggo
- cart / order flow (X) — decided-out · owner: A2/A7: order CTAs link to the source order flow
- dataLayer settings object (A) — done
