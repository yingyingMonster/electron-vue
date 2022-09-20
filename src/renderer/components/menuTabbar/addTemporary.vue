<template>
  <!-- 添加临时饮品弹窗 -->
  <el-form
    :inline="true"
    :model="dialogForm"
    ref="dialogForm"
    class="dialogForm justify"
    v-loading="loading"
  >
    <el-form-item
      class="formItemLeft"
      label="商品名称"
      prop="name"
      :rules="[{ required: true, message: '请输入商品名称', trigger: 'blur' }]"
    >
      <el-input v-model="dialogForm.name" placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item
      class="formItemRight"
      label="商品属性"
      prop="realTypeId"
      :rules="[{ required: true, message: '请输入商品属性', trigger: 'blur' }]"
    >
      <el-select v-model="dialogForm.realTypeId" placeholder="请选择">
        <el-option
          v-for="item in realTypeList"
          :key="item.id"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      class="formItemLeft"
      label="商品价格"
      prop="price"
      :rules="[{ required: true, message: '请输入商品价格', trigger: 'blur' }]"
    >
      <el-input
        v-model="dialogForm.price"
        placeholder="请输入"
        type="number"
        onkeyup="this.value = this.value.replace(/[^\d.]/g,'')"
      >
        <span slot="suffix">元</span>
      </el-input>
    </el-form-item>
    <el-form-item
      class="formItemRight"
      label="商品分类"
      prop="typeId"
      :rules="[
        { required: true, message: '请选择商品分类', trigger: 'change' },
      ]"
    >
      <el-select v-model="dialogForm.typeId" placeholder="请输入">
        <el-option
          v-for="item in typeList"
          :key="item.id"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>

    <!-- <el-form-item class="formItem" label="购买数量">
      <el-input
        v-model="dialogForm.price"
        placeholder="请输入"
        type="number"
        onkeyup="this.value = this.value.replace(/[^\d.]/g,'')"
      >
      </el-input>
    </el-form-item> -->
    
    
    <el-form-item
      class="formItemLeft"
      label="单位"
      prop="unitId"
      :rules="[
        { required: true, message: '请选择商品单位', trigger: 'change' },
      ]"
    >
      <el-select v-model="dialogForm.unitId" placeholder="请选择">
        <el-option
          v-for="item in unitList"
          :key="item.id"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item class="formItemRight" style="border: none">
    </el-form-item>
    <el-form-item class="formItemLeft remarksBox" style="border: none">
      <div class="remarks">
        <span class="title">备注</span>
        <div class="reasonBox justify" v-if="remarkList.length > 0">
          <span
            v-for="(item, index) in remarkList"
            :key="index"
            @click="checkRemark(index, item)"
            :class="dialogForm.remark == index ? 'active' : ''"
            >{{ item }}</span
          >
        </div>
        <el-input
          type="textarea"
          class="reason"
          v-model="dialogForm.remark"
          placeholder="自定义备注"
        ></el-input>
      </div>
    </el-form-item>
    <el-form-item class="formBtn">
      <el-button
        type="darkGreen"
        class="confirmBtn"
        @click="handleSubmit('dialogForm')"
        >加入购物车</el-button
      >
    </el-form-item>
    
  </el-form>
</template>
<script>
import { addOrder, submitAddMeal, getGoods } from "@/api";
export default {
  data() {
    return {
      dialogForm: {
        name: "",
        realTypeId:"",
        typeId: "",
        price: "",
        unitId: "",
        remark: "",
      },
      // 饮品列表
      typeList: [],
      // 单位
      unitList: [],
      // 备注
      remarkList: [],
      // 备注列表下表
      remarksIndex: -1,
      loading: false,
      // 商品属性
      realTypeList: [],
    };
  },

  methods: {
    // 提交加菜信息
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          submitAddMeal(this.dialogForm)
            .then((res) => {
              console.log(res);
              this.loading = false;
              if (res.code == 200) {
                getGoods(res.data)
                  .then((res) => {
                    this.$store.commit("addOrder", res.data);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
                this.$notify({
                  title: "成功",
                  message: "成功添加临时商品",
                  type: "success",
                });
                this.$parent.handleClose();
              }
            })
            .catch((err) => {
              this.loading = false;
              console.log(err);
            });
        } else {
          return false;
        }
      });
    },
    // 选择备注
    checkRemark(index, item) {
      this.remarksIndex = index;
      this.dialogForm.remark = item;
    },
  },
  mounted() {
    // 临时加菜弹出页信息查询
    addOrder()
      .then((res) => {
        console.log(res);
        this.realTypeList = res.data.realTypeList.map((item) => {
          return { label: item.name, value: item.id };
        });
        this.typeList = res.data.typeList.map((item) => {
          return { label: item.name, value: item.id };
        });
        this.unitList = res.data.unitList.map((item) => {
          return { label: item.name, value: item.id };
        });
        this.remarkList = res.data.remarkList.map((item) => {
          return { label: item.name, value: item.id };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>
<style lang="scss">
.remarksBox {
  .el-form-item__content {
    width: 100% !important;
  }
}
.dialogForm {
  .el-form-item__error {
    top: 66% !important;
  }
  .el-form-item__label:before {
    content: "" !important;
    margin: 0;
  }
  .el-form-item__label:after {
    content: "*";
    color: #f56c6c;
    margin-left: 4px;
  }
}
.el-select .el-input .el-select__caret {
  transform: rotateZ(90deg);
}
</style>
<style lang="scss" scoped>
.dialogForm {
  color: #4f424c;
  flex-wrap: wrap;
  width: 100%;
}
.formItem {
  width: calc(50% - 40px);
  padding: 5px 0;
  box-sizing: border-box;
  margin: 5px 20px;
  border-bottom: 1px solid #e7e7e7;
}

.formItemLeft {
  width: calc(50% - 40px);
  padding: 5px 0;
  box-sizing: border-box;
  margin: 5px 10px 5px 30px;
  border-bottom: 1px solid #e7e7e7;
}

.formItemRight {
  width: calc(50% - 40px);
  padding: 5px 0;
  box-sizing: border-box;
  margin: 5px 30px 5px 10px;
  border-bottom: 1px solid #e7e7e7;
}

.remarks {
  color: #4f424c;
  font-size: 14px;
}
.title {
  font-size: 18px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4f424c;
}
.reasonBox {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 20px 0;
  span {
    display: inline-block;
    cursor: pointer;
    width: 31%;
    background: #f5f5f5;
    color: #4f424c;
    border-radius: 10px;
    font-size: 12px;
    text-align: center;
    height: 40px;
    line-height: 40px;
  }
}
.formBtn {
  width: 100%;
  margin: 30px 0;
  text-align: center;
  button {
    width: 60%;
    height: 50px;
  }
}
.confirmBtn {
  width: 80% !important;
}
.active {
  background: #009e69 !important;
  color: #fff !important;
}
</style>