# Vixton Labs — Step-by-Step Launch Guide

This gets you from these files to a live site at **vixtonlabs.tech** with an
admin panel at **admin.vixtonlabs.tech**, where you can add/edit/delete your
services and projects and see them update instantly on the live site.

## How this is built (read this first)

- `website/` — your public site (Home, What We Do, Our Work, About, Contact). Plain HTML/CSS/JS, no build step.
- `admin/` — your private admin panel (login + dashboard). Also plain HTML/CSS/JS.
- **Supabase** — a free database + login system. The website *reads* from it, the admin panel *writes* to it. This is what makes "add/delete/edit" actually show up on your live site for every visitor, not just in your own browser.
- **GitHub** — stores your code.
- **Vercel** — takes the code from GitHub and puts it on the internet, and connects it to your domain. (GitHub Pages can't run two separate subdomains as easily, so Vercel is the beginner-friendly choice here — it's free for this.)

You will end up with **one GitHub repo** containing both folders, and **two Vercel projects** pointed at the same repo (one per folder).

---

## Part 1 — Create your database (Supabase)

1. Go to **supabase.com** → sign up (free) → **New project**.
2. Give it a name (e.g. `vixton-labs`), set a database password (save it somewhere), pick a region close to you, click **Create new project**. Wait ~2 minutes.
3. In the left sidebar, open **SQL Editor** → **New query**.
4. Open the file `supabase-schema.sql` from this project, copy everything, paste it into the query box, click **Run**.
   - This creates your `services`, `works`, and `messages` tables, sets up security rules, and adds 5 starter services so your site isn't empty.
5. In the left sidebar, open **Authentication** → **Users** → **Add user** → **Create new user**.
   - Enter your own email and choose a password. This is your **admin login** — the only account allowed to add/edit/delete on your site.
   - Tick "Auto Confirm User" if it's shown, so you don't need to click an email link.
6. In the left sidebar, open **Project Settings** → **API**.
   - Copy the **Project URL** and the **anon public** key. You'll paste these into two files in the next part.

---

## Part 2 — Add your keys to the code

1. Open `website/js/supabase-config.js` and replace:
   - `YOUR-PROJECT-ID.supabase.co` with your **Project URL**
   - `YOUR-ANON-PUBLIC-KEY` with your **anon public** key
2. Do the exact same thing in `admin/js/supabase-config.js`.
3. Save both files. That's the only editing required before this works.

(Optional now, easy to change later: open `website/contact.html`, `website/index.html` etc. and swap `hello@vixtonlabs.tech` for your real email if different.)

---

## Part 3 — Put the code on GitHub

If you don't have Git installed, install it from **git-scm.com**, and create a free account at **github.com**.

1. On GitHub, click **New repository**. Name it `vixton-labs-site`. Keep it **Public** or **Private** (either works with Vercel). Don't add a README. Click **Create repository**.
2. On your computer, open a terminal in the folder that contains your `website/`, `admin/`, and `supabase-schema.sql` (the folder this guide is in), and run:

```bash
git init
git add .
git commit -m "Initial Vixton Labs site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/vixton-labs-site.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username. Refresh the GitHub page — your files should be there.

---

## Part 4 — Deploy with Vercel (two projects, one repo)

Go to **vercel.com** → sign up with your GitHub account.

### Project 1 — the public website

1. Click **Add New** → **Project**.
2. Import `vixton-labs-site` from the list.
3. Under **Root Directory**, click **Edit** and select `website`.
4. Framework Preset: leave as **Other** (it's plain HTML, no build needed).
5. Click **Deploy**. Wait ~30 seconds — you'll get a URL like `vixton-labs-site.vercel.app`. Open it and check the site loads.

### Project 2 — the admin panel

1. Click **Add New** → **Project** again.
2. Import the **same** `vixton-labs-site` repo again (Vercel allows this).
3. Under **Root Directory**, select `admin`.
4. Framework Preset: **Other**.
5. Click **Deploy**. You'll get a second URL, e.g. `vixton-labs-admin.vercel.app`.
6. Open it, log in with the email/password you created in Part 1, and confirm the dashboard loads.

---

## Part 5 — Connect your domain (vixtonlabs.tech)

You already own `vixtonlabs.tech`. You'll point it at Vercel using DNS records at whichever registrar you bought it from (e.g. Namecheap, GoDaddy).

### On the website Vercel project
1. Open the website project → **Settings** → **Domains**.
2. Add `vixtonlabs.tech` and also add `www.vixtonlabs.tech`.
3. Vercel will show you DNS records to add — typically:
   - An **A record**: `@` → `76.76.21.21`
   - A **CNAME record**: `www` → `cname.vercel-dns.com`
   (Vercel shows the exact current values on this screen — use those if they differ.)

### On the admin Vercel project
1. Open the admin project → **Settings** → **Domains**.
2. Add `admin.vixtonlabs.tech`.
3. Vercel will show a **CNAME record**: `admin` → `cname.vercel-dns.com`.

### At your domain registrar
1. Log in to wherever you bought `vixtonlabs.tech`, find **DNS settings / DNS management**.
2. Add the records exactly as Vercel showed you (one A record for `@`, one CNAME for `www`, one CNAME for `admin`).
3. Save. DNS changes can take anywhere from a few minutes to a few hours to go live.
4. Back in Vercel, the Domains screen will show a green checkmark once it detects the records are correct.

---

## Part 6 — Try it out

1. Visit `admin.vixtonlabs.tech`, log in, go to **Our Work**, add a real project with a title, category, and description.
2. Visit `vixtonlabs.tech/work.html` — your new project should appear.
3. Do the same test with a **Service**, and check it shows on the home page and `services.html`.
4. Submit the contact form on `vixtonlabs.tech/contact.html`, then check the **Messages** tab in the admin panel — it should appear there.

If something doesn't show up: open your browser's developer console (F12) on the page that isn't working and look for a red error — it will usually say exactly which Supabase key or table is wrong.

---

## Making changes later

- **Content** (services, projects, reading messages): just use the admin panel — no code changes needed.
- **Design/copy changes** (colors, wording, new pages): edit the files in `website/`, then:
  ```bash
  git add .
  git commit -m "describe what you changed"
  git push
  ```
  Vercel automatically redeploys within about a minute of every push.
- **Adding a photo for a project**: upload the image anywhere that gives you a direct image URL (e.g. Supabase Storage, Imgur, or your own hosting), then paste that URL into the "Image URL" field when adding/editing a project in the admin panel.

## Notes on security

- Nobody can sign up on your admin panel themselves — accounts are only created by you, manually, in the Supabase dashboard (Part 1, step 5). To add a teammate later, repeat that step with their email.
- The `anon` key in your config files is meant to be public — it cannot bypass the database rules set up in `supabase-schema.sql`, which only allow reading services/works, submitting a contact message, and require a real login for anything else.
