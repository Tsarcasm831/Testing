# R.I.P. (Re-hosting & Integration Protocol) Guide

This document provides a comprehensive guide for developers who wish to adapt and host this portfolio website on their own domain. Following these instructions will allow you to replace the existing "Lord Tsarcasm" content with your own, while keeping the functionality and aesthetic intact.

## Section 1: Core Configuration (Essential Changes)

These changes are critical for the site to function with your user profile.

### 1.1. Setting Your Creator Profile

The entire site is dynamically powered by a single creator's profile information fetched from the websim API. You must modify the code to point to your profile instead of the default.

**File to Edit:** `js/api.js`

Locate the `getCreator` function. You need to replace its contents to return a static object with your own websim profile information. The `window.websim.getCreator()` call will not work outside of the websim environment.

**Instructions:**

1.  Open `js/api.js`.
2.  Find the `getCreator` function.
3.  Replace the entire function with the following code, filling in your own details.

```javascript
// js/api.js

// ... existing code at the top ...

    const getCreator = async () => {
        // --- THIS IS THE SECTION TO EDIT ---
        // Replace the values below with your own websim profile information.
        // Your username will be used to fetch your projects and likes automatically.
        const myProfile = {
            _type: "user",
            // You can find your user ID in the URL of your websim profile page.
            id: "YOUR_WEBSIM_USER_ID", 
            username: "YourWebsimUsername",
            // This can be a link to your avatar or left as null.
            avatar_url: "https://images.websim.com/avatar/YourWebsimUsername",
            // This description supports Markdown.
            description: "This is a sample description. I create amazing things with code and sound. Welcome to my digital domain.",
            is_admin: false,
        };
        // --- END OF EDIT SECTION ---

        return Promise.resolve(myProfile);
    };

// ... rest of the file ...

