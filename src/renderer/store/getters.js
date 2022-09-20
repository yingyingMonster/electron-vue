/**
 * 在这里则是state.文件名.状态名
 */
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  cafeBusinessNumber: state => state.user.cafeBusinessNumber,
  terminalKey: state => state.user.terminalKey,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  orderedMeal: state => state.order.orderedMeal,
  searchTxt: state => state.order.searchTxt,
  openAccountInfo: state => state.openAccount.openAccountInfo,
  submitValue: state => state.submitOrder.submitValue,
  originalPrice: state => state.submitOrder.originalPrice,
  userInfo: state => state.user.userInfo,
  antiInfo: state => state.order.antiInfo,
  checkPrintBill: state => state.submitOrder.checkPrintBill,
  needUpgrade: state => state.user.needUpgrade,
  vouchers: state => state.voucher.vouchers,
  voucherTotal:state => state.voucher.voucherTotal,
  voucherAllCount:state=>state.voucher.voucherAllCount,
  activeTab:state=>state.voucher.activeTab
}
export default getters
