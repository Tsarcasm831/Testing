# Home Page Functionality (`index.html`)

The home page serves as the central hub and default view of the website. It is not a standalone HTML file but is rendered within the main `index.html` shell when no specific page is requested in the URL.

## Core Components
- **`index.html`**: The main document shell containing the header, navigation, content grid, and modal structure.
- **`js/main.js`**: The entry point for all JavaScript execution. It initializes the site, fetches the primary user data, and sets up the router.
- **`js/router.js`**: Manages page loading and URL changes. It directs the app to run the home page logic when the path is `/`.
- **`js/home.js`**: Contains the logic specific to the home page, including tab switching and data loading.
- **`js/api.js`**: Handles all communication with the external websim API to fetch dynamic data.
- **`js/ui.js`**: Contains all functions related to updating the DOM, such as rendering the content grid and handling the modal.
- **`js/state.js`**: Manages the application's state, including cached data for each tab, API cursors, and loading flags.

## Feature Breakdown

### 1. Initialization
When a user first lands on the site, `js/main.js` performs the following startup sequence:
1.  Fetches the creator's profile information using `websim.getCreator()`.
2.  Renders the main header with the creator's avatar, username, and bio.
3.  Initializes the router.
4.  The router identifies the page as the home page and triggers its handler.

### 2. Tabbed Interface
The home page features four primary content tabs:
- **PROJECTS**: The default view. Displays projects created by the user.
- **LIKES**: Displays projects the user has liked.
- **MODELS**: Displays a static collection of 3D models.
- **SUPPORT**: Displays a static page with donation links.

Switching tabs is handled by `js/home.js`. When a tab is clicked, the `switchTab` function:
- Updates the active state on the tab buttons.
- Clears the content grid.
- Checks if data for the selected tab is already in the `app.state` object.
- If data exists, it's rendered immediately.
- If not, it triggers the data loading process.

### 3. Dynamic Data Loading & Infinite Scroll
- **PROJECTS & LIKES tabs** fetch their data from the websim API.
- The `loadData` function in `js/home.js` calls the appropriate function in `js/api.js` (`fetchProjects` or `fetchLikes`).
- These API calls are paginated. The API returns a `cursor` which points to the next page of data. This cursor is stored in `app.state`.
- To create an "infinite scroll" effect, an `IntersectionObserver` is attached to the last item in the content grid. When that item scrolls into view, `loadData` is called again with the stored cursor to fetch and append the next batch of items.
- The API module (`js/api.js`) implements a simple session-based cache for the first page of results to speed up tab switching.

### 4. Static Content Tabs
- **MODELS tab**: This tab's content is not fetched from an API. It is defined as a static array of objects (`ns.staticModels`) within `js/state.js`. When the tab is activated, this array is rendered into the grid.
- **SUPPORT tab**: This tab displays a block of static HTML, also defined as a string (`ns.supportContent`) in `js/state.js`.

### 5. Modal View
- Clicking on any card in the `PROJECTS`, `LIKES`, or `MODELS` grid opens a modal window.
- The `openModal` function in `js/ui.js` is responsible for populating the modal.
- For **Projects/Likes**, it displays a large project image, the title, a markdown-parsed description, stats (views, likes, comments), and a link to the project on websim.com.
- For **Models**, it dynamically loads the `three.js` library and initializes a 3D viewer inside the modal using the `initModelViewer` function from `js/model_viewer.js`. This viewer allows the user to rotate and zoom the 3D model. The model files (`.glb`) are fetched and cached in the browser using the Cache API for faster subsequent loads.

