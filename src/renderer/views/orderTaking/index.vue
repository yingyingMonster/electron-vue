<template>
  <div class="content">
    <div class="main justify">
      <div class="left">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="`全部订单(${allList.length})`" name="1">
            <div class="order">
              <div
                class="orderItem justifyS"
                v-for="(item, index) in allList"
                :class="activeIndex == index ? 'active' : ''"
                :key="index"
                @click="focusOrder(index, item)"
              >
                <div class="orderTitle">
                  <p>{{ item.orderNo }}</p>
                  <span v-if="item.status == 1 || item.status == 3"
                    >下单时间：
                    {{ $moment(item.createTime).format("HH:mm:ss") }}</span
                  >
                  <span v-if="item.status == 2"
                    >接单时间：{{
                      $moment(item.takeTime).format("HH:mm:ss")
                    }}</span
                  >
                </div>

                <div class="btnBox" v-if="item.status == 1">
                  <el-button size="small" @click="refuseOrder(item.id)"
                    >拒单</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    @click="takeOrder(item.id)"
                    >接单</el-button
                  >
                </div>
                <div v-if="item.status == 2">已接单</div>
                <div v-if="item.status == 3">未接单</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="`待接单(${waitList.length})`" name="2">
            <div class="order">
              <div
                class="orderItem justifyS"
                v-for="(item, index) in waitList"
                :class="activeIndex == index ? 'active' : ''"
                :key="index"
                @click="focusOrder(index, item)"
              >
                <div class="orderTitle">
                  <p>{{ item.orderNo }}</p>
                  <span
                    >下单时间：
                    {{ $moment(item.createTime).format("HH:mm:ss") }}</span
                  >
                </div>

                <div class="btnBox">
                  <el-button size="small" @click="refuseOrder(item.id)"
                    >拒单</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    @click="takeOrder(item.id)"
                    >接单</el-button
                  >
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="setting justify">
          <p>自动接单</p>
          <el-switch
            v-model="suspend"
            @change="setBtn"
            active-color="#009E69"
            inactive-color="#f5f5f5"
          >
          </el-switch>
        </div>
      </div>
      <div class="right" v-if="empty">
        <div class="orderUser justify">
          <img :src="orderVal.userInfo.avatar" alt="" />
          <div>
            <p>{{ orderVal.userInfo.name }}</p>
            <span>{{
              $moment(orderVal.userInfo.time).format("YYYY/MM/DD HH:mm:ss")
            }}</span>
          </div>
        </div>
        <!-- 菜品信息 -->
        <div class="info">
          <div class="title item justifyS">
            <p>新增菜品信息</p>
            <p>共 {{ orderVal.goods.length }} 项</p>
            <p>合计{{ orderVal.payList[""] }}</p>
          </div>
          <div
            class="goods"
            v-for="(item, index) in orderVal.goods"
            :key="index"
          >
            <div class="item justifyS">
              <p>{{ item.name }}</p>
              <p>x{{ item.amount }}</p>
              <p>￥{{ item.showPrice }}</p>
            </div>
            <div class="direction">
              <span>规格：{{ getSpec(item.specList) }}</span>
              <span>备注：{{ item.remark }}</span>
            </div>
          </div>
        </div>
        <!-- 支付信息 -->
        <div class="info">
          <div class="title">
            <p>支付信息</p>
          </div>
          <div class="goods">
            <div
              class="item justifyS"
              v-for="(val, key, index) in orderVal.payList"
              :key="index"
            >
              <p>{{ key }}</p>
              <p>{{ val }}</p>
            </div>
          </div>
        </div>

        <!-- 订单信息 -->
        <div class="info">
          <div class="title justifyS">
            <p>订单信息</p>
            <span class="succ">已支付</span>
          </div>
          <div class="orderInfo">
            <p>订单编号：{{ orderVal.orderInfo.no }}</p>
            <p>订单来源：{{ orderVal.orderInfo.source }}</p>
            <p>流水号：{{ orderVal.orderInfo.takeNo }}</p>
            <p>接单方式：{{ orderVal.orderInfo.takeType }}</p>
            <p>接单人：{{ orderVal.orderInfo.takeUser }}</p>
            <p>
              接单时间：{{
                orderVal.orderInfo.takeTime
                  ? $moment(orderVal.orderInfo.takeTime).format(
                      "YYYY/MM/DD HH:mm:ss"
                    )
                  : ""
              }}
            </p>
          </div>
        </div>
      </div>
      <div class="right flex-div" v-else>
        <div class="no-order">暂无订单详情</div>
      </div>
    </div>

    <el-dialog title="拒单确认" :visible.sync="refuseVisible" width="400px">
      <div class="dialog">
        <span>拒单后当前订单欠款原路返回</span>
        <p>拒单原因</p>
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
          placeholder="请输入原因"
        ></el-input>

        <div class="justifyS action">
          <el-button class="cancel" @click="refuseVisible = false"
            >取消</el-button
          >
          <el-button type="darkGreen" @click="confirm">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  orderTakingList,
  orderTakingDetail,
  setAtuo,
  orderTake,
  getRemarks,
  getTakeType,
  orderRefuse,
} from "@/api";
import Utils from "@/utils/util";
import {
  printCustomerTicket,
  printStickersTicket,
  printBill,
} from "@/utils/PrintCore";
export default {
  data() {
    return {
      activeName: "1",
      allList: [],
      waitList: [],
      activeIndex: 0,
      // 接单设置
      suspend: false,
      // 是否显示拒绝弹出窗
      refuseVisible: false,
      // 右侧订单信息
      orderVal: {
        goods: [],
        payList: {},
        orderInfo: {},
        userInfo: {},
      },
      // 订单ID
      orderId: "",
      // 拒单原因
      remarks: "",
      remarksIndex: -1,
      fixedRemarks: [],
      // 显示订单详情
      empty: false,
    };
  },
  mounted() {
    Utils.$on("refreshOrder", () => {
      this.showList();
    });
    // 获取全部列表以及商品详情
    this.showList();
    // 拉取备注
    getRemarks("9")
      .then((res) => {
        console.log(res);
        this.fixedRemarks = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    // 初始接单状态
    getTakeType()
      .then((res) => {
        console.log(res);
        this.suspend = res.data == 1 ? false : true;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    // 切换tab
    handleClick(tab, event) {
      const index = tab.index;
      this.activeIndex = 0;
      if (index == 0) {
        if (this.allList.length > 0) {
          this.getOrderDeatil(this.allList[this.activeIndex].id);
        } else {
          this.empty = false;
        }
      } else {
        if (this.waitList.length > 0) {
          this.getOrderDeatil(this.waitList[this.activeIndex].id);
        } else {
          this.empty = false;
        }
      }
    },
    // 选择不同订单
    focusOrder(index, item) {
      this.activeIndex = index;
      this.getOrderDeatil(item.id);
    },
    // 展示初始数据
    async showList() {
      // 获取待接单列表
      orderTakingList(2)
        .then((res) => {
          console.log(res);
          this.waitList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
      // 获取全部接单列表
      await orderTakingList(1)
        .then((res) => {
          console.log(res);
          this.allList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
      // 展示默认订单
      if (this.allList.length > 0) {
        await this.getOrderDeatil(this.allList[this.activeIndex].id);
      }
    },
    // 获取订单详情
    getOrderDeatil(params) {
      orderTakingDetail(params)
        .then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.orderVal = res.data;
            this.empty = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取规格
    getSpec(list) {
      let spec = [];
      if (list.length > 0) {
        for (let item of list) {
          for (let it of item.specItemList) {
            //  判断默认选中项
            if (item.defValueId == it.id) {
              //  判断是否是小料
              spec.push(it.name);
            }
          }
        }
      }
      return this._.join(spec, " ");
    },
    // 自动接单设置
    setBtn(e) {
      console.log(e);
      // 1手动接单 2自动接单
      setAtuo(e ? "2" : "1")
        .then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.$notify({
              title: "成功",
              message: `已成功设置${e ? "自动" : "手动"}接单`,
              type: "success",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 拒单事件
    refuseOrder(id) {
      this.orderId = id;
      this.refuseVisible = true;
    },
    // 接单事件
    takeOrder(id) {
      this.loading = true;
      orderTake(id)
        .then((res) => {
          console.log(res);
          this.loading = false;
          if (res.code == 200) {
            // 刷新订单数量
            Utils.$emit("queryOrderNumber-websocket");
            // 获取全部列表以及商品详情
            this.showList();
            this.$notify({
              title: "成功",
              message: "已成功接单",
              type: "success",
            });
            // 支付完成打印小票
            if (res.data.customerId != null) {
              printCustomerTicket(res.data.customerId);
            }
            printBill(res.data.accountId);
            if (res.data.stickerList != null && res.data.stickerList.length > 0) {
              for (let item of res.data.stickerList) {
                let d = JSON.stringify(item);
                let params = encodeURIComponent(d);
                printStickersTicket(params);
              }
            }
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    // 选择拒单原因
    checkRemark(index, item) {
      this.remarksIndex = index;
      this.remarks = item;
    },
    // 备注input 修改
    remarksChange(e) {
      if (this.fixedRemarks[this.remarksIndex] != e) {
        this.remarksIndex = -1;
      }
    },
    // 确认拒单按钮
    confirm() {
      orderRefuse(this.orderId, this.remarks ? this.remarks : "-1")
        .then((res) => {
          console.log(res);
          this.refuseVisible = false;
          if (res.code == 200) {
            // 刷新订单数量
            Utils.$emit("queryOrderNumber-websocket");
            // 刷新订单列表
            this.showList();
            this.$notify({
              title: "成功",
              message: "已拒绝接单",
              type: "success",
            });
          }
        })
        .catch((err) => {
          this.refuseVisible = false;
          console.log(err);
        });
    },
  },
  beforeDestroy() {
    Utils.$off("refreshOrder");
  },
};
</script>
<style scoped lang="scss">
.content {
  width: 100%;
  height: calc(100vh - 62px);
  padding: 15px;
  box-sizing: border-box;
  background: url("@/assets/homeBg.png");
  background-size: 100% 100%;
  color: #4f424c;
  font-size: 14px;
  p {
    margin: 5px 0;
    font-size: 14px !important;
  }
  span {
    color: #9f9f9f;
    font-size: 13px;
    line-height: 1.5;
  }
}
.main {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  overflow: hidden;
  background: #fff;
}
.left {
  width: 75%;
  height: 100%;
  border-right: 1px solid #f5f5f5;
  box-sizing: border-box;
  position: relative;
}
.right {
  width: 25%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}
::v-deep .el-tabs__header {
  padding: 0 30px;
  margin-top: 10px;
  box-sizing: border-box;
}
.setting {
  position: absolute;
  align-items: center;
  top: 10px;
  right: 22px;
  p {
    margin-right: 5px;
  }
}
::v-deep .el-tabs__content {
  height: calc(100vh - 157px);
  overflow: scroll;
}
.order {
  width: 100%;
}
.orderItem {
  padding: 10px 20px;
  box-sizing: border-box;
  align-items: center;
  border-bottom: 1px solid #f5f5f5;
  background: #fff;
  cursor: pointer;
  &:hover {
    background: #f5f5f5 !important;
  }
}
.orderTitle {
  p {
    padding: 0;
    font-size: 16px;
    margin: 5px 0;
  }
  span {
    font-size: 12px;
    color: #9f9f9f;
  }
}
.active {
  background: #f5f5f5 !important;
}
.btnBox {
  button {
    border-radius: 10px;
  }
}
.orderUser {
  align-items: center;
  img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 20px;
    overflow: hidden;
  }
}
.info {
  margin: 30px 0;
}
.title {
  padding: 5px 0;
  border-bottom: 1px solid #e7e7e7;
}
.item {
  line-height: 2;
  & p:nth-child(1) {
    width: 60%;
    word-break: break-all;
  }
  & p:nth-child(2) {
    width: 15%;
    text-align: end;
  }
  & p:nth-child(3) {
    width: 25%;
    text-align: end;
  }
}
.goods {
  margin: 5px 0;
}
.orderInfo {
  p {
    line-height: 2;
  }
}
.succ {
  color: #009e69 !important;
}
.dialog {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  span {
    font-size: 13px;
  }
  p {
    margin: 10px 0;
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

.no-order {
  width: 108px;
  height: 25px;
  font-size: 18px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #9f9f9f;
  line-height: 25px;
  align-self: center;
  text-align: center;
}

.flex-div {
  display: flex;
  justify-content: center;
}
</style>