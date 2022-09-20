<template>
  <div class="container direction">
    <div class="title justifyS">
      <div>
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
          v-if="batch"
          >全选</el-checkbox
        >
      </div>
      <div @click="emptyBtn">
        <i class="el-icon-delete"></i>
        <span>清空</span>
      </div>
    </div>

    <div class="main justify">
      <!-- 左侧订单列表 -->
      <el-checkbox-group
        class="orderList"
        v-model="orderList"
        @change="handleCheck"
      >
        <!-- 展示列表为去重后列表 -->
        <div
          v-for="(item, index) in settedArr"
          :key="index"
          @click="selectOrder(index)"
          :id="`order${index}`"
          class="order"
          :class="activeIndex == index ? 'active' : ''"
        >
          <el-checkbox
            :label="item"
            class="checkboxSty"
            :disabled="!batch"
            :class="batch ? '' : 'checkboxHide'"
          >
            <div class="topTitle justifyS">
              <div class="frontSty">
                <div class="bale" v-if="item.isPack">包</div>
                <div class="orderName">{{ item.name }}</div>
              </div>
              <div class="midSty" v-if="item.isDiscount">
                {{ _.round(item.discountValue * 10, 2) }}折
              </div>
              <div class="midSty" v-if="item.isDeduction">减免</div>
              <div class="endSty justifyE">x{{ item.amount }}</div>
              <div class="endSty justifyE">
                <span>￥{{ item.showPrice }}</span>
                <span
                  class="discountPrice"
                  v-if="item.totalPrice != item.showPrice"
                  >￥{{ item.totalPrice }}</span
                >
              </div>
            </div>
            <div class="specTxt" v-if="getSpec(item.specList)">
              规格：{{ getSpec(item.specList) }}
            </div>
            <div class="specTxt" v-if="item.remark">
              单品备注：{{ item.remark }}
            </div>
            <div class="specTxt" v-if="wholeRemark">
              整单备注：{{ wholeRemark }}
            </div>
          </el-checkbox>
        </div>
      </el-checkbox-group>
      <!-- 右侧订单操作 -->
      <div class="specifications direction">
        <div class="orderCount direction">
          <el-button @click="subOrder">
            <i class="el-icon-minus"></i>
          </el-button>
          <input type="text" :disabled="true" v-model="count" />
          <el-button @click="addOrder">
            <i class="el-icon-plus"></i>
          </el-button>
        </div>

        <el-button
          v-if="!anticheckout"
          type="primary"
          :class="
            dialogVal.content == 'Specification' && isShow
              ? 'spec-focus'
              : 'spec-active'
          "
          :disabled="settedArr.length > 0 ? false : true"
          @click="
            showModal({
              info: settedArr[activeIndex],
              type: '规格',
              content: 'Specification',
            })
          "
          >规格</el-button
        >

        <el-button
          v-if="!anticheckout"
          type="primary"
          :class="
            dialogVal.content == 'BatchDiscount' ||
            (dialogVal.content == 'Discount' && isShow)
              ? 'spec-focus'
              : 'spec-active'
          "
          :disabled="settedArr.length > 0 ? false : true"
          @click="
            showModal({
              info: settedArr[activeIndex],
              type: '折扣',
              content: batch ? 'BatchDiscount' : 'Discount',
            })
          "
          >折扣/减免</el-button
        >
        <el-button
          type="hollow"
          :disabled="settedArr.length > 0 ? false : true"
          @click="deleteDialogVisible = true"
          >删除</el-button
        >

        <el-dialog :visible.sync="deleteDialogVisible" :show-close="false">
          <img
            src="@/assets/dateClose.png"
            alt=""
            class="close-logo"
            @click="deleteDialogVisible = false"
          />

          <div class="delete-dialog-content">
            <span class="delete-dialog-content-title">确定要删除吗？</span>
            <div class="delete-dialog-action">
              <el-button
                class="delete-dialog-cancel"
                @click="deleteDialogVisible = false"
                >取消</el-button
              >
              <el-button
                type="primary"
                class="delete-dialog-confirm"
                style="margin-left: 15px"
                @click="
                  () => {
                    anticheckout ? antiDelOrder() : delOrder();
                  }
                "
                >确认</el-button
              >
            </div>
          </div>
        </el-dialog>

        <el-button
          v-if="!anticheckout"
          type="primary"
          :class="
            dialogVal.type == '单品备注' && isShow
              ? 'spec-focus'
              : 'spec-active'
          "
          :disabled="settedArr.length > 0 ? false : true"
          @click="
            showModal({
              info: settedArr[activeIndex],
              type: '单品备注',
              content: 'Remarks',
            })
          "
          >单品备注</el-button
        >
        <el-button
          v-if="!anticheckout"
          type="darkGreen"
          :class="
            settedArr.length > 0
              ? settedArr[activeIndex].isPack
                ? 'cancelPack'
                : ''
              : ''
          "
          :disabled="settedArr.length > 0 ? false : true"
          @click="checkBale"
          >{{
            settedArr.length > 0
              ? settedArr[activeIndex].isPack
                ? "取消打包"
                : "打包"
              : "打包"
          }}</el-button
        >
        <el-button
          type="primary"
          v-if="!anticheckout"
          @click="batchOperation"
          :class="batch ? 'spec-focus' : 'spec-active'"
          :disabled="settedArr.length > 0 ? false : true"
          >批量操作</el-button
        >
        <p v-if="!anticheckout" class="actionTitle">订单操作</p>
        <el-button
          v-if="!anticheckout"
          type="primary"
          :class="
            dialogVal.type == '备注' && isShow ? 'spec-focus' : 'spec-active'
          "
          :disabled="settedArr.length > 0 ? false : true"
          @click="
            showModal({
              info: null,
              type: '备注',
              content: 'Remarks',
            })
          "
          >整单备注</el-button
        >

        <el-popconfirm
          v-if="!anticheckout"
          confirm-button-text="确定"
          cancel-button-text="取消"
          confirm-button-type="primary"
          cancel-button-type="default"
          icon="el-icon-info"
          title="确定存单吗?"
          class="takeOrder"
          @confirm="saveBtn"
        >
          <el-button
            type="primary"
            slot="reference"
            :disabled="settedArr.length > 0 ? false : true"
            v-loading.fullscreen.lock="fullscreenLoading"
            >存单</el-button
          >
        </el-popconfirm>

        <el-badge
          v-if="!anticheckout"
          :value="takeOrderBage"
          :hidden="takeOrderBage == 0"
          class="takeOrder"
        >
          <el-button
            type="primary"
            @click="takeOrderbtn"
            :disabled="takeOrderBage == 0 ? true : false"
            >取单</el-button
          >
        </el-badge>

        <!-- 反结账按钮 -->
        <el-button
          v-if="anticheckout"
          :disabled="true"
          type="primary"
          @click="singleBack"
          >退菜</el-button
        >
        <el-button
          v-if="anticheckout"
          :disabled="true"
          type="primary"
          @click="chargeBack"
          >整单退菜</el-button
        >
        <el-button v-if="anticheckout" :disabled="true" type="primary"
          >补打订单</el-button
        >
      </div>
    </div>

    <div class="total justifyS">
      <el-checkbox v-if="!anticheckout" v-model="isWholePack" @change="packAll"
        >整单打包</el-checkbox
      >
      <div></div>
      <div class="totalSty justify">
        <span class="totalTxt">共{{ settedArr.length }}项</span>
        <span class="showPrice"
          >￥{{
            _.round(totalShowPrice - voucherTotal, 2) >= 0
              ? _.round(totalShowPrice - voucherTotal, 2)
              : 0
          }}</span
        >
        <span
          v-if="totalDiscountPrice > 0 || totalDeductionPrice > 0"
          class="totalLine"
          >￥{{
            _.round(
              totalDiscountPrice + totalDeductionPrice + totalShowPrice,
              2
            )
          }}</span
        >
        <span
          v-if="totalDiscountPrice > 0 || totalDeductionPrice > 0"
          class="discountTotal"
          >优惠-￥{{
            _.round(totalDiscountPrice + totalDeductionPrice, 2)
          }}</span
        >
      </div>
    </div>

    <div class="paymentMethod justifyC" v-if="$route.path == '/morePayment'">
      <el-button class="addMeal" @click="addMeal">加菜</el-button>
    </div>
    <div class="paymentMethod justify" v-if="$route.path == '/menuList'">
      <el-button type="cash" @click="payMthod('cash')">现金-人民币</el-button>
      <el-button type="primary" @click="payMthod('scanCode')"
        >扫码支付</el-button
      >
      <el-button type="pos" @click="payMthod('pos')">POS机刷卡</el-button>
      <el-button @click="payMthod('more')">更多支付</el-button>
    </div>

    <!-- 规格弹出窗 -->
    <transition name="fade">
      <div class="dialog" v-if="isShow">
        <Specification
          v-if="dialogVal.content == 'Specification'"
          :dialogVal="dialogVal"
        ></Specification>
        <Discount
          v-if="dialogVal.content == 'Discount'"
          :dialogVal="dialogVal"
        ></Discount>
        <BatchDiscount
          v-if="dialogVal.content == 'BatchDiscount'"
          :dialogVal="orderList"
        ></BatchDiscount>
        <Remarks
          v-if="dialogVal.content == 'Remarks'"
          :dialogVal="dialogVal"
          @changRemak="changeRemark"
        ></Remarks>
      </div>
    </transition>

    <!-- 取单弹出窗 -->
    <el-dialog
      title="取单"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      width="35%"
      :center="true"
      :before-close="handleClose"
    >
      <TakeOrder @getTakeOrder="getTakeOrder" @emptyBtn="emptyBtn"></TakeOrder>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { saveOrder, takeOrderList, getAntiList } from "@/api";
