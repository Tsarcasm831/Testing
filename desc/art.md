# Art Page Functionality (`art.html`)

The Art page is an unconventional page that serves a dual purpose: it thematically represents a "corrupted" part of the site and contains a hidden easter egg to unlock the Shop page.

## Core Components
- **`art.html`**: The HTML structure for the page.
- **`js/pages/art.js`**: Contains the logic for the "corrupted data" animation and the secret code detection.
- **`css/art.css`**: Provides extensive styling for the glitched text and error message aesthetic.
- **`js/router.js`**: Handles the navigation to the Shop page once unlocked.
- **`js/ui.js`**: Provides the `TextScramble` utility and the `showShopTab` function.

## Feature Breakdown

### 1. "Corrupted Archive" Theme
The primary purpose of the page from a user experience perspective is to present a fictional error.
1.  **Scramble Animation**: Like the "About Me" page, it uses the `TextScramble` utility to display a series of messages. However, these messages indicate failure (e.g., `SIGNAL INTERRUPTED...`, `CONNECTION FAILED...`).
2.  **Error Display**: After the intro animation, the final content fades in. This content is not artwork, but a stylized error report. It includes a `[// VISUAL ARCHIVE CORRUPTED //]` message, an error log, and a witty, in-character sign-off.
3.  **Advanced Glitch Styling**: The styling in `css/art.css` is highly detailed. It uses CSS animations with `clip-path` and pseudo-elements to create a convincing, animated glitch effect on the main error text, making it appear unstable and fractured. The container itself cycles through different glowing colors to enhance the effect.

### 2. Easter Egg: The Numpad Code
The page's secondary, hidden function is to act as a gateway to the secret Shop.
1.  **Event Listener**: When the Art page loads, `initArtPage` in `js/pages/art.js` attaches a `keydown` event listener to the document.
2.  **Code Detection**: This listener is specifically configured to only react to key presses originating from the keyboard's number pad (`e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD`). It listens for the specific key sequence "1" followed by "7".
3.  **Unlocking the Shop**:
    -   When the correct "17" sequence is detected, the `shopUnlocked` flag in `app.state` is set to `true`.
    -   `ns.ui.showShopTab()` is called, which dynamically adds the "SHOP" link to the main navigation bar.
    -   `ns.router.loadPage('shop')` is immediately called, navigating the user to the newly unlocked page.

### 3. State Management and Cleanup
- The `shopUnlocked` state is designed to be temporary. Navigating away from the shop page resets this flag.
- To prevent the numpad code from being active on other pages, the router is configured to run a `cleanupArtPage` function when the user navigates away from `/art`. This function removes the `keydown` event listener, ensuring the easter egg is isolated to the Art page.