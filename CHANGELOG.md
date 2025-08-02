# Changelog

## 2025-08-01

1732 Rotated the amphitheater lighting rig 180 degrees so stage floodlights now shine north. This fix introduces a new tweakable 'rigRotationY' constant, applied to the trussGroup in amphitheatre.js. Previously the bar of floodlights faced south due to zero rotation, leaving the stage in shadow while blinding the audience. By setting rigRotationY to Math.PI we flip the entire bar without altering individual spotlight angles, allowing them to still tilt downward. Stage orientation and geometry remain unchanged, so existing placements and collision boxes continue to line up. Administrators can further tweak the constant if orientation needs adjustment in custom venues.

## Guidelines for future updates
- List changes in reverse chronological order (newest first).
- Use a heading for each version or date, followed by brief bullet points.
- Summaries should be short, highlighting major additions or fixes.