<template>
  <div class="content justifyS" v-if="showNav">
    <div class="topTitle justify">
      <img src="@/assets/caffee_logo.png" class="cafe-logo" v-if="title == '首页'" />
      <div v-else>
        <div class="orderedBtn account-menue" @click="backPage" v-if="!showAccountMenue">
          <i class="el-icon-back" v-if="back"></i>
          <img style="width: 16px; height: auto" src="@/assets/menue_fold.png" alt v-if="!back" />
          <span class="marginleft7"> {{ title }}</span>
        </div>
      </div>
      <div v-if="showAccountMenue" class="account-menue">
        <img v-if="back" style="width: 18px; height: 18px" src="@/assets/menue_fold.png" @click="goHome" alt />
        <span :class="
          menueIndex == 0
            ? 'compadding30 commenue-select'
            : 'compadding30 commenue-unselect'
        " @click="accountPersonClcik">个人挂账
        </span>
        <span :class="menueIndex == 1 ? 'commenue-select' : 'commenue-unselect'" @click="accountEnterpriseClcik">企业挂账
        </span>
      </div>

      <div class="order-reminder justifyS" v-if="showOrderNumber && orderNumber > 0" @click="orderTaking">
        <div class="order-reminder justifyS" v-if="showOrderNumber">
          <p>
            <i class="el-icon-warning"></i>
            您有{{ orderNumber }}笔订单
          </p>
          <span>
            去处理
            <i class="el-icon-arrow-right"></i>
          </span>
        </div>
        <li class="el-icon-warning warning-status" v-if="websocketStatus != 1" />
      </div>
    </div>

    <div class="controls-container">
      <el-input v-if="showSearch" class="search" prefix-icon="el-icon-search" @input="isEmpty" @change="handleChange"
        v-model="search" placeholder="请输入单品名称"></el-input>
      <div class="time">{{ time }}</div>
      <img src="@/assets/print.png" @click="print" class="controls-icon" alt="" />
      <img src="@/assets/msg.png" @click="getMsg" class="controls-icon" alt="" />
      <el-dropdown trigger="click">
        <el-image :src="info.avatar" class="user" alt="" />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
          <el-dropdown-item @click.native="goHome">首页</el-dropdown-item>
          <el-dropdown-item @click.native="personalCenter">个人中心
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-drawer destroy-on-close title="个人中心" :withHeader="false" :visible.sync="drawer" closeDrawer="hanleClose"
      size="20%" :with-header="false">
      <PersonalCenter></PersonalCenter>
    </el-drawer>
  </div>
</template>
<script>
import moment from "moment";
import Utils from "@/utils/util.js";
import PersonalCenter from "@/components/popover/personalCenter";
import {
  init,
  socketStatus,
  reConnect,
  queryOrderNumber,
} from "@/utils/WebsocketCore.js";
import {
  printCustomerTicket,
  printStickersTicket,
  printBill,
} from "@/utils/PrintCore";
import { getUserInfo, printPolling, logoutLogin } from "@/api";

