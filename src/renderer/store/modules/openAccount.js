const openAccount = {
    state: {
      // 挂账信息
      openAccountInfo:""
    },
  
    mutations: {
      setInfo(state,data){
        state.openAccountInfo=data
      }
    },
  
    actions: {}
  }
  
  export default openAccount