# How to prompt an AI to build this

A sequence that worked, written so you can reuse it. Replace the bracketed parts. Work in stages and **check motion in the browser after each one** (stills hide jank).

## 0. Setup
> Create a Next.js (App Router, TypeScript) project with three.js via React Three Fiber and drei, GSAP + ScrollTrigger, Lenis smooth scroll and Zustand. UI-only: all commerce is a dummy. Keep all copy and product data in one data file.

## 1. Reference first
> I'll give you a reference video of a site I like. Extract frames and describe the page flow section by section. Replicate that flow exactly — layout, order, transitions — with my own brand and assets. Don't improvise a different flow.

## 2. Art direction
> Brand: [name], a [type] house. Palette: cream, ink, oxblood, one accent red, gold details. Display serif for headlines with italic accent words; clean sans for UI. Giant type is scenery.

## 3. The hero carousel
> Ten glass bottles on an arc over a star-shaped seal with curved rotating text. Drag, wheel and arrow keys rotate it. The arc runs diagonally bottom-left to top-right. A cursor pill says "[View]".

## 4. Bottle that travels
> Use one fixed WebGL canvas that never unmounts. Bottles follow DOM placeholders' positions each frame. Clicking a bottle flies it into the product page while others fall away; the carousel pose and product-hero start pose must be identical so there is no jump.

## 5. Scroll story
> On the product page: giant title bursts apart on scroll, story words flip up, marquee leans with scroll velocity, bottle makes a full turn, then flies through a 3D word tunnel. The bottle must always render above all text.

## 6. Materials
> Real glass (transmission), 2K PBR textures from Poly Haven (CC0), studio HDRI, filmic tone mapping. Warm the label stock so it doesn't bleach.

## 7. Still life
> Hero: sunlit plaster wall with swaying leaf-shadow, bottle on a travertine plinth with dried leaves, a flower and cloves. Real shadow maps updated only when needed.

## 8. Extras
> Intro: bottle follows the cursor, hold to spray mist, mist blooms into the site. Footer contact CTA with cursor mist, magnetic orb, copy-email. Draggable photo arc with momentum.

## 9. Polish & performance
> Mobile tiering (smaller textures, lower pixel ratio). Pre-compile shaders behind the preloader. Skip work for off-screen elements. Test on a real phone over the LAN.

## Prompting tips that mattered
- Say "replicate exactly" and give frames — otherwise the AI invents its own flow.
- Describe feel ("slow and static" is a complaint, "wow" is the goal) and give concrete rejections ("no ribbons on this arc").
- State layering rules explicitly (bottle above text).
- Ask it to measure frame timing, not just look at screenshots.
