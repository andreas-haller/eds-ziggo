<!-- stardust:provenance writtenBy=stardust:extract writtenAt=2026-11-25T10:12:00Z mode=current-state readArtifacts=_brand-extraction.json,_computed-styles.json,_computed-styles-2.json,pages/*.json,pages/*.html,state.json,_crawl-log.json -->

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

_provenance: inferred. Basis: page copy, CTA labels and nav structure across 33 captured pages. No user research was available._

- **Prospects comparing a home-connectivity subscription.** These are Dutch households choosing internet, TV and phone. The pages address them directly: "Stel je pakket samen", "Check je beschikbaarheid", "Kies je internetpakket", "Kan ik overstappen naar Ziggo?", "Ik heb nog geen Ziggo".
- **Existing Ziggo customers** who add or manage services. Examples: "Ja, ik ben al klant", "Bestel en beheer makkelijk in Mijn Ziggo", streaming add-ons ("Ik wil Netflix", "Bestellen"), "Mijn Ziggo" and the "Extra zenders wijzigen" menu entries.
- **TV viewers looking up features and channels:** recording, replay, the mediaboxen, voice control, the channel list ("Digitale zenderoverzicht", 172 channels) and channel pages (NPO 1, RTL 4 and others).
- **Business customers**, who get only a side door ("Zakelijk" audience tab, "Voor ondernemers", "Ik ben ondernemer").

## Product Purpose

Ziggo (VodafoneZiggo) sells and supports cable/fibre internet, TV & streaming and fixed telephony in the Netherlands. The captured part of www.ziggo.nl has three jobs:
1. Convert prospects into bundle orders. The paths are the pricing cards, the "Check je beschikbaarheid" postcode check and the bundle builder on Alles-in-1, Internet & TV, Kabel TV and TV Start.
2. Upsell TV extras and streaming services to customers (extra zenders, Netflix, Disney+, ESPN, Ziggo Sport).
3. Explain TV features and channels (13 feature articles, 7 channel pages, the channel list).

Home meta description, verbatim: "Welkom bij Ziggo ✓ Stabiel, snel en veilig internet ✓ Wifi Garantie ✓ Ziggo GO ✓ Ziggo Sport  ➔ Kies je voordeel en stel zelf je pakket samen."

## Positioning

_provenance: inferred. Basis: recurring claims in headings and hero copy, quoted verbatim._

Ziggo presents itself as "Het altijd alles netwerk": one network for speed, working wifi and entertainment. The recurring claims are:
- "Altijd alle snelheid die je nodig hebt." (up to 8 Gbit/s)
- "Altijd wifi die werkt. Gegarandeerd." (Wifi Garantie)
- "Altijd het beste van sport en entertainment voor jou." (ESPN and Ziggo Sport included as standard, "Ziggo Sport — Gratis op kanaal 14 voor Ziggo klanten")
- "TV & Streaming op één plek"
- Loyalty through Priority ("Hoe langer je blijft, hoe meer extra’s je krijgt")

Bundling with Vodafone mobile ("One van Vodafone & Ziggo", "tot €10 korting op mobiel én tot €10 korting…") is a mechanism specific to VodafoneZiggo.

## Capabilities and Constraints

- **Page types in scope:** landing (6), program (4), article (13), channel (7), streaming (2) and listing (1), per `stardust/state.json`.
- **Dynamic surfaces:** the availability checker (postcode / huisnummer / toevoeging), the client-rendered bundle builder with basket (`#basket-root`), the channel overview with search, filter and sort, carousels, FAQ accordions, and the sticky sub-navigation. See `pages/*.json#dynamic` and `_crawl-log.json#dynamicSurface`.
- **Third-party widgets present on every page, not part of the design:** the Dimelo chat pre-form (`aside.dimelo-form`, "Vertel ons wie je bent", captured open), the "Suggesties?" feedback survey tab and the OneTrust cookie consent.
- **Prices and promotions are time-bound:** "Onze grootste Black Friday ooit", "vanaf 41,95 p.m.", "Tot 15 maanden 34,95 p.m.", "Samsung TV + Soundbar t.w.v. € 898". The content changes per campaign.
- **Terminology** (Dutch, verbatim): Pakketten, Internet Only, Internet & TV, Alles-in-1, TV Start / TV Complete / TV Max, Mediabox Next, Next Mini, Ziggo GO, Wifi Garantie, SmartWifi, Priority, Extra zenders, Streamingdiensten, Veelgestelde vragen.
- **Not decided:** the scope of the migration beyond the 33 captured URLs, and how the dynamic widgets (checker, bundle builder, channel filter) will be re-implemented.

## Brand Commitments

Register: **brand**.

- **Name and owner:** Ziggo, part of VodafoneZiggo. The site also cross-links Vodafone, Ziggo Dome, Ziggo Zakelijk and Priority.
- **Logo:** the orange Ziggo wordmark, served as an SVG from scene7 (`ziggo-logo-orange-v1`, alt "Logo van Ziggo") at 72×30 in the header. It was not saved locally.
- **Colors:** Ziggo Orange `#ff5f00` (`--color_primary`) with the orange gradient `#ff4608 → #ff5f00 → #f7931e`, Ziggo Blue `#001489` for actions, and a cool gray ramp. See `DESIGN.md`.
- **Type:** the proprietary Ziggo Headline (400/700) and Vodafone Ziggo text (300/400/700 plus italics), self-hosted copies in `stardust/current/assets/fonts/`. The licence must be verified before reuse outside Ziggo properties. Icon font: `ziggo-ui-icon-v22` (proprietary).
- **Voice** (tone guess, inferred): bold-direct. It uses informal "je", short imperatives ("Stap nu over", "Kies je mediabox") and "altijd" superlatives. The language is Dutch, and copy must stay verbatim in a same-design replica.

## Evidence on Hand

- Page records with headings, body, CTAs, links, media, dynamic surface and typed `slots`: `stardust/current/pages/<slug>.json` (33). Rendered DOM: `stardust/current/pages/<slug>.html`.
- Screenshots: `stardust/current/assets/screenshots/<slug>.png` and `<slug>-thumb.png`.
- Style census at 1440 and 360 px: `stardust/current/_computed-styles.json` (23 pages) and `_computed-styles-2.json` (11 more pages, merged).
- Source stylesheets including the `body.ziggo` token layer: `stardust/current/assets/css/head.5329cc84e73fa9a6aec3c195822237a4.css`, `checkout.a939c984c79dc4d2524358f4cbb297de.css` and `checkers.css`.
- Fonts: `stardust/current/assets/fonts/` (ziggoheadline-regular/bold, vodafoneziggo-text-light/regular/bold plus italics, ziggo-ui-icon-v22).
- Brand surface: `stardust/current/_brand-extraction.json`. Design spec: `stardust/current/DESIGN.md` and `DESIGN.json`. Review page: `stardust/current/brand-review.html`.
- **Absences (do not fabricate):**
  - No favicon was captured (no `link rel=icon`, `/favicon.ico` unreachable).
  - No local logo file.
  - No local hero or product images; media are scene7 or AEM DAM URLs only.
  - No testimonials, press or case studies on the captured pages.
  - No `@font-face` or file for "Diodrum", which appears only in third-party CSS.

## Product Principles

_provenance: inferred. Basis: patterns repeated across page types. These are descriptive, not adopted strategy._

1. **Availability before price.** Program pages put "Check je beschikbaarheid" (postcode check) ahead of the bundle builder.
2. **One-network bundling.** Internet, TV, telephony and Vodafone mobile are sold as combinable packages with stacking discounts.
3. **Everything in one place.** TV & streaming are aggregated ("TV & Streaming op één plek"), with extras switchable monthly ("Maandelijks aan- en uitzetten").
4. **Help is always one band away.** FAQ accordions on 18 pages, and the "Nog een vraag?" Bel / Chat / Winkel band on product pages.

## Accessibility & Inclusion

_provenance: inferred. Basis: captured DOM and CSS; no stated standard was found in the captured pages beyond the footer "Toegankelijkheid" link._

- There is a skip link to `#main-content` and an `--a11y-outline-*` focus-outline token layer (2px auto). The button focus ring is `0 0 0 3px rgba(255,95,0,.25)`.
- Images: 648 of 1,328 captured images (49%) have empty `alt`. Many are progressive-image placeholders or decorative icons. Channel logos carry "Logo van <zender>".
- The home page's visual hero headline ("Onze grootste Black Friday ooit") is a styled `<span>`, not a heading. The page h1 is "Daarom kies je Ziggo".
- Body text is light (300) at 16px: black or `#1c1f21` on white, or white on orange `#ff5f00`.
