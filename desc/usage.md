# Websim API Usage Guide

This document provides a detailed guide on how to interact with the websim API through the helper functions available in the `js/api.js` module. The API provides access to user data, projects, likes, and comments.

## 1. Overview & Authentication

The API helper functions handle direct communication with the websim backend. Authentication is managed automatically through the user's session within the `window.websim` environment. All you need to do is call the provided asynchronous functions.

## 2. Core Functions

The `js/api.js` module exposes several key functions:

### `getCreator()`

This is the most fundamental function and should be called first. It retrieves the user object for the creator of the profile page.

**Usage:**

```javascript
import { app } from './app.js';

async function initialize() {
    const creator = await app.api.getCreator();

    if (!creator) {
        console.error("Could not retrieve creator information.");
        return;
    }

    console.log(`Creator found: @${creator.username}`);
    // Use the creator object for subsequent API calls.
}

