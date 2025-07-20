export async function loadProjectMetadata() {
    const projectTitleEl = document.getElementById('project-title');
    const projectDescriptionEl = document.getElementById('project-description');

    const defaultTitle = 'Terrain Walker';
    const defaultDescription = 'An interactive 3D terrain exploration experience built with Three.js. Explore a procedurally generated world with a dynamic day-night cycle.';

    if (window.websim) {
        try {
            const project = await window.websim.getCurrentProject();
            if (project && project.title) {
                document.title = project.title;
                if (projectTitleEl) projectTitleEl.textContent = project.title;
                if (projectDescriptionEl) projectDescriptionEl.textContent = project.description || defaultDescription;
            } else {
                 if (projectTitleEl) projectTitleEl.textContent = defaultTitle;
                 if (projectDescriptionEl) projectDescriptionEl.textContent = defaultDescription;
            }
        } catch (e) {
            console.error("Could not load project metadata", e);
            if (projectTitleEl) projectTitleEl.textContent = defaultTitle;
            if (projectDescriptionEl) projectDescriptionEl.textContent = defaultDescription;
        }
    } else {
        // Fallback for local development
        if (projectTitleEl) projectTitleEl.textContent = defaultTitle;
        if (projectDescriptionEl) projectDescriptionEl.textContent = defaultDescription;
    }
}