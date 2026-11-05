# Interface design

Kinjo uses the original AQUA POP layout in light mode and the original SIGNAL layout in dark mode, restored from `f7577f2`. The changes to that design are the Kinjo name and its aqua conversation badge with vector lettering for 近.

The original header, compact introduction, board activity chart, board sidebar, feed filters, card grid, dark thread rows, and circular compose button return with their original spacing and styling. The later neighborhood illustration and dashboard are no longer rendered.

`src/components/theme/themed-page.tsx` loads `home-d-css.ts` / `home-b-css.ts` and `pages-css.ts`, followed by `logo-css.ts` and `motion-css.ts`. The experimental `redesign-css.ts`, `kinjo-css.ts`, `polish-css.ts`, and `aqua-css.ts` layers remain in the repository but are not applied. The activity chart component remains available for future use.

Keyboard search, dismissible board menus, and the skip link are retained. Search, authentication, announcements, moderation, posting, reactions, and language/theme controls keep their existing handlers. Post totals exclude deleted posts and deleted threads. No external fonts or image requests are needed.

Validate both languages and themes at desktop and phone widths, keyboard search and board menus, route navigation, reduced motion, and the matching inline/download/tab icons. Keep local screenshots out of the repository.

## Motion and interactions

`motion-css.ts` adds consistent easing and short transitions to the original controls, cards, menus, sheets, and drawers. Like/save feedback animates the icon rather than moving the button. Touch devices avoid sticky hover lifts. The scroll header uses a 28px downward / 14px upward threshold and one update per animation frame; it stays visible while focused or while a menu is open. Notification and announcement panels animate out before unmounting. Theme changes refresh the server components beneath a short reveal instead of reloading the document, preserving browser and form state. Reduced-motion preferences disable these effects.
