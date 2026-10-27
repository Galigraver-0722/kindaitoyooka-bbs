# Trademark and name policy

The code in this repository is released under the MIT License. The name it is published under is
not part of that license. This page describes what the MIT License does and does not grant, which
names this project does not own, and what a fork must do before it is shown to students.

It is a naming policy written by the people who maintain this project. It is not legal advice,
and it has not been reviewed by a lawyer.

## What the MIT License covers

The MIT License grants permission to use, copy, modify, merge, publish, distribute, sublicense,
and sell copies of **the software**. It says nothing about the names under which the software is
published, because a name is not part of the source code.

So a fork inherits the right to run, change, and ship the code, and it does not inherit the right
to be called Toyooka BBS. This is the ordinary position in every permissive license: the copyright
grant and the brand are separate things.

## Names this project does not own

- **The school's name and emblem.** 近畿大学附属豊岡中高一貫校,
  *Kindai University Toyooka Junior & Senior High School*, and the school's marks belong to the
  school. Nothing in this repository grants any right to use them, and the MIT License cannot grant
  what the project does not hold. A fork may not imply that it is run by, approved by, or
  affiliated with the school.
- **Third-party names.** Next.js, React, Prisma, and the `naughty-words` word lists belong to their
  owners. `THIRD_PARTY_NOTICES.md` records the attribution that the word lists require.

## What a fork must do

1. **Choose another name.** If the site is deployed for real users — especially for students —
   it must carry a name that is clearly not this one. "Toyooka BBS" and any close variant imply
   that the deployment is this project's instance.
2. **Replace the default brand strings.** They live in a small number of places, and a fork that
   leaves them is still presenting itself as this site:
   - `src/lib/locales.ts` — `meta.title`, `meta.description`, and the `footer` block, in both the
     `en` and `ja` dictionaries.
   - `src/components/site-footer.tsx` — the site name in the footer.
   - `README.md` and `docs/` — the written material that names the school.
3. **Drop the school's name and emblem** from the deployment unless the school has given written
   permission to the people running that deployment. This is not something this repository can
   grant.
4. **State that it is a fork.** Keep the MIT copyright notice, keep `THIRD_PARTY_NOTICES.md`, and
   say plainly that the deployment is based on Toyooka BBS rather than being it.
5. **Do not imply endorsement.** A fork may not suggest that the maintainers of this project, the
   school, or the original site endorse it, review it, or are responsible for it.

## What is allowed without asking

- Referring to this project by name in a factual sentence, for example "based on Toyooka BBS",
  with a link to this repository.
- Studying, quoting, and teaching from the code, including in a classroom.
- Running a private or development copy under any name, as long as it is not offered to students
  as this site.
- Publishing patches and forks that follow the rules above.

## Status of the name

The name "Toyooka BBS" has not been registered as a trademark. This page does not claim a
registration; it records what the maintainers ask of deployments, and what the MIT License already
does not grant. Under Japanese law an unregistered mark can still be protected through prior use,
but this project does not intend to enforce anything beyond the naming rules above. Those rules
exist so that a student who lands on a badly moderated copy does not conclude that this project,
or the school, is responsible for it.

## Reporting misuse of the name

Open an issue in this repository, or contact the maintainer through the address on the repository
page. Include the URL of the deployment and a sentence about what is misleading. Reports about a
deployment that names the school without permission are the ones that matter most, and they are
the ones to raise with the teacher advisor as well.

## Changes to this policy

This page is versioned with the repository, so its history is visible in `git log -- TRADEMARK.md`.
A change to the rules for forks is described in the commit message that makes it.
