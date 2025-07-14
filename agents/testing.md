Testing Before Commit
=====================

- Run `npm test` or any project-specific test command before every commit.
- Install dependencies with `npm install` if required and ensure Node.js 18 or newer is being used.
- If tests fail due to missing dependencies or environment limitations, document the problem in the pull request body.
- When no formal tests exist, manually verify that the application starts without errors and note the manual steps taken.
- Do not commit with failing tests unless the failure is unrelated and thoroughly documented.
