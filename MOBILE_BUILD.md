# Building the native mobile app

This project is set up for **Capacitor** so the same web app ships to **iOS** and **Android**.

You can't build the native binary inside Lovable — it requires Xcode (macOS) or Android Studio. Here's the flow:

## 1. Push to GitHub
Click **GitHub → Connect to GitHub** in the top-right of the Lovable editor, then create a repo.

## 2. Clone locally
```bash
git clone https://github.com/<you>/<repo>.git
cd <repo>
bun install
```

## 3. Add native platforms
```bash
bunx cap add ios       # macOS only — needs Xcode
bunx cap add android   # needs Android Studio
```

## 4. Build the web bundle and sync
```bash
bun run build
bunx cap sync
```

## 5. Open in the native IDE
```bash
bunx cap open ios       # opens Xcode → Run
bunx cap open android   # opens Android Studio → Run
```

## Hot-reload from preview
Edit `capacitor.config.ts` and uncomment the `server.url` to point at your Lovable preview, then re-sync. Useful for iterating without rebuilding.

## Updating after changes
Every time you pull new code from Lovable:
```bash
git pull
bun install
bun run build
bunx cap sync
```

That's it.
