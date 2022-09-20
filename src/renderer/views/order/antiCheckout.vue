<template>
  <div class="content justify"   v-loading="loading">
    <div class="payment-way">
      <div class="dialogTitle justifyS">
        <span>退菜</span>
      </div>
      <p>反结账原因</p>
      <div class="fixed-reason">
        <div class="reasonBox justify">
          <span class="active">{{ antiInfo.reason }}</span>
        </div>
      </div>
      <!-- <p>退菜原因</p>
      <div class="fixed-reason">
        <div class="reasonBox justify">
          <span
            v-for="(item, index) in fixedRemarks"
            :key="index"
            @click="checkRemark(index, item)"
            :class="remarksIndex == index ? 'active' : ''"
            >{{ item }}</span
          >
        </div>
      </div>

      <el-input
        type="textarea"
        class="reason"
        v-model="remarks"
        @input="remarksChange"
        placeholder="请输入自定义备注内容"
      ></el-input> -->
      <div class="checkoutBill direction">
        <el-checkbox v-model="bill" @change="changePrint">打印结账单</el-checkbox>
        <el-button type="darkGreen" @click="confirmAnti">确认退菜</el-button>
      </div>
    </div>

    <div class="payment-detail">
      <div class="detailTitle justifyS">
        <span>账单明细</span>
        <i class="el-icon-close" @click="goBack"></i>
      </div>

      <div class="bill">
        <div class="originalPrice justifyS">
          <span>菜品原价</span>
          <span>￥{{ originalPrice }}</span>
        </div>
        <div class="receivable justifyS">
          <span>应收</span>
          <span>￥{{ submitValue.totalShowPrice }}</span>
        </div>
      </div>

      <div class="checkoutBill direction">
        <el-button class="" :disabled="true" @click="payBtn"
          >确认更新订单</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getRemarks, chargeBack } from "@/api";
import {
  printCustomerTicket,
  printStickersTicket,
  printBill,
} from "@/utils/PrintCore";
export default {
  data() {
    return {
      bill: true,
      // 退菜原因
      fixedRemarks: [],
      remarksIndex: -1,
      remarks: "",
      loading:false
    };
  },
  computed: {
    ...mapGetters(["antiInfo", "submitValue", "originalPrice"]),
  },
  components: {},
  mounted() {
    // 拉取退菜原因
    getRemarks("4")
      .then((res) => {
        this.fixedRemarks = res.data;
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(this.submitValue)
  },
  methods: {
    goBack() {
      this.$router.back(-1);
    },
    // 确认更新订单
    payBtn() {},
    // 选择事件
    checkRemark(index, item) {
      this.remarksIndex = index;
      this.remarks = item;
    },
    // 备注input 修改
    remarksChange(e) {
      if (this.list[this.remarksIndex] != e) {
        this.remarksIndex = -1;
      }
    },
    // 确认退菜
    confirmAnti() {
      this.loading=true;
      // 整单退菜
      chargeBack({
        orderId: this.antiInfo.id,
        revReason: this.antiInfo.reason,
        goodsList:this.submitValue.goodsList
      })
        .then((res) => {
          this.loading=false;
          if (res.code == 200) {
            this.$notify({
              title: "成功",
              message: "退菜成功",
              type: "success",
            });
            // 打印小票
            if(this.bill){
              printBill(this.antiInfo.id,2);
            }
            // 返回
            this.$router.back(-1)
          }
        })
        .catch((err) => {
          this.loading=false
          console.log(err);
        });
    },
    // 是否打印
    changePrint(e){
      console.log(e);
      this.bill=e;
    }
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: calc(100% - 20px);
  height: calc(100vh - 82px);
  border-radius: 15px;
  background: #fff;
  margin: 10px;
  color: #4f424c;
}
.payment-way {
  width: 25%;
  height: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  border-right: 1px solid #f7f7ff;
  position: relative;
}
.payment-detail {
  width: 75%;
}
.title {
  width: 100%;
  height: 60px;
  line-height: 60px;
  box-sizing: border-box;
}
.fixed-reason {
  font-size: 14px;
}
.discount {
  display: inline-block;
  font-size: 15px;
}
.reasonBox {
  margin: 10px 0;
  span {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f5f5f5;
    border-radius: 10px;
    font-size: 13px;
    min-width:100px ;
    padding: 10px ;
    margin-right: 10px;
  }
}
.paymentMethod {
  width: 100%;
  margin: 20px 0;
  span {
    display: inline-block;
    font-size: 15px;
    margin: 10px 0;
  }
  button {
    margin: 10px 5px;
  }
}
.payment-detail {
  width: 75%;
  height: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  position: relative;
}
.detailTitle {
  width: 100%;
  height: 60px;
  line-height: 60px;
  i {
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    cursor: pointer;
  }
}
.bill {
  width: 100%;
}
.originalPrice {
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #f7f7ff;
  span {
    font-size: 14px;
  }
}
.receivable {
  width: 100%;
  height: 40px;
  line-height: 40px;
  span {
    font-size: 14px;
  }
}
.paymentBtn {
  button {
    position: relative;
    border: none;
    border-radius: 10px;
    height: 45px;
    overflow: hidden;
    img {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
}
.checkoutBill {
  width: calc(100% - 40px);
  position: absolute;
  bottom: 10px;
  button {
    width: 100%;
    margin: 10px 0;
  }
}
.active {
  background: #009e69 !important;
  color: #fff !important;
}
.dialogTitle {
  width: 100%;
  height: 60px;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
  i {
    cursor: pointer;
  }
}
.fixed-reason {
  color: #4f424c;
  font-size: 14px;
  margin: 20px 0;
}
.title {
  display: inline-block;
  font-size: 15px;
}
</style>