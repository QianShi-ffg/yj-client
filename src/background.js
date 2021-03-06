"use strict";

import { app, protocol, BrowserWindow, Menu, ipcMain, remote } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

console.log(BrowserWindow)
async function createWindow () {
  // 隐藏默认菜单
  // Menu.setApplicationMenu(null)
  // Create the browser window.
  const win = new BrowserWindow({
    width: 250,
    height: 350,
    // minWidth: 900,
    // minHeight: 550,
    // maxHeight: 550,
    // autoHideMenuBar: true,
    frame: false, // 使用后会导致主菜单,最小化,关闭直接消失
    resizable: false,
    webPreferences: {
      enableRemoteModule: true,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }


  ipcMain.on('changWindowSize', () => {
    win.setSize(930, 535)
    win.center()
  })
  ipcMain.on('close', e =>
    win.close()
  )

  ipcMain.on('minimize', e =>
    win.minimize()
  )

  let exePath = app.getPath('exe');
  win.setAppDetails({
    appId: 'com.test.app',
    appIconPath: '../public/weiweixin.ico',
    appIconIndex: 0,
    relaunchDisplayName: '微微信',
    relaunchCommand: '"' + exePath + '"', //加参数的意义是C盘program files文件夹有空格风险，导致路由错误
  });

}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  // if (isDevelopment && !process.env.IS_TEST) {
  //   // Install Vue Devtools
  //   try {
  //     await installExtension(VUEJS_DEVTOOLS);
  //   } catch (e) {
  //     console.error("Vue Devtools failed to install:", e.toString());
  //   }
  // }
  createWindow();
});



// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

