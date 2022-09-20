<template>
  <div class="specContent">
    <div class="dialogTitle justifyS">
      <span
        >{{ this.dialogVal.type }}<i class="el-icon-minus"></i
        >{{ this.dialogVal.info.name }}</span
      >
      <i class="el-icon-close" @click="close"></i>
    </div>
    <div class="specItem" v-for="(item, index) in list.specList" :key="item.id">
      <span class="title">{{ item.name }}</span>
      <div class="specBox justify">
        <span
          v-for="(it, specIndex) in item.specItemList"
          :key="it.id"
          @click="checkSpec(index, specIndex)"
          :class="item.checkedId == it.id ? 'actived' : ''"
          >{{ it.price == 0 ? it.name : `${it.name} ￥${it.price}` }}</span
        >
      </div>
    </div>
    <el-button type="darkGreen" class="confirmBtn" @click="confirmBtn"
      >确认</el-button
    >
  </div>
</template>
<script>
export default {
  props: ["dialogVal"],
  data() {
    return {
      // 深拷贝的商品信息
      list: "",
      listCopy: "",
    };
  },
  mounted() {
    // 深拷贝商品信息,避免对原数组产生影响
    this.list = this._.cloneDeep(this.dialogVal.info);
    this.listCopy = this._.cloneDeep(this.dialogVal.info);
    console.log(this.list);
  },
  methods: {
    // 选择不同规格
    checkSpec(index, specIndex) {
      const parent = this.list.specList[index];
      const child = this.list.specList[index].specItemList[specIndex];
      // 判断是否规格可以取消选择
      if (parent.isCanCancel) {
        //判断是否是选择状态
        if (parent.checkedId == child.id) {
          parent.checkedId = "";
          parent.defValueId = "";
        } else {
          // 修改选中规格以及默认规格
          parent.checkedId = child.id;
          parent.defValueId = child.id;
        }
      } else {
        // 修改选中规格以及默认规格
        parent.checkedId = child.id;
        parent.defValueId = child.id;
      }
      // 循环遍历所有基础价格以及小料价格
      const sumBase = [];
      const sumMater = [];
      for (let item of this.list.specList) {
        for (let it of item.specItemList) {
          //  判断默认选中项
          if (item.defValueId == it.id) {
            sumBase.push(it.basePrice);
            sumMater.push(it.price);
          }
        }
      }
      //  修改showPrice,原价加基础类型(价格四舍五入)*折扣+小料
      const price = this.list.price;
      const basePrice = this._.sum(sumBase);
      const discountValue = this.list.discountValue;
      const mater = this._.sum(sumMater);
      this.list.showPrice = this._.round(
        (price + basePrice) * discountValue + mater,
        2
      );
      // 修改商品原价
      this.list.totalPrice = this._.round(price + basePrice, 2);
    },
    // 确认按钮
    confirmBtn() {
      console.log(this.listCopy, this.list);
      // 传递原始数组以及修改后的数组
      this.$store.commit("changeOrder", {
        key: this.listCopy,
        newVal: this.list,
      });
      // 关闭弹窗
      this.$parent.closePopover();
    },

    // 关闭按钮
    close() {
      // 关闭弹窗
      this.$parent.closePopover();
    },
  },
};
</script>
<style lang="scss" scoped>
.specContent {
  width: 100%;
  height: 100%;
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
.specItem {
  color: #4f424c;
  p {
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
  }
}
.specBox {
  width: 100%;
  flex-wrap: wrap;
  span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(100% / 3 - 20px);
    margin: 5px 10px;
    min-height: 40px;
    text-align: center;
    border-radius: 15px;
    color: #4f424c;
    background: #f5f5f5;
    font-size: 12px;
    cursor: pointer;
  }
}
.confirmBtn {
  border-radius: 10px;
  position: absolute;
  bottom: 10px;
  width: calc(100% - 20px);
  margin: 10px 0;
}
.title {
  display: inline-block;
  margin: 10px;
}
.actived {
  background: #009e69 !important;
  color: #fff !important;
}
</style>