// Load project detail page
async function loadProjectDetail() {
    // Get project info from URL path
    const pathParts = window.location.pathname.split('/');
    const category = pathParts[pathParts.length - 3]; // 'games' or 'jams'
    const projectName = pathParts[pathParts.length - 2];

    const projectType = category === 'games' ? 'game' : 'jam';

    try {
        // Show loading state
        document.getElementById('detail-content').innerHTML = `
            <div class="detail-loading">
                <div class="spinner"></div>
                <p>Loading project details...</p>
            </div>
        `;

        // Load project JSON
        const response = await fetch(`${projectType}.json`);
        if (!response.ok) throw new Error('Failed to load project data');

        const projectData = await response.json();

        // Update page title
        document.title = `${projectData.title} - Azar (Miisan)`;

        // Populate header
        const header = document.getElementById('project-header');
        header.innerHTML = `
            <h1>${projectData.title}</h1>
            ${projectData.postcard ? `<img src="${projectData.postcard}" alt="${projectData.title}" class="project-postcard" loading="eager">` : ''}
            ${projectData.links && projectData.links.length > 0 ? `
                <div class="project-links">
                    ${projectData.links.map(link => `
                        <a href="${link.url}" class="project-link" target="_blank" rel="noopener noreferrer">
                            ${link.text}
                        </a>
                    `).join('')}
                </div>
            ` : ''}
        `;

        // Populate content
        const content = document.getElementById('detail-content');
        let contentHtml = '';

        // Add description if available
        if (projectData.description) {
            contentHtml += `<div class="project-description">${projectData.description}</div>`;
        }

        // Try to load markdown content
        const markdownHtml = await loadMarkdownContent('content.md');
        if (markdownHtml) {
            contentHtml += `<div class="markdown-content">${markdownHtml}</div>`;
        }

        // Add showcase image if available (for jams)
        if (projectData.showcase) {
            contentHtml += `
                <div class="showcase-section">
                    <img src="${projectData.showcase}" alt="${projectData.title} showcase" class="showcase-image" loading="lazy">
                </div>
            `;
        }

        // Add additional images if specified
        if (projectData.images && projectData.images.length > 0) {
            contentHtml += `
                <div class="image-gallery">
                    ${projectData.images.map(img => `
                        <img src="${img}" alt="${projectData.title}" class="gallery-image" loading="lazy">
                    `).join('')}
                </div>
            `;
        }

        content.innerHTML = contentHtml || '<p class="no-projects">No additional content available.</p>';

    } catch (error) {
        console.error('Error loading project:', error);
        document.getElementById('detail-content').innerHTML = `
            <div class="error-message">
                <p>Failed to load project details. Please try again later.</p>
            </div>
        `;
    }
}

// Set up back button
function setupBackButton() {
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            // Check if there's history to go back to
            if (document.referrer.includes(window.location.origin)) {
                e.preventDefault();
                window.history.back();
            }
            // Otherwise, let the href handle navigation
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    setupBackButton();
    loadProjectDetail();
});
