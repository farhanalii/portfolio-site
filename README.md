# 🌐 Muhammad Farhan — Portfolio with AI Assistance

This is my personal portfolio website built with **FastAPI**, styled using **Tailwind CSS**, and deployed using **Docker** and **GitHub Actions** to **AWS EC2 (Free Tier)**. It showcases my experience, projects, and skill set in a modern, scalable, and DevOps-friendly stack.

---

## 🚀 Tech Stack

- **Backend:** FastAPI (async web server)
- **Templating:** Jinja2 (for HTML rendering)
- **Frontend:** TailwindCSS (Stitch-generated UI)
- **DevOps:** Docker, GitHub Actions CI/CD
- **Cloud:** AWS EC2 (Free Tier)
- **Optional Additions:** PostgreSQL (for contact form or blogs), Flask microservice (for showcasing architecture)

### 🧠 Additional Capabilities

1. **API Design Patterns:**

   - RESTful endpoints
   - Request/Response models
   - Error handling strategies

2. **AI Integration:**

   - Prompt engineering
   - Model selection and fallbacks
   - Rate limiting and quota management

3. **Session Management:**

   - Stateful vs stateless
   - Memory vs database storage
   - Security considerations

4. **Error Handling:**

   - Graceful degradation
   - User-friendly error messages
   - Logging and monitoring

5. **Security:**

   - API key management
   - Input validation
   - CORS configuration

---

## 📁 Project Structure

```bash
portfolio-site/
├── app/
│   ├── main.py
│   ├── routers/
│   │   └── site.py                  # FastAPI routes
│   ├── templates/
│   │   ├── base.html               # Base template with common structure
│   │   ├── index.html              # Main portfolio page (extends base)
│   │   ├── components/             # Reusable components
│   │   │   ├── header.html         # Navigation header
│   │   │   └── footer.html         # Footer with social links
│   │   ├── sections/               # Individual content sections
│   │   │   ├── hero.html           # Hero section with typewriter
│   │   │   ├── about.html          # About section
│   │   │   ├── tech-stack.html     # Tech stack with filtering
│   │   │   ├── projects.html       # Projects grid
│   │   │   └── contact.html        # Contact methods
│   │   └── pages/                  # Individual page templates
│   │       ├── about.html          # Dedicated about page
│   │       ├── tech-stack.html     # Dedicated tech stack page
│   │       ├── projects.html       # Dedicated projects page
│   │       └── contact.html        # Dedicated contact page
│   └── static/                     # Static assets (CSS, JS, images)
├── Dockerfile
├── .github/workflows/deploy.yml
├── requirements.txt
├── .env
└── README.md
```

---

## 🧩 Template Inheritance

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

---

## 🧭 FastAPI Routes

The router (`app/routers/site.py`) supports:

- `/` - Main portfolio page with all sections
- `/about` - Dedicated about page
- `/tech-stack` - Dedicated tech stack page
- `/projects` - Dedicated projects page
- `/contact` - Dedicated contact page
- `/download-cv` - CV download endpoint

---

## ✅ Benefits of This Structure

1. **Modularity**: Each section is in its own file, making maintenance easier
2. **Reusability**: Sections can be included in multiple pages
3. **SEO**: Individual pages have unique titles and URLs
4. **Performance**: Pages load only the content they need
5. **Maintainability**: Changes to components affect all pages automatically
6. **FastAPI Standards**: Follows FastAPI best practices for template organization

---

## ⚙️ Usage Examples

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

---

## 🔗 Navigation

The navigation uses proper URLs for better SEO and user experience:

- `/about` instead of `#about`
- `/tech-stack` instead of `#tech`
- `/projects` instead of `#projects`
- `/contact` instead of `#contact`

---

# 🤖 Farhan's AI Assistant - AI Assistant for Muhammad Farhan's Portfolio

Farhan's AI Assistant is an intelligent AI chatbot that helps recruiters and visitors learn about Muhammad Farhan's experience, skills, projects, and availability. It can also analyze job descriptions to provide match assessments.

---

Thank you for visiting this portfolio repository!

