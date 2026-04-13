# Perfection Everyday — salon website

Static HTML/CSS/JS site (multi-branch locations under `locations/`).

## Publish on GitHub (free hosting)

1. Create a new repository at [github.com/new](https://github.com/new) (any name, e.g. `perfection-everyday-salon`). Do **not** add a README if you already have this project locally.

2. In this folder, run (replace `YOUR_USER` and `YOUR_REPO`):

   ```bash
   git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

3. Turn on **GitHub Pages**: repo → **Settings** → **Pages** → **Build and deployment** → Source: **Deploy from a branch** → Branch: **main** → folder **/ (root)** → Save.

4. After a minute, the site will be at:

   `https://YOUR_USER.github.io/YOUR_REPO/`

   (If the repo is named `YOUR_USER.github.io`, the URL is `https://YOUR_USER.github.io/`.)
