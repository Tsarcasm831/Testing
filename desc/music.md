# Music Page Functionality (`music.html`)

The Music page serves as a comprehensive hub for the artist's musical work, including recent releases, a searchable catalog, and links to various streaming platforms.

## Core Components
- **`music.html`**: The HTML structure for the page, loaded dynamically by the router.
- **`js/pages/music.js`**: Contains all the client-side logic for fetching, rendering, and interacting with the song catalog.
- **`/songs/*.json`**: A set of static JSON files that contain the song catalog data, split alphabetically.
- **`css/music.css`**: Provides specific styling for the music page elements.

## Feature Breakdown

### 1. Page Structure
The page is organized into several distinct sections:
- **Navigation**: A link to `upcoming_music.html` is provided for users interested in future releases.
- **Featured Releases**: A static, manually updated section at the top showcasing the latest or most important tracks.
- **Song Catalog**: A dynamic and interactive section that constitutes the core of the page.
- **Platform Sections**: A grid of cards linking to the artist's profiles on external platforms like Suno, YouTube, and Spotify. This section also includes an embedded YouTube video.

### 2. Dynamic Song Catalog
This is the most complex feature of the page.
1.  **Data Fetching**: The `fetchAllSongs` function in `js/pages/music.js` asynchronously fetches all JSON files located in the `/songs/` directory. It uses `Promise.all` to fetch them in parallel for efficiency.
2.  **Data Aggregation**: Once all files are fetched, their contents (arrays of song objects) are merged into a single, large array.
3.  **Sorting**: The combined array is then sorted alphabetically by `song_title` to ensure a consistent and user-friendly order.
4.  **Rendering**: The `renderSongs` function takes the sorted array and generates the HTML for the song list. Each song is rendered as a `.song-catalog-item` containing the title and direct links to its page on Spotify, YouTube, and Apple Music.

### 3. User Interaction
- **Search Functionality**: An input field (`#song-search-input`) allows users to filter the catalog in real-time. An `input` event listener triggers a filter on the master song array and re-renders the list with matching results. The filtering is case-insensitive.
- **Export Functionality**:
    - **Full Catalog**: A button allows the user to download the entire aggregated and sorted song catalog as a single `lord_tsarcasm_song_catalog.json` file. This is achieved by creating a JSON string from the data, converting it to a `Blob`, creating an object URL, and triggering a download via a temporary `<a>` element.
    - **Separated Files**: The script also dynamically creates buttons for each of the original source JSON files (e.g., `songs_a_e.json`). Clicking these buttons fetches the specific file and allows the user to download it directly.

### 4. Styling and Aesthetics
- The page adheres to the site's overall cyberpunk theme, using styles from `css/music.css`.
- The song catalog is presented in a scrollable container with a custom scrollbar to handle the potentially long list of songs.
- Hover effects on song items and links provide visual feedback to the user, often involving the site's signature cyan glow.

