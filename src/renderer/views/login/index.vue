<template>
  <div class="content justify">
    <div class="main">
      <img src="@/assets/logo.png" alt="" class="logo"/>
      <p class="title">上水咖啡点餐系统登录</p>
      <el-form
          ref="form"
          :model="form"
          class="loginForm"
          :class="subError ? 'errSty' : ''"
      >
        <el-form-item :class="subSucc ? 'succSty' : ''">
          <el-input placeholder="请输入用户名" v-model="form.username">
            <!-- class="el-input__icon el-icon-check" -->
            <i slot="prefix">
              <img style="width:15px;height:15px" src="@/assets/login_check.png" alt/>
            </i>
          </el-input>
        </el-form-item>
        <el-form-item :class="subSucc ? 'succSty' : ''">
          <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              @keyup.enter.native="handleSubmit"
          >
            <!-- class="el-input__icon el-icon-lock" -->
            <i slot="prefix">
              <img style="width:15px;height:15px" src="@/assets/login_lock.png" alt/>
            </i>
          </el-input>
        </el-form-item>
        <el-form-item :class="subSucc ? 'succSty' : ''">
          <el-select v-model="value" @change="selectShop" filterable  placeholder="请选择店铺" v-loading="loading">

            <!-- <i slot="prefix" class="el-input__icon el-icon-s-shop"></i> -->
            <i slot="prefix">
              <img style="width:15px;height:15px" src="@/assets/login_shop.png" alt/>
            </i>

            <el-option
                v-for="(item,index) in shopList"
                :key="index"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="brown" class="loginBtn" @click="handleSubmit"
          >登录
          </el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <div class="loginBg">
      <img src="@/assets/loginBg.png" alt=""/>
    </div>
  </div>
</template>
<script>
import {login, getShops, checkLogin} from "@/api";
import {mapGetters} from "vuex";

export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      subError: false,
      subSucc: false,
      // 店铺列表
      shopList: [],
      value: "",
      loading: true
    };
  },
  computed: {
    ...mapGetters(["token"]),
  },
  mounted() {
    this.getShopList();
    // 判断之前是否选择过店铺
    if (localStorage.getItem("cafeNumber")) {
      this.value = localStorage.getItem("cafeNumber")
    }
  },
  methods: {
    handleSubmit() {
      // 表单验证
      if (!(this.form.username && this.form.password)) {
        this.subError = true;
      } else {
        this.subError = false;
      }
      //检查其他端是否有登录
      checkLogin(this.value).then(result => {
        if (result.data) {
          this.$confirm("当前店铺端正在其他电脑登录中，确认登录其他电脑将登出，是否继续登录？请确认在登录前当前计算机连接小票打印机等必要的硬件设备。", "提示", {
            confirmButtonText: "登录",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            login(this.form)
                .then((res) => {
                  console.log(res);
                  if (res.code == 200) {
                    localStorage.setItem("token", `Bearer ${res.data.token}`);
                    localStorage.setItem("terminalKey", `${res.data.terminalKey}`);
                    this.$store.commit("setToken", `Bearer ${res.data.token}`)
                    this.$router.push({path: "/home"});
                  } else {
                    this.subError = true;
                    this.subSucc = false;
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
          });
        } else {
          login(this.form)
              .then((res) => {
                console.log(res);
                if (res.code == 200) {
                  localStorage.setItem("token", `Bearer ${res.data.token}`);
                  localStorage.setItem("terminalKey", `${res.data.terminalKey}`);
                  this.$store.commit("setToken", `Bearer ${res.data.token}`)
                  this.$router.push({path: "/home"});
                } else {
                  this.subError = true;
                  this.subSucc = false;
                }
              })
              .catch((error) => {
                console.log(error);
              });
        }
      });
    },
    // 获取店铺列表
    getShopList() {
      getShops()
          .then((res) => {
            this.loading = false
            this.shopList = res.data.map((item) => {
              return {value: item.businessNumber, label: item.chineseName, id: item.id};
            });
          })
          .catch((err) => {
            console.log(err);
            this.loading = false
          });
    },
    // 选择店铺
    selectShop(e) {
      localStorage.setItem("cafeNumber", e);
      const shopInfo = this.shopList.filter(item => {
        return item.value == e
      })
      localStorage.setItem("cafeId", shopInfo[0].id);
    }
  },
  watch: {
    form: {
      handler(newVal, oldVal) {
        this.subSucc = true;
        this.subError = false;
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss">
.loginForm {
  width: 400px;
}

.loginForm .el-input.is-active .el-input__inner,
.el-input__inner:focus {
  width: 100%;
  margin: 0 auto;
  border-bottom: 1px solid #9ec1d6;
}

.loginForm .el-input__inner {
  border-radius: 0;
  border: none;
  border-bottom: 1px solid #9ec1d6;
  text-indent: 10px;
}

.errSty {
  .el-input__inner {
    border-radius: 0;
    border: none;
    border-bottom: 1px solid #f06543 !important;
  }

  .el-input.is-active .el-input__inner,
  .el-input__inner:focus {
    width: 100%;
    margin: 0 auto;
    border-bottom: 1px solid #f06543 !important;
  }

  .el-input__inner::placeholder {
    color: #f06543;
  }

  input {
    color: #f06543;
  }
}

.succSty {
  input {
    caret-color: #009e69;
  }

  .el-input__icon {
    color: #009e69;
  }
}

.el-select {
  width: 100%;
}
</style>
<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100vh;
}

.main {
  height: 100%;
  width: 40%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.logo {
  width: 90px;
  height: auto;
}

.title {
  font-size: 24px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #4f424c;
  line-height: 42px;
  margin: 50px 0;
}

.loginBg {
  height: 100%;
  width: 60%;
  display: flex;
  justify-content: flex-end;

  img {
    width: auto;
    height: 100%;
  }
}

.loginBtn {
  width: 100%;
  height: 60px;
  border-radius: 100px;
  color: #fff;
  font-size: 16px;
  margin: 50px 0;
}
</style>