# Quick Reference Guide

## Default Sizing for All Projects

### Images
- **Default**: 70% width, centered
- **Screenshots**: Use `{70}` (same as default)
- **Large images**: Use `{80}` or `{90}`
- **Small images**: Use `{50}` or `{60}`

```markdown
![Screenshot 1](images/screenshot1.png){70}
![Team photo](images/team.png){70}
![Gameplay GIF](images/gameplay.gif){80}
```

### Videos
- **Default**: 70% width, centered, 16:9 ratio
- No size control needed - automatically matches image sizing

```markdown
[youtube](https://www.youtube.com/watch?v=VIDEO_ID)
```

### Postcard (Header Image)
- **Max width**: 900px
- **Max height**: 400px
- Automatically centered and sized

---

## Quick Template for Project Content

```markdown
# About [Project Name]

**[Project Name]** was created for [Event/Purpose]. Brief intro paragraph.

## Trailer/Demo Video

[youtube](https://www.youtube.com/watch?v=VIDEO_ID)

## Gameplay/Features

![Gameplay showcase](images/gameplay.gif){80}

## My Role

As the **[Your Role]**, I was responsible for:

* **Task 1**: Description
* **Task 2**: Description
* **Task 3**: Description

## Screenshots

![Screenshot 1](images/s1.png){70}

![Screenshot 2](images/s2.png){70}

![Screenshot 3](images/s3.png){70}

## Technical Stack

* **Engine**: Unity/Unreal/Godot
* **Programming**: C#/C++/Python
* **Tools**: List tools used
* **Development Time**: X days/weeks

---

*Optional closing thoughts*
```

---

## Common Sizes Reference

| Use Case | Size | Example |
|----------|------|---------|
| Screenshots | `{70}` | `![Screenshot](img.png){70}` |
| Team photos | `{70}` | `![Team](team.png){70}` |
| Gameplay GIFs | `{80}` | `![Gameplay](game.gif){80}` |
| Small diagrams | `{50}` | `![Diagram](diagram.png){50}` |
| Full width | `{90}` | `![Banner](banner.png){90}` |
| Videos | Auto 70% | `[youtube](URL)` |

---

## JSON Template

```json
{
    "title": "Project Name",
    "preview": "preview.png",
    "postcard": "postcard.png",
    "description": "One-line description that appears on the main page.",
    "tech": ["Unity", "C#", "HLSL", "Custom Shaders"],
    "links": [
        {
            "text": "Play Now",
            "url": "https://..."
        },
        {
            "text": "View Source",
            "url": "https://github.com/..."
        }
    ]
}
```

---

## File Checklist for New Project

- [ ] Create folder: `games/project_name/` or `jams/project_name/`
- [ ] Add `preview.png` (280x200px)
- [ ] Add `postcard.png` (900x400px max)
- [ ] Create `game.json` or `jam.json`
- [ ] Create `content.md` with detailed description
- [ ] Add images to `images/` subfolder
- [ ] Copy `index.html` from another project
- [ ] Update `games/index.json` or `jams/index.json`
