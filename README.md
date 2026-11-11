# Bready Darkroom

Photo editor for web design projects, by Bready Web Studios. It has 60 food, portrait and general filters, plus:

- Light and colour controls, curves, levels, HSL, colour grading, sharpening and skin smoothing
- Crop and straighten, with the option to fill the empty corners
- Batch edits: one look across many photos
- Projects you can save and reopen, plus autosave
- Export for the web as JPG, WebP or PNG at preset sizes

It runs on the graphics chip and works offline. Photos never leave the device.

## Get it

| Platform | How |
|---|---|
| Any browser / Mac / iPhone / iPad / Chromebook | https://breadywebstudios.github.io/darkroom/ (install from the browser) |
| Windows | [Installer](https://github.com/breadywebstudios/darkroom/releases/latest/download/Bready-Darkroom-Setup.exe) · [Portable](https://github.com/breadywebstudios/darkroom/releases/latest/download/Bready-Darkroom-Portable.exe) |
| Android | [APK](https://github.com/breadywebstudios/darkroom/releases/latest/download/Bready-Darkroom.apk) |

Download page: https://breadywebstudios.github.io/darkroom/download.html

## How it's built

- `web/`: the app itself. `index.html` holds all the editor code. It also has the manifest, service worker (offline mode), icons and self-hosted fonts.
- `desktop/`: the Windows app. It's an Electron wrapper that loads `web/`, packaged with electron-builder.
- `capacitor.config.json` + `scripts/prepare-android.sh` + `android-res/`: the Android app. Capacitor generates it in CI from `web/`, using Darkroom's icons.
- `android-keystore/debug.keystore`: a fixed signing key so each new APK installs over the old one. It's for sideloading only. A Play Store release would need a private release key.
- `.github/workflows/build.yml`: every push to `main` deploys the web app to Pages, builds the .exe and .apk, and replaces the `latest` release, so the download links above never change.

## Work on it locally

```bash
npm run serve        # web app at http://localhost:8080
cd desktop && cp -r ../web web && npm ci && npm start   # Windows app
```
