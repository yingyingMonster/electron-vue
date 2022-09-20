import lodash from 'lodash'
const order = {
  state: {
    // 下单列表
    orderedMeal: [],
    // 搜索内容
    searchTxt:"",
    // 反结账信息
    antiInfo:""
  },

  mutations: {
    // 清空订单
    emptyOrder(state) {
      console.log("清空--")
      state.orderedMeal = [];
    },
    // 订单修改
    changeOrder(state, data) {
      data.key.amount=null;
      data.newVal.amount=null;
      let index = lodash._.indexOf(state.orderedMeal, lodash._.find(state.orderedMeal, data.key));
      state.orderedMeal.splice(index, 1, data.newVal);
      console.log(state.orderedMeal)
    },
    // 添加订单
    addOrder(state, data) {
      let list = state.orderedMeal
      list.map((item) => {
        item.select = item.id == data.id
      })
      data.select = true
      list.push(data)
      state.orderedMeal = list
    },
    // 合并订单
    concatOrder(state, data) {
      state.orderedMeal = state.orderedMeal.concat(data);
    },
    // 删减订单
    subOrder(state, data) {
      let index = lodash._.indexOf(state.orderedMeal, lodash._.find(state.orderedMeal, data));
      state.orderedMeal.splice(index, 1);
    },
    // 删除订单
    delOrder(state, data) {
      state.orderedMeal = lodash._.differenceWith(state.orderedMeal, data, lodash._.isEqual);
    },
    // 根据数量生成订单
    createOrder(state,data){
      let count=data.amount;
      for(let i=0;i<count;i++){
        data.amount=null;
        state.orderedMeal.push(data)
      }
      console.log(state.orderedMeal)
    },
    // 整单备注
    batchRemarks(state,data){
      state.orderedMeal=state.orderedMeal.map(item=>{
        item.remark=data
        return item
      })
      console.log(state.orderedMeal)
    },
    // 整单打包
    packAll(state,data){
      state.orderedMeal=state.orderedMeal.map(item=>{
        item.isPack=data
        return item
      })
      console.log(state.orderedMeal)
    },
    // 保存搜索内容
    saveSearch(state,data){
      state.searchTxt=data
    },
    // 设置反结账信息
    setAntiInfo(state,data){
      state.antiInfo=data
    }
    
  },

  actions: {}
}

export default order