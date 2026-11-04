# Kinjo: kanji mark and bulletin layout

The new mark draws **近** as original SVG strokes. Its lower walking radical sweeps underneath the rest of the character. A dark forest square, warm white strokes, and a small pale-green corner form the icon. The full name **近所** appears beside it in the site header; the Roman spelling remains secondary.

- `src/components/kinjo-mark.tsx`: inline vector used in the header, masthead, and footer.
- `src/app/icon.svg`: browser tab icon, registered through Next.js metadata conventions.
- `public/kinjo-mark.svg`: standalone logo asset, available at `/kinjo-mark.svg`.

The outlined mark has no font or external asset dependency. Keep the stroke geometry and proportions consistent across these three versions. The full wordmark uses the system Japanese serif stack; the small mark always uses vectors. The SVG frame supplies contrast in either theme. Its accessible name comes from the containing home link; repeated decorative marks are hidden from assistive technology.

## Layout

The homepage now follows a neighborhood bulletin: a plain masthead, board navigation, a single-column discussion stream, and a narrow activity sidebar. Thread titles, excerpts, tags, authors, and actions remain together in each row. Rules separate conversations rather than rounded card containers. Cream paper, forest ink, and a pale-green accent carry the identity; dark mode uses the same hierarchy.

Below 1000px the activity sidebar moves beneath the discussion stream, and below 700px board navigation moves to the existing header menu. The welcome area stays compact on phones. Search, Saved, and My posts use a wider discussion column with no empty space reserved for the activity sidebar. Existing chart controls, permissions, routes, and reduced-motion preferences remain in effect.

Validation covers English and Japanese, both themes, desktop/tablet/phone widths, keyboard navigation, chart range changes, filtered views, and authenticated screens. Earlier design notes describe previous iterations; this document records the current layout and mark.
