# AGENTS

This repository hosts a simple static website for the Testing project. To minimize searching and keep contributions consistent, follow these guidelines whenever you modify files in this repo.

## Repository layout
- HTML pages live in the repository root (e.g., `index.html`, `art.html`, `music.html`, `shop.html`, etc.).
- Stylesheets are stored in `css/`.
- JavaScript files are stored in `js/`.
- Images and other assets can be found at the repository root or under `assets/`.

## Conventions
- Use **two spaces** for indentation; avoid tabs.
- End every file with a trailing newline.
- Keep lines under ~120 characters when possible.
- Use double quotes for HTML attributes and single quotes for JavaScript strings.
- Encode files as UTF-8.

## Workflow
1. Make your changes.
2. If a test suite becomes available, run `npm test` and ensure it passes. (Currently no tests are defined.)
3. Preview HTML pages in a browser to verify layout and links.
4. Run `git status` to review changes.
5. Commit using a clear, concise message.

## Adding Assets
- Place new images in `assets/` and reference them with relative paths.
- Optimize images before committing to keep the repository lightweight.

## Pull Request Guidelines
- Each pull request should focus on a single logical change.
- Mention any manual verification steps in the PR description.
- Ensure `git status` shows a clean worktree before submitting.

