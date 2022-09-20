<template>
  <div class="container">
    <p class="title">个人中心</p>
    <div class="personal justifyS">
      <div class="info">
        <p>{{ userInfo.name }}</p>
        <span>{{ userInfo.phone }}</span>
      </div>
      <img :src="userInfo.avatar" class="avatar" alt=""/>
    </div>

    <div class="action">
      <!-- <div class="item justifyS">
        <span>暂停接单</span>
        <el-switch
          v-model="suspend"
          active-color="#009E69"
          inactive-color="#f5f5f5"
        >
        </el-switch>
      </div>

      <div class="item justifyS">
          <span>数据更新</span>
          <div>
            <i class="el-icon-arrow-right"></i>
          </div>
      </div> -->

      <div class="item justifyS" @click="checkUpgrade">
        <span>软件更新</span>
        <div class="upgrade">
          <li class="red-point" v-if="needUpgrade"></li>
          <span>版本:{{ version }}</span>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
    </div>

    <div class="btnContent direction" zhuchonh>
      <el-button type="darkGreen" @click="handover">去交班</el-button>
      <el-button class="logout" @click="logout">退出登录</el-button>
    </div>

    <div class="support" v-if="userInfo.phone">
      技术电话:<span>{{ userInfo.phone }}</span>
    </div>
  </div>
</template>
<script>
import {mapGetters} from "vuex";
import config from "../../../../package.json";
import {logoutLogin} from "@/api";

export default {
  data() {
    return {
      version: config.version,
      suspend: false,
    };
  },
  computed: {
    ...mapGetters(["userInfo", "needUpgrade"]),
  },
  mounted() {
  },
  methods: {
    checkUpgrade() {
      this.$ipcApi.send("check-update");
    },
    // 退出登录
    logout() {
      logoutLogin().then(() => {
        localStorage.setItem("token", "");
        this.$router.push({path: "/login"});
      });
    },
    handover() {
      this.$router.push({path: "/handover"});
      this.$parent.handleClose();
    },
  },
};
</script>
<style lang="scss" scoped>
.upgrade {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.red-point {
  border-radius: 50%;
  width: 18px;
  height: 18px;
  color: red;
}

.container {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  color: #4f424c;
}

.title {
  font-size: 18px;
  margin-bottom: 20px;
  letter-spacing: 2px;
  font-weight: bold;
}

.personal {
  width: 100%;
  align-items: center;
}

.info {
  p {
    font-size: 14px;
    margin: 5px;
    font-weight: 600;
  }

  span {
    font-size: 12px;
  }
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.action {
  margin: 30px 0;
}

.item {
  padding: 10px 0;
  border-bottom: 1px solid #f5f4f5;

  span {
    font-size: 14px;
  }
}

.btnContent {
  width: 100%;
  margin: 30px 0;
  align-items: center;

  button {
    width: 90%;
    margin: 10px 0;
    height: 40px;
  }
}

.logout {
  color: #009e69;
  border: 1px solid #009e69;
}

.support {
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 10px;
  font-size: 13px;

  span {
    color: #009e69;
  }
}
</style>