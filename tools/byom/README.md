# Randapparatuur via BYOM + json2html

Demo integration of the Ziggo randapparatuur webshop (source: https://randapparatuur.ziggo.nl/randapparatuur)
as Edge Delivery pages, without authoring them page by page:

```
DA sheet /data/randapparatuur-products  ──►  json2html worker (Mustache)  ──►  BYOM overlay  ──►  preview / publish
   one row per product                         templates/randapparatuur/*.html     /randapparatuur
                                                                                   /randapparatuur/details/<offer-id>
```

| Piece | Where |
|---|---|
| Products sheet (25 rows) | DA `/data/randapparatuur-products` (local copy `content/data/randapparatuur-products.json`) |
| Detail template | `templates/randapparatuur/product.html` → `product-detail` block |
| Overview template | `templates/randapparatuur/overview.html` → `hero-band` + `product-list` block |
| json2html config | `tools/byom/json2html-config.json` |
| Sheet seed script | `tools/byom/build-products-sheet.mjs` (offers feed + detail pages → sheet JSON) |
| Local template render | `tools/byom/render.mjs` (needs `mustache`; mirrors what the worker does) |

## Sheet columns

`path` (page path, the json2html `pathKey`), `id`, `sku`, `brand`, `title`, `subtitle`, `price` (formatted),
`amount`, `color`, `image` (absolute URL), `stock`, `available` (`true` or empty), `description`, `specs`,
`note` (HTML), `certified` (`true` or empty), `source` (shop URL, used for the order button).

Mustache cannot split or format, so values are stored ready to show (price as `€ 5,25`, specs as
`<ul><li><strong>Label</strong> value</li></ul>`). Empty cells hide the matching row on the page.

## Go-live order (matters)

1. **Code**: merge to `main` (templates, blocks, `ziggo-geschikt` icon).
2. **Sheet**: upload the sheet to DA, preview **and publish** it, so
   `https://main--eds-ziggo--andreas-haller.aem.live/data/randapparatuur-products.json` returns the rows.
3. **json2html config** (needs an AEM admin API token, set outside this repo):
   ```
   POST https://json2html.adobeaem.workers.dev/config/andreas-haller/eds-ziggo/main
   Authorization: token <admin API token>
   Content-Type: application/json
   <body: tools/byom/json2html-config.json>
   ```
   The detail entry is listed first, so it wins whether the worker matches by order or by prefix.
4. **Check the worker** before switching the overlay on:
   - `GET https://json2html.adobeaem.workers.dev/andreas-haller/eds-ziggo/main/randapparatuur/details/59677` → product HTML
   - `GET …/main/randapparatuur` → overview HTML
   - `GET …/main/index` → **404** (anything else must fall through to DA). An unconfigured worker answers
     500 for every path, which would break previewing *all* pages once the overlay is on.
5. **Overlay**: add to the site configuration (`content.overlay`):
   ```json
   { "url": "https://json2html.adobeaem.workers.dev/andreas-haller/eds-ziggo/main", "type": "markup" }
   ```
6. **Preview + publish** `/randapparatuur` and the 25 `/randapparatuur/details/<id>` paths (bulk job).

## Updating products

Edit the DA sheet → publish it → re-preview (and publish) the affected product pages and `/randapparatuur`.
Pages show the sheet as it was at their last preview; nothing updates on its own.
