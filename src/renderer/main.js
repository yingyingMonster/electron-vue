import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'

import './styles/theme/index.css'
// 引用element
import ElementUI from 'element-ui'
// 引用lodash
import _ from 'lodash'
Vue.prototype._ = _
// 日志
import './error'
import './icons'
import '@/styles/index.scss'
import moment from "moment"


if (!process.env.IS_WEB) {
  if (!require('../../config').IsUseSysTitle) {
    require('@/styles/custom-title.scss')
  }
  // 当处于electron状态下才引用db
  Vue.prototype.$ipcApi = require('./utils/ipcRenderer').default
}
Vue.use(ElementUI)
Vue.prototype.$moment = moment

Vue.config.productionTip = false
/* eslint-disable no-new */
const vue = new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

export default vue
