# Serene Interval

Serene Interval is a calm Pomodoro focus timer built with React, Vite, and Tauri.
It can run as a web app during development and can be packaged as a desktop app
for Linux and Windows.

The app is intentionally simple:

- No backend
- No database
- No login
- No cloud sync
- Saved tasks, settings, focus sessions, and break sessions use `localStorage`

## Features

- Focus, short break, and long break timer modes
- Circular timer progress display
- Start, pause, reset, and skip controls
- Completion pop-up when a timer finishes
- Five-second completion sound
- Task list with priority and estimated pomodoros
- Local session history
- Weekly activity analytics
- Settings for durations, automation, dark mode, sound tone, and volume
- Desktop packaging through Tauri

## Timer Durations

Timer durations can be changed in the Settings screen.

- Focus: `1` to `240` minutes, up to 4 hours
- Short break: `1` to `20` minutes
- Long break: `1` to `60` minutes

Values are saved locally and restored when the app opens again.

## Tech Stack

- React
- Vite
- Tauri 2
- Rust, for the Tauri desktop wrapper
- CSS modules/files, no Tailwind build step
- Web Audio API for generated alert sounds
- `localStorage` for persistence

## Project Structure

```text
.
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   ├── components/
│   ├── hooks/
│   └── utils/
├── src-tauri/
│   ├── tauri.conf.json
│   ├── Cargo.toml
│   ├── src/
│   ├── icons/
│   └── capabilities/
├── DESIGN.md
├── IMPLEMENTATION_PLAN.md
├── DESKTOP_BUILD.md
├── package.json
└── vite.config.js
```

## Install

```bash
npm install
```

## Run Web App

```bash
npm run dev
```

Open:

```text
http://localhost:5173/
```

## Build Web App

```bash
npm run build
```

The web build is written to:

```text
dist/
```

## Run Desktop App In Development

Make sure Rust and the Linux Tauri prerequisites are installed.

```bash
. "$HOME/.cargo/env"
npm run desktop:dev
```

## Build Linux Desktop Packages

```bash
. "$HOME/.cargo/env"
npm run desktop:build:linux
```

Generated packages are written under:

```text
src-tauri/target/release/bundle/
```

Expected Linux outputs include:

```text
src-tauri/target/release/bundle/appimage/Serene Interval_0.1.0_amd64.AppImage
src-tauri/target/release/bundle/deb/Serene Interval_0.1.0_amd64.deb
```

Install the Debian package with:

```bash
sudo apt install "./src-tauri/target/release/bundle/deb/Serene Interval_0.1.0_amd64.deb"
```

Run the AppImage with:

```bash
"./src-tauri/target/release/bundle/appimage/Serene Interval_0.1.0_amd64.AppImage"
```

## Build Windows Desktop Packages

Build Windows packages on a Windows machine.

Requirements:

- Node.js
- Rust through `rustup`
- Microsoft C++ Build Tools

Then run:

```powershell
npm install
npm run desktop:build:windows
```

Outputs are written under:

```text
src-tauri\target\release\bundle\
```

Expected Windows outputs include an installer such as `.exe` or `.msi`, and the
compiled executable is written under:

```text
src-tauri\target\release\
```

## Linux Prerequisites

On Ubuntu:

```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
. "$HOME/.cargo/env"
```

Check the Tauri environment:

```bash
npx tauri info
```

## Available Scripts

```bash
npm run dev                  # Start Vite web dev server
npm run build                # Build web app
npm run preview              # Preview web build
npm run desktop:dev          # Run Tauri desktop dev app
npm run desktop:build        # Build desktop app for current OS
npm run desktop:build:linux  # Build Linux AppImage and deb
npm run desktop:build:windows # Build Windows installers
```

## Persistence

The app stores data in `localStorage`.

Saved data includes:

- Tasks
- Completed focus sessions
- Completed break sessions
- Timer duration settings
- Sound settings
- Dark mode preference

There is no remote sync. Data stays on the machine and inside the browser or
desktop webview storage.

## Notes

- The desktop app is a Tauri shell around the same React UI.
- The UI follows the calm "Serene Interval" design described in `DESIGN.md`.
- Build artifacts are ignored by `.gitignore`.
- `src-tauri/target/`, `dist/`, and `node_modules/` should not be committed.
