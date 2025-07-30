# Changelog

## 2025-07-30

- 1620 Reworked the Options menu Items tab to solve layout overflows and present a far more professional interface. The new stageItems module introduces simplified meshes for microphones, spotlights, speakers, and similar equipment built from existing stage materials. ItemPreview now merges these functions with the house items list and injects section headings so categories are clearly separated. Updated styles tighten flexbox widths, add responsive stacking rules, and define a category heading style, preventing text or previews from spilling beyond the modal while making the entire catalog easier to browse across device sizes.
- 1517 Expanded materials library with a new 'StageAssets' category containing twenty entries representing typical stage equipment. Each entry defines kitbashing module paths, local texture directories, and short descriptions for lights, cameras, speakers, rigging, and other props. Updated mats-generator.js to read mats.json from the json directory and regenerated all material modules. The resulting stage asset modules now reside under js/mats and can be imported by build tools. These additions allow the AI builder and manual placement systems to easily reference common performance equipment and give creators more options when populating venues.

- 1501 Refactored OptionsUI by extracting item preview functionality into a separate module called ItemPreview. The new class encapsulates preview initialization, event handling, animation control, and item rendering. OptionsUI now delegates preview setup to this class, trimming over one hundred lines from the file. This structural change improves readability and makes it easier to maintain or extend each feature independently. Existing behavior for toggling the preview remains consistent, but the codebase is now more modular.

- 1418 Updated amphitheater seating collisions so that each seat row segment is fully collidable and matches the stage platform's solidity. Added radial collision parameters to individual segments to correctly handle walking on curved tiers, preventing the player from falling through or clipping when traversing seats. Seat bases now register as barriers with stair properties so characters can smoothly step onto them while still interacting with prompts. These changes align seating behavior with the stage and provide a more consistent exploration experience throughout the amphitheater.


## Guidelines for future updates
- List changes in reverse chronological order (newest first).
- Use a heading for each version or date, followed by brief bullet points.
- Summaries should be short, highlighting major additions or fixes.