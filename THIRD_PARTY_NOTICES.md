# Third-party notices

## naughty-words

- Package: `naughty-words` 1.2.0
- Source: https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words
- License: Creative Commons Attribution 4.0 International (CC BY 4.0)
- Copyright: © 2012–2020 Shutterstock, Inc.

The Japanese and English word lists are used by `src/lib/content-filter.ts` as a starting point
for automatic moderation flags. The project maintains its own ignore list for words that are
ordinary in a school context, and adds a small number of Japanese threats and insults.

The lists contain offensive language. They are used only to flag posts for human review; a match
never hides or blocks content by itself.
