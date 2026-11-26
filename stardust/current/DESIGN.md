---
name: Ziggo
description: "Current-state design system of www.ziggo.nl (consumer internet, TV & streaming, bellen) — captured, not prescribed."
colors:
  ziggo-orange: "#ff5f00"
  ziggo-orange-deep: "#ff4608"
  ziggo-orange-light: "#f7931e"
  ziggo-blue: "#001489"
  ziggo-blue-hover: "#022c91"
  navy: "#01125d"
  black: "#000000"
  ink: "#1c1f21"
  white: "#ffffff"
  charcoal: "#323639"
  gray-800: "#4a4f54"
  gray-700: "#60676c"
  gray-600: "#757e84"
  gray-400: "#a9aeb2"
  gray-300: "#c1c5c8"
  gray-200: "#d9dbde"
  gray-100: "#f1f2f3"
typography:
  display:
    fontFamily: "Ziggo Headline, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "61.04px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  h1:
    fontFamily: "Ziggo Headline, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "3.05rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  h2:
    fontFamily: "Ziggo Headline, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "39.04px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  h3:
    fontFamily: "Ziggo Headline, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "31.2px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  h4:
    fontFamily: "Ziggo Headline, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "25.008px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  title:
    fontFamily: "Ziggo Headline, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  footer-heading:
    fontFamily: "Ziggo Headline, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "normal"
  subheading-light:
    fontFamily: "Vodafone Ziggo text, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "31.2px"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "normal"
  body:
    fontFamily: "Vodafone Ziggo text, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 300
    lineHeight: 1.6
    letterSpacing: "normal"
  body-list:
    fontFamily: "Vodafone Ziggo text, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  small:
    fontFamily: "Vodafone Ziggo text, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  legal:
    fontFamily: "Vodafone Ziggo text, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 300
    lineHeight: 1.6
    letterSpacing: "normal"
  button:
    fontFamily: "Vodafone Ziggo text, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "normal"
rounded:
  xxs: "6px"
  xs: "8px"
  sm: "16px"
  base: "24px"
  lg: "32px"
  xl: "40px"
  circle: "50%"
spacing:
  xxs: "4px"
  xs: "8px"
  s: "16px"
  m: "24px"
  l: "32px"
  xl: "40px"
  xxl: "80px"
components:
  button-primary:
    backgroundColor: "{colors.ziggo-blue}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.xl}"
    padding: "0 20px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.ziggo-blue-hover}"
    textColor: "{colors.white}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.navy}"
    typography: "{typography.button}"
    rounded: "{rounded.xl}"
    padding: "0 19px"
    height: "48px"
  button-light:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ziggo-blue}"
    typography: "{typography.button}"
    rounded: "{rounded.xl}"
    padding: "0 20px"
    height: "48px"
  button-light-hover:
    backgroundColor: "{colors.gray-100}"
  chip-dark:
    backgroundColor: "{colors.charcoal}"
    textColor: "{colors.gray-100}"
    rounded: "18px"
    padding: "8px 17px"
  header-tab:
    backgroundColor: "{colors.white}"
    textColor: "{colors.black}"
    rounded: "8px 8px 0 0"
    padding: "0 20px"
  hero-band:
    backgroundColor: "{colors.ziggo-orange}"
    textColor: "{colors.white}"
    typography: "{typography.h1}"
  card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.base}"
    padding: "24px"
  card-dark:
    backgroundColor: "{colors.charcoal}"
    textColor: "{colors.white}"
    rounded: "{rounded.base}"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.gray-700}"
    rounded: "{rounded.xs}"
    padding: ".375rem .75rem"
    height: "48px"
  surface-light:
    backgroundColor: "{colors.gray-100}"
    textColor: "{colors.ink}"
---

