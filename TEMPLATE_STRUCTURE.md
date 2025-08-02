# FastAPI Portfolio Template Structure

This document explains the new segregated template structure following FastAPI best practices.

## Directory Structure

```
app/
├── templates/
│   ├── base.html                 # Base template with common structure
│   ├── index.html               # Main portfolio page (extends base)
│   ├── components/              # Reusable components
│   │   ├── header.html          # Navigation header
│   │   └── footer.html          # Footer with social links
│   ├── sections/                # Individual content sections
│   │   ├── hero.html            # Hero section with typewriter
│   │   ├── about.html           # About section
│   │   ├── tech-stack.html      # Tech stack with filtering
│   │   ├── projects.html        # Projects grid
│   │   └── contact.html         # Contact methods
│   └── pages/                   # Individual page templates
│       ├── about.html           # Dedicated about page
│       ├── tech-stack.html      # Dedicated tech stack page
│       ├── projects.html        # Dedicated projects page
│       └── contact.html         # Dedicated contact page
├── routers/
│   └── site.py                  # FastAPI routes
└── static/                      # Static assets (unchanged)
```

## Template Inheritance

### Base Template (`base.html`)
- Contains the complete HTML structure
- Includes all CSS, JavaScript, and meta tags
- Defines blocks for content injection:
  - `{% block title %}` - Page title
  - `{% block content %}` - Main content area
  - `{% block extra_head %}` - Additional head content
  - `{% block extra_scripts %}` - Additional scripts

### Main Index (`index.html`)
- Extends `base.html`
- Includes all sections for the main portfolio page
- Uses `{% include %}` to include section templates

### Individual Pages (`pages/`)
- Each page extends `base.html`
- Includes only the relevant section
- Has unique titles and meta information

## FastAPI Routes

The router (`app/routers/site.py`) now supports:

- `/` - Main portfolio page with all sections
- `/about` - Dedicated about page
- `/tech-stack` - Dedicated tech stack page
- `/projects` - Dedicated projects page
- `/contact` - Dedicated contact page
- `/download-cv` - CV download endpoint

## Benefits of This Structure

1. **Modularity**: Each section is in its own file, making maintenance easier
2. **Reusability**: Sections can be included in multiple pages
3. **SEO**: Individual pages have unique titles and URLs
4. **Performance**: Pages load only the content they need
5. **Maintainability**: Changes to components affect all pages automatically
6. **FastAPI Standards**: Follows FastAPI best practices for template organization

## Usage Examples

### Adding a New Section
1. Create `app/templates/sections/new-section.html`
2. Include it in `index.html` or individual pages
3. Add route in `site.py` if needed

### Creating a New Page
1. Create `app/templates/pages/new-page.html`
2. Extend `base.html`
3. Include relevant sections
4. Add route in `site.py`

### Modifying Components
- Changes to `components/header.html` affect all pages
- Changes to `components/footer.html` affect all pages
- Base styles in `base.html` are shared across all pages

## Navigation

The navigation has been updated to use proper URLs:
- `/about` instead of `#about`
- `/tech-stack` instead of `#tech`
- `/projects` instead of `#projects`
- `/contact` instead of `#contact`

This provides better SEO and user experience with proper page URLs. 