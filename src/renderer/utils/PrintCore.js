import {
    BrowserWindow,
    ipcMain
} from 'electron'
const ipc = require("electron").ipcRenderer;
var queuePrint = []
var parent = null
var currentMap = null
var currentWindow = null
export const initPrint = (p) => {
    parent = p

    ipcMain.on('printCore-print', (event, args) => {
        if (args.clear) {
            queuePrint = []
        }
        addPrintQueue(args)
    })


    ipcMain.on('printCore-prepare', () => {
        let prints = currentWindow.webContents.getPrinters()
        let hasPrint = false
        if (prints) {
            // 判断打印机是否存在
            for (let i = 0; i < prints.length; i++) {
                let print = prints[i]
                if (print.name == currentMap.deviceName) {
                    hasPrint = true
                    break;
                }
            }
        }
        if (hasPrint) {
            setTimeout(() => {
                startPrint()
            }, 250);
        } else {
            nextPrint(false, 'device not fount')
        }


    })
}
const startPrint = () => {
    // 页面准备好主备打印
    currentWindow.webContents.print({
        silent: true,
        deviceName: currentMap.deviceName
    }, (success, failureReason) => {
        nextPrint(success, failureReason)
    });

}
const nextPrint = (success, failureReason) => {

    parent.webContents.send("printCore-printResult", {
        deviceName: currentMap.deviceName,
        url: currentMap.url,
        // 打印完成
        end: queuePrint.length <= 1,
        success: success,
        failureReason: failureReason
    });

    // 关闭当前页面
    currentWindow.close()
    currentWindow = null
    // 移除当前第一位置的 数组 
    queuePrint.splice(0, 1)
    // 判断是否有下一页
    if (queuePrint.length > 0) {
        currentMap = queuePrint[0]
        print()
    }


}

/**
{
    "url": "",
    "deviceName": "", 
}
 * @param {*} map 
 */
const addPrintQueue = (map) => {

    queuePrint.push(map)

    if (queuePrint.length == 1) {
        currentMap = queuePrint[0];

        print()
    }
}

const print = () => {
    currentWindow = new BrowserWindow({
        // 不可更改窗口尺寸
        resizable: true,
        // 支持最大化
        maximizable: true,
        // 为了让初始化窗口显示无闪烁，先关闭显示，等待加载完成后再显示。
        show: false,
        // 开启渲染进程中调用模块  即require
        webPreferences: {
            nodeIntegration: true,
        },
        parent: parent
    })
    currentWindow.loadURL(currentMap.url)
}
// 1 结账单 2反结账单
export const printBill = (id, type = 1, clear = false) => {

    let map = {
        url: getBaseUrl(`printBill/${id}/${type}/0`),
        deviceName: "XP-80C",
        clear: clear
    };
    ipc.send("printCore-print", map);

    if (type !== 2) {
        let map1 = {
            url: getBaseUrl(`printBill/${id}/${type}/0`),
            deviceName: "XP-80C (副本 1)",
            clear: clear
        };
        ipc.send("printCore-print", map1);
    }
}
// 补打结账单、补打反结账单
export const supPrintBill = (id, type = 1,orderNo=0, clear = false) => {
    let map = {
        url: getBaseUrl(`printBill/${id}/${type}/${orderNo}`),
        deviceName: "XP-80C",
        clear: clear
    };
    ipc.send("printCore-print", map); 
}

// 打印挂帐单
export const printHangUpBill = (data, clear = false) => {

    let map = {
        url: getBaseUrl(`hangUpBill/${data}`),
        deviceName: "XP-80C",
        clear: clear
    };
    ipc.send("printCore-print", map);

}

export const printHandover = (id, clear = false) => {

    let map = {
        url: getBaseUrl(`printHandover/${id}`),
        deviceName: "XP-80C",
        clear: clear
    };
    ipc.send("printCore-print", map);


}

export const printStickersTicket = (params, clear = false) => {

    let map = {
        url: getBaseUrl(`printMiniStickers/${params}`),
        deviceName: "Xprinter XP-320B",
        clear: clear
    };
    ipc.send("printCore-print", map);


}

export const printCustomerTicket = (id, clear = false) => {

    let map = {
        url: getBaseUrl(`printCustomer/${id}`),
        deviceName: "XP-80C",
        clear: clear
    };
    console.log(map)
    ipc.send("printCore-print", map);
}

const getBaseUrl = (path) => {
    return process.env.NODE_ENV === "development" ?
        `http://localhost:9080/#/${path}` :
        `file://${__dirname}/index.html#${path}`
}