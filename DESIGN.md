# Design notes

## Concept
A fictional perfume house, **ÉCORCE** ("bark"): ten extraits distilled from bark, resin and skin. The site is one continuous scroll story where a single 3D glass bottle travels between sections instead of each section having its own image.

## Palette — "Rouge Oxblood"
| Role | Value |
|---|---|
| Cream (paper) | `#eee4da` |
| Ink | `#2b1416` |
| Oxblood (primary) | `#6e1a1e` |
| Accent red (italic words, active dash) | `#b3261e` |
| Gold (small details, rules) | `#c9a04e` |

Each fragrance also has its own "mood" palette; the background and seal colours blend continuously between neighbours as the carousel moves.

## Typography
- **Display:** Fraunces (high-contrast serif; chosen over Bodoni because hairlines broke up at hero size). Italic words carry the accent colour.
- **UI / body:** Manrope, small caps tracking for labels.
- Giant heavy sans/serif words are used as *scenery* (hero title, tunnel words, marquee), not just headings.

## Page flow
1. **Preloader / intro** — a glass bottle follows the cursor; press and hold to spray WebGL mist; mist blooms to cream and reveals the site.
2. **Home** — ten bottles on a diagonal (bottom-left → top-right) arc over a star-shaped seal with rotating manifesto text. Drag, scroll or arrow keys; "View" pill follows the cursor.
3. **Click → fly-in** — the chosen bottle physically travels into the product page while the others fall away.
4. **Product hero** — diagonal editorial lockup (line 1 flush left, italic line 2 flush right), sunlit plaster wall with swaying leaf shadows, bottle on a travertine plinth with leaves, gardenia, cloves, dried plum.
5. **Story** — words flip up on scroll; the bottle makes a full showcase turn.
6. **Other extraits** — a full edge-to-edge draggable arc of the other nine scents; the first slot is an empty dashed "Yours" card the hero bottle docks into.
7. **Tunnel** — "Into the scent": a 3D word tunnel the bottle flies through.
8. **Composition** — notes orbit the bottle.
9. **Worn & wanted** — a draggable arc of campaign photos.
10. **Gallery → Contact CTA → giant wordmark footer** — a cursor scent-mist canvas, magnetic orb that sprays on click, copy-to-clipboard email.

## Layering rule
Photos < DOM text < the 3D bottle. The bottle is **always on top** of text. Prints and photos stay in the side lanes so they never fight the bottle.

## Motion principles
- Everything is scroll- or pointer-driven; nothing loops idly without reason.
- One shared clock for smooth scroll, scroll triggers and the 3D renderer so DOM and 3D never drift by a frame.
- Scroll *velocity* adds lean/skew to marquees so the page feels physical.
- Eased hand-offs: the carousel's selected pose and the product hero's start pose are the same pose, so the transition has no jump.

## Materials & lighting (3D)
Procedural bottles (five silhouettes × five cap styles), glass with transmission/refraction, 2K walnut/marble/travertine maps with normal maps, a studio HDRI, filmic tone mapping with warm-tinted label stock (filmic mapping bleaches pure white). Refraction backdrops exist only inside the glass pass so glass bends cream instead of white.

## Performance & mobile
- Device tiers: phones get 1K textures, a lower pixel ratio and a half-resolution refraction pass.
- Shader pre-compilation and texture uploads are spread across frames behind the preloader.
- Off-screen elements skip per-frame measuring.
- Mobile story becomes a split screen: bottle on top, text below.
