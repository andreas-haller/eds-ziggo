# Prototype gate — every crafted prototype, 360px

2026-11-25T15:04:45.129Z · **6 PASS / 0 FAIL / 0 error of 6**

Verdict: pixel criterion (aligned % ≤ 10 AND total offset ≤ the bound; alignment not used: unaligned % ≤ 10) AND |Δh| ≤ 5% of origin height AND clipped ≤ 0 (+ documented allowance)

Calibration — pixel-only verdict (criteria 1+2): **6 PASS**; full verdict (1–4): **6 PASS**. Failing by criterion: pixel 0, height 0, clip 0, content 0; fonts dead on the source — reported, not failing: 1 (Roboto [origin]); content n/a (origin not probed) 0; **units not declared 2 of 6** (no repeated-unit family applies: the check did not run on them); pixel criterion met only thanks to alignment (unaligned % over the threshold): 0.
| page | template | tier | origin | browser | pixel % aligned (unaligned) [text] | offsets | Δh px | clipped | content | units | verdict | reasons |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/televisie-zenderoverzicht-proposed.html` | - | - | stitch-live | chrome | 0.03 (0.08) | 2 step(s), 2px (bound 8) | 0 | 0 | n/a | off 0 hidden 0 missing 0 (1 family checked) | PASS | - |
| `/televisie-zenders-npo-1-proposed.html` | - | - | stitch-live | chrome | 0.54 (1) | 2 step(s), 2px (bound 8) | 0 | 0 | n/a | not declared | PASS | (reported) units: no family declared for this page — the repeated-unit check did not run |
| `/alles-in-1-proposed.html` | - | - | stitch-live | chrome | 0.83 (1.06) | 8 step(s), 8px (bound 8) | 0 | 0 | n/a | off 0 hidden 0 missing 0 (2 families checked) | PASS | - |
| `/televisie-voicecontrol-proposed.html` | - | - | stitch-live | chrome | 1.39 (1.6) | 2 step(s), 2px (bound 8) | 0 | 0 | n/a | not declared | PASS (masked 292 rows: self-varying rows of the frozen reference (noise floor 0.64%)) | (reported) font-dead-on-source:Roboto; (reported) units: no family declared for this page — the repeated-unit check did not run |
| `/televisie-extra-zenders-streamingdiensten-netflix-proposed.html` | - | - | stitch-live | chrome | 0.76 (1.77) | 4 step(s), 4px (bound 8) | 0 | 0 | n/a | off 0 hidden 0 missing 0 (2 families checked) | PASS | - |
| `/index-proposed.html` | - | - | stitch-live | chrome | 2.53 (2.77) | 4 step(s), 4px (bound 8) | 0 | 0 | n/a | off 0 hidden 0 missing 0 (3 families checked) | PASS (masked 356 rows: self-varying rows of the frozen reference (noise floor 2.53%)) | - |
