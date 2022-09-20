const Login = () => import('@/views/login')
const Notfound = () => import('@/views/404')
/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/

/**
 * hidden: true                 如果在模板中使用该选项,则不会在侧栏显示该路由(例如：Dashboard),如果是在第一个子路由中使用,侧栏则只显示第一个子路由的名字和图标(例如: Form)
 * alwaysShow: true             如果设置为true它则会始终显示根菜单,无视自路由长度,没有设置的话,就会折叠起来(不清楚为什么没有作用,可能是我写错位置了?)
 * redirect: noredirect         若设置为noredirect则顶部面包屑不能够为其重定向.
 * onlyShowfirst: false         若该设置为true时，将会无视其有多少个孩子路由，只会显示第一个子路由并将其设置为根菜单
 * name:'router-name'           路由名称,此项为必须填写项
 * meta : {
    title: 'title'               这里的名字决定了面包屑和侧栏的名字
    icon: 'svg-name'             当你在svg文件夹内加入了你的图标,那么在这里填写图标名他就会显示在侧栏
  }
 **/
export default [
  {
    path: '/',
    name: 'frontPage',
    component: () => import('@/views/index'),
    redirect: "/home",
    children: [
      {
        path: '/orderedMeal',
        name: 'orderedMeal',
        component: () => import('@/views/orderedMeal/index'),
        meta: { title: '点餐页面', showSearch: true, showOrderNumber: true},
        redirect: "/menuList",
        children: [
          {
            path: '/menuList',
            name: 'menuList',
            component: () => import('@/components/menuTabbar'),
            meta: { title: '点餐', showSearch: true, showOrderNumber: true ,back:false },
          },
          {
            path: '/morePayment',
            name: 'morePayment',
            component: () => import('@/components/morePayment'),
            meta: { title: '更多支付方式', showSearch: true, showOrderNumber: true },
          },
          {
            path: '/antiCheckout',
            name: 'antiCheckout',
            component: () => import('@/views/order/antiCheckout'),
            meta: { title: '反结账', showSearch: false, showOrderNumber: true },
          }
        ]
      },
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/index'),
        meta: { title: '首页', back: false, showOrderNumber: true, }
      },
      {
        path: '/handover',
        name: 'handover',
        component: () => import('@/views/handover/index'),
        meta: { title: '交班' },
        redirect: "/handoverIndex",
        children: [
          {
            path: '/handoverIndex',
            name: 'handoverIndex',
            component: () => import('@/views/handover/handoverIndex/index'),
            meta: { title: '交班', back: false },
          },
          {
            path: '/handoverRecord/:noSubmitNums',
            name: 'handoverRecord',
            component: () => import('@/views/handover/handoverRecord/index'),
            meta: { title: '交班记录' },
          },

          {
            path: '/handoverDetail/:id/:type',
            name: 'handoverDetail',
            component: () => import('@/views/handover/handoverDetail/index'),
            meta: { title: '交班详情' },
          },

        ]
      },
      {
        path: '/orderTaking',
        name: 'orderTaking',
        component: () => import('@/views/orderTaking/index'),
        meta: { title: '接单', back: false },
      },
      {
        path: '/openAccount',
        name: 'openAccount',
        component: () => import('@/views/openAccount/index'),
        meta: { title: '挂账' },
        redirect: "/openAccountIndex",
        children: [
          {
            path: '/openAccountIndex',
            name: 'openAccountIndex',
            component: () => import('@/views/openAccount/openAccountIndex/index'),
            meta: { title: '挂账', showAccountMenue: true, menueIndex: 0 },
          },

          {
            path: '/enterpriseAccountIndex',
            name: 'enterpriseAccountIndex',
            component: () => import('@/views/openAccount/enterpriseAccountIndex/index'),
            meta: { title: '企业挂账', showAccountMenue: true, menueIndex: 1 },
          },

          {
            path: '/openAccountPersonDetail',
            name: 'openAccountPersonDetail',
            component: () => import('@/views/openAccount/openAccountPersonDetail/index'),
            meta: { title: '个人挂账明细' },
          },

          {
            path: '/openAccountEnterpriseDetail',
            name: 'openAccountEnterpriseDetail',
            component: () => import('@/views/openAccount/openAccountPersonDetail/index'),
            meta: { title: '企业挂账明细' },
          },
          {
            path: '/openAccountOrderDetail',
            name: 'openAccountOrderDetail',
            component: () => import('@/views/openAccount/openAccountOrderDetail/index'),
            meta: { title: '挂账订单明细' },
          },
          {
            path: '/rePayment',
            name: 'rePayment',
            component: () => import('@/views/openAccount/rePayment/index'),
            meta: { title: '挂账还款' },
          },
        ]
      },
      {
        path: '/order',
        name: 'order',
        component: () => import('@/views/order/index'),
        meta: { title: '订单列表',back: false },
        // redirect: "/orderList",
        // children: [
        //   {
        //     path: '/orderList',
        //     name: 'getOrderList',
        //     component: () => import('@/views/order/orderList/index'),
        //     meta: { title: '订单列表' },
        //   },
        //
        // ]
      },

    ]
  },
  { path: '/login', component: Login, hidden: true },
  { path: '*', component: Notfound, hidden: true },
  {
    path: '/callNumber',
    name: 'callNumber',
    component: () => import('@/views/callNumber/index'),
    meta: { title: '叫号' },
  },
  // 打印挂账单
  {
    path: '/hangUpBill/:data',
    name: 'hangUpBill',
    component: () => import('@/views/prints/hangUpBill')
  },
  {
    path: '/printHandover/:id',
    name: 'printHandover',
    component: () => import('@/views/prints/handover')
  },
  {
    path: '/printCustomer/:id',
    name: 'customer',
    component: () => import('@/views/prints/customer')
  },
  {
    path: '/printAcountDiscount',
    name: 'accountDiscount',
    component: () => import('@/views/prints/accountDiscount')
  },
  {
    path: '/printBill/:id/:type/:orderNo',
    name: 'bill',
    component: () => import('@/views/prints/bill')
  },
  {
    path: '/printMiniStickers/:params',
    name: 'miniStickers',
    component: () => import('@/views/prints/miniStickers')
  },
  {
    path: '/prinAntiCheckout',
    name: 'prinAntiCheckout',
    component: () => import('@/views/prints/antiCheckout')
  }


]
