<template>
  <div class="container">
    <div class="item justify">
      <span>挂账人</span>
      <el-select
        v-model="value"
        filterable
        @change="selectActive"
        placeholder="请选择"
      >
        <el-option
          v-for="(item, index) in options"
          :key="index"
          :label="item.label"
          :value="index"
        >
        </el-option>
      </el-select>
    </div>
    <transition name="fade">
      <div class="item justify" v-if="this.isShowPwd">
        <span>密码</span>
        <el-input type="password" v-model="subVal.password"></el-input>
      </div>
    </transition>

    <div class="justifyS action">
      <el-button class="cancel" @click="cancel">取消</el-button>
      <el-button type="darkGreen" @click="confirm">确定</el-button>
    </div>
  </div>
</template>
<script>
import { getHolder, verifyPwd } from "@/api";
export default {
  data() {
    return {
      options: [],
      value: "",
      subVal: {
        // 密码
        password: "",
        // 挂账人ID
        creditUserId: "",
        // 挂账人类型
        creditType: "",
      },
      // 是否显示密码
      isShowPwd: true,
      // 当前挂账人信息
      openAccountInfo: "",
    };
  },
  mounted() {
    this.getOptions();
  },
  methods: {
    // 获取挂账人列表
    getOptions() {
      getHolder("-1")
        .then((res) => {
          this.options = res.data.map((item) => {
            return { value: item, label: item.name };
          });
          console.log(this.options);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 确定按钮
    confirm() {
      if (this.isShowPwd) {
        verifyPwd(this.subVal)
          .then((res) => {
            console.log(res);
            if (res.data) {
              this.$emit("confirmOpenAccount");
            } else {
              this.$message({
                type: "error",
                message: "密码错误",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }else{
        this.$emit("confirmOpenAccount");
      }
    },
    // 当前挂账人
    selectActive(index) {
      this.subVal.creditUserId = this.options[index].value.creditUserId;
      this.subVal.creditType = this.options[index].value.creditType;
      // 是否展示密码框
      this.isShowPwd = this.options[index].value.isPassword;
      // 储存当前挂账人信息
      console.log(this.options[index].value);
      this.$store.commit("setInfo", this.options[index].value);
    },
    // 关闭弹窗
    cancel() {
      this.$parent.handleClose();
    },
  },
};
</script>
<style lang="scss">
.container {
  .el-select {
    width: 100%;
  }
}
.el-select-dropdown__item.selected {
  color: #009e69 !important;
}
</style>
<style scoped lang="scss">
.container {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.item {
  width: 100%;
  align-items: center;
  margin-bottom: 20px;
  input {
    width: calc(100% - 60px);
  }
  span {
    display: inline-block;
    width: 60px;
  }
}
.action {
  padding: 20px 0;
  .cancel {
    background: #f5f5f5;
    border-color: #e7e7e7;
  }
  button {
    width: 45%;
    height: 40px;
  }
}
</style>