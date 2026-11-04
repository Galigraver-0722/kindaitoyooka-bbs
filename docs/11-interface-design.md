# Interface design

The campus commons redesign replaces the earlier separate AQUA POP and SIGNAL layouts with a shared navigation and card system, in day and night palettes. This supersedes the visual treatment in ADR-0018 and the prototype notes under `local/designs/`.

- A shared header contains search, boards, announcements, account, language, and theme controls. Cmd/Ctrl-K focuses search. The native board menu supports Escape and outside-click dismissal.
- The home introduction explains the forum and links directly to composing or browsing. Its illustration is decorative HTML/CSS, has no network dependency, and is hidden from assistive technology.
- Feed, board, and profile thread lists use the same cards in both themes. Existing search, sorting, pagination, and permissions stay in their handlers.
- Forms, discussions, profiles, policies, moderation surfaces, and error boundaries share the new spacing, borders, and typography. Policy links are available in the themed footer.
- Entrance animations run once; hover motion is limited to precise pointers. Reduced-motion preferences disable animation and transitions. Keyboard focus remains visible, and a skip link precedes navigation.
- New copy lives in both dictionaries in `src/lib/locales.ts`. No external font or animation dependency is required.

The final theme layer is `src/components/theme/redesign-css.ts`, appended after the existing structural styles. `shell-interactions.tsx` owns the small navigation enhancements; normal links and GET search forms remain usable without JavaScript.

Validate both themes at desktop and phone widths, with Japanese and English text, reduced motion, keyboard search, board-menu dismissal, and route navigation. Check authenticated screens with a local test account. Never include student data in screenshots committed to the repository.
