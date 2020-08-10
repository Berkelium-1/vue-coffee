<template>
  <div>
    <div class="address">
      <!-- 导航栏 -->
      <van-nav-bar title="编辑地址" left-text="返回" @click-left="back()" left-arrow placeholder fixed></van-nav-bar>

      <van-address-edit
        :address-info="addressInfo"
        :area-list="areaList"
        show-postal
        show-delete
        show-set-default
        show-search-result
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="onSave"
        @delete="delAddress"
      />
    </div>
  </div>
</template>

<script>
import "@/assets/css/address.less";

//导入地址数据
import areaList from "@/assets/js/area";

export default {
  data() {
    return {
      areaList,
      //地址信息
      addressInfo: {
        //收货人
        name: "",
        //手机号
        tel: "",
        //省
        province: "",
        //城市
        city: "",
        //区县
        county: "",
        //详细地址
        addressDetail: "",
        //地区编号，地址选择
        areaCode: "",
        //邮编
        postalCode: "",
        //默认地址
        isDefault: false
      },

      //地址id
      aid: ""
    };
  },

  created() {
    //截取路由参数 地址id: aid
    this.aid = this.$route.query.aid;

    if (this.aid) {
       
      this.getAidAddressdata(this.aid);
    }
  },

  methods: {
    // 保存按钮
    onSave(addressData) {
      if (this.aid) {
        // 编辑地址
        this.editAddress(addressData);
      } else {
        // 新增地址
        this.pushAddress(addressData);
      }
    },

    // 获取要编辑的地址数据
    getAidAddressdata(aid) {
      this.axios({
        url: "/findAddressByAid",
        params: {
          appkey: this.appkey,
          tokenString: localStorage.getItem("_Tk"),
          aid
        }
      })
        .then(res => {
           
          if (res.data.code == 40000) {
            res.data.result[0].isDefault = Boolean(
              res.data.result[0].isDefault
            );

            // 将数据放在页面
            for (let key in this.addressInfo) {
              this.addressInfo[key] = res.data.result[0][key];
            }
          }
        })
        .catch(err => {
           
        });
    },

    // 编辑修改地址
    editAddress(addressData) {
      // 加载提示
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true, // 是否禁止背景点击
        duration: 0 // 展示时长(ms) 值为 0 时 toast 不会消失
      });

      let data = {
        name: "",
        tel: "",
        province: "",
        city: "",
        county: "",
        addressDetail: "",
        areaCode: "",
        postalCode: "",
        isDefault: false
      };

      //拷贝对象属性
      for (let key in data) {
        data[key] = addressData[key];
      }

      data.aid = this.aid;
      data.appkey = this.appkey;
      data.tokenString = localStorage.getItem("_Tk");

      // 把布尔值转换成 0 或 1
      data.isDefault = Number(data.isDefault);

      this.axios({
        method: "post",
        url: "/editAddress",
        data
      })
        .then(res => {
           
          if (res.data.code == 30000) {
            this.$toast.success("保存成功");
            // 返回我的地址列表
            this.back();
          } else {
            this.$toast.fail("保存失败 " + res.data.code);
          }
        })
        .catch(err => {
          this.$toast.fail("保存失败");
           
        });
    },

    // 添加地址 @save自带回调参数 参数是表单信息
    pushAddress(addressData) {
      // 加载提示
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true, // 是否禁止背景点击
        duration: 0 // 展示时长(ms) 值为 0 时 toast 不会消失
      });

      let data = {
        name: "",
        tel: "",
        province: "",
        city: "",
        county: "",
        addressDetail: "",
        areaCode: "",
        postalCode: "",
        isDefault: false
      };

      //拷贝对象属性
      for (let key in data) {
        data[key] = addressData[key];
      }

      data.appkey = this.appkey;
      data.tokenString = localStorage.getItem("_Tk");

      // 把布尔值转换成 0 或 1
      data.isDefault = Number(data.isDefault);

      this.axios({
        method: "post",
        url: "/addAddress",
        data
      })
        .then(res => {
          //  
          if (res.data.code == 9000) {
            this.$toast.success("保存成功");

            // 返回我的地址列表
            this.back();
          } else {
            this.$toast.fail("保存失败 " + res.data.code);
          }
        })
        .catch(err => {
          this.$toast.fail("保存失败");
           
        });
    },

    // 删除地址
    delAddress(addressData) {
      // 加载提示
      this.$toast.loading({
        message: "删除中...",
        forbidClick: true, // 是否禁止背景点击
        duration: 0 // 展示时长(ms) 值为 0 时 toast 不会消失
      });
      this.axios({
        method: "post",
        url: "/deleteAddress",
        data: {
          appkey: this.appkey,
          tokenString: localStorage.getItem("_Tk"),
          aid: this.aid
        }
      })
        .then(res => {
           
          if (res.data.code == 10000) {
            this.$toast.success("删除成功");

            // 返回我的地址列表
            this.back();
          } else {
            this.$toast.fail("删除失败 " + res.data.code);
          }
        })
        .catch(err => {
          this.$toast.fail("删除失败");

           
        });
    },

    // 返回
    back() {
      this.$router.back(-1);
    }
  }
};
</script>
