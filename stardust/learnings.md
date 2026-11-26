# Learnings — ziggo.nl replica (33 pages)

### Source JSON-LD dropped at delivery
- failure class: silent-render (structured data lost; every pixel and content gate green)
- evidence: rollout F-optimize run-1, 2026-11-26 — 25/33 delivered pages had no `application/ld+json` while the captured source (`stardust/current/pages/<slug>.html`) carried BreadcrumbList, FAQPage and Organization+WebSite; the FAQPage blocks on the source are invalid JSON (raw newlines inside answer strings). Fixed by a `JSON-LD` metadata row (EDS renders it as a head script), source strings verbatim with control characters escaped; run-2 0 open.
- proposed change: `skills/migrate/reference/content-preservation.md` § Preserve verbatim — list the source's JSON-LD as preserved metadata and emit it as a `JSON-LD` row of the metadata block at render, parsed leniently (escape control characters inside strings), so F-optimize never has to recover it after delivery.
- status: pending
