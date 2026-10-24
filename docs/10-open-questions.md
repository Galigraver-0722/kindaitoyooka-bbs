# Open Questions

Decisions that are intentionally left to the project owner, the teacher advisor, or the school.
Do not let the codebase answer them by accident.

| ID | Question | Options | Why it matters | Recommended default | Owner | Decide by |
| --- | --- | --- | --- | --- | --- | --- |
| Q1 | What is the public name of the site? | "Toyooka BBS", a Japanese name, a club-chosen name | Branding, domain, school approval | Keep "Toyooka BBS" as the working name until a teacher approves another | Project owner | Before domain purchase |
| Q2 | Who owns the domain and server accounts? | Student, teacher, school IT | Continuity after the maintainer graduates | School or teacher-owned account with the student as technical contact | Teacher advisor | Before launch |
| Q3 | Is there a named teacher advisor and written approval? | Yes / no | Legal and safety requirement | Do not launch without both | Administration | Phase 3 |
| Q4 | Where will it be hosted? | VPS, school server, Vercel + managed Postgres | Cost, HTTPS, backups, data location | Small VPS with HTTPS and offsite backup | Maintainer + advisor | Phase 1 |
| Q5 | Who can register? | Open, invite code, school email domain | Spam and stranger risk vs adoption | Invite code for the beta, open with a school-domain hint for launch | Advisor | Phase 2 |
| Q6 | Do we send email? | None, verification only, full notifications | Requires a provider, consent, and deliverability work | None in v0.1; verification before open registration | Maintainer | Phase 2 |
| Q7 | Who moderates, and with what time commitment? | 2 student mods + teacher, a student committee, teachers only | Burnout and response time | At least 2 student moderators and 1 advisor; publish an SLA | Advisor | Phase 1 |
| Q8 | Does the interface need Japanese? | English only, bilingual, Japanese only | Adoption and school approval | English v0.1; add Japanese if the advisor requires it | Advisor | Phase 3 |
| Q9 | What is the retention policy for removed content? | Keep forever, 180 days, 30 days | Privacy vs audit | 180 days for removed bodies, then purge with backup | Advisor + maintainer | Before launch |
| Q10 | Will images be allowed? | Never, event posters only, general uploads | Safety, storage, moderation load | No images in the first year; revisit with a moderation plan | Advisor | Phase 5 at the earliest |
| Q11 | Is anonymous posting allowed? | No, pseudonymous only, fully anonymous | Accountability vs willingness to ask | Pseudonymous accounts only | Advisor | Already decided: no |
| Q12 | What analytics are acceptable? | None, self-hosted aggregate counts, third-party | Privacy of minors | Aggregate counts only, no third-party trackers, no ad tech | Advisor | Before launch |
| Q13 | Who owns user posts, and what license do users grant? | Implicit, CC BY-SA, school-owned | Reuse in yearbooks or archives | State in the terms: users keep authorship, grant the site a non-exclusive license to display | Advisor | Before launch |
| Q14 | Can teachers read moderation reports and user emails? | No, advisor only, all staff | Trust and privacy expectations | Advisor can request specific records through the maintainer; no bulk access | Advisor | Before launch |
| Q15 | Who takes over when the maintainer graduates? | A successor, a club, school IT | Bus factor | Recruit and document a successor in year one | Project owner | End of first year |

## How to close a question

1. Write the decision and the reasoning in `docs/08-decision-log.md`.
2. If it changes behavior, update the relevant doc and the code in the same pull request.
3. Announce user-visible changes in the "Site Feedback" board.

## Questions that are already answered

| Question | Answer | Where |
| --- | --- | --- |
| Which language for code, comments, and docs? | English | ADR-0006 |
| Which license? | MIT | ADR-0002 |
| Which framework? | Next.js 16 | ADR-0001 |
| Which database? | SQLite + Prisma | ADR-0003 |
| Real names required? | No; username only, email optional | `docs/00` |
| Anonymous posting? | No | `docs/01` |
