# Bainsla Music — Complete Project Handoff

## Project Overview

**Bainsla Music Private Limited** ka official website + admin panel jo Hostinger pe deployed hai.

- **Live Website:** https://bainslamusic.com
- **Admin Panel:** https://bainslamusic.com/admin/
- **Admin Login:** username: `admin` / password: `Bainsla@2024`
- **Technology:** PHP backend (flat-file JSON database) + static HTML/CSS/JS frontend
- **Hosting:** Hostinger shared hosting
- **GitHub Repo:** `vijendra95/Bainsla-Music-website` (branch: `devin/1779659525-full-website`)

---

## Architecture

```
bainslamusic.com (Hostinger: public_html/)
├── index.html              ← Main website (reads data from API dynamically)
├── admin/
│   ├── index.html          ← Admin login page
│   ├── dashboard.js        ← Admin panel logic (CRUD for all sections)
│   ├── dashboard.css       ← Admin panel styles
│   ├── admin.js            ← Login logic
│   └── admin.css           ← Login styles
├── api/
│   ├── config.php          ← Database config (DATA_DIR path, helpers)
│   ├── data.php            ← Main REST API (GET/POST/PUT/DELETE + public endpoint)
│   ├── login.php           ← Session-based auth
│   ├── logout.php          ← Logout
│   ├── upload.php          ← Image upload handler
│   ├── frontend-data.php   ← Alternative public data endpoint
│   └── fix-permissions.php ← Utility to fix file permissions
├── data/
│   ├── content.json        ← THE DATABASE (all website content in JSON)
│   └── .htaccess           ← Prevents direct access to JSON
├── images/
│   └── artists/            ← Uploaded artist images
├── dashboard/
│   └── index.html          ← Public dashboard page
└── dynamic-loader.js       ← Legacy loader (not actively used now)
```

---

## How It Works

### Data Flow:
1. **Admin edits content** → Admin panel calls `POST /api/data.php` → saves to `/data/content.json`
2. **Website loads** → `index.html` JavaScript calls `GET /api/data.php?section=public` → gets all data → renders dynamically
3. **Result:** Admin edits are INSTANTLY live on website (just refresh the page)

### API Endpoints:
- `GET /api/data.php?section=public` — Returns ALL website data (no auth needed)
- `GET /api/data.php?section=labels` — Returns specific section (needs auth)
- `POST /api/data.php` — Create/Update/Delete items (needs auth via PHP session)
- `POST /api/login.php` — Login (returns session cookie)
- `POST /api/upload.php` — Upload images (needs auth)

### Admin Panel Sections (all fully editable):
1. **Settings** — Company name, tagline, description, contact info, social URLs
2. **Banners** — Homepage hero slider images
3. **Our Labels** — Music label cards with stats (songs, views, subs)
4. **Our Presence** — Platform logos (Spotify, Apple Music, YouTube, etc.)
5. **Our Associates** — Artist profiles with roles and social links
6. **Our Clients** — Client company logos
7. **Exclusive Albums** — Album cards with YouTube video IDs
8. **Our Journey** — Timeline entries (year + description)
9. **Services** — Service offerings with icons
10. **Latest Releases** — YouTube video releases with views/dates
11. **Directors & Team** — Director profiles with full details
12. **Artists** — Artist database
13. **Videos** — Video content management
14. **Music Catalogue** — Song categories
15. **Licensing** — Licensing info cards
16. **Inquiries** — Contact form submissions (view only)

---

## Hostinger Deployment Details

- **Hostinger IP:** 82.180.143.173
- **SSH Port:** 65002
- **SSH Username:** u392705218
- **SSH Password:** AjeetKing@1234
- **File Manager:** Use Hostinger hPanel → File Manager (most reliable method)
- **Document Root:** `~/domains/bainslamusic.com/public_html/`

### Important File Permissions:
- `/data/` folder: **755** (rwxr-xr-x)
- `/data/content.json`: **644** (rw-r--r--)

### Deployment Method:
SSH doesn't always work from Devin (network isolation). Use Hostinger File Manager:
1. Login to hPanel
2. Navigate to File Manager → `public_html/`
3. Edit/upload files directly

---

## Current State (as of June 2026)

- Website is LIVE and working at https://bainslamusic.com
- Admin panel is LIVE at https://bainslamusic.com/admin/
- Admin edits save to content.json and appear on website on refresh
- All 15+ sections are functional in admin
- Image upload works for artist/director photos
- DG Mawai label was added via admin and confirmed working
- Journey section edited (2016) and confirmed working

---

## GitHub Repository: vijendra95/Bainsla-Music-website

