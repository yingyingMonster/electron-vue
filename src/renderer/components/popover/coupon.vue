<template>
  <div class="couponContent">
    <!-- tabs -->
    <div class="tabs">
      <div
        v-for="(item, index) in tabsList"
        @click="checkCoupon(index)"
        :key="index"
        class="tabItem"
        :class="index == activeCoupon ? 'tabActive' : null"
      >
        {{ item }}
      </div>
    </div>
    <!-- 无码优惠券 -->
    <div class="package" v-if="activeCoupon == 0">
      <div class="couponList">
        <el-badge
          class="couponItem"
          v-for="(item, index) in couponList"
          :key="index"
          :value="item.count"
          :hidden="item.count == 0"
        >
          <span
            @click="handleUse(index)"
            :class="index == active ? 'active' : ''"
            >{{ item.voucherName }}</span
          >
        </el-badge>
      </div>
      <div class="couponCount">
        <p class="couponTitle">使用数量</p>
        <el-input-number
          v-model="couponList[active].count"
          @change="handleStepChange"
          :min="0"
          :step="1"
        ></el-input-number>
      </div>
    </div>
    <!-- 有码优惠券 -->
    <div class="package" v-if="activeCoupon == 1">
      <p class="sancodeTitle">扫码或输入使用现金券</p>
      <el-row :span="24" class="demo-autocomplete">
        <el-col>
          <el-autocomplete
            class="inline-input"
            v-model="couponNum"
            :fetch-suggestions="querySearch"
            placeholder="请输入现金券"
            :trigger-on-focus="false"
            value-key="code"
            @select="handleSelect"
            style="ime-mode: disabled"
            ref="auto"
          ></el-autocomplete>
        </el-col>
      </el-row>
      <div class="useList">
        <div class="useItem" v-for="item in vouchers" :key="item.voucherId">
          <div class="useInfo large">
            {{ item.voucherName }}
          </div>
          <div class="useInfo justifyEnd small">{{ item.code }}</div>
          <div class="useInfo justifyEnd small">
            <p>￥{{ item.voucherAmount }}</p>
            <span class="delBtn" @click="delAction(item.voucherId)">×</span>
          </div>
        </div>
      </div>
      <div class="calprice">
        <div class="useInfo large">合计</div>
        <div class="useInfo justifyEnd small">x{{ voucherAllCount }}</div>
        <div class="useInfo justifyEnd totalPrice small">
          ￥{{ voucherTotal }}
        </div>
      </div>
      <p class="errcode" :hidden="tips == ''">{{ tips }}</p>
    </div>
    <div class="justifyS action">
      <el-button class="cancel" @click="close">取消</el-button>
      <el-button type="darkGreen" @click="confirm"
        >确认并选择支付方式</el-button
      >
    </div>
    <div class="notice">
      <span>*</span>
      点击取消或切换现金券后，已加入列表优惠券将不再保存，如需保存列表请点击右上角关闭或确认并选择支付方式。
    </div>
  </div>
