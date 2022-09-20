<template v-slot:spec>
  <div class="discountContent">
    <div class="dialogTitle justifyS">
      <span
        >{{ this.dialogVal.type }}<i class="el-icon-minus"></i
        >{{ this.dialogVal.info.name }}</span
      >
      <i class="el-icon-close" @click="close"></i>
    </div>
    <div class="discount-box">
      <div class="justifyS toggleBox" v-if="toggleExemption">
        <span @click="toggleEvent" class="discountLab">折扣/减免</span>
        <el-input
          v-model="calcAmount"
          placeholder="请输入打折额度"
          type="number"
          onkeyup="this.value = this.value.replace(/[^\d.]/g,'')"
          oninput="if(value>99)value=99"
        >
          <span slot="suffix" class="suffix-icon">%</span>
        </el-input>
      </div>
      <div class="justifyS toggleBox" v-else>
        <span @click="toggleEvent" class="discountLab">减免/折扣</span>
        <el-input
          v-model="calcAmount"
          placeholder="请输入减免金额"
          type="number"
          onkeyup="this.value = this.value.replace(/[^\d.]/g,'')"
          :oninput="`if(value>${_.round(this.dialogVal.info.price+_.sum(sumBase)+_.sum(mater),2)})value=${_.round(this.dialogVal.info.price+_.sum(sumBase)+_.sum(mater),2)}`"
        >
          <span slot="suffix" class="suffix-icon">￥</span>
        </el-input>
      </div>
    </div>

    <div class="discount-total justifyS">
      <transition name="fade">
        <div v-show="calcAmount">
          {{ toggleExemption ? "打折后" : "减免后"
          }}<span>￥{{ list.showPrice }}</span>
        </div>
      </transition>
      <transition name="fade">
        <div v-show="calcAmount">包含小料</div>
      </transition>
    </div>
    <div class="fixed-count" v-if="toggleExemption">
      <span
        v-for="(item, index) in discountList"
        :key="index"
        @click="checkedFixDiscount(index, item)"
        :class="index == discountIndex ? 'active' : ''"
        >{{ item }}%</span
      >
    </div>

    <div class="keyboard">
      <table class="numBtn">
        <tbody>
          <tr>
            <td>
              <el-button @click="getNum(1)">1</el-button>
            </td>
            <td>
              <el-button @click="getNum(2)">2</el-button>
            </td>
            <td>
              <el-button @click="getNum(3)">3</el-button>
            </td>
            <td rowspan="2">
              <el-button class="funBtn" @click="delBtn">删除</el-button>
            </td>
          </tr>
          <tr>
            <td>
              <el-button @click="getNum(4)">4</el-button>
            </td>
            <td>
              <el-button @click="getNum(5)">5</el-button>
            </td>
            <td>
              <el-button @click="getNum(6)">6</el-button>
            </td>
          </tr>
          <tr>
            <td>
              <el-button @click="getNum(7)">7</el-button>
            </td>
            <td>
              <el-button @click="getNum(8)">8</el-button>
            </td>
            <td>
              <el-button @click="getNum(9)">9</el-button>
            </td>
            <td rowspan="2">
              <el-button class="funBtn" @click="subBtn">
                <img src="@/assets/delBtn.png" alt="" />
              </el-button>
            </td>
          </tr>
          <tr>
            <td>
              <el-button></el-button>
            </td>
            <td>
              <el-button @click="getNum(0)">0</el-button>
            </td>
            <td>
              <el-button></el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="fixed-reason">
      <span class="title">{{ toggleExemption ? "打折原因" : "减免原因" }}</span>
      <div class="reasonBox justify">
        <span
          v-for="(item, index) in fixedReason"
          :key="index"
          @click="checkReason(index, item)"
          :class="remarksIndex == index || remarks == item ? 'active' : ''"
          >{{ item }}</span
        >
      </div>
    </div>

    <el-input
      type="textarea"
      class="reason"
      v-model="remarks"
      @input="remarksChange"
      placeholder="请输入打折原因"
    ></el-input>

    <el-button type="darkGreen" class="confirmBtn" @click="confirmBtn"
      >确认</el-button
    >
  </div>