### Branches:
- `main` — Initial setup only
- `devin/1779659525-full-website` — **MAIN BRANCH** with all latest code (PR #1)

### Key Commits:
1. `25fa69a` — Complete Bainsla Music website + Admin Panel (initial)
2. `e80c1d1` — Pre-populate admin panel with all website data
3. `58f528f` — Improve file permission handling
4. `27862d2` — Add error handling to API + fix-permissions utility
5. `241aeca` — Improve admin panel error handling + session management
6. `6415e97` — **Load website data from admin API instead of hardcoded arrays** (THE KEY FIX)

### Pull Request:
- PR #1: https://github.com/vijendra95/Bainsla-Music-website/pull/1
- Title: "feat: Complete Bainsla Music website + Admin Panel with unique design"

---

## Second Repository: vijendra95/bainsla-music-cms

This is an OLDER Next.js based CMS that was on Vercel. It contains:
- Next.js app (TypeScript, Tailwind CSS)
- An `admin-panel/` folder with the PHP admin panel code
- Multiple branches from various iterations of the website design
- Deployed on Vercel (bainsla-music-cms.vercel.app)

**Note:** The LIVE website (bainslamusic.com) uses the `Bainsla-Music-website` repo code, NOT this one. This CMS repo has historical work from earlier sessions.

### Key branches on bainsla-music-cms:
- `devin/1779653866-vianet-redesign` — Latest design iteration (Vianetmedia-inspired)
- `devin/1778792032-admin-panel-full-edit` — Admin panel with full edit access
- Many other feature branches (see git branch -a for full list)

---

## Website Design Details

- **Theme:** Light (white background, #c00 red accents)
- **Header:** Transparent, becomes solid on scroll
- **Libraries:** Swiper.js (carousels), AOS (scroll animations), Font Awesome (icons)
- **Responsive:** Yes, mobile-first design
- **Key Sections:**
  - Hero slider with banners
  - Stats bar (256+ songs, 42+ artists, 178+ videos, 12.8M+ views)
  - Our Labels (Swiper carousel)
  - Our Presence (platform logos grid)
  - Our Associates (Swiper carousel)
  - Exclusive Albums (Swiper carousel)
  - Our Journey (timeline)
  - Services (grid)
  - Latest Releases (grid with YouTube links)
  - Directors & Team
  - Contact section with Google Maps embed
  - Footer with social links

---

## Known Issues & Notes

1. **SSH access:** May not work from Devin due to network isolation. Use File Manager.
2. **Cloudflare:** Hostinger hPanel is behind Cloudflare — browser automation (Playwright) gets blocked.
3. **File uploads:** Images upload to `/images/artists/` folder. Make sure folder exists with 755 permissions.
4. **content.json:** This IS the database. If it gets corrupted, website breaks. Always backup before major changes.
5. **No cache:** Website fetches fresh data on every page load (no caching). If performance becomes an issue, add caching later.

---

## What To Tell New Devin

Copy-paste this to the new Devin session:

```
Main kaam: Bainsla Music Private Limited ki website (bainslamusic.com) manage karna hai.

Project details:
- Website: https://bainslamusic.com (Hostinger pe deployed)
- Admin Panel: https://bainslamusic.com/admin/ (login: admin / Bainsla@2024)
- Tech: PHP + HTML/CSS/JS (no framework, flat-file JSON database)
- Hosting: Hostinger shared hosting (SSH: u392705218 / AjeetKing@1234, port 65002)
- GitHub: vijendra95/Bainsla-Music-website (branch: devin/1779659525-full-website)

Current state: Website fully functional. Admin panel se kuch bhi edit karo → website pe turant live hota hai (page refresh pe).

Architecture:
- /data/content.json = database (sab data yahan store hai)
- /api/data.php = REST API (CRUD operations)
- /admin/ = admin panel (login-protected)
- index.html = main website (dynamically loads data from API)

Permissions:
- /data/ folder: 755
- /data/content.json: 644

IMPORTANT: SSH usually doesn't work from Devin. Use Hostinger File Manager for deployment.
```

---

## YouTube Channel & Social Links

- YouTube: https://www.youtube.com/@bainslaofficial
- Instagram: https://www.instagram.com/bainsla_music_company
- Facebook: https://facebook.com/bainslamusic
- Owner: Ajeet Bainsla (+91 72978 97628)
- Email: bainslamusiccompany@gmail.com

---

## content.json Structure

The database file has these top-level keys:
```json
{
  "settings": { ... },      // Company info, contact, social URLs
  "banners": [ ... ],       // Hero slider images
  "labels": [ ... ],        // Music label cards
  "presence": [ ... ],      // Platform logos (Spotify, etc.)
  "associates": [ ... ],    // Artist profiles
  "clients": [ ... ],       // Client logos
  "albums": [ ... ],        // Album cards
  "journey": [ ... ],       // Timeline entries
  "services": [ ... ],      // Service cards
  "releases": [ ... ],      // YouTube releases
  "directors": [ ... ],     // Director profiles
  "team": [ ... ],          // Team members
  "artists": [ ... ],       // Artist database
  "videos": [ ... ],        // Video content
  "catalogue": [ ... ],     // Music categories
  "licensing": [ ... ],     // Licensing cards
  "inquiries": [ ... ]      // Contact submissions
}
```

Each item has an `id` field (auto-generated) and a `created_at` timestamp.
