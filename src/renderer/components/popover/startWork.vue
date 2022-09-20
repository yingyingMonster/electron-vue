<template>
  <div class="flex-row" v-loading="loading">
    <div class="flex-column" style="width: 400px; padding: 25px 30px 25px 30px">
      <span class="title" style="margin-bottom:20px">开班</span>
      <div class="flex-row center-v space-between" @click="currentIndex = 1">
        <span class="item-form">班次</span>
        <span class="select-text">{{ type == 1 ? "早班" : "晚班" }}</span>
      </div>
      <div class="line-h"></div>

      <div class="flex-row center-v">
        <span class="item-form" style="flex-shrink: 0">备用金</span>
        <el-input
          class="input"
          @focus="focus"
          v-model="reserveAmount"
          type="text"
        />
        <span class="yuan" style="flex-shrink: 0">元</span>
      </div>

      <div class="line-h"></div>

      <div class="flex-row center-v">
        <span class="item-form" style="margin-top: 20px"
          >收银员：{{ userInfo.name }}</span
        >
      </div>
      <el-button
        type="primary"
        style="margin-top: 20px"
        @click="submitForm"
        :disabled="reserveAmount.length <= 0"
        >开班</el-button
      >
    </div>

    <div class="line-v"></div>
    <div class="flex-column" style="width: 279px">
      <div class="flex-column" v-if="currentIndex == 1">
        <span class="right-title">选择班次</span>
        <div class="flex-row just-center">
          <el-button
            :class="type == 1 ? 'btn-select' : 'btn-unselect'"
            @click="type = 1"
            >早班</el-button
          >
          <el-button
            :class="type == 2 ? 'btn-select' : 'btn-unselect'"
            @click="type = 2"
            >晚班</el-button
          >
        </div>
      </div>

      <div class="flex-row" v-else style="height: 100%">
        <div class="flex-row wrap keyboard">
          <div v-for="index in 12" :key="index" :class="getStyle(index)">
            <div
              v-if="index == 10"
              @click="addYuan('.')"
              class="center-keyboard"
            >
              .
            </div>

            <div
              v-else-if="index == 11"
              @click="addYuan('0')"
              class="center-keyboard"
            >
              0
            </div>
            <div
              v-else-if="index == 12"
              class="center-keyboard"
              @click="delYuan()"
            >
              <img
                src="@/assets/keyboard_del.png"
                alt=""
                class="keyboard-del"
              />
            </div>
            <div v-else @click="addYuan(index)" class="center-keyboard">
              {{ index }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { openMthod } from "@/api";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      currentIndex: 1,
      type: 1,
      reserveAmount: "",
      loading:false
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),

    getStyle() {
      return function (index) {
        if (index == 3 || index == 6 || index == 9) {
          return "keyboard-item noright";
        }
        if (index == 10 || index == 11) {
          return "keyboard-item nobottom";
        }
        if (index == 12) {
          return "keyboard-item nobottom noright";
        }
        return "keyboard-item";
      };
    },
  },
  methods: {
    delYuan() {
      if (this.reserveAmount.length <= 1) {
        this.reserveAmount = "";
      } else {
        this.reserveAmount = this.reserveAmount.substring(
          0,
          this.reserveAmount.length - 1
        );
      }
    },
    addYuan(e) {
      this.reserveAmount = this.reserveAmount + e;
    },
    focus(e) {
      this.currentIndex = 2;
    },
    submitForm() {
      this.loading=true;
      var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (!reg.test(this.reserveAmount)) {
        this.$notify({
          title: "提示",
          type: "error",
          message: "输入正确备用金",
        });

        return;
      }

      let data = {
        type: this.type,
        reserveAmount: this.reserveAmount,
      };
      openMthod(data)
        .then((res) => {
          this.loading=false;
          console.log(res);
          if (res.data) {
            this.$parent.handleClose();
            this.$notify({
              title: "提示",
              type: "success",
              message: "开班成功",
            });
          } else {
            this.$notify({
              title: "提示",
              type: "error",
              message: "开班失败",
            });
          }
        })
        .catch((err) => {
          this.loading=false;
          console.log(err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.center-keyboard {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.keyboard-del {
  height: 25px;
  width: 25px;
}
.yuan {
  margin-left: 4px;
  font-size: 15px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #9f9f9f;
  line-height: 21px;
}
.input {
  background: #fff;
  flex-grow: 1;
}
::v-deep .el-input__inner {
  border: 1px solid transparent !important;
  text-align: right;
}
.flex-row {
  display: flex;
  flex-direction: row;
}
.flex-column {
  display: flex;
  flex-direction: column;
}
.center-v {
  align-items: center;
}
.just-center {
  justify-content: center;
}
.item-form {
  height: 55px;
  font-size: 15px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4f424c;
  line-height: 21px;
  display: flex;
  align-items: center;
}
.line-h {
  width: 100%;
  border-bottom: 1px solid #e7e7e7;
}
.line-v {
  width: 1px;
  background: #e7e7e7;
}
.select-text {
  font-size: 15px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4f424c;
  line-height: 21px;
}
.space-between {
  justify-content: space-between;
}
.right-title {
  height: 81px;
  font-size: 15px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4f424c;
  line-height: 81px;
  margin-left: 29px;
}

.btn-select {
  width: 105px;
  height: 40px;
  background: #009e69;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 20px;
}

.btn-unselect {
  width: 105px;
  height: 40px;
  background: #f5f5f5;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4f424c;
  line-height: 20px;
}
.keyboard-item {
  width: 93px;
  height: 81px;
  display: flex;
  border-right: 1px solid #e7e7e7;
  border-bottom: 1px solid #e7e7e7;
  font-size: 15px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4f424c;
  line-height: 21px;
  align-items: center;
  justify-content: center;
}
.noright {
  border-right: 1px solid transparent;
}
.nobottom {
  border-bottom: 1px solid transparent;
}
.wrap {
  flex-wrap: wrap;
}
.keyboard {
  // height: 100%;
  // width: 100%;
  align-self: center;
  align-items: center;
  justify-content: center;
}

.formItem {
  width: 100%;
  padding: 5px 0;
  border-bottom: 1px solid #f5f5f5;
  ::v-deep .el-input__inner {
    border: none;
  }
  ::v-deep .el-select {
    width: 100%;
  }
  ::v-deep .el-form-item__error {
    top: 120%;
    left: 10px;
  }
}
.btn {
  width: 100%;
  button {
    width: 90%;
    height: 40px;
    margin: 0 5%;
  }
  ::v-deep .el-form-item__content {
    margin: 0 !important;
  }
}
.title {
  font-size: 20px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4f424c;
  line-height: 28px;
}
</style>