# Kinjo (近所): a little neighborhood within our school

The public name is **Kinjo**, meaning neighborhood. People can share hallways without knowing one another; Kinjo makes room for conversations beyond their usual circles. The character 近 also quietly connects the name to Kindai. The project is independent and student-run, rather than an official school channel.

Kinjo is simply another place to be. Questions, ideas, and useful information remain discoverable beyond fast-moving chat histories. The community gives the neighborhood its character. The bilingual `/about` page presents this philosophy to readers.

## Design

Kinjo builds on the rounded campus commons redesign, not AQUA POP. Warm paper, soft leafy green, blue houses, and a small golden sun give the interface a neighborhood atmosphere. Dark mode becomes the same neighborhood after sunset. The wordmark, arch-shaped badge, and tab icon use the new identity; original project attribution and school disclaimers remain.

The streetscape is decorative HTML/CSS/SVG with no external images or fonts. A message floats gently and a dotted path moves for two cycles. Chart bars animate on entry or range changes. Reduced-motion settings disable these effects.

## Charts

The activity chart switches between 7 and 14 days. It counts non-deleted posts and replies in non-deleted threads, grouped into calendar days in Japan Standard Time. Zero days remain zero. The server reads only timestamps from the previous fourteen days; no account identifiers or post text are sent to the chart. Hovering or focusing a bar exposes its count, and range changes announce the total.

The board chart shows the four active boards with the most visible threads and links to their pages. It measures thread counts, not online users or views. Existing announcement rows and user-written content keep their historical wording; new starter announcements use Kinjo.

Validate English and Japanese, light and dark themes, narrow phones and desktop, chart range controls, keyboard behavior, reduced motion, and empty data. The date-bucketing tests cover JST midnight and quiet days.
