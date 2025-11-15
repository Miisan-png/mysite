// Current category state
let currentCategory = 'games';

// Bio texts for different categories
const bioTexts = {
    games: "Harro, i am azar, i code, eat food and enjoy retro games. I make game engines or random stuff.",
    jams: "Welcome to my game-jam journal, where i store all the good memories i made during game jams.."
};

// Load and display games
async function loadGames() {
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading games...</p></div>';

    try {
        // Fetch the list of game folders
        const indexResponse = await fetch('games/index.json');
        const indexData = await indexResponse.json();

        projectsGrid.innerHTML = '';

        // Load each game's data
        for (const gameName of indexData.projects) {
            try {
                const gameResponse = await fetch(`games/${gameName}/game.json`);
                const gameData = await gameResponse.json();

                const projectCard = createProjectCard(gameData, gameName, 'games');
                projectsGrid.appendChild(projectCard);
            } catch (error) {
                console.error(`Error loading game ${gameName}:`, error);
            }
        }

        if (projectsGrid.children.length === 0) {
            projectsGrid.innerHTML = '<p class="no-projects">No games found.</p>';
        }
    } catch (error) {
        console.error('Error loading games:', error);
        projectsGrid.innerHTML = '<p class="error-message">Failed to load games.</p>';
    }
}

// Load and display jams
async function loadJams() {
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading jams...</p></div>';

    try {
        // Fetch the list of jam folders
        const indexResponse = await fetch('jams/index.json');
        const indexData = await indexResponse.json();

        projectsGrid.innerHTML = '';

        // Load each jam's data
        for (const jamName of indexData.projects) {
            try {
                const jamResponse = await fetch(`jams/${jamName}/jam.json`);
                const jamData = await jamResponse.json();

                const projectCard = createProjectCard(jamData, jamName, 'jams');
                projectsGrid.appendChild(projectCard);
            } catch (error) {
                console.error(`Error loading jam ${jamName}:`, error);
            }
        }

        if (projectsGrid.children.length === 0) {
            projectsGrid.innerHTML = '<p class="no-projects">No jams found.</p>';
        }
    } catch (error) {
        console.error('Error loading jams:', error);
        projectsGrid.innerHTML = '<p class="error-message">Failed to load jams.</p>';
    }
}

// Create a project card element
function createProjectCard(data, name, category) {
    const card = document.createElement('a');
    card.className = 'project-card';
    card.href = `${category}/${name}/index.html`;

    // Generate tech badges HTML if tech array exists
    let techBadgesHTML = '';
    if (data.tech && data.tech.length > 0) {
        techBadgesHTML = '<div class="tech-stack">';
        data.tech.forEach(tech => {
            techBadgesHTML += `<span class="tech-badge">${tech}</span>`;
        });
        techBadgesHTML += '</div>';
    }

    card.innerHTML = `
        <img src="${category}/${name}/${data.preview}" alt="${data.title}" class="project-preview">
        ${techBadgesHTML}
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

    // Add click handlers for category toggle
    const categoryIcons = document.querySelectorAll('.category-icon');
    categoryIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            toggleCategory(icon.dataset.category);
        });
    });
});
