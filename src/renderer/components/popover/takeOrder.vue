<template>
  <div class="content justify" v-loading="loading">
    <div class="left">
      <div
        class="order"
        v-for="(item, index) in orderList"
        :key="item.id"
        @click="checkOrder(index)"
        :class="index == orderIndex ? 'active' : ''"
      >
        <span>{{ item.showOrder }}</span>
        <span>￥{{ item.price }}</span>
        <div>{{ item.ctDate }}</div>
      </div>
    </div>
    <div class="right">
      <div class="orderList">
        <div
          class="orderItem justify"
          v-for="item in orderList[orderIndex]
            ? orderList[orderIndex].goodsList
            : ''"
          :key="item.id"
        >
          <div class="frontSty">{{ item.name }}</div>
          <div class="endSty">x {{ item.amount }}</div>
          <div class="endSty price">￥{{ item.price }}</div>
        </div>
      </div>
      <div class="action">
        <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          confirm-button-type="darkGreen"
          cancel-button-type="default"
          icon="el-icon-info"
          icon-color="red"
          title="确定删除此存单?"
          class="getOrder"
          @confirm="delOrder"
        >
          <el-button
            class="normal"
            :disabled="orderList.length < 1"
            slot="reference"
          >
            删除此订单
          </el-button>
        </el-popconfirm>
        <el-button
          type="primary"
          :disabled="orderList.length < 1"
          slot="reference"
          @click="getOrder"
        >
          确认此订单
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { takeOrderList, delTakeOrder, takeOrderDetail } from "@/api";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      orderList: [],
      orderIndex: 0,
      loading: true,
    };
  },
  computed: {
    ...mapGetters(["orderedMeal"]),
  },
  mounted() {
    this.getTakeOrder();
  },
  methods: {
    checkOrder(index) {
      this.orderIndex = index;
    },
    // 获取存单列表
    getTakeOrder() {
      this.loading = true;
      takeOrderList()
        .then((res) => {
          this.loading = false;
          console.log(res);
          if (res.code == 200) {
            this.orderList = res.data;
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    // 删除存单
    delOrder() {
      this.loading = true;
      delTakeOrder(this.orderList[this.orderIndex].id)
        .then((res) => {
          this.loading = false;
          console.log(res);
          if (res.code == 200) {
            this.getTakeOrder();
            this.orderIndex = 0;
            this.$emit("getTakeOrder");
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    // 确定选择存单
    getOrder() {
        this.loading=true;
      if (this.orderedMeal.length > 0) {
        this.$emit('emptyBtn');
        // 先存单,再取单
        takeOrderDetail(this.orderList[this.orderIndex].id)
          .then((res) => {
            this.loading=false;
            console.log(res);
            if (res.code == 200) {
              for (let item of res.data.goodsList) {
                this.$store.commit("createOrder", item);
              }
              this.$emit("getTakeOrder");
            }
            // 关闭弹窗
            this.$parent.handleClose();
          })
          .catch((err) => {
            this.loading=false;
            console.log(err);
          });
      } else {
        takeOrderDetail(this.orderList[this.orderIndex].id)
          .then((res) => {
            this.loading=false;
            console.log(res);
            if (res.code == 200) {
              for (let item of res.data.goodsList) {
                this.$store.commit("createOrder", item);
              }
              this.$emit("getTakeOrder");
            }
            // 关闭弹窗
            this.$parent.handleClose();
          })
          .catch((err) => {
            this.loading=false;
            console.log(err);
          });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.content {
  width: 100%;
  height: 400px;
  color: #4f424c;
}
.left {
  width: 30%;
  height: 100%;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid #f5f5f5;
}
.order {
  width: 80%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #e7e7e7;
  margin-bottom: 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
  cursor: pointer;
  span {
    font-size: 15px;
    color: #4f424c;
    line-height: 2;
  }
  div {
    font-size: 12px;
    color: #9f9f9f;
    line-height: 2;
  }
}
.right {
  width: 70%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.orderList {
  width: 100%;
  height: calc(100% - 60px);
  padding: 0 20px;
  overflow: scroll;
  box-sizing: border-box;
}
.orderItem {
  width: 100%;
  padding: 10px 0;
  align-items: center;
  border-bottom: 1px solid #f5f5f5;
}
.frontSty {
  width: 60%;
}
.endSty {
  width: 20%;
  text-align: center;
}
.price {
  font-size: 16px;
}
.action {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  button {
    width: 160px;
    height: 45px;
  }
}
.normal {
  background: #f5f5f5;
}
.active {
  background: #fafffd;
  border-color: #009e69;
}
.getOrder {
  width: 160px;
  height: 45px;
  button {
    width: 160px;
    height: 45px;
  }
}
</style>