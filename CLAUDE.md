# H&L Flower Walls — Project Context

## What This Project Is

Production website for H&L Flower Walls, a flower wall rental business
serving Tampa Bay, Florida. The site must rank #1 for flower wall, flower
arch, and photo booth rental services across Tampa Bay and surrounding cities.

## Business Info

- Business: H&L Flower Walls
- Phone: (813) 705-3771
- Email: hlflowerwalls@gmail.com
- Website: hlflowerwalls.com
- Instagram: @hlflowerwalls
- Facebook: /hlflowerwalls
- TikTok: @hlflowerwalls
- The Knot: hl-event-rentals-tampa-fl
- Location: Tampa, FL 33602
- Coordinates: 27.9506, -82.4572

## Services

1. Flower Wall Rentals — 8x8 ft freestanding silk/foam panels, 8 designs
2. Twin Floral Arches — freestanding twin arch arrangement for ceremonies
3. Mirror Photo Booth — interactive mirror booth with prints and digital sharing
4. LED Signs — custom LED signage add-ons (Mr & Mrs, Will You Marry Me, etc.)
5. Other add-ons: balloon garlands, draping, greenery accents

## Pricing

- Flower Walls: $80/hr or $360/day (4+ hours)
- Twin Arches: $70/hr or $315/day (4+ hours)
- Mirror Photo Booth: $180/hr or $810/day (4+ hours)
- LED Signs: $30 flat rate per sign

## Product Catalog

Each product has a unique ID used for inquiry tracking and webhooks.

| ID | Category | Name | Hourly Rate | Daily Rate | 
|-----|-----------|------|-------------|------------|
| FW-001 | flower-wall | Donna Champagne Flower Wall | $80 | $360 |
| FW-002 | flower-wall | Amor Red Flower Wall | $80 | $360 |
| FW-003 | flower-wall | Hedge Flower Wall (Aria Arch) | $80 | $360 |
| FW-004 | flower-wall | Pearl White Flower Wall | $80 | $360 |
| FW-005 | flower-wall | Dhalia Pink Flower Wall | $80 | $360 |
| FW-006 | flower-wall | Flora Pink Flower Wall | $80 | $360 |
| FW-007 | flower-wall | Veronica's Garden Flower Wall | $80 | $360 |
| FW-008 | flower-wall | The Pearl Flower Wall | $80 | $360 |
| TA-001 | twin-arches | Serenity Twin Floral Arches | $70 | $315 |
| PB-001 | photo-booth | Mirror Photo Booth | $180 | $810 |
| LED-001 | led-sign | Mr & Mrs LED Sign | N/A | $30 |
| LED-002 | led-sign | Will You Marry Me LED | N/A | $30 |

## Service Areas (16 Cities)

Tampa (home base), Clearwater, St. Petersburg, Sarasota, Lakeland,
Brandon, Wesley Chapel, Plant City, Bradenton, Largo, Riverview,
Lutz, New Port Richey, Spring Hill, Kissimmee, Orlando

## Tech Stack

- Static HTML/CSS/JS — no frameworks, no build tools
- Hosted on Netlify (free tier)
- Lead capture form POSTs JSON to n8n webhook
- n8n routes leads to Google Sheets + CRM
- No database — product catalog lives in products.json and products.js

## SEO Requirements (Non-Negotiable)

These must be preserved in every change to the site:

- Semantic HTML5: header, nav, main, section, article, footer
- Proper heading hierarchy: H1 then H2 then H3 (never skip levels)
- Only ONE H1 per page
- 6 JSON-LD schemas: LocalBusiness, 3x Service, FAQPage, BreadcrumbList
- Every image must have descriptive alt text with service type + location
- aria-label on every section element
- Meta tags: title, description, OG, Twitter Cards, geo, canonical
- FAQ section with schema markup (critical for AI search / featured snippets)

## Lead Capture Form — How It Works

The inquiry form sends a JSON payload to a Zapier webhook:

{
  "customer": {
    "name": "...",
    "email": "...",
    "phone": "...",
    "event_date": "...",
    "event_type": "...",
    "message": "..."
  },
  "products": [
    {
      "id": "FW-001",
      "category": "flower-wall",
      "name": "Donna Champagne Flower Wall",
      "hourly_rate": 80,
      "daily_rate": 360
    },
    {
      "id": "LED-001",
      "category": "led-sign",
      "name": "Mr & Mrs LED Sign",
      "hourly_rate": null,
      "daily_rate": 30
    }
  ],
  "rental_type": "daily",
  "inquiry_code": "INQ-FW001-20260302-4X7K",
  "submitted_at": "2026-03-02T14:30:00Z",
  "source": "website"
}

Inquiry codes follow the pattern: INQ-{PRIMARY_PRODUCT_ID}-{YYYYMMDD}-{4_RANDOM_CHARS}
The primary product is the first product in the array (typically the wall or booth).

The webhook URL is stored in a config variable at the top of products.js.
Replace the placeholder with the real n8n webhook URL before going live:

const WEBHOOK_URL = "https://YOUR-N8N-INSTANCE.app.n8n.cloud/webhook/hl-inquiry";

## File Responsibilities

- src/index.html — All page structure and content. CSS and JS are external files.
- src/css/styles.css — All styling. Uses CSS custom properties for theming.
- src/js/main.js — Scroll animations, nav behavior, FAQ accordion.
- src/js/products.js — Product catalog array, inquiry modal, form submission,
  inquiry code generation, webhook POST logic.
- config/products.json — Source of truth for all products. If a new product
  is added, update this file AND products.js.
- docs/seo-strategy.md — Full SEO roadmap. Reference when adding new pages.

## Design System

- Fonts: Cormorant Garamond (headings), DM Sans (body)
- Primary bg: #FAF7F4
- Accent: #C4856E
- Accent dark: #A66B55
- Deep bg: #2D2A26
- Text: #2D2A26
- Text light: #7A7470
- Border radius: 10px
- Buttons: 50px border-radius (pill shape), uppercase, letter-spacing
- Style: luxury editorial — clean, warm, minimal

## Skills

- **Rename Product** (`.claude/skills/rename-product.md`): When the user sends a
  screenshot of a product card + a new name, follow the rename procedure in
  that file to update the name across ALL pages and data files in one pass.
- **Convert HEIC Image** (`.claude/skills/convert-heic-image.md`): When the user adds
  a HEIC image and wants it used on the site, follow the conversion procedure in
  that file to convert to JPG and update the HTML reference.
- **Deploy** (`.claude/skills/deploy.md`): After completing any code changes,
  follow this procedure to commit, push to GitHub, and trigger a Netlify deploy
  so the live site stays in sync.

## Rules for Claude Code

- Never remove or break existing JSON-LD schema markup
- Never change the heading hierarchy without updating schema
- Always preserve alt text on images — never leave alt="" empty
- Keep all CSS in styles.css, all JS in the js/ folder
- Test that the inquiry form webhook payload includes product IDs
- When adding new pages (blog posts, city pages), follow the SEO
  content rules in docs/seo-strategy.md
- Every new page needs: title tag, meta description, OG tags, canonical,
  at least one JSON-LD schema, proper heading hierarchy, FAQ section
- Keep the site fast — no heavy frameworks, no unnecessary dependencies