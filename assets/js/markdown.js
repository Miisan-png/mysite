// Simple markdown parser for project details
function parseMarkdown(markdown) {
    if (!markdown) return '';

    // Escape HTML to prevent XSS
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    let html = markdown;

    // YouTube embeds (MUST be before regular links)
    html = html.replace(/\[youtube\]\(([^)]+)\)/g, (match, url) => {
        const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
        if (videoId) {
            return `<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`;
        }
        return match;
    });

    // Images with optional size control (MUST be before regular links)
    // Syntax: ![alt](image.png) or ![alt](image.png){width}
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)(?:\{(\d+)%?\})?/g, (match, alt, src, width) => {
        const styleAttr = width ? ` style="max-width: ${width}%;"` : '';
        return `<img src="${src}" alt="${alt}" class="content-image"${styleAttr} loading="lazy">`;
    });

    // Headers (must be before bold/italic)
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Links (after images and youtube)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code class="language-${lang || 'plaintext'}">${escapeHtml(code.trim())}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Lists (unordered)
    html = html.replace(/^\* (.+)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Lists (ordered)
    html = html.replace(/^\d+\. (.+)$/gim, '<li>$1</li>');

    // Blockquotes
    html = html.replace(/^> (.+)$/gim, '<blockquote>$1</blockquote>');

    // Horizontal rules
    html = html.replace(/^---$/gim, '<hr>');

    // Line breaks (double newline = paragraph break)
    html = html.split('\n\n').map(para => {
        // Don't wrap these elements in paragraphs
        if (para.match(/^<(h[1-3]|ul|ol|pre|blockquote|hr|div|img)/)) {
            return para;
        }
        // Skip empty paragraphs
        if (para.trim() === '') {
            return '';
        }
        return `<p>${para.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    return html;
}

// Load markdown file and convert to HTML
async function loadMarkdownContent(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) return null;

        const markdown = await response.text();
        return parseMarkdown(markdown);
    } catch (error) {
        console.error('Error loading markdown:', error);
        return null;
    }
}
