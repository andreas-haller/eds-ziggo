# Inconsistency register — www.ziggo.nl replica

Everything not listed here is frozen; any design delta found by the gate is a
defect, not an improvement.

## R-01 — Proprietary brand fonts self-hosted

- **Evidence:** @font-face in the captured DOM (stardust/current/pages/index.html): Ziggo Headline 400/700, Vodafone Ziggo text 300/400/700 (+italics), ziggo-ui-icon-v22, served from www.ziggo.nl/assets/fonts and /assets/icons; copies in stardust/current/assets/fonts/.
- **Finding:** the faces are proprietary to VodafoneZiggo; the new host serves the same files, which needs the owner's licence confirmation (deploy licensing alert).
- **Minimal change:** none to the design — same files, same faces; licence confirmation is a handover item.
- **Status:** deferred
- **Where:** all page types
