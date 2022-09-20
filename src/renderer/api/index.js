import {post , get , Delete} from './request.js'

// 登录接口
export const login= params => post("/login", params)
// 查询首页菜单列表"
export const getHome = () => get("/coffee/terminal/home");
// 查询工作台页面菜品数据
export const getWorkbench = () => get("/coffee/terminal/workbench");
// 查询商品接口
export const getGoods = params => get(`/coffee/terminal/goods/${params}`);
// 临时加菜弹出页信息查询
export const addOrder = () => get("/coffee/terminal/order/temp");
// 提交临时加菜数据
export const submitAddMeal = params => post("/coffee/terminal/order/temp",params);
// 折扣列表查询
export const getDiscount = ()=> get("/coffee/terminal/discount/info");
// 拉取备注信息列表
export const getRemarks = params => get(`/coffee/terminal/remark/list/${params}`);
// 提交存单
export const saveOrder = params => post("/coffee/terminal/order/storage/submit",params);
// 拉取存单列表接口
export const takeOrderList =  ()=> get("/coffee/terminal/order/storage/list");
// 删除存单
export const delTakeOrder= params => Delete(`/coffee/terminal/order/storage/${params}`)
// 拉取存单详情
export const takeOrderDetail = params => get(`/coffee/terminal/order/storage/detail/${params}`);
// 拉取反结账商品信息
export const getAntiList = params => get(`/coffee/terminal/order/detail/${params}`);
// 提交订单
export const payed= params => post("/coffee/terminal/order/submit/payed", params)
// 查询挂账人
export const getHolder = params => get(`/coffee/terminal/account/holder/${params}`);
// 挂账密码校验
export const verifyPwd= params => post("/coffee/terminal/account/verify", params);
// 拉取交班首页数据
export const handoverHome = () => get('/coffee/terminal/handover/home')
// 拉取交班人
export const handoverUsers = () => get('/coffee/terminal/handover/user/list')
// 拉取交班记录列表
export const handoverRecord = params => post('/coffee/terminal/handover/page/list',params)
// 提交订单接口_等待支付
export const waitOrderSubmit = params => post('/coffee/terminal/order/submit',params)
// 扫码订单支付接口
export const sanCodeSubmit = params => post('/coffee/terminal/order/pay ',params)
// 获取店铺
export const getShops = () => get('/login/cafe/')

// 检查登陆
export const checkLogin = cafeId => get(`/login/check/${cafeId}`)
//登出
export const logoutLogin = () => get('/logout/')

// 拉取未交班记录列表
export const handoverRecordNo = params => post('/coffee/terminal/handover/page/unfinish/list',params)
// 拉取交班详情
export const handoverDetail = id => get(`/coffee/terminal/handover/detail/${id}`)
// 交班接口
export const handoverSubmit = params => post(`/coffee/terminal/handover/submit`,params)

//个人挂账列表
export const personAccountListReq = params => post('/coffee/terminal/account/person/page',params)
//企业挂账列表
export const groupAccountListReq = params => post('/coffee/terminal/account/group/page',params)
//个人挂账详情
export const personAccountDetailReq = params => post('/coffee/terminal/account/person/record/page',params)
//企业挂账详情
export const groupAccountDetailReq = params => post('/coffee/terminal/account/group/record/page',params)
// 个人挂账订单明细
export const personAccountDescReq = id => get(`/coffee/terminal/account/person/record/detail/${id}`)
// 是否需要弹出开班窗口
export const startWork = () => get('/coffee/terminal/handover/is/open')
// 开办接口
export const openMthod = params => post('/coffee/terminal/handover/open',params)
// 获取用户信息
export const getUserInfo = () => get(`/coffee/terminal/user`)

// 企业挂账订单明细
export const groupAccountDescReq = id => get(`/coffee/terminal/account/group/record/detail/${id}`)
// 退单接口
export const chargeBack = params => post('/coffee/terminal/order/return',params)
// 查询订单支付状态
export const checkOrder = params => get(`/coffee/terminal/order/pay/check/${params}`)
// 查询接单列表
export const orderTakingList = params => get(`/coffee/terminal/order/take/list/${params}`)
// 查询接单详情
export const orderTakingDetail = params => get(`/coffee/terminal/order/take/detail/${params}`)
// 查询接单类型
export const getTakeType = () => get(`/coffee/terminal/order/take/type`)
// 设置是否自动接单
export const setAtuo = params => get(`/coffee/terminal/order/set/take/${params}`)
// 接单接口
export const orderTake = params => get(`/coffee/terminal/order/take/${params}`)
// 拒单接口
export const orderRefuse = (id,params) => get(`/coffee/terminal/order/refuse/${id}/${params}`)
// 叫号取餐大屏
export const dashboard = () => get(`/coffee/terminal/order/take/dashboard`)

// 小票
// 打印顾客小票接口
export const customerTicket = (id) => get(`/coffee/terminal/print/customer/${id}`)
// 打印贴纸接口
export const stickersTicket = (id) => get(`/coffee/terminal/print/stickers/${id}`)
// 打印结账单接口
export const accountTicket = (id,type) => get(`/coffee/terminal/print/account/${id}/${type}`)
// 打印交班接口
export const handoverTicket = (id) => get(`/coffee/terminal/print/handover/${id}`)
// 补打反结账小票
export const antiAccountTicket = (id,orderNo) => get(`/coffee/terminal/print/account/all/${id}/${orderNo}`)
// 获取补打订单标识
export const antiAccountList = (id) => get(`/coffee/terminal/print/account/all/${id}`)



// 轮询请求是否有需要打印的订单
export const printPolling = () => get(`/coffee/terminal/print/polling`)
// 模糊匹配现金券
export const matchCoupon = (data) => get(`/coffee/company/voucher/search/${data}`)
// 匹配现金券是否使用
export const matchUseCoupon = (data) => get(`/coffee/company/voucher/query/voucher/${data} `)



//订单列表
export const getOrderList = params => post('/coffee/terminal/order/page',params)
// 挂账还款支付方式
export const rePaymentWay = params => post('/coffee/code/type/code',params)
// 挂账还款用户信息
export const  rePaymentInfo= params => get(`/coffee/personal/credit/account/editor/${params}`)
// 挂账还款公司信息
export const  rePaymentEnterpriseInfo= params => get(`/coffee/enterprise/credit/account/editor/${params}`)
// 个人挂账列表信息
export const rePaymentList = params => post('/coffee/personal/credit/account/record/page',params)
// 企业挂账列表信息
export const rePaymentEnterpriseList = params => post('/coffee/enterprise/credit/account/record/page',params)
// 挂账还款
export const submitRecord = params => post('/coffee/personal/credit/account/record',params)
// 企业挂账还款
export const submitEnterpriseRecord = params => post('/coffee/enterprise/credit/account/record',params)
// 拉取优惠券
export const getCouponList = () => get(`/coffee/terminal/voucher/list`)



