#!/usr/bin/env python3
"""
Portfolio Website Generator

This script automatically generates HTML pages for all game and jam projects
based on the game.json/jam.json files in each directory.

Usage:
    python generate_site.py
"""

import json
import os
from pathlib import Path


def load_template(template_path):
    """Load the HTML template file."""
    with open(template_path, 'r', encoding='utf-8') as f:
        return f.read()


def load_data(data_path, data_type='game'):
    """Load project data from game.json or jam.json."""
    json_filename = f'{data_type}.json'
    json_path = data_path / json_filename
    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def generate_links_html(links):
    """Generate HTML for project links."""
    links_html = []
    for link in links:
        link_html = f'<a href="{link["url"]}" class="game-link" target="_blank" rel="noopener noreferrer">{link["text"]}</a>'
        links_html.append(link_html)
    return '\n                    '.join(links_html)


def generate_page(name, data, template):
    """Generate HTML page for a single project (game or jam)."""
    # Replace placeholders in template
    html = template.replace('{{TITLE}}', data['title'])
    html = html.replace('{{POSTCARD}}', data['postcard'])
    html = html.replace('{{DESCRIPTION}}', data['description'])

    # Generate links HTML
    if 'links' in data and data['links']:
        links_html = generate_links_html(data['links'])
    else:
        links_html = ''

    html = html.replace('{{LINKS}}', links_html)

    return html


def update_javascript_data(games_dir, jams_dir, js_path):
    """Update the JavaScript file with game and jam data."""
    games = {}
    jams = {}

    # Scan all game directories
    for game_dir in games_dir.iterdir():
        if game_dir.is_dir() and (game_dir / 'game.json').exists():
            game_name = game_dir.name
            game_data = load_data(game_dir, 'game')
            games[game_name] = game_data

    # Scan all jam directories
    if jams_dir.exists():
        for jam_dir in jams_dir.iterdir():
            if jam_dir.is_dir() and (jam_dir / 'jam.json').exists():
                jam_name = jam_dir.name
                jam_data = load_data(jam_dir, 'jam')
                jams[jam_name] = jam_data

    # Generate JavaScript content
    js_content = """// Current category state
let currentCategory = 'games';

// Bio texts for different categories
const bioTexts = {
    games: "Harro, i am azar, i code, eat food and enjoy retro games. I make game engines or random stuff.",
    jams: "Welcome to my game-jam journal, where i store all the good memories i made during game jams.."
};

// Games data - Add your games here
"""
    js_content += "const gamesData = " + json.dumps(games, indent=4) + ";\n\n"
    js_content += "// Jam data - Add your jam journal entries here\n"
    js_content += "const jamsData = " + json.dumps(jams, indent=4) + ";\n\n"

    # Add the rest of the JavaScript code
    js_content += """// Load and display games
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
"""

    # Write to JavaScript file
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(js_content)


def main():
    """Main function to generate all game and jam pages."""
    # Setup paths
    script_dir = Path(__file__).parent
    games_dir = script_dir / 'games'
    jams_dir = script_dir / 'jams'
    game_template_path = script_dir / 'game_template.html'
    jam_template_path = script_dir / 'jam_template.html'
    js_path = script_dir / 'assets' / 'js' / 'script.js'

    # Check if templates exist
    if not game_template_path.exists():
        print(f"Error: Game template file not found at {game_template_path}")
        return

    if not jam_template_path.exists():
        print(f"Error: Jam template file not found at {jam_template_path}")
        return

    # Load templates
    print("Loading templates...")
    game_template = load_template(game_template_path)
    jam_template = load_template(jam_template_path)

    # Process each game directory
    print("\nGenerating game pages...")
    games_processed = 0

    if games_dir.exists():
        for game_dir in games_dir.iterdir():
            if game_dir.is_dir() and (game_dir / 'game.json').exists():
                game_name = game_dir.name
                print(f"  Processing game: {game_name}")

                try:
                    # Load game data
                    game_data = load_data(game_dir, 'game')

                    # Generate HTML
                    html = generate_page(game_name, game_data, game_template)

                    # Write HTML file
                    output_path = game_dir / 'index.html'
                    with open(output_path, 'w', encoding='utf-8') as f:
                        f.write(html)

                    print(f"    ✓ Generated {output_path}")
                    games_processed += 1

                except Exception as e:
                    print(f"    ✗ Error processing {game_name}: {e}")

    # Process each jam directory
    print("\nGenerating jam pages...")
    jams_processed = 0

    if jams_dir.exists():
        for jam_dir in jams_dir.iterdir():
            if jam_dir.is_dir() and (jam_dir / 'jam.json').exists():
                jam_name = jam_dir.name
                print(f"  Processing jam: {jam_name}")

                try:
                    # Load jam data
                    jam_data = load_data(jam_dir, 'jam')

                    # Generate HTML
                    html = generate_page(jam_name, jam_data, jam_template)

                    # Write HTML file
                    output_path = jam_dir / 'index.html'
                    with open(output_path, 'w', encoding='utf-8') as f:
                        f.write(html)

                    print(f"    ✓ Generated {output_path}")
                    jams_processed += 1

                except Exception as e:
                    print(f"    ✗ Error processing {jam_name}: {e}")

    # Update JavaScript data
    print("\nUpdating JavaScript data...")
    try:
        update_javascript_data(games_dir, jams_dir, js_path)
        print(f"  ✓ Updated {js_path}")
    except Exception as e:
        print(f"  ✗ Error updating JavaScript: {e}")

    # Summary
    print(f"\n{'='*50}")
    print(f"Generation complete!")
    print(f"  Games processed: {games_processed}")
    print(f"  Jams processed: {jams_processed}")
    print(f"{'='*50}")


if __name__ == '__main__':
    main()
