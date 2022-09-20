<template>

<!-- 个人和企业挂帐订单明细复用页面 -->
  <div class="bg-wrap">
    <!-- 姓名部分 -->
    <div class="name-wrap phone-text">
      <div class="name-row">
        <div class="name-text"  v-if="kindType == 1">{{infoData.creditName}}</div>
        <div class="name-text"  v-if="kindType == 2">{{infoData.orgName}}</div>
        <div>
          <span class="phone-text">已结账</span>
          <span>{{infoData.payTime}}</span>
        </div>
      </div>
      <div class="phone-row">
        <div class="phone-left">
          
          <!-- 个人 -->
          <span v-if="kindType == 1">手机号：</span>
          <span class="paddingRight20" v-if="kindType == 1"> {{infoData.phone}}</span>
          <span v-if="kindType == 1">职位：</span>
          <span v-if="kindType == 1">{{infoData.position}}</span>
          <!-- 企业 -->
          <span v-if="kindType == 2">挂帐人：</span>
          <span class="" v-if="kindType == 2"> {{infoData.creditName}}</span>
        </div>
        <div class="phone-right">
          <span>挂账消费：</span>
          <span>{{infoData.usedAmount}}</span>
        </div>
      </div>
      <div class="num-wrap">
        <span>编号：</span>
        <span class="paddingRight20">{{infoData.code}}</span>
        <span>挂账额度：</span>
        <span>￥{{infoData.limitAmount}}</span>
      </div>
    </div>

    <!-- 菜品部分 -->
    <div  class="dishes-bigwrap ordertext-nomal">
      <div class="dishes-wrap">
        <div class="dishes-text">{{infoData.dishName}}</div>
        <div>已结账并确认订单数</div>
        <div class="separated-line"></div>

        <div  v-for="(item,index) in infoData.orderDetailList" :key="index"  class="name-row">
          <div>{{item.goodsName}}</div>
          <div>
            <span class="paddingRight80">x {{item.num}}</span>
            <span>{{item.goodsPrice}}</span>
          </div>
        </div>
        <div></div>
      </div>
    </div>

    <!-- 订单部分 -->
    <div class="order-wrap">

      <!-- 订单信息 -->
      <div class="order-info">
        <div class="point-group">
          <div class="point-color"></div>
          <div class="point-name">订单信息</div>
        </div>
        <div class="ordertext-top ordertext-nomal">
          <span>订单号：</span>
          <span>{{infoData.orderNum}}</span>
        </div>
        <div class="ordertext-top ordertext-black">
          <span>时间：</span>
            <span>{{infoData.ctDate}}</span>
        </div>
        <div class="ordertext-top ordertext-nomal">
          <span>取餐号：</span>
            <span>{{infoData.mealCode}}</span>
        </div>
        <div class="ordertext-top ordertext-nomal">
          <span>下单人：</span>
          <span>{{infoData.staffName}}</span>
        </div>
      </div>
      <!-- 支付信息 -->
      <div class="pay-info ordertext-nomal">
        <div class="pointtwo-group">
          <div class="pointleft-group">
            <div class="point-color"></div>
            <div class="point-name">支付信息</div>
          </div>
          <div>
            <span v-if="infoData.cashierName">收银员：</span>
            <span v-if="infoData.cashierName">{{infoData.cashierName}}</span>
          </div>
        </div>
        
        <div class="ordertext-top ">
          <span class="ordertexttip-width">菜品原价：</span>
          <span>{{infoData.originalPrice}}</span>
        </div>
         <div class="ordertext-top ordertext-bottom ordertext-black">
          <span class="ordertexttip-width">订单原价：</span>
          <span>{{infoData.orderPrice}}</span>
        </div>

        <div class="order-pay  ordertext-black">
          <span class="ordertexttip-width">顾客应付：</span>
          <span>{{infoData.price}}</span>
        </div>

         <div class="ordertext-top ">
          <span class="ordertexttip-width">挂账消费：</span>
          <span >{{infoData.creditPrice}}</span>
        </div>
         <div class="ordertext-top ordertext-bottom ordertext-black">
          <span class="ordertexttip-width">支付合计：</span>
          <span>{{infoData.payAmount}}</span>
        </div>

        <div class="order-pay  ordertext-black">
          <span class="ordertexttip-width">支付优惠：</span>
          <span>{{infoData.discountPrice}}</span>
        </div>

         <div class="ordertext-top">
          <span class="ordertexttip-width">挂账消费收入：</span>  
          <span>{{infoData.creditAmount}}</span>
        </div>
         <div class="ordertext-top ordertext-black">
          <span class="ordertexttip-width">订单收入：</span>
          <span>{{infoData.orderAmount}}</span>
        </div>
      </div>

       <!-- 挂账信息 -->
       <div class="account-info">
        <div class="point-group">
          <div class="point-color"></div>
          <div class="point-name">挂账信息</div>
        </div>
        <div class="ordertext-top ordertext-nomal">
          <span class="accounttip-width">挂账类型：</span>
          <span>{{infoData.creditType}}</span>
        </div>
        <div class="ordertext-top ordertext-nomal" v-if="kindType == 2">
          <span class="accounttip-width">挂账企业：</span>
          <span>{{infoData.orgName}}</span>
        </div>
         <div class="ordertext-top ordertext-nomal">
          <span class="accounttip-width">挂账人：</span>
          <span>{{infoData.creditName}}</span>
        </div>
        <div class="ordertext-top ordertext-nomal" v-if="kindType == 1">
          <span class="accounttip-width">手机号：</span>
          <span>{{infoData.phone}}</span>
        </div>
      </div>

      <!-- 操作日志 -->
      <div class="record-info">
        <div class="pointtwo-group">
          <div class="pointleft-group">
            <div class="point-color"></div>
            <div class="point-name">操作日志</div>
          </div>
          <div class="record-num">{{infoData.logList.length}}条</div>
        </div>
        <div class="record-wrap">
          <div v-for="(item,index) in infoData.logList" :key="index" class="record-row">
            <div class="record-time">
              <span>{{item.ctDate}}</span>
              <span>操作人:</span>
              <span>{{item.operateName}}</span>
            </div>
            <div class="record-text">{{item.remark}}</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>

