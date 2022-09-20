<template>
  <div class="content">
    <div class="title">
      <div>{{ info.shopName }}</div>
      <span>店铺编号：{{ info.shopCode }}</span>
    </div>
    <div class="main justify justify-center">
      <div
        class="item"
        v-for="(item, index) in list"
        :key="index"
        @click="goMode(item)"
      >
        <div class="box">
          <img :src="item.img" alt="" />
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>

    <el-dialog 
      v-if="workVisible"
      :visible.sync="workVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false"
      width="680px"
      :before-close="handleClose"
    >

    <span slot="title" style="height:0px">
 
  </span>
      <StartWork></StartWork>
    </el-dialog>
  </div>
</template>
<script>
import { getHome, startWork } from "@/api/index";
import StartWork from "@/components/popover/startWork";
import {mapGetters} from "vuex"
const ipc = require("electron").ipcRenderer;
export default {
  data() {
    return {
      info: "",
      list: [],
      // 开班弹出窗
      workVisible: false,
    };
  },
  computed:{
    ...mapGetters(['token'])
  },
  components: {
    StartWork,
  },
  methods: {
    // 跳转页面
    goMode(item) {
      if (item.pathName == "/callNum") {
        ipc.send("callNumber");
        ipc.send("sendToken",this.token);
      } else {
        this.$router.push({ path: item.pathName });
      }
    },
    // 开班弹窗关闭
    handleClose() {
      this.workVisible = false;
    },
  },
  mounted() {
    // 获取首页模块列表
    getHome()
      .then((res) => {
        console.log(res);
        this.info = res.data;
        this.list = res.data.menuList;
      })
      .catch((err) => {
        console.log(err);
      });
    // 判断是否显示开班窗口
    startWork()
      .then((res) => {
        this.workVisible = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__header{
  padding: 0px;
}
.justify-center{
  justify-content: center;
}
.content {
  width: 100%;
  height: calc(100vh - 62px);
  background: url("@/assets/homeBg.png");
  background-size: 100% 100%;
  color: #4f424c;
  padding: 0 100px;
}
.title {
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 20px;
  div {
    font-size: 26px;
    font-weight: bold;
    line-height: 2;
    letter-spacing: 1px;
  }
  span {
    font-size: 13px;
    line-height: 1.5;
  }
}
.main {
  width: 100%;
  height: calc(100vh - 212px);
  overflow: scroll;
  flex-wrap: wrap;
  align-content: flex-start;
}
.item {
  background: #fff;
  border-radius: 80px;
  width: calc(100% / 6 - 50px);
  height: 0;
  padding-bottom: calc(100% / 6 - 50px);
  margin: 20px;
  position: relative;
  cursor: pointer;
}
.box {
  width: 140px;
  height: 180px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -90px;
  margin-left: -70px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  img {
    width: 142px;
    height: auto;
  }
  span {
    display: flex;
    justify-content: center;
    width: 100%;
  }
}
</style>