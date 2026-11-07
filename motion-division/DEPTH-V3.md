
# CYCLE / Motion Division V3: Depth Audit and Implementation

## Original problem
The V2 site uses 3 image-to-video plates switched by opacity. Its corridor was a flat film, its two world transitions hard-cut into normal sections, automotive photo slices used 2D transforms, and yachting route was a flat SVG overlay. Verified on desktop 1440×900 and mobile 390×844: the primary `transform-style` was `flat`, `perspective` was `none`.

## Chosen solution: lightweight spatial stage, not an invented GLB
- Real perspective CSS 3D for six nested metallic corridor frames, ceiling/floor planes, physical side walls and luminous aperture.
- Scroll transforms advance the camera through the set and reveal the light gallery with columns, floor, chrome track and depth.
- Automotive / Yachting section media stay factual photographic plates, supplemented by their own 3D door, floor, architectural frame, and slow camera motion.
- The Engine's four image slices become independent 3D tilted planes at different Z depths.
- The Course gains a watery perspective layer and subtler parallax.
- Existing semantic copy, section links, keyboard input, interactive content drawers remain in place.
- No external runtime dependency. No fake car mesh claim.
- Two explicit fallbacks: mobile reduced complexity, prefers-reduced-motion drops all camera and set movement.
- All V3 files scoped to `motion-division/`; parent Daniil Terekh site untouched.

## Verification
- JS parse, HTML ids and links, browser desktop/mobile, actual transform matrix3d, anchor click, reduced motion, and no horizontal overflow.
- Inspect low- and mid-scroll screenshots and verify geometry remains legible. Keep performance bounded using CSS transforms and a rAF throttle.

## Known limits
CSS 3D architecture is not full mesh-based CGI. Real photoreal camera continuity, yacht/vehicle mesh rotation and true hull/chassis exploded-view animation will require authored Blender/Three.js models or a physically continuous source render. V3 strengthens the existing prototype without pretending that still photography is a rotatable 3D vehicle.