import { personAccountDescReq, groupAccountDescReq} from "@/api/index";
export default {
    data() {
    return {
      kindType: 1, // 1 个人 2 企业
      input: '',
      quaryId: 0,
      infoData: {
        logList:[]
      },
    };
  },

  mounted(){

    this.kindType = this.$route.query.kindType ? this.$route.query.kindType : 1
    this.quaryId =  this.$route.query.quaryId ? this.$route.query.quaryId : 0
    this.detailReq()
  },

   methods: {


   /** 关闭弹窗 */
    popCloseClick() {
      this.dialogTableVisible = false
    },

     /** 接口请求 */
    detailReq() {
     if(this.kindType == 1) {
       this.personDetailReq()
     } else {
       this.groupDetailReq()
     }
    },

     /** 个人接口请求 */
    personDetailReq() {
       personAccountDescReq( this.quaryId).then((res) => {
        this.infoData = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    },

     /** 企业接口请求 */
    groupDetailReq() {
       groupAccountDescReq( this.quaryId).then((res) => {
        this.infoData = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    },



    
  },
 
};
</script>
<style lang="scss" scoped>



.bg-wrap {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
 
}

.name-wrap {
  margin-top: 20px;
  padding: 25px 30px;
  width: 40%;
  background: #F5F5F5;
  border: 1px solid #F5F5F5;
  height: 160px;
}

.name-row  {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.name-text {
  font-size: 30px;
  font-family: PingFangSC-Medium, PingFang SC;
  color: #4F424C;
}
.paddingRight20 {
  padding-right: 20px;
}
.phone-text {
  font-size: 15px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #4F424C;
}

.phone-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 20px;
}

.dishes-bigwrap {
  width: 25%;
}

.dishes-wrap {
  min-height: 160px;
  margin-top: 20px;
  padding: 14px 20px 18px;
  border: 1px solid #E7E7E7;
}

.dishes-text {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  color: #4F424C;
  padding-bottom: 10px;
}

.separated-line {
  width: 100%;
  height: 1px;
  background: #E7E7E7;
  margin: 14px 0px 10px;
}

.paddingRight80 {
  padding-right: 80px;
}

.order-wrap {
  width: 30%;
  padding: 20px;
  border-left: 1px solid #E7E7E7;
  // height: 80vh;
  //顶部62    padding 15*2  =  92px 
  height: calc(100vh - 92px - 30px);
  overflow: scroll;
}

.order-info, .pay-info, .account-info, .record-info {
  margin-bottom: 30px;
}

.accounttip-width {
  width: 8vw;
  display: inline-block;
}

.pointtwo-group {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid #E7E7E7;
}

.pointleft-group {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.point-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #E7E7E7;
}

.point-color {
  margin-right: 5px;
  width: 4px;
  height: 14px;
  background: #009E69;
}

.point-name {
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500; 
  color: #4F424C;
}

.ordertext-top {
  margin-top: 15px;
}

.ordertexttip-width {
  width:  12vw;
  display: inline-block;
}

.ordertext-paddingRight5vw {
  padding-right: 5vw;
}

.ordertext-bottom {
  margin-bottom: 15px;
}

.order-pay {
  padding-top: 15px;
  padding-bottom: 15px;
  border-top: 1px solid #E7E7E7;
  border-bottom: 1px solid #E7E7E7;
}

.ordertext-nomal {
  font-size: 14px;
  color: #4F424C;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
}

.ordertext-black {
  font-size: 14px;
  color: #4F424C;
  font-family: PingFangSC-Semibold, PingFang SC;  
  font-weight: 600;
}

.record-row {
  margin-top: 15px;
}

.record-num {
  font-size: 14px;
  color: #9F9F9F;
}

.record-time {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #9F9F9F;
}

.record-text {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #4F424C;
  padding-top: 3px;
}

</style>