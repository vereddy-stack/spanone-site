# SpanOne Website (Static Rebuild)

A static rebuild of [spanone.com](https://spanone.com), migrated off WordPress so it can be hosted directly on GitHub Pages. Plain HTML/CSS/JS — no build step, no framework, no external services.

## Structure

```
index.html                  Home
college-counseling.html     College Counseling
bs-md.html                  BS-MD
international-students.html International Students
client-reviews.html         Client Reviews
about-us.html                About Us
free-assessment.html         Free Assessment (form)
contact-us.html               Contact Us (form)
blog.html                     Blog listing (10 posts)
blog/                          Individual blog post pages
css/style.css                 All styles (navy/gold design system)
js/main.js                     Mobile nav toggle + form handling
```

## Forms — how they work

Both forms (`free-assessment.html`, `contact-us.html`) use a plain `mailto:` approach instead of a forms service:

- On submit, JavaScript builds a `mailto:spanoneinc@gmail.com` link pre-filled with the visitor's answers (subject + body) and opens it.
- This opens the visitor's own email app with a ready-to-send message — nothing is transmitted silently, and there's no backend, database, or third-party form service involved.
- **Trade-off:** this only works if the visitor has an email client configured on their device (desktop mail app, or a phone with Mail/Gmail set up). If they don't, the button won't do anything visible. If you outgrow this, a small serverless function (e.g. a free Cloudflare Worker) can send mail server-side without changing the form markup much — but that's a deliberate future upgrade, not something built in now.

## Deploying to GitHub Pages

1. Push this repo to GitHub (see commands below).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch," branch `main`, folder `/ (root)`.
4. Save. GitHub will publish at `https://<your-username>.github.io/<repo-name>/` within a minute or two.
5. **To use spanone.com as the domain:** add a `CNAME` file to the repo root containing just `spanone.com`, then in your domain's DNS settings point it at GitHub Pages (an `A` record to GitHub's IPs, or a `CNAME` record if using a subdomain) — GitHub's Pages docs have the exact records to use for the type of domain you have.

```bash
git add -A
git commit -m "Initial static rebuild of spanone.com"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## Images — one thing to finish

Photos and icons currently hotlink to the original WordPress media library (`spanone.com/wp-content/uploads/...`) so the site works immediately. This means the new site currently still depends on the old host for images.

Before you retire the WordPress hosting, download those images and swap the `<img src="...">` paths to local files in `/images/`. The current image URLs used are listed in each page's `<img>` tags — search each HTML file for `spanone.com/wp-content` to find them.

## About the blog

`blog.html` now lists SpanOne's 10 current posts as static pages under `/blog/`, pulled in from the live WordPress blog at the time of this rebuild. Since these are now plain HTML files, adding a new post going forward means duplicating one of the files in `/blog/` and editing the content by hand (or asking Claude to do it) — there's no CMS or admin panel anymore. If posting frequently becomes important, a static-site generator (e.g. Eleventy or Hugo) that builds pages from Markdown would be worth adding later.

## Local preview

No build tools needed — just open any `.html` file in a browser, or serve the folder locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```
