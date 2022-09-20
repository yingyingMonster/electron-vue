<template>
  <div class="content" v-loading="loading">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <div class="totalTip">当前共{{ goodsCount }}件商品</div>
      <!-- 展示全部商品 -->
      <el-tab-pane label="全部" name="all" class="orderList">
        <div class="list justify">
          <!-- 添加按钮 -->
          <el-card
            class="direction addCard"
            shadow="hover"
            @click.native="addMenu()"
          >
            <i
              class="el-icon-plus add-icon"
              style="font-size: 38px; color: #c0c0c0"
            ></i>
            <p>添加临时商品</p>
          </el-card>

          <el-badge
            v-for="it in allList"
            :value="getBadge(it.id)"
            :key="it.id"
            :hidden="getBadge(it.id) > 0 ? false : true"
            class="listItem"
          >
            <el-card
              class="direction card"
              shadow="hover"
              @click.native="placOrder(it.id)"
            >
              <div class="direction goodsName">
                <span class="name-goods">{{ it.name }}</span>
                <span class="name-goods">{{ it.enName }}</span>
              </div>
              <span class="name-goods name-price">￥{{ it.price }}</span>
            </el-card>
          </el-badge>
        </div>
      </el-tab-pane>
      <!-- 展示不同类别商品 -->
      <el-tab-pane
        v-for="item in navList"
        :key="item.id"
        :label="item.name"
        :name="item.name"
        class="orderList"
      >
        <!-- 角标展示 -->
        <div slot="label">
          <span>{{ item.name }}</span>
          <el-badge
            :value="getCategoryBadge(item.id)"
            v-if="getCategoryBadge(item.id) > 0 ? true : false"
          ></el-badge>
        </div>
        <div class="list justify">
          <!-- 添加按钮 -->
          <el-card
            class="direction addCard"
            shadow="hover"
            @click.native="addMenu"
          >
            <i
              class="el-icon-plus add-icon"
              style="font-size: 38px; color: #c0c0c0"
            ></i>
            <p>添加临时商品</p>
          </el-card>
          <el-badge
            :value="getBadge(it.id)"
            v-for="it in item.goodsList"
            :key="it.id"
            :hidden="getBadge(it.id) > 0 ? false : true"
            class="listItem"
          >
            <el-card
              class="direction card"
              shadow="hover"
              @click.native="placOrder(it.id)"
            >
              <div class="direction goodsName">
                <span class="name-goods">{{ it.name }}</span>
                <span class="name-goods">{{ it.enName }}</span>
              </div>
              <span class="name-goods name-price">￥{{ it.price }}</span>
            </el-card>
          </el-badge>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="添加临时饮品"
      :visible.sync="dialogVisible"
      width="700px"
      :before-close="handleClose"
    >
      <span class="dialogTip">将临时饮品添加至购物车，不会影响商品库存</span>
      <AddTemporary></AddTemporary>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getWorkbench, getGoods } from "@/api/index";