<!-- stardust:provenance writtenBy=stardust:extract writtenAt=2026-11-25T10:20:00Z mode=current-state sources=_brand-extraction.json,_computed-styles.json,_computed-styles-2.json,assets/css/head.5329cc84e73fa9a6aec3c195822237a4.css,pages/*.json -->

# Design System: Ziggo

## Overview

**Creative North Star: "Orange Band, Blue Action"**

Ziggo's site is a high-contrast telecom retail surface. 29 of 33 pages open with an orange band (`#ff5f00`, class `.vfz-hero-container.bg-primary`) carrying a white Ziggo Headline h1 and a product or campaign photo bleeding in from the right. Channel pages, the channel list and the TV main-menu page use an orange gradient instead (`#ff4608 → #ff5f00 70% → #f7931e`). Below the band the page turns white or very light gray (`#f1f2f3`), and every action is a Ziggo-blue (`#001489`) pill button. The orange is the brand. The blue is where you click.

The layout is a 1200px container with modular sections. Typical sections are rounded 24px cards with one soft charcoal-tinted shadow (`0 4px 10px rgba(28,31,33,.2)`), three-up plan cards, a "Veelgestelde vragen" accordion and a "Nog een vraag?" contact band. Two proprietary families split the work. Ziggo Headline (bold) sets every heading. Vodafone Ziggo text sets body copy in a light 300 weight, with 600 on buttons. The voice is informal Dutch ("je"), with short commands and "altijd" claims.

This file describes the current site and does not propose changes. Exact values come from the computed-style census and the `body.ziggo` token layer in `head.*.css`.

**Key Characteristics:**
- Every captured page has an orange band: a bg-primary photo band on 24 pages, a gradient band on 9. On 4 pages a dark "Ben je Ziggo klant?" toggle band comes first.
- Ziggo-blue `#001489` fills every primary action. Orange appears on action controls only in the third-party feedback tab.
- 24px is the dominant radius for cards, tiles and the sub-nav bar. Buttons are 40px pills.
- One shadow family, tinted with charcoal `rgba(28,31,33,.2)` at xs/s/m strengths.
- Headings are bold Ziggo Headline on a 1.25 (major-third) ladder at desktop and a 1.125 ladder on mobile.
- Body copy is light (300) Vodafone Ziggo text at 16px/1.6.

## Colors

The palette is orange for the brand, blue for actions and a nine-step cool gray ramp for everything else. All of it is declared as `--color_*` custom properties on `body.ziggo`.

### Primary
- **Ziggo Orange** (#ff5f00): CSS token `--color_primary`. It fills the hero bands (bg-primary, 30.3M px² of background area, the largest of any saturated color) and appears in the header strip gradient, orange heading accents (310 heading-color uses) and the orange-tinted focus ring (`0 0 0 3px rgba(255,95,0,.25)`).
- **Gradient Orange Deep** (#ff4608) / **Gradient Amber** (#f7931e): the start and end stops of `--background_gradient` (`linear-gradient(90deg,#ff4608 0%,#ff5f00 70%,#f7931e)`). The gradient appears on the header strip, gradient heroes and promo sections (51 elements).

### Secondary
- **Ziggo Blue** (#001489): CSS token `--color_tertiary`. It is the fill of primary buttons (162 button backgrounds), the link color (1,172 link uses) and the price color. The census role heuristic labels it `primary`.
- **Ziggo Blue Hover** (#022c91): the hover fill for blue buttons (`--color_tertiary-lighten-20`, 31 hover deltas in `_computed-styles.json`).
- **Navy** (#01125d): the text and border color of outline buttons, the header audience-tab text and some USP list text (`--color_tertiary-darken-40`).

### Neutral
- **Black** (#000000): the most common text color (1,845 text uses), used for headings and paragraphs on white.
- **Ink** (#1c1f21): secondary text color (`--color_secondary`, 1,752 text uses), used for paragraphs on light surfaces and breadcrumbs.
- **White** (#ffffff): the page background and the text color on orange and dark bands.
- **Charcoal** (#323639): dark section and card ground (`bg-dark`, dark media cards), text on light chips and dark chip fills (`--color_dark`).
- **Gray 100** (#f1f2f3): light section ground (`bg-light`, 653 background uses) and the sticky sub-nav bar.
- **Gray 300** (#c1c5c8): border and divider color (`--color_border-color`), also used as light footer-link text on dark.
- **Gray 200 / 400 / 600 / 700 / 800** (#d9dbde / #a9aeb2 / #757e84 / #60676c / #4a4f54): card borders, muted nav text, input borders, input text and secondary labels.

Status colors are declared but were not observed in the census: success `#178001`, error `#bd0000`, warning `#eb9701`, plus Vodafone red `#e60000`, red-violet `#9c2aa0` and turquoise `#007c92`.

### Named Rules
**The Orange-Is-Ground Rule.** Orange appears as large fields (hero bands, the gradient strip) and as heading accents. It is not used for buttons. Primary actions are Ziggo Blue.

## Typography

**Display Font:** Ziggo Headline (with -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif)
**Body Font:** Vodafone Ziggo text (same fallback stack)

**Character:** A rounded, heavy proprietary display face over a light, open text face. Headlines feel friendly and loud, and body copy reads airy at weight 300. Both families are proprietary and self-hosted (`assets/fonts/`). Ziggo Headline ships only 400/700 faces, so the token `--headings_font-weight: 600` renders with the 700 face.

### Hierarchy
- **Display** (700, 61.04px desktop / 32.32px mobile, 1.1): the largest landing h1 (e.g. "Internet van Ziggo").
- **Headline 1** (700, 48.8px = 3.05rem desktop / 28.83px = 1.802rem mobile, 1.1): the page h1 in the orange band.
- **Headline 2** (700, 39.04px / 25.6px, 1.1): section headings ("Veelgestelde vragen", "Kies je mediabox").
- **Headline 3** (700, 31.2px / 22.78px, 1.1): sub-sections and large card titles.
- **Headline 4** (700, 25.01px / 20.26px, 1.1): plan names and tile titles ("Internet Only", "TV & Streaming").
- **Title** (700, 20px / 18.5px, 1.1): small card and price titles ("Tot 15 maanden 34,95 p.m.").
- **Light Subheading** (Vodafone Ziggo text 300, 31.2px / 22.72px, 1.1): hero subtitles and the contact band ("Onze adviseurs helpen je graag").
- **Body** (300, 16px, 1.6): paragraph copy.
- **List / UI** (400, 16px, 1.5): USP lists and navigation.
- **Label** (600, 16px, 1.25): button labels. **Legal** (300, 12px, 1.6): price conditions (`.vfz-text--legal`).

The sizes above are the declared `.hN` / `.vfz-heading__hN` size classes. At desktop they step through 16 → 20 → 25 → 31.2 → 39.04 → 48.8 → 61.04, a 1.25 major-third ladder. At 360px the same steps compress to 18 → 20.26 → 22.78 → 25.6 → 28.83 → 32.32, a 1.125 major-second ladder. Authors set the size class independently of the heading tag, so h3 elements render at 20px (78), 25px (77), 31.2px (36) and 39px (9). The mechanical per-tag audit is therefore ad-hoc (h1 48.8, h2 39.04, h3 25.01, h4 25.01). Headings are mixed case (3% uppercase), with no letter-spacing.

### Named Rules
**The Light-Body Rule.** Running text is set at weight 300. Weight 400 is used for lists and UI, and 600 for buttons.

## Layout

The `.container` is fluid below 1024px, has a max-width of 1200px from 1024px, and 1600px from 1920px. Side padding is 20px (<1024), 24px (1024–1440), 32px (1440–1920) and 40px (≥1920). Vertical rhythm comes from the `vfz-spacing-top/bottom` margin utilities: 4, 8, 16, 24, 32, 40, 64 and 80px, on an 8px base with a 4px half step. The m, l, xl and xxl steps grow by one step at ≥1024px. Sections are full-bleed color bands (`bg-primary`, `bg-white`, `bg-light`, `bg-dark`, `bg-ziggo-gradient`) holding the container. Content runs as cards in 2–4-column grids (`row--equal-height`) that stack on mobile. Hero bands use a two-column split (copy col-md-5, photo bleeding right) with fixed height modifiers (20/40/60/80vh variants). Eight TV feature pages add a sticky in-page sub-navigation.

## Elevation & Depth

Depth comes from one soft shadow family on white cards over white or light-gray bands. Every shadow uses the same charcoal tint, `rgba(28,31,33,.2)`, at three strengths.

### Shadow Vocabulary
- **Shadow S** (`box-shadow: 0 4px 10px rgba(28,31,33,.2)`): the default for cards, articles and the sticky sub-nav bar (248 occurrences, the signature).
- **Shadow XS** (`box-shadow: 0 2px 4px rgba(28,31,33,.2)`): the address-checker card, plan tiles and deal blocks (104).
- **Shadow M** (`box-shadow: 0 6px 20px rgba(28,31,33,.2)`): raised cards on the home page.
- **Focus** (`box-shadow: 0 0 0 3px rgba(255,95,0,.25)`): the button focus token.

The census also recorded a Material-style three-layer shadow. It belongs to the third-party "Suggesties?" feedback tab and is not part of the brand.

## Shapes

Shapes are soft, large-radius rectangles. The radius tokens are 6, 8, 16, 24, 32 and 40px.
- **24px** is the dominant radius: cards, mediabox and plan tiles, the sub-nav pill bar and grouped panels (980 occurrences, also the area mode). On mobile, hero bands take a bottom-only `0 0 24px 24px`.
- **40px** is the button pill (`--btn-border-radius`) and the large checker and fieldset containers.
- **8px** is used for inputs, thumbnails and small images. The header audience tabs use `8px 8px 0 0`.
- **16px** is used for home tiles. **50%** is used for circular carousel arrows and icon buttons.

Icons come from the proprietary icon font `ziggo-ui-icon-v22` (18 distinct glyphs captured, e.g. `icon-package` \E93A, `icon-wifi-speed-1000` \E909). Footer social icons are 36px inline SVGs.

## Components

### Buttons
- **Shape:** full pill (40px). Heights are 40px (sm), 48px (default) and 56px (lg). Horizontal padding is 12, 20 or 32px.
- **Primary:** Ziggo Blue `#001489` fill with a white label in Vodafone Ziggo text 16px/600. Hover changes the fill to `#022c91`.
- **Secondary (outline):** transparent with a 2px Navy `#01125d` border and Navy label. Hover changes both to `#00136f`. It follows the primary as a pair ("Stel je pakket samen" + "Voor ondernemers").
- **On dark / light:** a white-outline ghost on dark bands, and a white fill with a blue label on dark cards ("Bekijk meer").
- **Focus:** the `--a11y-outline-*` 2px auto outline, plus the orange focus token.

### Chips
- **Style:** a Charcoal `#323639` fill with a Gray-100 label, an 18px radius and 8px 17px padding. Hover changes the fill to black. Used for the inline links in the extra-zenders FAQ.

### Cards / Containers
- **Corner Style:** 24px.
- **Background:** white on white or light bands. Media teaser cards use Charcoal `#323639` with white text.
- **Shadow Strategy:** Shadow S (see Elevation).
- **Border:** none. Comparison tiles use a 1px `#d9dbde` border.
- **Internal Padding:** 24px.

### Inputs / Fields
- **Style:** 48px high, with a 1px gray border (`#a9aeb2` token; `#757e84` computed on the postcode fields), 8px radius, `#60676c` text and a white fill.
- **Focus:** a border-color/box-shadow transition (.15s) and the browser focus outline.

### Navigation
- **Header:** an orange gradient strip holds the white "Privé / Zakelijk" tabs (14px/700, `8px 8px 0 0`). Below it is a white bar with the orange Ziggo logo, the mega-menu triggers Producten / Klantenservice / Entertainment, search, Ziggo GO, Ziggo Mail and Mijn Ziggo.
- **Breadcrumb:** on 20 TV pages. The labels are the capitalised URL slugs.
- **Sticky sub-navigation:** a light-gray pill bar of in-page anchors ("Navigeer naar ...") with Shadow S, on 8 pages.
- **Footer:** four link columns (Pakketten · Internet · Televisie · Bellen & Overige), then service links, social icons and a legal row.

### Orange Hero Band (signature)
Present on all 33 pages, and the first band on 29. It has an orange field, a white Ziggo Headline h1 at 48.8px, an optional light 31.2px subtitle or USP list, primary/outline CTAs, a 12px legal line. On bg-primary bands a product photo is set as the CSS `background-image` from scene7 (`3840x1300_header60_*` or `3840x870_header40_*`). The 9 gradient bands have no photo.

### Address Checker ("Check je beschikbaarheid")
A white card with Shadow XS and a 40px-radius fieldset. It has a "Geen klant / Al klant" toggle, Postcode, Huisnummer and Toevoeging fields, an "Ik ben ondernemer" checkbox and a blue submit pill. It appears on the four program pages and on internet.

## Do's and Don'ts

### Do:
- **Do** open pages with the orange band (`#ff5f00`, or the `#ff4608 → #ff5f00 → #f7931e` gradient on channel and list pages) and a white Ziggo Headline h1.
- **Do** fill primary actions with Ziggo Blue `#001489` on a 40px pill, with hover `#022c91`.
- **Do** set running text in Vodafone Ziggo text 300 at 16px/1.6, and headings in Ziggo Headline 700 at line-height 1.1.
- **Do** use 24px radii and `0 4px 10px rgba(28,31,33,.2)` for cards.
- **Do** keep copy in informal Dutch with "je" and short commands ("Stel je pakket samen", "Check je beschikbaarheid").

### Don't:
- **Don't** use orange for button fills. On the captured site the only orange button is the third-party feedback tab.
- **Don't** treat the Dimelo chat pre-form (`aside.dimelo-form`), the "Suggesties?" feedback tab or the OneTrust banner as brand components. Their `#ff0000` asterisks, 6px and 3px radii, Material shadows and Diodrum, Open Sans and Roboto fonts are third-party.
- **Don't** add uppercase headings or letter-spacing. The site uses neither.
