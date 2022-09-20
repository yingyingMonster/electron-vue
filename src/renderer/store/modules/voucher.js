import lodash from "lodash"
const voucher = {
  state: {
    vouchers: [],
    voucherTotal: 0,
    voucherAllCount: 0,
    activeTab:0
  },

  mutations: {
    // 储存现金券
    setVoucherList(state, data) {
      console.log(data,'data')
      state.vouchers = data;
      state.voucherTotal = lodash._.sum(data.map(item => {
        return item.voucherAmount * item.count
      }))
      state.voucherAllCount =  lodash._.sum(state.vouchers.map(item => {
        return item.count
      }))
    },
    delVoucher(state) {
      state.vouchers = [];
      state.voucherTotal = 0;
      state.voucherAllCount = 0;
    },
    // 添加现金券
    addVoucher(state, data) {
      state.vouchers.push(data);
      state.voucherTotal = lodash._.sum(state.vouchers.map(item => {
        return item.voucherAmount * item.count
      }))
      state.voucherAllCount =  lodash._.sum(state.vouchers.map(item => {
        return item.count
      }))
    },
    // 删除订单
    subVoucher(state, data) {
      state.vouchers = lodash._.remove(state.vouchers, function (n) {
        return n.voucherId != data
      });
      state.voucherTotal = lodash._.sum(state.vouchers.map(item => {
        return item.voucherAmount 
      }))
      state.voucherAllCount =  lodash._.sum(state.vouchers.map(item => {
        return item.count
      }))
    },
    // 储存现金券tab标签
    saveTab(state,data){
      state.activeTab=data
    }
  },

  actions: {}
}

export default voucher