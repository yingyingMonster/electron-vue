import { BrowserWindow, Menu, ipcMain, globalShortcut } from 'electron'
import menuconfig from '../config/menu'
import config from '@config'
import setIpc from './ipcMain'
import upload from './checkupdate'
import DownloadUpdate from './downloadFile'
import { winURL, loadingURL } from '../config/StaticPath'
import { initPrint } from '../../renderer/utils/PrintCore'
var loadWindow = null
var mainWindow = null
var callNum = null
const path = require('path')
const electron = require('electron')
/*获取electron窗体的菜单栏*/

function createMainWindow() {
  /**
   * Initial window options
   */
  // 隐藏菜单栏
  Menu.setApplicationMenu(null)
  mainWindow = new BrowserWindow({
    height: 1080,
    useContentSize: true,
    icon:path.join(__dirname, '../../../icons/icon.ico'),
    width: 1920,
    minWidth: 1600,
    minHeight: 1000,
    show: false,
    frame: config.IsUseSysTitle,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      // 如果是开发模式可以使用devTools
      devTools: process.env.NODE_ENV === 'development',
      // devTools: true,
      // 在macos中启用橡皮动画
      scrollBounce: process.platform === 'darwin'
    }
  })
  
  // 这里设置只有开发环境才注入显示开发者模式
  if (process.env.NODE_ENV === 'development') {
    menuconfig.push({
      label: '开发者设置',
      submenu: [{
        label: '切换到开发者模式',
        accelerator: 'CmdOrCtrl+I',
        role: 'toggledevtools'
      }]
    })
  }
  // 载入菜单
  const menu = Menu.buildFromTemplate(menuconfig)
  Menu.setApplicationMenu(menu)
  mainWindow.loadURL(winURL)

  setIpc.Mainfunc(mainWindow, config.IsUseSysTitle)
  
  upload.Update(mainWindow)
  DownloadUpdate.download(mainWindow)

  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.show()
  })
  if (config.UseStartupChart) loadWindow.destroy()

  if (process.env.NODE_ENV === 'development') mainWindow.webContents.openDevTools(true)

  mainWindow.on('close', () => {
    mainWindow.webContents.send('clearToken');
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  // 初始化打印
  initPrint(mainWindow)

}

function loadingWindow() {
  loadWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    backgroundColor: '#222',
    skipTaskbar: true,
    transparent: true,
    resizable: false,
    webPreferences: { experimentalFeatures: true }
  })

  loadWindow.loadURL(loadingURL)

  loadWindow.show()

  setTimeout(() => {
    createMainWindow()
  }, 2000)

  loadWindow.on('closed', () => {
    loadWindow = null
  })
}

function callNumber() {
  Menu.setApplicationMenu(null); // 关闭子窗口菜单栏
  const modalPath =
    process.env.NODE_ENV === "development"
      ? "http://localhost:9080"
      : `file://${__dirname}/index.html`;
  // 使用hash对子页面跳转，这是vue的路由思想
  callNum = new BrowserWindow({
    height: 1080,
    useContentSize: true,
    width: 1920,
    minWidth: 1600,
    minHeight: 1000,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      // 如果是开发模式可以使用devTools
      devTools: process.env.NODE_ENV === 'development',
      // devTools: true,
      // 在macos中启用橡皮动画
      scrollBounce: process.platform === 'darwin'
    },
    parent: mainWindow, // mainWindow是主窗口
  });
  if (process.env.NODE_ENV === 'development') {
    menuconfig.push({
      label: '开发者设置',
      submenu: [{
        label: '切换到开发者模式',
        accelerator: 'CmdOrCtrl+I',
        role: 'toggledevtools'
      }]
    })
  }
  const menu = Menu.buildFromTemplate(menuconfig)
  Menu.setApplicationMenu(menu)
  callNum.loadURL(modalPath + '#/callNumber');

  callNum.on("closed", () => {
    callNum = null;
  });
}

ipcMain.on('callNumber', e =>
  callNumber()
);

ipcMain.on('accountNewPage', (event, args) =>
 {

  let currentWindow = new BrowserWindow({
    // 不可更改窗口尺寸
    resizable: false,
    // 支持最大化
    maximizable: true,
    height: 1080,
    useContentSize: true,
    width: 1920,
    minWidth: 1600,
    minHeight: 1000,
    // 为了让初始化窗口显示无闪烁，先关闭显示，等待加载完成后再显示。
    // show: false,
    // 开启渲染进程中调用模块  即require
    webPreferences: {
        nodeIntegration: true,
        scrollBounce:true,
    },
    parent: mainWindow
})
currentWindow.loadURL(args)
 }
);

function initWindow() {
  if (config.UseStartupChart) {
    return loadingWindow()
  } else {
    return createMainWindow()
  }
}
export default initWindow