const ipc = require("electron").ipcRenderer;
export default {
  watch: {
    $route() {
      this.getNav();
    },
  },
  data() {
    return {
      // 定时器
      timer: "",
      time: "",
      search: "",
      title: "",
      back: true,
      showOrderNumber: true,
      showSearch: true,
      showNav: true,
      orderNumber: 0,
      websocketStatus: 0,
      showAccountMenue: false,
      menueIndex: 0,
      // 个人中心
      drawer: false,
      // 个人信息
      info: {},
      // 店铺id
      shopId: "",
      // 用于计算 轮询请求是否有需要打印的订单 时间
      printCount: 0,
    };
  },
  components: {
    PersonalCenter,
  },
  mounted() {
    this.getNav();
    const that = this;
    // 初始化 websocket
    init(localStorage.getItem("cafeId"), (e) => {
      // 消息
      let data = e.data;
      console.log("socket onMessage", data);
      this.orderNumber = data;
      Utils.$emit("refreshOrder");
    });

    this.timer = setInterval(function () {
      that.printCount = that.printCount + 1;
      // console.log(that.printCount)
      if (that.printCount == 30) {
        that.printCount = 0;
        if (!localStorage.getItem("token")) {
          return;
        }
        // 请求是否有需要打印的订单
        printPolling().then((res) => {
          console.log(res, "轮询");
          if (res.code == 200 && res.data) {
            let data = res.data;
            if (data.isPrint && data.printList) {
              for (let i = 0; i < data.printList.length; i++) {
                let obj = data.printList[i];
                // 打印顾客小票
                if (obj.customerId != null) {
                  printCustomerTicket(obj.customerId);
                }
                // 打印结转单
                printBill(obj.accountId);
                // 打印贴纸
                if (obj.stickerList != null && obj.stickerList.length > 0) {
                  for (let j = 0; j < obj.stickerList.length; j++) {
                    let d = JSON.stringify(obj.stickerList[j]);
                    let params = encodeURIComponent(d);
                    printStickersTicket(params);
                  }
                }
              }
            }
          }
        });
      }

      that.time = moment().locale("zh-cn").format("llll");
      let status = socketStatus();

      if (!that.websocketStatus || that.websocketStatus != status) {
        that.websocketStatus = status;
      }

      // 检测websocket 状态 如果链接失败需要重新链接
      if (status != 1) {
        if (!that.rConnectTimer) {
          let rConnectTimer = setInterval(function () {
            console.log("socket reConnect");
            reConnect();
          }, 5 * 1000);
          that.rConnectTimer = rConnectTimer;
        }
      } else {
        if (that.rConnectTimer) {
          clearInterval(that.rConnectTimer);
          that.rConnectTimer = null;
        }
      }
    }, 1000);

    Utils.$on("queryOrderNumber-websocket", () => {
      queryOrderNumber();
    });
    // 修改标题
    Utils.$on("changeMetaTitle", (e) => {
      that.title = e;
    });

    // 获取用户信息
    getUserInfo()
      .then((res) => {
        if (res.code == 200) {
          this.info = res.data;
          this.$store.commit("setUserInfo", res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // 退出状态
    ipc.on("clearToken", () => {
      localStorage.setItem("token", "");
    });
  },
  methods: {
    // 打印按钮
    print() { },
    // 信息按钮
    getMsg() { },
    // 退出
    logout() {
      logoutLogin().then(() => {
        this.$store.commit("clearToken");
        localStorage.setItem("token", "");
        this.$router.push({ path: "/login" });
      });
    },
    // 跳转首页
    goHome() {
      this.$router.push({ path: "/home" });
    },
    backPage() {
      if (this.back) {
        this.$router.back();
      } else {
        this.$router.push({ path: "/home" });
      }
    },

    //个人挂账
    accountPersonClcik() {
      this.$router.push({ path: "/openAccountIndex" });
    },

    //企业挂账
    accountEnterpriseClcik() {
      this.$router.push({ path: "/enterpriseAccountIndex" });
    },

    getNav() {
      this.title = this.$route.meta.title;
      let back = true;
      if (this.$route.meta.back != undefined) {
        back = this.$route.meta.back;
      }
      console.log(this.$route.path);
      this.back = back;

      // 要显示订单数量 页面
      let showOrderNumber = false;
      if (this.$route.meta.showOrderNumber != undefined) {
        showOrderNumber = this.$route.meta.showOrderNumber;
      }

      this.showOrderNumber = showOrderNumber;

      // 要显示搜索 页面
      let showSearch = false;
      if (this.$route.meta.showSearch != undefined) {
        showSearch = this.$route.meta.showSearch;
      }

      this.showSearch = showSearch;

      // 要显示搜索 页面
      let showNav = true;
      if (this.$route.meta.showNav != undefined) {
        showNav = this.$route.meta.showNav;
      }

      // 要显示挂帐页面
      let showAccountMenue = false;
      let menueIndex = 0;
      if (this.$route.meta.showAccountMenue != undefined) {
        showAccountMenue = this.$route.meta.showAccountMenue;
        menueIndex = this.$route.meta.menueIndex;
      }

      this.showAccountMenue = showAccountMenue;
      this.menueIndex = menueIndex;

      this.showNav = showNav;
    },
    // 搜索文字
    handleChange(e) {
      console.log(e);
      // 存储vuex
      this.$store.commit("saveSearch", e);
    },
    // 判断是否为空
    isEmpty(e) {
      if (e == "") {
        this.$store.commit("saveSearch", "");
      }
    },
    // 个人中心
    personalCenter() {
      this.drawer = true;
    },
    // 关闭个人中心
    hanleClose() {
      this.drawer = false;
    },
    // 跳转接单
    orderTaking() {
      this.$router.push("/orderTaking");
    },
  },
  beforeDestroy() {
    Utils.$off("queryOrderNumber-websocket");
    Utils.$off("changeMetaTitle");
    ipc.off(["clearToken"]);
    clearInterval(this.timer);
  },
};
</script>
<style lang="scss">
.search {
  width: 300px;
  background: #4f424c;

  input {
    border-radius: 30px;
    background: #4f424c;
    color: #fff;
  }
}
</style>
<style lang="scss" scoped>
.content {
  width: 100%;
  height: 62px;
  align-items: center;
  background: #4f424c;
}

.time {
  width: 300px;
  text-align: center;
  color: #fff;
}

.controls-container {
  width: 70%;
  padding: 0 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.controls-icon {
  width: 24px;
  height: auto;
  cursor: pointer;
  margin-right: 20px;
}

.user {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  border: 2px solid #ffffff;
}

.topTitle {
  width: 30%;
  padding: 0 40px;
  align-items: center;
}

.orderedBtn {
  margin-right: 40px;

  i {
    color: #fff;
    font-size: 16px;
  }

  color: #fff;
  font-size: 16px;
}

.order-reminder {
  width: 230px;
  height: 40px;
  border-radius: 30px;
  background: #fff;
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  p {
    font-size: 13px;

    i {
      color: #f06543;
      font-size: 16px;
    }

    color: #4f424c;
  }

  span {
    font-size: 13px;
    color: #f06543;
    cursor: pointer;
  }
}

/**菜单*/
.menueBtn {
  color: #fff;
}

.commenue-select {
  color: #fff;
}

.commenue-unselect {
  color: #bfc2cc;
  cursor: pointer;
}

.compadding-right30 {
  padding-right: 30px;
}

.compadding30 {
  padding: 0px 30px 0px 7px;
}

.marginleft7 {
  margin-left: 7px;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
}

.compadding-right7 {
  padding-right: 7px;
}

.warning-status {
  color: #e6a23c;
}

.cafe-logo {
  width: 84px;
  height: 27px;
}

.account-menue {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
}
</style>