</template>
<script>
import { getCouponList, matchCoupon, matchUseCoupon } from "@/api";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      tabsList: ["现金券", "扫码现金券"],
      activeCoupon: 0,
      couponList: [
        {
          count: 0,
        },
      ],
      active: 0,
      couponNum: "",
      tips: "",
    };
  },
  computed: {
    ...mapGetters([
      "submitValue",
      "vouchers",
      "voucherAllCount",
      "voucherTotal",
      "activeTab",
    ]),
  },
  mounted() {
    if (this.vouchers.length > 0) {
      this.couponList = this._.cloneDeep(this.vouchers);
    } else {
      getCouponList().then((res) => {
        if (res.code == 200) {
          this.couponList = res.data;
        }
      });
    }
    this.activeCoupon = this.activeTab;
  },
  methods: {
    close() {
      this.$store.commit("delVoucher");
      this.$store.commit(
        "setSub",
        Object.assign(this.submitValue, {
          vouchers: [],
        })
      );
      // 关闭弹窗
      this.$parent.handleClose();
    },
    handleUse(index) {
      this.active = index;
    },
    // 计数器变化
    handleStepChange() {
      // 保存抵扣券参数
      this.$store.commit("setVoucherList", this.couponList);
      // 订单提交参数
      this.$store.commit(
        "setSub",
        Object.assign(this.submitValue, {
          vouchers: this.couponList,
        })
      );
    },
    confirm() {
      this.$parent.handleClose();
    },

    checkCoupon(index) {
      this.activeCoupon = index;
      this.$store.commit("saveTab", index);
      this.$store.commit("delVoucher");
      if (index == 0) {
        getCouponList().then((res) => {
          if (res.code == 200) {
            this.couponList = res.data;
          }
        });
      }
      // else if(index==1){
      //    console.log(this.$refs.auto)
      // }
    },
    // 模糊匹配现金券
    querySearch(queryString, cb) {
      console.log(this._.isEmpty(queryString))
      if (!this._.startsWith(queryString, " ")) {
        matchCoupon(queryString)
          .then((res) => {
            if (res.code == 200) {
              if (res.data.length == 1) {
                this.useCoupon(res.data[0]);
                this.couponNum = "";
                cb([]);
              } else {
                cb(res.data);
              }
            }
          })
          .catch(() => {});
      }
    },

    handleSelect(item) {
      this.useCoupon(item);
    },
    // 现金券使用条件
    useCoupon(item) {
      if (this.vouchers.length >= 1) {
        let idList = [];
        this.vouchers.forEach((element) => {
          idList.push(element.voucherId);
        });
        // 判断是否是一家公司现金券
        if (this.vouchers[0].companyCode == item.companyCode) {
          // 判断现金券是否已经添加过
          if (this._.indexOf(idList, item.voucherId) == -1) {
            this.ifUse(item);
            this.tips = "";
          } else {
            this.tips = "*该优惠券已添加";
          }
        } else {
          this.$message({
            message: "请添加相同公司的现金券",
            type: "error",
          });
        }
      } else {
        this.ifUse(item);
      }
    },
    // 后台校验现金券是否使用过
    ifUse(item) {
      matchUseCoupon(item.code).then((res) => {
        if (res.code == 200) {
          if (res.data.isCanUse) {
            this.$store.commit("addVoucher", item);
            // 订单提交参数
            this.$store.commit(
              "setSub",
              Object.assign(this.submitValue, {
                vouchers: this.vouchers,
              })
            );
          } else {
            this.$message({
              message: res.data.msg,
              type: "error",
            });
          }
        }
      });
    },
    // 删除订单
    delAction(id) {
      this.$store.commit("subVoucher", id);
    },
  },
};
</script>
<style lang="scss" scoped>
.couponContent {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  ::v-deep .el-autocomplete {
    width: 100%;
    padding: 15px 0;
  }
  ::v-deep .el-input__inner {
    background: #f5f5f5 !important;
  }
}
.couponList {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: center;
  margin: 0 0 20px 0;
}
.couponItem {
  margin: 20px 20px 0 0;
  span {
    width: 100%;
    height: 40px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    background: #f5f5f5;
    color: #4f424c;
    font-size: 14px;
    cursor: pointer;
    padding: 0 10px;
    box-sizing: border-box;
  }
}
.active {
  background: #009e69 !important;
  color: #fff !important;
}
.action {
  padding: 20px 0;
  .cancel {
    background: #f5f5f5;
    border-color: #e7e7e7;
  }
  button {
    width: 45%;
    height: 45px;
  }
}
.couponCount {
  margin: 10px 0;
}
.couponTitle {
  padding: 10px;
  font-size: 16px;
  color: #303133;
}
.tabs {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  overflow: hidden;
}
.tabItem {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  color: #009e69;
  font-size: 16px;
  height: 45px;
  cursor: pointer;
  border: 1px solid #009e69;
  background: #fafffd;
  &:first-child {
    border-radius: 6px 0 0 6px;
  }
  &:last-child {
    border-radius: 0 6px 6px 0;
  }
}
.tabActive {
  color: #fff !important;
  background: #009e69 !important;
}
.sancodeTitle {
  margin: 30px 0 15px 0;
  font-size: 14px;
}
.calprice {
  width: 100%;
  display: flex;
  justify-content: flex-start;
}
.delBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 14px;
  height: 14px;
  font-size: 12px;
  border-radius: 50%;
  color: #fff;
  background: #dbdbdb;
  cursor: pointer;
  &:hover {
    background: #f06543;
  }
}
.useList {
  width: 100%;
  border-bottom: 1px solid #e7e7e7;
}
.useItem {
  width: 100%;
  display: flex;
  justify-content: flex-start;
}
.useInfo {
  padding: 10px 0;
  p {
    margin: 0;
    padding-right: 10px;
  }
}
.large {
  width: 40%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.small {
  width: 30%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.justifyEnd {
  justify-content: flex-end;
}
.errcode {
  text-align: center;
  height: 35px;
  line-height: 35px;
  color: #f06543;
}
.totalPrice {
  color: #f06543;
  font-size: 20px;
}
.notice {
  color: #9f9f9f;
  display: flex;
  justify-content: flex-start;
  span {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 10px;
    height: 20px;
    color: #f06543;
  }
}
</style>