</template>
<script>
import { getDiscount } from "@/api";
export default {
  props: ["dialogVal"],
  data() {
    return {
      // 备注信息
      remarks: "",
      remarksIndex: -1,
      // 折扣价格列表
      discountList: "",
      discountIndex: -1,
      // 深拷贝后的商品列表以及商品价格
      list: "",
      listCopy: "",
      // 基础价格数组
      sumBase: [],
      // 小料价格数组
      mater: [],
      // 固定原因列表
      fixedReason: [],
      loading: true,
      // 折扣减免切换
      toggleExemption: true,
      // 计算
      calcAmount: "",
    };
  },
  methods: {
    // 数字键盘点击事件
    getNum(value) {
      // 判断折扣/减免
      if (this.toggleExemption) {
        // 折扣
        if (parseInt(this.calcAmount + value) < 100) {
          this.calcAmount += value;
          this.discountIndex = -1;
        }
      } else {
        // 减免
        if (parseInt(this.calcAmount + value) < this.listCopy.totalPrice) {
          this.calcAmount += value;
        }
      }
    },
    // 获取折扣列表
    getDiscountList() {
      getDiscount()
        .then((res) => {
          if (res.code == 200) {
            this.discountList = res.data.discountList.map((item) => {
              return parseInt(item * 100);
            });
            this.fixedReason = res.data.reasonList;
          }
        })
        .catch(() => {});
    },
    // 数字键盘-删除
    delBtn() {
      this.calcAmount = "";
    },
    // 数字键盘-删减
    subBtn() {
      let count = this.calcAmount;
      this.calcAmount = count.toString().substring(0, count.length - 1);
    },
    // 选择固定折扣
    checkedFixDiscount(index, val) {
      this.discountIndex = index;
      this.calcAmount = val.toString();
    },
    // 确认按钮
    confirmBtn() {
      if (this.calcAmount == "") {
        this.$notify({
          title: "提示",
          message: "请修改折扣/减免后提交",
          type: "warning",
        });
      } else {
        // 传递原始数组以及修改后的数组
        this.$store.commit("changeOrder", {
          key: this.listCopy,
          newVal: this.list,
        });
        // 关闭弹窗
        this.$parent.closePopover();
      }
    },
    // 切换固定折扣
    checkReason(index, item) {
      this.remarksIndex = index;
      this.remarks = item;
    },
    // 监听input value
    remarksChange(e) {
      console.log(e);
      if (this.fixedReason[this.remarksIndex] != e) {
        this.remarksIndex = -1;
      }
    },
    // 关闭按钮
    close() {
      // 关闭弹窗
      this.$parent.closePopover();
    },
    // 切换折扣减免
    toggleEvent() {
      this.calcAmount = "";
      this.toggleExemption = !this.toggleExemption;
    },
  },
  mounted() {
    // 深拷贝商品信息,避免对原数组产生影响
    this.list = this._.cloneDeep(this.dialogVal.info);
    this.listCopy = this._.cloneDeep(this.dialogVal.info);
    if (this.list.isDiscount) {
      // 回显折扣信息
      this.remarks = this.list.discountRemark;
      if (this.list.discountValue == 1) {
        return;
      } else {
        this.calcAmount = this._.round(this.list.discountValue * 100, 2);
      }
    } else if (this.list.isDeduction) {
      // 回显减免信息
      this.remarks = this.list.deductionRemark;
      this.calcAmount = this.list.deductionAmount;
      this.toggleExemption = false;
    }

    // 循环遍历所有基础价格以及小料价格
    for (let item of this.list.specList) {
      for (let it of item.specItemList) {
        //  判断默认选中项
        if (item.checkedId == it.id) {
          this.sumBase.push(it.basePrice);
          this.mater.push(it.price);
        }
      }
    }
    this.getDiscountList();
  },
  watch: {
    // 监听输入额度/折扣
    calcAmount: function (newVal) {
      const price = this.list.price;
      const basePrice = this._.sum(this.sumBase);
      const mater = this._.sum(this.mater);
      this.list.totalPrice = this._.round(price + basePrice, 2);
      if (this.toggleExemption) {
        //  计算折扣价格,原价加基础类型(价格四舍五入)*折扣+小料
        const discountValue = this._.round(newVal / 100, 2);
        // 修改订单折扣值
        this.list.discountValue = discountValue;
        // 修改是否折扣
        this.list.isDiscount = true;
        // 修改折扣价格
        this.list.discountPrice = this._.round(
          price + basePrice - (price + basePrice) * discountValue,
          2
        );
        // 修改折扣备注
        this.list.discountRemark = this.remarks;
        // 修改商品价格
        this.list.showPrice = this._.round(
          (price + basePrice) * discountValue + mater,
          2
        );
        // 减免价格属性置空
        this.list.deductionAmount=0;
        this.list.isDeduction=false;
        this.list.deductionRemark="";
      } else {
        this.list.deductionAmount = newVal;
        // 修改商品价格
        this.list.showPrice = this._.round(
          price + basePrice - newVal + mater,
          2
        );
        // 是否减免
        this.list.isDeduction = true;
        // 修改减免备注
        this.list.deductionRemark = this.remarks;
        // 置空折扣属性
        this.list.discountValue=1;
        this.list.isDiscount=false;
        this.list.discountPrice=0;
        this.list.discountRemark="";
      }
    },
  },
};
</script>
<style lang="scss">
.discount-box .el-input {
  width: 50%;
  input {
    border: none;
    text-align: right;
    color: #4f424c;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
}
.numBtn button {
  height: 42px;
}
.content .el-textarea__inner {
  color: #4f424c;
  background: #f5f5f5;
}
</style>
<style lang="scss" scoped>
.discountContent {
  height: 100%;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  position: relative;
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
.discount-box {
  width: 100%;
  border: 1px solid #3bc697;
  border-radius: 4px;
  padding: 0 10px;
  box-sizing: border-box;
  background: #fafffd;
}
.discountLab {
  width: 80px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  background: #009e69;
  font-size: 12px;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
}
.suffix-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.confirmBtn {
  border-radius: 10px;
  position: absolute;
  left: 0;
  bottom: 10px;
  width: calc(100% - 20px);
  margin: 10px;
}
.fixed-count {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 10px 0 20px 0;
  span {
    display: inline-block;
    width: 23%;
    margin: 0 1%;
    background: #f5f5f5;
    color: #4f424c;
    border-radius: 10px;
    font-size: 12px;
    text-align: center;
    height: 35px;
    line-height: 35px;
    cursor: pointer;
  }
}
.numBtn {
  width: 100%;
  td {
    text-align: center;
    width: 25%;
  }
  button {
    width: 98%;
    text-align: center;
    background: #f5f5f5;
    border-radius: 10px;
    margin: 2px 0;
  }
}
.funBtn {
  height: 92px;
}
.discount-total {
  color: #4f424c;
  font-size: 13px;
  width: 100%;
  height: 30px;
  line-height: 30px;
  span {
    color: #f06543;
    font-size: 15px;
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
.reasonBox {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 10px 0;
  span {
    display: inline-block;
    width: 31%;
    margin: 0 1%;
    background: #f5f5f5;
    color: #4f424c;
    border-radius: 10px;
    font-size: 12px;
    text-align: center;
    height: 35px;
    line-height: 35px;
    cursor: pointer;
  }
}
.active {
  background: #009e69 !important;
  color: #fff !important;
}
.toggleBox {
  align-items: center;
  height: 50px;
}
</style>