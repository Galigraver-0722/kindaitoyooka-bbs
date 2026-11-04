# Kinjo: kanji mark and bulletin layout

The new mark draws **近** as original SVG strokes. Its lower walking radical sweeps underneath the rest of the character. A dark forest square, warm white strokes, and a small pale-green corner form the icon. The full name **近所** appears beside it in the site header; the Roman spelling remains secondary.

- `src/components/kinjo-mark.tsx`: inline vector used in the header, masthead, and footer.
- `src/app/icon.svg`: browser tab icon, registered through Next.js metadata conventions.
- `public/kinjo-mark.svg`: standalone logo asset, available at `/kinjo-mark.svg`.

The outlined mark has no font or external asset dependency. Keep the stroke geometry and proportions consistent across these three versions. The full wordmark uses the system Japanese serif stack; the small mark always uses vectors. The SVG frame supplies contrast in either theme. Its accessible name comes from the containing home link; repeated decorative marks are hidden from assistive technology.

## Layout

The bulletin layout was tried and then withdrawn at the project owner's request. The previous rounded Kinjo design is restored: neighborhood illustration, discussion cards, and charts below the feed. Only the approved kanji identity remains from that experiment. `src/components/theme/logo-css.ts` styles the header and footer lockups without altering layout or palette.

## Aqua refinement

At the owner's request, the original AQUA POP palette, outlined controls, dot-grid background, and hard shadows are restored over the existing Kinjo structure. The kanji SVG geometry, homepage sections, discussion-card grid, activity chart controls, and chart locations are preserved. `src/components/theme/aqua-css.ts` supplies this styling layer. Dark mode returns to SIGNAL cyan and technical grid colors while keeping the same page elements. Theme-switch wipe colors match the restored canvases.
