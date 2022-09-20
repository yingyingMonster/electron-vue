<template>
  <div class="container justify">
    <div class="left">
      <div class="title justifyC">
        <p>请取餐</p>
        <span>Please take meal</span>
      </div>
      <div class="main">
        <div class="orderItem" v-for="(item, index) in madeOrder" :key="index">
          {{ item }}
        </div>
      </div>
    </div>
    <div class="right">
      <img src="@/assets/callNumber.png" alt="" />
      <div class="making">
        <div class="title justifyC">
          <p>制作中</p>
          <span>Making</span>
        </div>
        <div class="main">
          <div
            class="orderItem"
            v-for="(item, index) in makingOrder"
            :key="index"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { dashboard } from "@/api";
import {
  callNumber,
  socketStatus,
  reConnect
} from "@/utils/WebsocketCall.js";
export default {
  data() {
    return {
      makingOrder: [],
      madeOrder: [],
      // 定时器
      timer: "",
      websocketStatus:0
    };
  },
  mounted() {
    const that = this;
    this.getList();
     // 初始化 websocket
    callNumber(localStorage.getItem("cafeId"), (e) => {
      // 消息
      console.log("ssssss", e); 
      this.getList();
    });
    this.timer=setInterval(function(){
      let status = socketStatus();

      if (!that.websocketStatus || that.websocketStatus != status) {
        that.websocketStatus = status;
      }

      // 检测websocket 状态 如果链接失败需要重新链接
      console.log(status)
      if (status != 1) {
        if (!that.rConnectTimer) {
          let rConnectTimer = setInterval(function () {
            console.log("socket reConnect");
             that.getList();
            reConnect();
          }, 1000);
          that.rConnectTimer = rConnectTimer;
        }
      } else {
        if (that.rConnectTimer) {
          clearInterval(that.rConnectTimer);
          that.rConnectTimer = null;
        }
      }
    },1000)

  },
  methods: {
    getList() {
      dashboard()
        .then((res) => {
          console.log(res);
          this.makingOrder = res.data.makingOrder; 
          this.madeOrder = res.data.madeOrder;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
  color: #fff;
  overflow: hidden;
}
.left {
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #000;
}
.right {
  width: 40%;
  position: relative;
  .making {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 3;
  }
  img {
    position: absolute;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
}
.title {
  border-bottom: 1px solid #fff;
  width: 80%;
  height: 100px;
  margin: 40px 0;
  padding: 20px 0;
  align-items: center;
  p {
    height: 40px;
    line-height: 40px;
    font-size: 60px;
    margin: 0;
    margin-right: 20px;
    letter-spacing: 2px;
  }
  span {
    font-size: 40px;
    letter-spacing: 2px;
  }
}
.main {
  width: 80%;
  height: calc(100vh - 180px);
  overflow: scroll;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-content: flex-start;
  .orderItem {
    width: 50%;
    text-align: center;
    height: 100px;
    line-height: 100px;
    font-size: 60px;
    font-weight: bold;
  }
}
</style>