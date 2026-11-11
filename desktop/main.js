// Bready Darkroom for Windows: an Electron window around the same web app in ../web
const { app, BrowserWindow, shell, Menu } = require("electron");
const path = require("path");

// keep one window; opening the app again focuses it
if (!app.requestSingleInstanceLock()) app.quit();

let win = null;
function createWindow() {
  win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: "#18181a",
    title: "Bready Darkroom",
    icon: path.join(__dirname, "build", "icon.png"),
    autoHideMenuBar: true,
    show: false,
    webPreferences: { contextIsolation: true, sandbox: true, spellcheck: false },
  });
  win.loadFile(path.join(__dirname, "web", "index.html"));
  win.once("ready-to-show", () => { win.maximize(); win.show(); });

  // links to websites open in the normal browser, never inside the app
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  win.webContents.on("will-navigate", (e, url) => {
    if (!url.startsWith("file:")) { e.preventDefault(); if (/^https?:/.test(url)) shell.openExternal(url); }
  });
  // exports: Windows "Save as" dialog, remembering the last folder
  win.webContents.session.on("will-download", (e, item) => {
    item.setSaveDialogOptions({ title: "Save from Bready Darkroom", defaultPath: path.join(lastDir(), item.getFilename()) });
    item.once("done", (_e, state) => { if (state === "completed") lastSaveDir = path.dirname(item.getSavePath()); });
  });
}
let lastSaveDir = null;
const lastDir = () => lastSaveDir || app.getPath("pictures");

Menu.setApplicationMenu(null);
app.on("second-instance", () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.whenReady().then(createWindow);
app.on("window-all-closed", () => app.quit());
