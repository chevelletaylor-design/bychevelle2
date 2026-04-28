# By Chevelle — Website

Custom 6-page site for the By Chevelle web design business. Config-driven with a Decap CMS admin panel.

## File structure

```
bychevelle/
├── index.html              ← Homepage
├── process.html            ← Full process page
├── terms.html              ← Project terms / contract
├── work.html               ← Work hub gallery
├── consultation.html       ← Password-gated client questionnaire
├── feedback.html           ← Password-gated client feedback form
├── config.json             ← All editable site content (the brain)
├── README.md               ← This file
├── admin/
│   ├── index.html          ← Admin panel entry (loads Decap CMS)
│   └── config.yml          ← Decap CMS field definitions
└── assets/
    ├── css/shared.css      ← All site styles
    ├── js/site.js          ← Loads config + renders content
    └── images/
        ├── logo-primary-web.png
        ├── logo-oval-web.png
        ├── phone-web.png
        └── uploads/        ← Created automatically when admin uploads images
```

## How content editing works

**All editable content lives in `config.json`.** When a page loads, `site.js` fetches the config and populates everything inside `data-bind="..."` placeholders.

You can edit the content in **two ways:**

### Option 1 — Edit config.json directly (developer mode)

Open `config.json` in a text editor. Change the values. Save. Refresh the site.

### Option 2 — Use the admin panel (after Netlify deploy)

Once deployed to Netlify with Identity enabled, visit `yoursite.com/admin/`, log in, and edit through forms. Every field has a labeled input. Saving commits the change to your Git repo (which triggers a Netlify rebuild and pushes the change live in ~1 minute).

## Editable content (via admin panel)

- **Site Settings** — page title, meta description, email, Instagram URL, footer text, copyright year
- **Promo Banner** — toggle on/off, edit text in three parts (before, emphasized, after)
- **Homepage Hero** — eyebrow, headline (start + italic emphasis), lead paragraph, both CTA labels
- **Who I Work With** — section copy + 4 audience cards
- **What's Included** — 4 items (icons stay fixed in HTML, you edit titles + descriptions)
- **Work Portfolio** — array of projects (URL, tag, title, description, desktop screenshot, mobile screenshot, optional live URL). Add/remove/reorder.
- **About Section** — section copy, photo upload, paragraph list (HTML allowed), script flourish, closing line
- **Process Roadmap** — section copy + 6 stops (number, title, description). Add/remove/reorder.
- **Pricing** — section copy + 4 packages. Each package: name, subtitle, prices, "for whom" copy, bullet list, CTA label. Plus: which one is featured, plus add-ons.
- **Inquiry Form** — copy + Formspree endpoint URL + submit button label
- **Client Passwords** — array of clients with passwords for consultation/feedback pages

## Setting up the admin panel (one-time)

1. **Push the site to a GitHub repo.** Decap CMS uses your repo as the database.
2. **Deploy to Netlify** by connecting that repo. Drop the folder into [app.netlify.com/drop](https://app.netlify.com/drop) for a quick first deploy, or set up a continuous-deploy connection.
3. **In your Netlify site settings:**
   - Site settings → Identity → Enable Identity
   - Identity → Registration → Set to "Invite only" (so randos can't sign up)
   - Identity → Services → Git Gateway → Enable Git Gateway
4. **Invite yourself:**
   - Identity → Invite users → Enter your email → Click Send
   - Open the invite email, click the link, set your password
5. **Visit yoursite.com/admin/** and log in.

Once you're set up, you can invite clients (with limited permissions) the same way if you ever want them editing their own sites.

## Local development

To preview the site locally with config.json loading correctly, run a local server (the browser blocks `fetch()` from the `file://` protocol):

```bash
cd bychevelle
python3 -m http.server 8000
```

Then visit `http://localhost:8000/index.html`.

## Adding a new project to the work section

### Via admin panel
1. Go to `/admin/` → Site Content → Edit Site Content → Work Portfolio → Projects
2. Click "Add Projects"
3. Fill in URL display, tag, title, description, upload desktop + mobile screenshots
4. Save

### Via config.json
1. Take a full-page screenshot of the live client site using GoFullPage Chrome extension (long PNG of desktop view AND mobile view)
2. Drop the screenshots into `assets/images/work/` (create folder if needed)
3. Edit `config.json` → `work.projects` array, add a new entry with the image paths

## Setting client passwords

### Via admin panel
1. Go to `/admin/` → Client Passwords
2. Click "Add Client Passwords"
3. Set client ID, password, name, project, mark active
4. Save

### Via config.json
Edit the `clients` array. Each entry needs `id`, `password`, `client_name`, `project_name`, and `active: true`.

**Security note:** This is client-side password protection — a soft gate to keep nosy people out. Anyone who views page source could find the passwords. For real security, you'd need server-side auth. For "private feedback page" use, this is fine.

## Wiring up the inquiry form

1. Sign up at [formspree.io](https://formspree.io) and create a form
2. Copy your endpoint URL (`https://formspree.io/f/YOUR_ID`)
3. In admin panel → Inquiry Form → Formspree Endpoint URL → paste it → save

OR edit `config.json` → `inquiry.formspree_endpoint`.

## Adding your photo to About

### Via admin panel
Go to About Section → Photo of Chevelle → upload an image. Save.

### Manually
Drop a 4:5 portrait into `assets/images/chevelle.jpg`, then edit `config.json` → `about.photo_image` → set value to `"assets/images/chevelle.jpg"`.

## Brand colors (in shared.css)

| Variable | Hex |
|---|---|
| `--red` | `#E20019` |
| `--pink` | `#FFCEF1` |
| `--cream` | `#F6F5E1` |
| `--ink` | `#2A1418` |

## Promo banner

Toggle on/off in admin panel under Promo Banner → Show Banner. Edit the three text parts (before, emphasized, after) to change what it says.
