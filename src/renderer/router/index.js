import Vue from 'vue'
import Router from 'vue-router'
// 引入路由表
import routerMap from './constantRouterMap'
// 路由重复点击报错解决
const originalPush = Router.prototype.push;
const originalReplace = Router.prototype.replace


Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
// replace
Router.prototype.replace = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}
Vue.use(Router)

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: routerMap
})