import Utils from "@/utils/util.js";
import Specification from "@/components/popover/specification";
import Discount from "@/components/popover/discount";
import Remarks from "@/components/popover/remarks";
import BatchDiscount from "@/components/popover/batchDiscount";
import TakeOrder from "@/components/popover/takeOrder";

export default {
  data() {
    return {
      count: 0,
      // 批量订单列表
      orderList: [],
      // 批量按钮
      batch: false,
      // 批量选择
      checkAll: false,
      isIndeterminate: false,
      // 当前选中订单
      activeIndex: 0,
      // 规格弹出窗
      isShow: false,
      dialogVal: "",
      // 去重后数组
      settedArr: [],
      // 总价
      totalShowPrice: 0,
      totalDiscountPrice: 0,
      totalDeductionPrice: 0,
      // 是否整单打包
      isWholePack: false,
      // 整单备注
      wholeRemark: "",
      // loading
      fullscreenLoading: false,
      // 取单角标
      takeOrderBage: 0,
      // 取单弹出窗
      dialogVisible: false,
      // 计算总价
      originalPrice: 0,
      // 是否反结账
      anticheckout: "",
      // 反结账订单数量
      antiAmount: [],
      // 删除弹框
      deleteDialogVisible: false,
    };
  },
  computed: {
    ...mapGetters([
      "orderedMeal",
      "submitValue",
      "antiInfo",
      "voucherTotal",
      "vouchers",
    ]),
  },
  components: {
    Specification,
    Discount,
    BatchDiscount,
    Remarks,
    TakeOrder,
  },

  mounted() {
    // 加载初始存单数量
    this.getTakeOrder();
    // 整单折扣
    Utils.$on("discountAll", () => {
      this.discountAll();
    });
    // 清空抵扣券
    this.$store.commit("delVoucher");
    // 生成反结账订单
    if (this.$route.path == "/antiCheckout") {
      this.anticheckout = true;
      getAntiList(this.$route.query.id)
        .then((res) => {
          if (res.code == 200) {
            for (let item of res.data.goodsList) {
              this.antiAmount.push(item.amount);
              this.$store.commit("createOrder", item);
            }
            // 初始反结账订单信息
            this.$store.commit("setAntiInfo", {
              id: this.$route.query.id,
              reason: this.$route.query.reason,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.anticheckout = false;
    }
  },
  methods: {
    // 获取规格
    getSpec(list) {
      let spec = [];
      for (let item of list) {
        for (let it of item.specItemList) {
          //  判断默认选中项
          if (item.defValueId == it.id) {
            //  判断是否是小料
            if (it.price != 0) {
              spec.push(`${it.name}￥${it.price}`);
            } else {
              spec.push(it.name);
            }
          }
        }
      }
      return this._.join(spec, " ");
    },
    // 选择订单
    selectOrder(index) {
      this.activeIndex = index;
      this.isShow = false;
      // 选择不同订单，切换不同数量
      this.count = this.settedArr[this.activeIndex].amount;
    },
    // 展示弹窗
    showModal(data) {
      if (data.type == this.dialogVal.type) {
        this.isShow = !this.isShow;
      } else {
        this.isShow = true;
      }
      this.dialogVal = data;
    },
    // 支付方式
    payMthod(data) {
      // 判断是否有订单
      if (this.settedArr.length > 0) {
        this.$router.push({
          path: "/morePayment",
          query: {
            name: data,
          },
        });
      } else {
        this.$notify({
          title: "还未添加订单",
          message: "未添加订单，无法结算",
          type: "warning",
        });
      }
    },
    // 批量选择
    handleCheck(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.settedArr.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.settedArr.length;
    },
    // 全选按钮
    handleCheckAllChange(val) {
      this.orderList = val
        ? this.settedArr.map((item) => {
            return item;
          })
        : [];
      this.isIndeterminate = false;
    },
    // 批量按钮
    batchOperation() {
      this.batch = !this.batch;
      // 批量隐藏后数组置空
      if (this.batch == false) {
        this.orderList = [];
        this.checkAll = false;
      }
      if (this.isShow) {
        this.isShow = false;
      }
    },
    // 清空按钮
    emptyBtn() {
      this.$store.commit("emptyOrder");
      this.orderList = [];
      this.checkAll = false;
      this.wholeRemark = "";
    },
    // 关闭弹窗
    closePopover() {
      this.isShow = false;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    // 添加订单
    addOrder() {
      console.log(
        this.anticheckout,
        this.settedArr[this.activeIndex].amount,
        this.antiAmount[this.activeIndex]
      );
      if (this.settedArr[this.activeIndex]) {
        if (this.anticheckout) {
          if (
            this.settedArr[this.activeIndex].amount <
            this.antiAmount[this.activeIndex]
          ) {
            let copy = this._.cloneDeep(this.settedArr[this.activeIndex]);
            copy.amount = null;
            this.$store.commit("addOrder", copy);
          }
        } else {
          let copy = this._.cloneDeep(this.settedArr[this.activeIndex]);
          copy.amount = null;
          this.$store.commit("addOrder", copy);
        }
      }
    },
    // 删减订单
    subOrder() {
      if (this.settedArr[this.activeIndex]) {
        if (this.settedArr[this.activeIndex].amount > 1) {
          let copy = this._.cloneDeep(this.settedArr[this.activeIndex]);
          copy.amount = null;
          this.$store.commit("subOrder", copy);
        }
      }
    },
    // 删除订单
    delOrder() {
      this.deleteDialogVisible = false;

      // 判断单品删除还是批量删除
      if (this.orderList.length == 0) {
        let copy = this._.cloneDeep(this.settedArr[this.activeIndex]);
        copy.amount = null;
        this.$store.commit("subOrder", copy);
      } else {
        let listCopy = this._.cloneDeep(this.orderList);
        for (let item of listCopy) {
          item.amount = null;
        }
        this.$store.commit("delOrder", listCopy);
        this.clearBatch();
      }
      this.activeIndex = 0;
    },
    antiDelOrder() {
      this.deleteDialogVisible = false;
      let copy = this._.cloneDeep(this.settedArr[this.activeIndex]);
      copy.amount = null;
      this.$store.commit("delOrder", [copy]);
      this.activeIndex = 0;
    },
    // 打包
    checkBale() {
      // 判断是单品打包还是批量打包
      if (this.orderList.length == 0) {
        // 单品
        let copy = this._.cloneDeep(this.settedArr[this.activeIndex]);
        copy.isPack = !copy.isPack;
        this.$store.commit("changeOrder", {
          key: this.settedArr[this.activeIndex],
          newVal: copy,
        });
      } else {
        // 批量
        let listCopy = this._.cloneDeep(this.orderList);
        let list = this._.cloneDeep(this.orderList);
        for (let item of listCopy) {
          item.amount = null;
        }
        this.$store.commit("delOrder", listCopy);
        for (let item of list) {
          item.isPack = !item.isPack;
          this.$store.commit("createOrder", item);
        }
      }
      this.clearBatch();
    },
    // 整单打包
    packAll(value) {
      this.$store.commit("packAll", value);
    },
    // 存单
    saveBtn(data, cab) {
      console.log(this.submitValue);
      this.fullscreenLoading = true;
      saveOrder(this.submitValue)
        .then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.fullscreenLoading = false;
            this.$notify({ type: "success", message: "存单成功" });
            // 刷新存单角标
            this.getTakeOrder();
            // 清空订单
            this.$store.commit("emptyOrder");
          }
          cab(data);
        })
        .catch((err) => {
          console.log(err);
          this.fullscreenLoading = false;
        });
    },
    // 整单备注
    changeRemark(data) {
      console.log(data);
      this.wholeRemark = data;
      // 修改备注参数
      this.$store.commit(
        "setSub",
        Object.assign(this.submitValue, { wholeRemark: this.wholeRemark })
      );
    },
    // 取单
    takeOrderbtn() {
      this.dialogVisible = true;
    },
    // 获取存单数量
    getTakeOrder() {
      console.log("获取订单数量");
      takeOrderList().then((res) => {
        this.takeOrderBage = res.data.length;
      });
    },
    // 整单折扣
    discountAll() {
      this.orderList = this.settedArr;
      this.isShow = !this.isShow;
      this.dialogVal = {
        info: null,
        type: "折扣",
        content: "BatchDiscount",
      };
    },
    // 加菜按钮
    addMeal() {
      this.$router.push("menuList");
    },
    // 单独退菜按钮
    singleBack() {
      if (this.orderList.length > 0) {
        this.$store.commit("setAntiInfo", {
          id: this.$route.query.id,
          reason: this.$route.query.reason,
          goodsList: this.orderList,
          isAll: false,
        });
      } else {
        this.$store.commit("setAntiInfo", {
          id: this.$route.query.id,
          reason: this.$route.query.reason,
          goodsList: [this.settedArr[this.activeIndex]],
          isAll: false,
        });
      }
    },
    // 退菜按钮
    chargeBack() {
      this.$store.commit("setAntiInfo", {
        id: this.$route.query.id,
        reason: this.$route.query.reason,
        isAll: true,
      });
    },
    // 清除批量
    clearBatch() {
      this.orderList = [];
      this.checkAll = false;
      this.batch = false;
    },
  },

  watch: {
    orderedMeal: function (newVal) {
      // 深拷贝数据，避免对vuex影响
      let copy = this._.cloneDeep(newVal);
      // 计算总价
      const showPriceList = [];
      const discountPriceList = [];
      const deductionList = [];
      const originList = [];
      this.checkAll = false;
      // 监听vuex数据 去重数组
      let list = this._.uniqWith(copy, this._.isEqual);

      let isPackCount = 0;

      let selectIdx = this.activeIndex;

      this.settedArr = list.map((item, index) => {
        item.amount = this._.filter(newVal, item).length;
        showPriceList.push(item.showPrice * item.amount);
        discountPriceList.push(item.discountPrice * item.amount);
        deductionList.push(item.deductionAmount * item.amount);
        originList.push(item.totalPrice * item.amount);
        // 订单显示总价
        this.totalShowPrice = this._.round(this._.sum(showPriceList), 2);
        // 订单折扣总价
        this.totalDiscountPrice = this._.round(
          this._.sum(discountPriceList),
          2
        );
        // 订单减免总价
        this.totalDeductionPrice = this._.round(this._.sum(deductionList), 2);
        // 原价
        this.originalPrice = this._.round(this._.sum(originList), 2);

        if (item.isPack) {
          isPackCount++;
        }

        if (item.select) {
          selectIdx = index;
          setTimeout(function () {
            document.querySelector(`#order${index}`).scrollIntoView({
              behavior: "smooth", // 平滑过渡
              block: "start", // 上边框与视窗顶部平齐
            });
          }, 100);
        }

        return item;
      });
      this.activeIndex = selectIdx;

      this.isWholePack = isPackCount == list.length;
      if (isPackCount == 0) {
        this.isWholePack = false;
      }

      // 如果没有商品,订单价格归零
      if (list.length == 0) {
        this.totalShowPrice = 0;
        this.totalDiscountPrice = 0;
        this.originalPrice = 0;
        // 没有商品弹窗关闭
        this.isShow = false;
        // 没有商品返回点餐页面
        // this.$router.push('/menuList');
        this.activeIndex = 0;
        this.$store.commit("delVoucher");
      }
      // 右侧box数量
      if (this.settedArr[this.activeIndex]) {
        this.count = this.settedArr[this.activeIndex].amount;
      } else {
        this.count = 0;
      }
      // 保存支付参数
      this.$store.commit("setSub", {
        goodsList: this.settedArr,
        totalDiscountPrice: this.totalDiscountPrice,
        totalShowPrice: this.totalShowPrice,
        isWholePack: this.isWholePack,
        wholeRemark: this.wholeRemark,
        is_free: false,
        free_remark: "",
        vouchers: this.vouchers,
      });
      // 保存原价
      this.$store.commit("setOrigin", this.originalPrice);
    },
  },
  beforeDestroy() {
    this.$store.commit("emptyOrder");
  },
};
</script>
<style lang="scss">
.checkboxSty .el-checkbox__label {
  width: 90%;
}
.checkboxHide .el-checkbox__input {
  display: none;
}

.container {
  .el-checkbox {
    white-space: normal;
  }
  .el-checkbox__input.is-disabled + span.el-checkbox__label {
    cursor: pointer;
  }
  .is-fixed {
    top: 10px !important;
    right: 20px !important;
  }
}
</style>
<style lang="scss" scoped>
.container {
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  margin: 10px;
  background: #fff;
  border-radius: 15px;
}
.frontSty {
  width: calc(88% - 40px);
  display: flex;
  justify-content: flex-start;
  color: #4f424c;
}
.midSty {
  width: 40px;
  display: flex;
  justify-content: center;
  color: #fff;
  background: #f06543;
  font-size: 12px;
  height: 20px;
  line-height: 20px;
  border-radius: 10px;
  white-space: nowrap;
}
.endSty {
  width: 12%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #4f424c;
  height: 20px;
  line-height: 20px;
  span {
    width: 100%;
    display: inline-block;
    height: 20px;
    line-height: 20px;
    text-align: center;
  }
}
.discountPrice {
  font-size: 13px;
  color: #9f9f9f;
  text-decoration: line-through;
}

.orderName {
  width: calc(100% - 23px);
  word-break: break-all;
}
.bale {
  width: 18px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  border-radius: 2px;
  background: #009e69;
  color: #fff;
  margin-right: 5px;
}
.title {
  width: 100%;
  height: 60px;
  border-bottom: 1px solid #e7e7e7;
  padding: 0 20px;
  box-sizing: border-box;
  color: #4f424c;
  cursor: pointer;
  align-items: center;
  span {
    font-size: 14px;
  }
  i {
    font-size: 18px;
    margin-right: 5px;
    color: #4f424c;
  }
}
.main {
  width: 100%;
  height: calc(100% - 200px);
}
.orderList {
  width: 80%;
  height: 100%;
  overflow: scroll;
}
.total {
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #e7e7e7;
  padding: 0 10px;
  box-sizing: border-box;
  align-items: center;
  position: relative;
}
.paymentMethod {
  width: 100%;
  height: 100px;
  padding: 0 10px;
  box-sizing: border-box;
  align-items: center;
  flex-wrap: wrap;
  button {
    height: 40px;
    margin: 5px;
  }
}
.specifications {
  width: 20%;
  height: 100%;
  align-items: center;
  button {
    width: 80%;
    height: 40px;
    line-height: 40px;
    flex-wrap: wrap;
    padding: 0;
    margin: 5px 0;
    font-size: 13px;
    border-radius: 10px;
    overflow: hidden;
  }
}
.orderCount {
  width: 80%;
  border: 1px solid #009e69;
  margin: 20px 0;
  border-radius: 15px;
  overflow: hidden;
  align-items: center;
  background: #fafffd;
  button {
    width: 100%;
    height: 40px;
    line-height: 40px;
    border: none;
    margin: 0;
    background: #fafffd;
  }
  input {
    width: 90%;
    height: 80px;
    line-height: 80px;
    border: none;
    border-top: 1px solid #cfcfcf;
    border-bottom: 1px solid #cfcfcf;
    text-align: center;
    font-size: 20px;
    outline: none;
    background: #fafffd;
  }
}
.actionTitle {
  width: 100%;
  text-align: center;
  font-size: 16px;
  margin: 20px 0 10px 0;
}
.order {
  width: 100%;
  padding: 10px 20px;
  box-sizing: border-box;
  border-radius: 0 30px 30px 0;
  background: #fff;
  margin: 10px 0;
  display: flex;
  align-items: center;
}
.checkboxSty {
  width: 100%;
  display: flex;
  align-items: center;
}
.specTxt {
  font-size: 12px;
  color: #9f9f9f;
  line-height: 1.5;
}
.topTitle {
  padding: 10px 0;
}
.active {
  background: #f5f5f5;
}
.totalSty {
  align-items: center;
}
.totalTxt {
  font-size: 12px;
  padding-right: 4px;
}
.showPrice {
  font-size: 20px;
  color: #f06543;
}
.totalLine {
  font-size: 14px;
  color: #9f9f9f;
  font-weight: 500;
  text-decoration: line-through;
  padding-left: 4px;
}
.discountTotal {
  font-size: 15px;
  color: #9f9f9f;
  font-weight: 400;
  position: absolute;
  top: -10px;
  right: 10px;
}
.dialog {
  position: absolute;
  top: 72px;
  left: calc(25% + 5px);
  width: 375px;
  height: calc(100vh - 82px);
  background: #fff;
  border-radius: 15px;
  z-index: 200;
  border: 1px solid #e7e7e7;
}
.takeOrder {
  width: 80%;
  height: 40px;
  margin-bottom: 10px;
  button {
    width: 100%;
    height: 40px;
    line-height: 40px;
    flex-wrap: wrap;
    padding: 0;
    margin: 5px 0;
    font-size: 13px;
    border-radius: 10px;
    overflow: hidden;
  }
}
.addMeal {
  width: 60%;
  height: 40px;
  background: #f5f5f5;
  color: #4f424c;
}
.cancelPack {
  background: #fff;
  color: #009e69;
}

.spec-active {
  background: #009e69;
  border-color: #009e69;
}
.spec-focus {
  background: #3bc697;
  border-color: #3bc697;
}

.delete-dialog-content-title {
  font-size: 20px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4f424c;
  line-height: 28px;
}
.delete-dialog-action {
  width: 100%;
  margin-top: 40px;
  display: flex;
  flex-direction: row;
}
.delete-dialog-content {
  margin: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
::v-deep .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  transform: translate(-50%, -50%);
  /*height:600px;*/
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}

.delete-dialog-confirm {
  width: 160px;
  height: 45px;
}

.delete-dialog-cancel {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 45px;
  background: #f5f5f5;
  border-radius: 6px;
  border: 1px solid #e7e7e7;
  font-size: 17px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4f424c;
  line-height: 24px;
}

.close-logo {
  position: absolute;
  right: 30px;
  top: 20px;
  width: 18px;
  height: 18px;
}
</style>