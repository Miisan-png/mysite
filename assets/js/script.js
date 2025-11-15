// Current category state
let currentCategory = 'games';

// Filter state
let activeTags = new Set();
let allProjects = [];

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
        allProjects = [];

        // Load each game's data
        for (const gameName of indexData.projects) {
            try {
                const gameResponse = await fetch(`games/${gameName}/game.json`);
                const gameData = await gameResponse.json();

                allProjects.push({ data: gameData, name: gameName, category: 'games' });
            } catch (error) {
                console.error(`Error loading game ${gameName}:`, error);
            }
        }

        // Build tag filter and display projects
        buildTagFilter();
        displayFilteredProjects();
    } catch (error) {
        console.error('Error loading games:', error);
        projectsGrid.innerHTML = '<p class="error-message">Failed to load games.</p>';
    }
}

// Load and display jams
async function loadJams() {
    const projectsGrid = document.getElementById('projects-grid');
    const filterContainer = document.getElementById('tag-filter-container');

    // Hide filter for jams
    filterContainer.style.display = 'none';

    // Show under construction message
    projectsGrid.innerHTML = '<p class="under-construction">under construction... I will finish coding this soon :PP</p>';

    /* Temporarily disabled
    projectsGrid.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading jams...</p></div>';

    try {
        // Fetch the list of jam folders
        const indexResponse = await fetch('jams/index.json');
        const indexData = await indexResponse.json();

        projectsGrid.innerHTML = '';
        allProjects = [];

        // Load each jam's data
        for (const jamName of indexData.projects) {
            try {
                const jamResponse = await fetch(`jams/${jamName}/jam.json`);
                const jamData = await jamResponse.json();

                allProjects.push({ data: jamData, name: jamName, category: 'jams' });
            } catch (error) {
                console.error(`Error loading jam ${jamName}:`, error);
            }
        }

        // Build tag filter and display projects
        buildTagFilter();
        displayFilteredProjects();
    } catch (error) {
        console.error('Error loading jams:', error);
        projectsGrid.innerHTML = '<p class="error-message">Failed to load jams.</p>';
    }
    */
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

    // Clear active filters when switching categories
    activeTags.clear();

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

// Build tag filter from loaded projects
function buildTagFilter() {
    const tagFilterContainer = document.getElementById('tag-filter');
    const filterContainer = document.getElementById('tag-filter-container');

    // Collect all unique tags
    const allTags = new Set();
    allProjects.forEach(project => {
        if (project.data.tech && project.data.tech.length > 0) {
            project.data.tech.forEach(tag => allTags.add(tag));
        }
    });

    // Show/hide filter container based on whether there are tags
    if (allTags.size === 0) {
        filterContainer.style.display = 'none';
        return;
    }
    filterContainer.style.display = 'block';

    // Clear existing tags
    tagFilterContainer.innerHTML = '';

    // Create tag buttons sorted alphabetically
    Array.from(allTags).sort().forEach(tag => {
        const tagButton = document.createElement('button');
        tagButton.className = 'tag-button';
        tagButton.textContent = tag;
        tagButton.dataset.tag = tag;

        tagButton.addEventListener('click', () => {
            toggleTag(tag);
        });

        tagFilterContainer.appendChild(tagButton);
    });
}

// Toggle a tag filter
function toggleTag(tag) {
    if (activeTags.has(tag)) {
        activeTags.delete(tag);
    } else {
        activeTags.add(tag);
    }

    // Update button states
    const tagButtons = document.querySelectorAll('.tag-button');
    tagButtons.forEach(button => {
        if (activeTags.has(button.dataset.tag)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    displayFilteredProjects();
}

// Display projects based on active filters
function displayFilteredProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = '';

    let filteredProjects = allProjects;

    // Filter by active tags if any
    if (activeTags.size > 0) {
        filteredProjects = allProjects.filter(project => {
            if (!project.data.tech || project.data.tech.length === 0) {
                return false;
            }
            // Project must have at least one of the active tags
            return project.data.tech.some(tag => activeTags.has(tag));
        });
    }

    // Display filtered projects
    if (filteredProjects.length === 0) {
        projectsGrid.innerHTML = '<p class="no-projects">No projects match the selected filters.</p>';
        return;
    }

    filteredProjects.forEach(project => {
        const projectCard = createProjectCard(project.data, project.name, project.category);
        projectsGrid.appendChild(projectCard);
    });
}

// Clear all filters
function clearAllFilters() {
    activeTags.clear();

    const tagButtons = document.querySelectorAll('.tag-button');
    tagButtons.forEach(button => {
        button.classList.remove('active');
    });

    displayFilteredProjects();
}

// Toggle filter visibility
function toggleFilterPanel() {
    const filterContent = document.getElementById('filter-content');
    const filterToggle = document.getElementById('filter-toggle');
    const arrow = filterToggle.querySelector('.arrow');

    filterContent.classList.toggle('open');

    if (filterContent.classList.contains('open')) {
        arrow.textContent = '▲';
    } else {
        arrow.textContent = '▼';
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

    // Add click handler for filter toggle button
    const filterToggleBtn = document.getElementById('filter-toggle');
    if (filterToggleBtn) {
        filterToggleBtn.addEventListener('click', toggleFilterPanel);
    }

    // Add click handler for clear filters button
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
});
