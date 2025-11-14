# Portfolio Website

A modern, dynamic portfolio website for showcasing games and game jam projects.

## Features

- **Dynamic Content Loading**: Projects are loaded from JSON files
- **Loading States**: Visual feedback while content loads
- **Markdown Support**: Write detailed project descriptions in Markdown
- **Image Galleries**: Support for multiple images per project
- **Responsive Design**: Works on all device sizes
- **Keyboard Accessible**: Full keyboard navigation support
- **Smooth Animations**: Fade-in effects and hover states

## Project Structure

```
Portfolio Website/
├── index.html              # Main portfolio page
├── assets/
│   ├── css/
│   │   ├── style.css       # Main page styles
│   │   └── detail.css      # Project detail page styles
│   └── js/
│       ├── script.js       # Main page logic
│       ├── detail.js       # Project detail page logic
│       └── markdown.js     # Markdown parser
├── games/
│   ├── index.json          # List of game projects
│   └── [project-name]/
│       ├── index.html      # Auto-generated detail page
│       ├── game.json       # Project metadata
│       ├── content.md      # Detailed description (optional)
│       ├── preview.png     # Thumbnail for grid
│       ├── postcard.png    # Header image
│       └── [images...]     # Additional screenshots
└── jams/
    ├── index.json          # List of jam projects
    └── [project-name]/
        ├── index.html      # Auto-generated detail page
        ├── jam.json        # Project metadata
        ├── content.md      # Detailed description (optional)
        ├── preview.png     # Thumbnail for grid
        ├── postcard.png    # Header image
        ├── showcase.png    # Additional showcase image
        └── [images...]     # Additional screenshots
```

## Adding a New Game

1. Create a new folder in `games/` with your game's name (use lowercase, no spaces)
2. Copy the `detail.html` template into your folder as `index.html`
3. Create a `game.json` file with this structure:

```json
{
    "title": "Your Game Name",
    "preview": "preview.png",
    "postcard": "postcard.png",
    "description": "Short description of your game.",
    "links": [
        {
            "text": "Play Now",
            "url": "https://your-game-link.com"
        }
    ]
}
```

4. Add your images:
   - `preview.png` - Thumbnail shown in the grid (280x200px recommended)
   - `postcard.png` - Large header image for the detail page

5. (Optional) Create a `content.md` file for detailed description with markdown formatting

6. Add your game's folder name to `games/index.json`:

```json
{
    "projects": [
        "existing-game",
        "your-new-game"
    ]
}
```

## Adding a New Jam Entry

Same process as games, but in the `jams/` folder and use `jam.json` instead of `game.json`. Jam entries can also include a `showcase.png` for additional visuals.

## Markdown Content

Create a `content.md` file in any project folder to add detailed content:

```markdown
# Main Heading

Your detailed project description goes here.

## Features

* Feature 1
* Feature 2
* Feature 3

## Screenshots

![Alt text](screenshot1.png)
![Alt text](screenshot2.png)

## Development

You can add **bold text**, *italic text*, [links](https://example.com), and more!
```

### Supported Markdown

- Headers (# ## ###)
- Bold (**text**)
- Italic (*text*)
- Links ([text](url))
- Images (![alt](url) or ![alt](url){width})
- YouTube videos ([youtube](video_url))
- Code blocks (\`\`\`code\`\`\`)
- Inline code (\`code\`)
- Lists (* item)
- Blockquotes (> text)
- Horizontal rules (---)

## Image & Media Guidelines

### Preview Images (Grid Thumbnails)
- Size: 280x200px or similar aspect ratio
- Format: PNG or JPG
- Show key visual from your project

### Postcard Images (Detail Page Header)
- Max width: 900px
- Max height: 400px
- Format: PNG or JPG
- High quality banner image
- Automatically centered

### Content Images (Default Sizing)
- **Default**: 70% width, centered
- **Custom size**: Add `{60}` for 60% width (or any percentage)
- Format: PNG, JPG, or GIF
- Examples:
  ```markdown
  ![Screenshot](image.png)        // 70% width (default)
  ![Screenshot](image.png){50}    // 50% width
  ![Screenshot](image.png){90}    // 90% width
  ```

### YouTube Videos (Default Sizing)
- **Default**: 70% width, centered, 16:9 aspect ratio
- Embed with: `[youtube](https://www.youtube.com/watch?v=VIDEO_ID)`
- Automatically responsive on mobile (90% on tablet, 100% on phone)

## Customization

### Colors

The main accent color is `#ff4d6d`. To change it, search and replace in:
- `assets/css/style.css`
- `assets/css/detail.css`

### Fonts

Currently uses: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`

To change, update the `font-family` in `assets/css/style.css`

## Browser Support

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅

## Development Notes

- The website loads data asynchronously from JSON files
- Images are lazy-loaded for better performance
- All external links open in new tabs with security attributes
- Category switching uses smooth transitions with loading states
- Focus styles ensure keyboard accessibility

## Tips

1. Keep JSON files properly formatted (use a validator)
2. Optimize images before uploading (compress for web)
3. Use descriptive alt text for accessibility
4. Test on multiple devices/browsers
5. Keep project folder names URL-friendly (lowercase, hyphens)

## Future Enhancements

Consider adding:
- Search/filter functionality
- Tags/categories for projects
- Lightbox for images
- Blog section
- Contact form
- Analytics
