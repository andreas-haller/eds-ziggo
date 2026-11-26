# Font licensing — REQUIRED BEFORE GOING LIVE

All faces below were captured from www.ziggo.nl and are self-hosted as-is for design fidelity.
They are **proprietary** (VodafoneZiggo corporate typefaces). Confirm the webfont / embedding
license covers this host before treating the aem.live origin as production.

| File | Family | Foundry / owner | Status |
|---|---|---|---|
| vodafoneziggo-text-light.woff2 | Vodafone Ziggo text 300 | VodafoneZiggo (proprietary) | unconfirmed |
| vodafoneziggo-text-lightitalic.woff2 | Vodafone Ziggo text 300 italic | VodafoneZiggo (proprietary) | unconfirmed |
| vodafoneziggo-text-regular.woff2 | Vodafone Ziggo text 400 | VodafoneZiggo (proprietary) | unconfirmed |
| vodafoneziggo-text-regularitalic.woff2 | Vodafone Ziggo text 400 italic | VodafoneZiggo (proprietary) | unconfirmed |
| vodafoneziggo-text-bold.woff2 | Vodafone Ziggo text 700 | VodafoneZiggo (proprietary) | unconfirmed |
| vodafoneziggo-text-bolditalic.woff2 | Vodafone Ziggo text 700 italic | VodafoneZiggo (proprietary) | unconfirmed |
| ziggoheadline-regular.woff2 | Ziggo Headline 400 | VodafoneZiggo (proprietary) | unconfirmed |
| ziggoheadline-bold.woff2 | Ziggo Headline 700 | VodafoneZiggo (proprietary) | unconfirmed |
| ziggo-ui-icon-v22.woff2 | ziggo-ui-icon-v22 (icon font) | VodafoneZiggo (proprietary) | unconfirmed |

## Remove path
If the license cannot be confirmed: delete the `.woff2` files above and their `@font-face`
rules in `styles/fonts.css`. Every stack in `styles/styles.css` names a metric-matched
`*-fallback` face second (Arial / Liberation Sans / Arimo), so text falls back without
layout shift. The icon font has no fallback; replace `.icon-*` glyphs with SVG icons.
