# Repository Contribution Guidelines

This repository maintains short guide files under the `agents/` directory.
Read them all before contributing:

- `general.md` – development workflow and commit guidance.
- `changelog.md` – how to record and archive changes.
- `testing.md` – required commands to run before committing.

Key points:

- Update `CHANGELOG.md` for every change using UTC dates and an `HHMM` prefix for each bullet.
- Keep only the most recent ten entries from previous days in `CHANGELOG.md`. Move older ones to `CHANGELOG_ARCHIVE.md`. Entries from the current UTC day may exceed this count.
- Run `npm test` or any project-specific tests before committing. Document test issues caused by environment limits in the pull request.

