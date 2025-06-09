# Contributor Guidelines

This repository stores a collection of static assets and JavaScript helpers. Follow these conventions when working here.

## Environment Setup
- Ensure **Node.js** is available. Check with `node --version`. If it is missing, install with `sudo apt-get update && sudo apt-get install -y nodejs`.
- Confirm **apt-utils** is installed with `apt-cache policy apt-utils`. Install it via `sudo apt-get install -y apt-utils` if necessary.

## Coding Style
- Use **2 spaces** for indentation in JavaScript, CSS, and HTML files.
- Prefer modern ES6 syntax when writing JavaScript.
- Document exported functions using JSDoc comments.

## Verification
- Run any `npm` tests if a `package.json` is present: `npm test`.
- Lint JavaScript with `npm run lint` if available.

## Pull Requests
- Summarize changes clearly in the PR description.
- Cite modified files and test results when applicable.

