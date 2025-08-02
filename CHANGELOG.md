# Changelog

## 2025-08-01

1750 Added ability to manually rotate bestiary models via drag gestures. The bestiary preview container now listens for pointer events and rotates the active model based on horizontal and vertical mouse movement. Automatic rotation is disabled during dragging to give the player full control. The showNpcDetail method now recalculates the model's bounding box after scaling and directs the preview camera to its center, solving an issue where models were offset to one side of the viewport. Combined, these changes make the bestiary more immersive by presenting every creature in the middle of the window and letting users explore details by dragging.

1732 Rotated the amphitheater lighting rig 180 degrees so stage floodlights now shine north. This fix introduces a new tweakable 'rigRotationY' constant, applied to the trussGroup in amphitheatre.js. Previously the bar of floodlights faced south due to zero rotation, leaving the stage in shadow while blinding the audience. By setting rigRotationY to Math.PI we flip the entire bar without altering individual spotlight angles, allowing them to still tilt downward. Stage orientation and geometry remain unchanged, so existing placements and collision boxes continue to line up. Administrators can further tweak the constant if orientation needs adjustment in custom venues.

## Guidelines for future updates
- List changes in reverse chronological order (newest first).
- Use a heading for each version or date, followed by brief bullet points.
- Summaries should be short, highlighting major additions or fixes.