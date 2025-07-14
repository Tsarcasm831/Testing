# Repository Contribution Guidelines

Detailed instructions are stored in the `agents/` directory. Each file in that
folder expands on a specific workflow topic. Review `general.md` for coding and
commit conventions, `changelog.md` for log maintenance, and `testing.md` for
the test procedure before you start working.

- Update `CHANGELOG.md` with a short description for every change. If more
  context is needed, add it to the pull request description instead of the
  changelog.
- After every 10 changelog entries, move the oldest entry from
  `CHANGELOG.md` to `CHANGELOG_ARCHIVE.md` so the main file stays concise.
- Use the current UTC date for new changelog sections. Create the date heading
  with `date -u +%Y-%m-%d` and prefix each bullet underneath with an `HHMM`
  timestamp from `date -u +%H%M`.
- Run any available tests before committing, even if none exist yet, and note
  skipped tests in the pull request description.
- Keep commit messages short, in the present tense and under 72 characters.

