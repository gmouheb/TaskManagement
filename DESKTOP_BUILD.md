# Desktop Builds

This app is configured as a Tauri 2 desktop app with the existing Vite React UI.
It does not add a backend, database, login, or sync layer. Saved focus sessions,
break sessions, settings, and tasks continue to use `localStorage` inside the
desktop webview.

## Development

```bash
npm install
npm run desktop:dev
```

## Production Web Build

```bash
npm run build
```

## Linux Builds

Install the Tauri prerequisites on Ubuntu first:

```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

Restart the terminal after installing Rust, then build the requested Linux
packages:

```bash
npm run desktop:build:linux
```

Outputs are written under `src-tauri/target/release/bundle/`, including
AppImage and Debian package files when the platform dependencies are present.

## Windows Builds

Build Windows packages from Windows with:

```powershell
npm install
npm run desktop:build:windows
```

Windows requires Microsoft C++ Build Tools and Rust with the MSVC toolchain.
The NSIS target produces a Windows `.exe` installer, and the MSI target produces
an `.msi` installer. The compiled app executable is also emitted under
`src-tauri/target/release/`.

Cross-compiling Windows installers from Linux is possible only with additional
toolchain setup, so the simplest path is to build Windows packages on Windows.
