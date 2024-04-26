const { app, BrowserWindow } = require('electron')
const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
      width: 1000,
      height: 800,
      webPreferences: {
        preload: path.join(__dirname,'preload.js')
      }
    })
  
    win.loadFile('index.html')

    const Database = require("better-sqlite3");
    const db = new Database("db.db", { verbose: console.log, nativeBinding: "./node_modules/better-sqlite3/build/Release/better_sqlite3.node" });
    console.log('db :>> ', db);

    // 监听键盘事件，实现后退功能
    win.webContents.on('before-input-event', (event, input) => {
      if (input.control && input.key.toLowerCase() === 'z') {
        win.webContents.goBack()
      }
    })
  }

// 等待应用准备就绪后创建窗口
app.whenReady().then(()=>{
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createWindow()
        }
    })
})

// 关闭所有窗口时退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})