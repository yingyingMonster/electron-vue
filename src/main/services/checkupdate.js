import { autoUpdater } from 'electron-updater'
import { ipcMain } from 'electron'
const path = require('path')
/**
 * -1 检查更新失败 0 正在检查更新 1 检测到新版本，准备下载 2 未检测到新版本 3 下载中 4 下载完成
 **/
function Message(mainWindow, type, data) {
  const senddata = {
    state: type,
    msg: data
  }
  mainWindow.webContents.send('UpdateMsg', senddata)
}

export default {
  Update(mainWindow) {
    // 设置地址要和package中的一样

    autoUpdater.autoDownload = false

    autoUpdater.setFeedURL('https://archive-artifacts.oss-cn-beijing.aliyuncs.com/desktop/an-plus-coffee-desktop/' + process.env.TERGET_ENV.NODE_ENV + "/")

    if (process.env.TERGET_ENV.NODE_ENV == "development") {
      autoUpdater.updateConfigPath = path.join(__dirname, '../../../yml/dev-app-update.yml')
    } else if (process.env.TERGET_ENV.NODE_ENV == "test") {
      autoUpdater.updateConfigPath = path.join(__dirname, '../../../yml/test-app-update.yml')
    } else {
      autoUpdater.updateConfigPath = path.join(__dirname, '../../../yml/prod-app-update.yml')
    }


    // 当更新发生错误的时候触发。
    autoUpdater.on('error', (err) => {
      console.log('更新出现错误')
      console.log(err.message)
      if (err.message.includes('sha512 checksum mismatch')) {
        Message(mainWindow, -1, 'sha512校验失败')
      } else {
        Message(mainWindow, -1, '请检查主进程报错信息')
      }
    })

    // 当开始检查更新的时候触发
    autoUpdater.on('checking-for-update', (event, arg) => {
      console.log('开始检查更新')
      Message(mainWindow, 0)
    })

    // 发现可更新数据时
    autoUpdater.on('update-available', (event, arg) => {
      console.log('有更新')

      Message(mainWindow, 1)
    })

    // 没有可更新数据时
    autoUpdater.on('update-not-available', (event, arg) => {
      console.log('没有更新')
      Message(mainWindow, 2)
    })

    // 下载监听
    autoUpdater.on('download-progress', (progressObj) => {
      Message(mainWindow, 3, progressObj)
    })

    // 下载完成
    autoUpdater.on('update-downloaded', () => {
      console.log('下载完成')
      Message(mainWindow, 4)
    })
    // 执行自动更新检查
    ipcMain.handle('check-update', () => {
      autoUpdater.checkForUpdates().catch(err => {
        console.log('网络连接问题', err)
        Message(mainWindow, 5,err)
      })
    })
    // 渲染进程执行更新操作
    ipcMain.handle('confirm-update', () => {
      autoUpdater.quitAndInstall()
    })

    // 手动下载更新文件
    ipcMain.handle('confirm-downloadUpdate', () => {
      autoUpdater.downloadUpdate()
    })
  }
}
