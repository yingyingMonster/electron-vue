<template>
  <div>
    <el-dialog
      title="下载进度"
      :visible.sync="dialogVisible"
      :show-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      center
      width="50%"
      top="45vh"
    >
      <div class="conten">
        <el-progress
          :percentage="percentage"
          :status="progressStaus"
        ></el-progress>
      </div>
    </el-dialog>
  </div>
</template>

<script>
let ipcRenderer = require("electron").ipcRenderer;
import { mapGetters } from "vuex";
import ElementUI from "element-ui";
export default {
  computed: {
    ...mapGetters(["needUpgrade"]),
  },
  data: () => ({
    percentage: 0,
    dialogVisible: false,
    progressStaus: null,
  }),
  mounted() {
    ipcRenderer.on("UpdateMsg", (event, arg) => {
      // -1 检查更新失败 0 正在检查更新 1 检测到新版本，准备下载 2 未检测到新版本 3 下载中 4 下载完成
      switch (arg.state) {
        case 1:
          this.$store.commit("setUpgrade", true);
          this.$confirm("检查到有新版本，是否更新?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            this.dialogVisible = true;
            this.$ipcApi.send("confirm-downloadUpdate");
          });
          break;
        case 2:
          if (this.showVersionTip) {
            ElementUI.Message({
              type: "success",
              message: "当前为最新版本!",
            });
          }
          this.showVersionTip = true;

          break;
        case 3:
          this.percentage = arg.msg.percent.toFixed(0);
          break;
        case 4:
          this.dialogVisible = false;
          this.progressStaus = "success";
          this.$alert("下载完成！", "提示", {
            confirmButtonText: "确定",
            callback: (action) => {
              if (action == "confirm") {
                this.$store.commit("setUpgrade", false);
                this.$ipcApi.send("confirm-update");
              }
            },
          });
          break;
        default:
          break;
      }
    });
    this.$ipcApi.send("check-update");
  },
  beforeDestroy() {
    ipcRenderer.off(["UpdateMsg"]);
  },
};
</script>
<style scoped>
.conten {
  width: 90%;
  margin: 0 auto;
  padding: 0px 0px 20px 0px;
}
</style>