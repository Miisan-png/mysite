// Current category state
let currentCategory = 'games';

// Bio texts for different categories
const bioTexts = {
    games: "Harro, i am azar, i code, eat food and enjoy retro games. I make game engines or random stuff.",
    jams: "Welcome to my game-jam journal, where i store all the good memories i made during game jams.."
};

// Games data - Add your games here
const gamesData = {
    "celeste": {
        "title": "Celeste",
        "preview": "preview.png",
        "postcard": "postcard.png",
        "description": "A platforming adventure about climbing a mountain, from the creators of TowerFall. Brave hundreds of hand-crafted challenges, uncover devious secrets, and piece together the mystery of the mountain.",
        "links": [
            {
                "text": "Play on Steam",
                "url": "https://store.steampowered.com/app/504230/Celeste/"
            },
            {
                "text": "Visit Website",
                "url": "https://www.celestegame.com/"
            }
        ]
    }
};

// Jam data - Add your jam journal entries here
const jamsData = {
    "better_grounds": {
        "title": "Indie Game Jam 2025",
        "preview": "preview.png",
        "postcard": "postcard.png",
        "showcase": "showcase.png",
        "description": "An incredible experience at the APU Game Jam! Teamed up with talented developers and designers to create a game in just 48 hours. We pushed our limits, learned new techniques, and had an absolute blast bringing our creative vision to life. The energy, collaboration, and late-night coding sessions made this jam unforgettable. Huge thanks to everyone involved and the amazing APU community for making this happen!",
        "links": [
            {
                "text": "View Post on LinkedIn",
                "url": "https://www.linkedin.com/posts/azar-ali-8b6364280_apu-apugamedev-mypdti-activity-7322639089478905857-qfKQ"
            }
        ]
    },
    "indie_jam": {
        "title": "Indie Game Jam 2025",
        "preview": "preview.png",
        "postcard": "postcard.png",
        "showcase": "showcase.png",
        "description": "An incredible experience at the APU Game Jam! Teamed up with talented developers and designers to create a game in just 48 hours. We pushed our limits, learned new techniques, and had an absolute blast bringing our creative vision to life. The energy, collaboration, and late-night coding sessions made this jam unforgettable. Huge thanks to everyone involved and the amazing APU community for making this happen!",
        "links": [
            {
                "text": "View Post on LinkedIn",
                "url": "https://www.linkedin.com/posts/azar-ali-8b6364280_apu-apugamedev-mypdti-activity-7322639089478905857-qfKQ"
            }
        ]
    },
    "red_games_25": {
        "title": "Indie Game Jam 2025",
        "preview": "preview.png",
        "postcard": "postcard.png",
        "showcase": "showcase.png",
        "description": "An incredible experience at the APU Game Jam! Teamed up with talented developers and designers to create a game in just 48 hours. We pushed our limits, learned new techniques, and had an absolute blast bringing our creative vision to life. The energy, collaboration, and late-night coding sessions made this jam unforgettable. Huge thanks to everyone involved and the amazing APU community for making this happen!",
        "links": [
            {
                "text": "View Post on LinkedIn",
                "url": "https://www.linkedin.com/posts/azar-ali-8b6364280_apu-apugamedev-mypdti-activity-7322639089478905857-qfKQ"
            }
        ]
    },
    "um_jam_24": {
        "title": "Indie Game Jam 2025",
        "preview": "preview.png",
        "postcard": "postcard.png",
        "showcase": "showcase.png",
        "description": "An incredible experience at the APU Game Jam! Teamed up with talented developers and designers to create a game in just 48 hours. We pushed our limits, learned new techniques, and had an absolute blast bringing our creative vision to life. The energy, collaboration, and late-night coding sessions made this jam unforgettable. Huge thanks to everyone involved and the amazing APU community for making this happen!",
        "links": [
            {
                "text": "View Post on LinkedIn",
                "url": "https://www.linkedin.com/posts/azar-ali-8b6364280_apu-apugamedev-mypdti-activity-7322639089478905857-qfKQ"
            }
        ]
    }
};

// Load and display games
function loadGames() {
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = '';

    // Loop through each game and create a card
    for (const [gameName, gameData] of Object.entries(gamesData)) {
        const projectCard = createProjectCard(gameData, gameName, 'games');
        projectsGrid.appendChild(projectCard);
    }
}

// Load and display jams
function loadJams() {
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = '';

    // Loop through each jam and create a card
    for (const [jamName, jamData] of Object.entries(jamsData)) {
        const projectCard = createProjectCard(jamData, jamName, 'jams');
        projectsGrid.appendChild(projectCard);
    }
}

// Create a project card element
function createProjectCard(data, name, category) {
    const card = document.createElement('a');
    card.className = 'project-card';
    card.href = `${category}/${name}/index.html`;

    card.innerHTML = `
        <img src="${category}/${name}/${data.preview}" alt="${data.title}" class="project-preview">
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
