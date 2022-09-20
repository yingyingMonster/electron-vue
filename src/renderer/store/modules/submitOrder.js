const submitOrder= {
    state: {
        // 提交订单参数
        submitValue:"",
        // 原来总价
        originalPrice:"",
        // 是否打印结账单
        checkPrintBill:true
    },
  
    mutations: {
      setSub(state,data){
          state.submitValue=data
      },
      setOrigin(state,data){
        state.originalPrice=data
      },
      setPrint(state,data){
        state.checkPrintBill=data
      }
    },
  
    actions: {

    }
  }
  
  export default submitOrder