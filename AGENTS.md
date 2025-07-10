# Contributor Guidelines

Follow these instructions when working in this repository.

## Environment Setup
- Ensure **Node.js** is available. Check with `node --version`.
- If a `package.json` is present, run `npm install` before testing.

## Coding Style
- Use **2 spaces** for indentation in JavaScript, CSS, and HTML files under `src/`.
- Prefer modern ES6 module syntax.
- Document exported functions with JSDoc when possible.

## Verification
- Run `npm test` if defined in `package.json`.
- Lint code with `npm run lint` when the script exists.

## Pull Requests
- Summarize changes clearly in the PR description.
- Reference modified files using repository-relative paths.
- Update `devlog.md` with a short entry describing your changes.
