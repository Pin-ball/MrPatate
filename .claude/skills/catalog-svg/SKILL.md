---
name: catalog-svg
description: Clean a drawing (Figma, Illustrator, Inkscape… export) and bring it into the Mr Patate catalog, or re-check drawings already in src/catalog — SVGO, data-role by color, eyes and pupils, skin under the shadows, labels and planes. Use when the user gives an .svg to add as a variant, asks to clean / conform / check a catalog drawing, or invokes /catalog-svg.
---

# Catalog SVG

Turn an exported drawing into a valid `src/catalog/<part>/<id>.svg`, or re-check existing ones. The mechanical part is done by `npm run catalog:clean`; this skill handles what needs judgement and checks the result on screen. Answer in French.

## Rules the drawings follow

Read them in `README.md` (« Ajouter une Variante »), `src/catalog/planes.ts`, `src/catalog/parts.ts` and the « Catalogue » decisions in `.untracked/plan.md`. In short:

- `viewBox="0 0 800 1000"`, same frame as the other drawings of the part; one `<title lang>` per locale (`src/i18n/locales.ts`).
- Only `g path circle ellipse rect polygon polyline`; no `id`, `class`, `style`, `<defs>`, clip paths or masks.
- Roles by color: `#21C488` → `skin`, `#20A069` → `shadow`, black lines → `outline` (contours and inner lines). Solid black fills (iris, inside of a mouth…) keep no role: the command measures each black shape and treats it as solid when more than 10 % of its visible part (what is not covered by shapes painted above) is thicker than 8 units. Other colors keep no role.
- Eyes (part `eyes` only): each white shape holding one small black pupil is grouped as `<g data-role="eye">` with `eye-white` and `eye-pupil`; no hole in the white under the pupil.
- Shadows: the skin covers the whole area under the shadow (skin ∪ shadow), and the shadow goes 3 units beyond the silhouette; it is clipped by the skin at render time.
- Parts drawn on several planes (`planes.ts`, e.g. arms and legs): top-level content is `<g data-plane="…">` groups.
- Ids are kebab-case and permanent (they end up in shared links).

## 1. Clean

- **New drawing**: `npm run catalog:clean -- <source.svg> --to <part>/<id>`. The source can be anywhere (Downloads, export folder); only the cleaned file is written. Ask for the part and id if the user did not give them; propose an id from the label. It refuses to overwrite an existing variant.
- The output is validated with the real catalog loader (`parseDrawing`, ids, planes of the part) and nothing is written while an `error` remains, so a running dev server never receives a broken drawing. Exports usually lack the `<title lang>` and, for multi-plane parts, the `<g data-plane>` groups: copy the source into the scratchpad, add them there (steps 2 and 3), then run `--to` on the copy.
- **Existing drawings**: `npm run catalog:clean -- src/catalog/<part>/<id>.svg …` reports without writing; add `--write` only once the user agreed. Existing roles are kept; only missing ones are added.

The command prints a report per file: `error` (not written), `warning` (to fix or confirm), `info` (what it did). Lines start with the shape (`<path> at x,y`) or the plane they concern.

## 2. Handle the report

- **Loader errors** (`<part>/<id>.svg: …`): viewBox, missing label, unsupported tag, planes, id. For the viewBox, ask for an 800×1000 export aligned on the other drawings rather than rescaling.
- **Black shapes inside a white shape, not a pupil**: no eye is grouped; these shapes follow the usual rule (lines → `outline`, solid fills → no role, as the irises of `eyes/kawaii.svg`).
- **Solid black fill left without role / `outline` on a solid black fill**: look at the shape. A filled area keeps no role; a line drawn very thick (or with a large junction) may still deserve `outline`, add it by hand.
- **Color close to the skin/shadow color**: almost always an export color shift; set the exact drawn color so the role applies.
- **Skin or shadow inside a group**: move it to the top level of its plane; the shadow clip only reads top-level shapes.
- **clip-path / mask removed**: check the render, the clip may have hidden part of the drawing.
- **Transform / stroke / no fill / covers the whole frame**: editor leftovers (frame background, outlined strokes not expanded). Fix in the file or ask for a re-export.
- **Missing label**: propose a French and English label in the tone of the other variants of the part, and let the user confirm.
- **Shadow stops at the silhouette**: extend the shadow 3 units beyond the skin edge where it meets the silhouette.
- **Skin missing under the shadow**: extend the skin path to cover the shadow (union of both shapes).
- **Shadow extends too far**: trim it back to about 3 units.

Edit the paths by hand when needed, then run the command again on the catalog file (`--write`) until only `info` lines are left, or the remaining warnings are accepted by the user.

## 3. Planes

If the part is on several planes, split the content into `<g data-plane="…">` groups in the order of `planes.ts` (e.g. the arm behind the body in `back`, the one in front in `front`), following an existing drawing of the same part.

## 4. Verify

- `npm run check` (validates every catalog file with the real loader: tags, attributes, planes, labels).
- Open the app (`npm run dev`) and choose the variant: position against the other parts, skin color change, shadows moving with the pointer without gaps, pupils moving inside the eyes. Compare with a screenshot before/after for re-cleaned files.
- Never stage or commit.

## Report

In French: file written, what the command did, what you fixed by hand, warnings left and why, and what the user should look at.
