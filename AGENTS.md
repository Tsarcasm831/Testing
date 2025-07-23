# Repository Contribution Guidelines

This repository maintains short guide files under the `agents/` directory.
Read them all before contributing:

- `general.md` – development workflow and commit guidance.
- `changelog.md` – how to record and archive changes.
- `testing.md` – required commands to run before committing.

Key points:

- Update `CHANGELOG.md` for every change using UTC-7 dates and an `HHMM` prefix for each bullet.
- `CHANGELOG.md` should contain only entries from the current UTC day. Move all older entries to `CHANGELOG_ARCHIVE.md`.
- Run `npm test` or any project-specific tests before committing. Document test issues caused by environment limits in the pull request.

