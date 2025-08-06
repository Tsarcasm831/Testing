# About Me Page Functionality (`about_me.html`)

The "About Me" page provides a stylized, narrative-driven biography of the creator, presented as a classified dossier being decrypted in real-time.

## Core Components
- **`about_me.html`**: The HTML structure for the page, loaded by the router.
- **`js/pages/about.js`**: Contains the logic for the page's animations and content rendering.
- **`js/ui.js`**: Provides the `TextScramble` and `typewriterEffect` utility classes/functions used for the page's dynamic text effects.
- **`css/about.css`**: Defines the unique styling for the dossier, text effects, and overall layout of the page.

## Feature Breakdown

### 1. Animated Introduction
The page does not display its content immediately. Instead, it engages the user with a multi-stage animation to build atmosphere:
1.  **Text Scramble**: The `runFullAnimation` function in `js/pages/about.js` is initiated. It uses the `TextScramble` utility to display a series of "decrypting" messages (e.g., `SUBJECT: LORD TSARCASM`, `STATUS: DECRYPTING...`). Each line appears sequentially with a "glitching" text effect.
2.  **Fade Transition**: After the scramble animation completes, the "datastream" element fades out, and the main dossier content container fades in, creating a seamless transition from the intro to the main content.

### 2. Dossier Structure
The main content is presented as a "dossier" with a distinct visual identity defined in `css/about.css`.
- The dossier is divided into themed sections like `IDENTITY ASSESSMENT`, `OPERATIONAL DIRECTIVES`, and `CORE MATRIX`.
- Each section is revealed sequentially with a fade-and-slide-up animation to control the flow of information.
- Within each section, individual data points (`.dossier-item`) are also animated, appearing one by one after the section title is visible.

### 3. Typewriter Effect for Personal Log
A key feature is the "Personal Log" entry. Instead of just appearing, its content is typed out character by character using the `typewriterEffect` utility.
- This creates a more personal and dynamic feel, as if the log is being written or recalled in real time.
- A blinking cursor is appended to the end of the text after it finishes typing, enhancing the terminal aesthetic.

### 4. Content and Styling
- The content provides biographical information in a stylized, in-character voice (e.g., "Psych Profile," "Operational Directives").
- Certain information is marked as `[REDACTED]` for thematic effect.
- The styling in `css/about.css` is crucial, using a dark palette, monospace fonts, and glowing highlights to evoke the feeling of a futuristic, classified computer interface.
- A section for supporting the creator, with PayPal and Venmo links, is also included at the bottom of the dossier.

