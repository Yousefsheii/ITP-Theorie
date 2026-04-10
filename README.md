# Hello World (GitHub → Vercel)

## Ziel
- Eine Website mit **"Hello World"** läuft auf `deinName.vercel.app`
- Updates passieren **automatisch** durch Pushes auf **GitHub**

## Lokal testen
Du kannst die `index.html` einfach im Browser öffnen.

## Git initialisieren & erster Commit
Im Projektordner:

```bash
git init
git add .
git commit -m "Initial hello world"
```

## GitHub Repo erstellen & pushen
1. Auf GitHub ein neues Repository erstellen (z.B. `hello-vercel`)
2. Dann im Projektordner:

```bash
git branch -M main
git remote add origin <DEIN_GITHUB_REPO_URL>
git push -u origin main
```

## Vercel Deploy (Auto-Deploy)
1. Auf Vercel einloggen
2. **Add New → Project**
3. Dein GitHub Repo auswählen
4. Framework: **Other** (oder einfach Default lassen)
5. Deploy klicken

Ab jetzt: jedes `git push` triggert automatisch ein neues Deployment.
