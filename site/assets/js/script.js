// Current category state
let currentCategory = 'games';

// Bio texts for different categories
const bioTexts = {
    games: "Harro, i am azar, i code, eat food and enjoy retro games. I make game engines or random stuff.",
    jams: "Welcome to my game-jam journal, where i store all the good memories i made during game jams.."
};

// Cache for loaded project data
const projectCache = {
    games: null,
    jams: null
};

// Show loading state
function showLoading() {
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading projects...</p></div>';
}

// Show error state
function showError(message) {
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = `<div class="error-message"><p>⚠ ${message}</p></div>`;
}

// Fetch project data from JSON
async function fetchProjectData(category) {
    // Return cached data if available
    if (projectCache[category]) {
        return projectCache[category];
    }

    try {
        // Fetch the index file to get list of projects
        const indexResponse = await fetch(`${category}/index.json`);
        if (!indexResponse.ok) throw new Error(`Failed to load ${category} index`);

        const indexData = await indexResponse.json();
        const projects = {};

        // Fetch each project's JSON file
        const projectType = category === 'games' ? 'game' : 'jam';
        for (const projectName of indexData.projects) {
            const projectResponse = await fetch(`${category}/${projectName}/${projectType}.json`);
            if (projectResponse.ok) {
                projects[projectName] = await projectResponse.json();
            } else {
                console.warn(`Failed to load ${projectName}`);
            }
        }

        // Cache the data
        projectCache[category] = projects;
        return projects;
    } catch (error) {
        console.error(`Error loading ${category}:`, error);
        throw error;
    }
}

// Load and display games
async function loadGames() {
    showLoading();

    try {
        const gamesData = await fetchProjectData('games');
        const projectsGrid = document.getElementById('projects-grid');
        projectsGrid.innerHTML = '';

        // Loop through each game and create a card
        for (const [gameName, gameData] of Object.entries(gamesData)) {
            const projectCard = createProjectCard(gameData, gameName, 'games');
            projectsGrid.appendChild(projectCard);
        }

        // Show message if no games found
        if (Object.keys(gamesData).length === 0) {
            projectsGrid.innerHTML = '<p class="no-projects">No games available yet.</p>';
        }
    } catch (error) {
        showError('Failed to load games. Please try again later.');
    }
}

// Load and display jams
async function loadJams() {
    showLoading();

    try {
        const jamsData = await fetchProjectData('jams');
        const projectsGrid = document.getElementById('projects-grid');
        projectsGrid.innerHTML = '';

        // Loop through each jam and create a card
        for (const [jamName, jamData] of Object.entries(jamsData)) {
            const projectCard = createProjectCard(jamData, jamName, 'jams');
            projectsGrid.appendChild(projectCard);
        }

        // Show message if no jams found
        if (Object.keys(jamsData).length === 0) {
            projectsGrid.innerHTML = '<p class="no-projects">No jam entries available yet.</p>';
        }
    } catch (error) {
        showError('Failed to load jam entries. Please try again later.');
    }
}

// Create a project card element
function createProjectCard(data, name, category) {
    const card = document.createElement('a');
    card.className = 'project-card';
    card.href = `${category}/${name}/index.html`;

    const techBadges = data.tech ? `
        <div class="tech-stack">
            ${data.tech.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
        </div>
    ` : '';

    card.innerHTML = `
        <img src="${category}/${name}/${data.preview}" alt="${data.title}" class="project-preview">
        ${techBadges}
        <div class="project-overlay">
            <h3 class="project-title">${data.title}</h3>
        </div>
    `;

    return card;
}

// Toggle between categories
function toggleCategory(category) {
    currentCategory = category;

    const categoryIcons = document.querySelectorAll('.category-icon');
    const descriptionElement = document.querySelector('.description');

    // Update active state of icons
    categoryIcons.forEach(icon => {
        if (icon.dataset.category === category) {
            icon.classList.add('active');
        } else {
            icon.classList.remove('active');
        }
    });

    // Update bio text
    if (descriptionElement) {
        descriptionElement.textContent = bioTexts[category];
    }

    // Load appropriate content
    if (category === 'games') {
        loadGames();
    } else if (category === 'jams') {
        loadJams();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadGames();

    // Add click and keyboard handlers for category toggle
    const categoryIcons = document.querySelectorAll('.category-icon');
    categoryIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            toggleCategory(icon.dataset.category);
        });

        // Add keyboard support (Enter and Space)
        icon.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCategory(icon.dataset.category);
            }
        });
    });
});
