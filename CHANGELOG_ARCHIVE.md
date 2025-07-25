# Changelog Archive
## 2025-07-24
- 1609 Added kitbashing material generator and regenerated js/mats modules
- 1504 Split amphitheatre.js into smaller modules
- 1551 Added houseItems.js with 25 kitbashed furniture items


## 2025-07-24
- 1609 Added kitbashing material generator and regenerated js/mats modules
- 1504 Split amphitheatre.js into smaller modules
- 1551 Added houseItems.js with 25 kitbashed furniture items

## 2025-07-23
- 1621 Added "Use Animated Sprites" option with new sprite models and animations
- 2214 Break Game.js into smaller initialization modules for easier maintenance
- 1614 Move ground textures into assets/ground_textures and update references
- 0000 Rewrite mats.json to load building modules from `js/mats`

## 2025-07-22
- 2123 Add distinct biomes and tree types. The world now features five biomes: a central Grassland, Sand (Palm trees), Snow (Snowy Pine trees), Forest (Deciduous and Pine trees), and Dirt/Stone (Sparse, bare trees).
- 2122 Add music button and modal with scrollable song and collaborator lists

## 2025-07-21
- 2146 Update contribution guidelines in AGENTS files

- 2147 Convert lyrics display to canvas texture so it hides behind objects
- 2158 Update lyrics with corrected lines
- 2208 Rotate amphitheater seats 90 degrees counter-clockwise and update collision angles
- 2217 Use per-model bounding boxes for NPC collision detection
- 2223 Clarify changelog entry retention rules to allow unlimited current-day items

## 2025-07-17
- 2005 Compute amphitheater seat geometry bounds before adding to scene

## 2025-07-15
- 1210 Fix amphitheater seat collision by correctly positioning the seats and improving collision padding logic.
- 1205 Fix compass not displaying directions and add tweakable offset

## 2025-07-15
- 1200 Fix shopkeeper not spawning and improve interaction system performance

## 2025-06-26
- **7d0177a** Merge: extend MapUI to handle scene objects
- **d335b69** Use texture sampling for map terrain
- **858612b** Merge: load texture and update terrain rendering
- **c210851** Add static object markers to MapUI
- **08f04d4** Starting Point
- **cfb2ea7** Initial commit
- Add AGENTS.md with changelog and testing guidelines
- 2314 Add theme stylesheet and replace color constants

- 2118 Make AI builder asynchronous with progress indicator
- Document using the current UTC date when updating the changelog
- 1918 Revise character generator prompt for humanoid proportions and 3×3×3 size limit
- 1918 Prevent objects from spawning on top of players
- 1928 Add pyramid shape to builder tool

- 1958 Reserve spawn area so players don't load inside objects
- 1928 Add rotate and undo buttons to basic build mode
- 2018 Add map UI button and close control
- 2057 Rework character creator modal layout for clearer flow
- 2110 Fix build tool using undefined material index in object creator
- 2147 Add HouseBlocks mesh kit


- 2221 Document new agents directory and split instructions
- 2218 Fade chat bubbles before hiding
- 2214 Show sent chat immediately and keep log of messages
- 2309 Update remote players to run custom animations each frame
- 2257 Add animated player replace button and improved options styling
- 2242 Add options menu with asset downloader and glb analysis scripts

## 2025-06-27
- 1623 Fix stylesheet path in index.html
- 1742 Fix idle animation orientation for animated player model
- 1815 Hide mobile/desktop toggle and rely on auto-detection

## 2025-06-28
- 0100 Rig up running animation on Shift key press for animated player model.

## 2025-07-14
- 1818 Fix player asset replacement to avoid duplicate player model
- 1522 Fix HouseBlocks module loading error by merging it into starterHouse.js
- 1507 Break up worldGeneration.js into modular files

## 2025-07-15
- 1205 Fix compass not displaying directions and add tweakable offset
- 1200 Fix shopkeeper not spawning and improve interaction system performance
## 2025-07-23
- 1621 Added "Use Animated Sprites" option with new sprite models and animations
- 2214 Break Game.js into smaller initialization modules for easier maintenance
- 1614 Move ground textures into assets/ground_textures and update references
- 0000 Rewrite mats.json to load building modules from `js/mats`
