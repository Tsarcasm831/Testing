# Changelog

## 2025-08-03

1142 Introduced a dedicated video settings interface to centralize control of all screen-related features. Pressing the "v" key now opens a modal that pauses player input and presents administrative tools for updating the amphitheater's video source, removing the previously scattered controls from the general options panel. The component ships with its own stylesheet for consistent styling and is initialized through the UI manager alongside other HUD elements. By isolating video configuration in one place and gating the URL field to the existing admin account, maintainers no longer need to hunt through unrelated menus to manage playback, paving the way for future additions like volume or subtitle toggles without bloating the main options menu. This restructuring improves discoverability for routine show setups while reducing clutter for regular players.

## Guidelines for future updates
- List changes in reverse chronological order (newest first).
- Use a heading for each version or date, followed by brief bullet points.
- Summaries should be short, highlighting major additions or fixes.