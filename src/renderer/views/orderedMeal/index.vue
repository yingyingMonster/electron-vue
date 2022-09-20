<template>
  <div class="justify menuContent">
    <div class="orderContent">
      <OrderDetail></OrderDetail>
    </div>

    <div class="menuList">
      <transition name="fade">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>
<script>
import OrderDetail from "../../components/orderDetail";
export default {
  components: {
    OrderDetail,
  },
};
</script>
<style lang="scss" scoped>
.menuList {
  width: 75%;
  height: calc(100vh - 62px);
}
.menuContent {
  width: 100%;
  min-height: calc(100vh - 62px);
  background: url("@/assets/homeBg.png");
  background-size:cover ;
}
.orderContent {
  width: 25%;
  height: calc(100vh - 62px);
}
</style>