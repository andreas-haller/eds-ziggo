---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-11-25T10:21:08Z
  againstInput: https://www.ziggo.nl/
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.ziggo.nl/,
promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-11-25T10:21:08Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

Roster caps (cap-probe): contentMaxWidth 1600px; shell fluid on 5 of 6 archetypes, 1600px on alles-in-1 and zenderoverzicht.

## Decision — out-of-plan link targets repointed to the source (E2, 2026-11-26)

The page scope is fixed at the 33 planned pages, so internal targets outside it are SCOPE EXTENSION and point at https://www.ziggo.nl (all answered 200 there): /entertainment/tv-gids/{npo-1,npo-2,npo-3,rtl-4,rtl-5,sbs6}-vanavond, /televisie/extra-zenders-streamingdiensten/{hbo-max,videoland,viaplay,prime-video,tv-zenders-plus}, /televisie/zenderoverzicht/{regionaal,zenderwijzigingen,radio}, /klantenservice/televisie-radio/secret-circle-aanzetten-of-uitzetten (22 links), plus the absolute source links `localize-links.mjs` keeps as the honest boundary. No captured page was repointed; no capture gaps (`site.captureGaps` empty).
