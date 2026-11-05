# Kinjo: aqua conversation badge

The mark combines original vector lettering for **近** with a rounded speech bubble. AQUA POP cyan (`#12BFD1`), navy outlines and lettering (`#062330`), and rounded stroke ends replace the forest-green square, cream strokes, and lime corner. In the dark header, the bubble uses SIGNAL cyan (`#5AE6EC`).

- `src/components/kinjo-mark.tsx`: decorative inline mark in the home link.
- `src/app/icon.svg`: browser tab icon, registered through Next.js metadata conventions.
- `public/kinjo-mark.svg`: matching standalone asset at `/kinjo-mark.svg`.

Keep the silhouette, lettering, and proportions consistent across all three files. The containing home link supplies the accessible name; the SVG is hidden from assistive technology. No font or external asset is required.

The original AQUA POP and SIGNAL layouts are restored, with the Kinjo name and redesigned badge. `src/components/theme/logo-css.ts` only sizes the mark, adapts its dark colour, and retains the hidden-until-focused skip link. See [Interface design](11-interface-design.md) for the current layout; the later neighborhood designs are no longer applied.
