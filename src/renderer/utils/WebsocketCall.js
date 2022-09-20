
const VUE_APP_MEALWEBSOCKET  = process.env.TERGET_ENV.VUE_APP_MEALWEBSOCKET + 'websocket/coffee/meal/'
var webSocket = null;
var cId = null
var call = null

export const callNumber = function (cafeId, onmessage = function (e) {}) {
    cId = cafeId
    call = onmessage
    webSocket = new WebSocket(VUE_APP_MEALWEBSOCKET + cafeId + '_coffeeMealWebsocket_' + new Date().getTime());
    console.log(VUE_APP_MEALWEBSOCKET + cafeId + '_coffeeMealWebsocket_' + new Date().getTime(),'callNumber')
    webSocket.onopen = (e) => {
        sendMsg(cafeId)
        console.log('callOnopen', e)
    }

    webSocket.onmessage = onmessage
    webSocket.onerror = (e) => {
        console.log('callOnerror', e)
    }
    webSocket.onclose = (e) => {
        console.log('callOnclose', e)
    }

}

export const destory = function () {
    if (null != webSocket) {
        webSocket.close()
        call = null
        webSocket = null
    }

}


export const queryOrderNumber = function () {
    // 发送
    sendMsg(cId)
}

export const sendMsg = function (data) {
    if (null != webSocket) {
        console.log('sendMsg', data)
        webSocket.send(data)
    }
}

export const reConnect = function () {
    if (socketStatus() != 1) {
        callNumber(cId, call)
    }


}

export const socketStatus = function () {
    // 0        CONNECTING        连接尚未建立
    // 1        OPEN              WebSocket的链接已经建立
    // 2        CLOSING           连接正在关闭
    // 3        CLOSED            连接已经关闭或不可用

    if (null == webSocket) {
        return -1
    } else {
        return webSocket.readyState
    }

}