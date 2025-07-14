Changelog Updates
=================

- Record each change briefly in `CHANGELOG.md`. Start each bullet with the
  `HHMM` timestamp followed by a short sentence describing the update.
- Keep only the most recent 10 bullet entries in `CHANGELOG.md` so readers can
  scan the latest work quickly.
- Move older entries to `CHANGELOG_ARCHIVE.md`, preserving the same bullet
  format and date heading.
- Group multiple updates from the same day under a single date heading.
- When creating a new date heading, place it at the top so entries remain in
  reverse chronological order.
- Use UTC for dates and times. Example commands:
  - `date -u +%Y-%m-%d` for the date heading.
  - `date -u +%H%M` for the bullet prefix.
- Always update the changelog before committing to keep history consistent.