import AddTemporary from "./addTemporary";
export default {
  data() {
    return {
      // tabbar默认页面
      activeName: "all",
      // 商品总数
      goodsCount: "",
      // 请求数据列表
      navList: [],
      // 全部商品列表
      allList: [],
      // 加菜弹窗
      dialogVisible: false,
      // tab标签页
      tabIndex: "",
      loading: false,
    };
  },

  components: {
    AddTemporary,
  },

  computed: {
    ...mapGetters(["orderedMeal", "searchTxt"]),
  },
  mounted() {
    this.getList();
  },

  methods: {
    // 切换标签
    handleClick(tab, event) {
      const index = tab.index;
      this.tabIndex = tab.index;
      if (index == 0) {
        this.goodsCount = this.allList.length;
      } else {
        this.goodsCount = this.navList[index - 1].goodsList.length;
      }
    },
    // 点击添加订单
    placOrder(id) {
      this.loading = true;
      getGoods(id)
        .then((res) => {
          this.loading = false;
          this.$store.commit("addOrder", res.data);
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    // 获取商品角标数量
    getBadge(val) {
      let arr = this.orderedMeal.filter((item) => {
        return item.id == val;
      });
      return arr.length;
    },
    // 获取分类角标数量
    getCategoryBadge(val) {
      let arr = this.orderedMeal.filter((item) => {
        return item.type == val;
      });
      return arr.length;
    },
    // 添加临时饮品
    addMenu() {
      this.dialogVisible = true;
    },
    // 获取点餐界面接口
    getList() {
      this.loading = true;
      getWorkbench()
        .then((res) => {
          this.loading = false;
          console.log(res);
          this.navList = res.data.typeList;
          // 全部商品列表拼接
          const allGoods = res.data.typeList
            .map((item) => {
              return item.goodsList.map((it) => {
                return it;
              });
            })
            .flat();
          this.allList = this._.orderBy(allGoods, ["showOrder"], ["asc"]);
          // 刷新tab下数量
          if (this.tabIndex == 0) {
            this.goodsCount = this.allList.length;
          } else {
            this.goodsCount = this.navList[this.tabIndex - 1].goodsList.length;
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    // 关闭弹窗
    handleClose() {
      this.dialogVisible = false;
    },
  },
  // 监听vuex中searchTxt
  watch: {
    searchTxt: function (newVal) {
      if (this._.trim(newVal)) {
        // 深拷贝数据
        let list = this._.cloneDeep(this.navList);
        for (let item of list) {
          item.goodsList = item.goodsList.filter((it) => {
            return (it.name + it.enName).includes(this._.trim(newVal));
          });
        }
        this.allList = this.allList.filter((it) => {
          return (it.name + it.enName).includes(this._.trim(newVal));
        });
        this.navList = list;
        // 刷新tab下数量
        if (this.tabIndex == 0) {
          this.goodsCount = this.allList.length;
        } else {
          this.goodsCount = this.navList[this.tabIndex - 1].goodsList.length;
        }
      } else {
        this.getList();
      }
    },
  },
};
</script> 
<style lang="scss">
.dialogForm .el-form-item__label {
  width: 30%;
  text-align: left;
}
.dialogForm .el-form-item__content {
  width: 70%;
  .el-select {
    width: 100%;
  }
  input {
    border: none;
    padding: 0;
    height: 40px;
    line-height: 40px;
  }
}
.remarks > .el-form-item__content {
  width: 100%;
}
.addCard .el-card__body {
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  align-items: center;
}
.card .el-card__body {
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-start;
}
</style>
<style scoped lang="scss">
.content {
  width: 100%;
  height: 100%;
  padding: 10px 0;
  box-sizing: border-box;
  border-radius: 15px;
  ::v-deep .el-tabs__active-bar {
    border-radius: 4px;
    height: 4px;
    bottom: 2px;
    background: #009e69;
  }
  ::v-deep .el-tabs__nav-wrap::after {
    height: 1px;
  }
  ::v-deep .el-tabs__item {
    height: 50px;
    font-weight: 400;
  }
  ::v-deep .is-fixed {
    top: 10px !important;
    right: 20px !important;
  }
  ::v-deep .el-tabs__header {
    background: #fff;
    padding: 15px 20px;
    position: relative;
    border-radius: 15px 15px 0 0;
    margin: 0 10px;
  }
  ::v-deep .el-tabs__item.is-active,
  .el-tabs__item:hover {
    color: #4f424c;
    font-weight: 600;
  }
  ::v-deep .el-tabs__item {
    font-size: 18px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #4f424c;
  }
  ::v-deep .el-tabs__nav-wrap {
    height: 60px;
  }
}
.orderList {
  height: calc(100vh - 219px);
  padding: 5px 0;
  box-sizing: border-box;
  overflow: scroll;
}
.list {
  flex-wrap: wrap;
  cursor: pointer;
}
.listItem {
  width: calc(100% / 7 - 10px);
  height: calc((100vh - 209px) / 5 - 10px);
  margin: 5px;
}
.card {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  font-size: 14px;
  color: #4f424c;
  span {
    display: flex;
  }
}
.addCard {
  width: calc(100% / 7 - 10px);
  height: calc((100vh - 209px) / 5 - 10px);
  margin: 5px;
  border-radius: 15px;
  border: 1px dashed #009e69;
  color: #4f424c;
  i {
    font-size: 24px;
    color: #4f424c;
  }
}
.totalTip {
  width: calc(100% - 20px);
  height: 48px;
  color: #4f424c;
  font-size: 13px;
  background: #fff;
  border-radius: 0px 0px 15px 15px;
  margin-left: 10px;
  padding: 10px 0 10px 20px;
  display: flex;
}
.pagination {
  width: calc(100% - 20px);
  margin: 0 10px;
  padding: 0 20px;
  box-sizing: border-box;
  height: 80px;
  background: #fff;
  border-radius: 15px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.goodsName {
  span:last-child {
    font-size: 13px;
  }
}
.dialogTip {
  margin-left: 30px;
  font-size: 14px;
  margin-top: 5px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #9f9f9f;
}
.name-goods {
  font-size: 18px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 500;
  color: #4f424c;
  line-height: 20px;
}
.name-price {
  font-weight: 800;
}
</style>