<template>
  <div class="secure">
    <!-- 导航栏 -->
    <van-nav-bar title="账号中心" left-text="返回" @click-left="back()" left-arrow placeholder fixed></van-nav-bar>

    <!-- 列表选项 -->
    <div class="list-box">
      <van-cell-group>
        <van-cell title="修改密码" is-link @click="openPopup" />
        <van-cell title="注销账号" is-link @click="destroy" />
      </van-cell-group>
    </div>

    <!-- 退出登录按钮 -->
    <div class="logout">
      <van-button :round="true" :block="true" type="danger" @click="logout">退出登录</van-button>
    </div>

    <!-- 输入密码 -->
    <van-popup v-model="isOpen" position="bottom">
      <div class="v-popup">
        <van-form @submit="commit">
          <van-field
            v-model="passwordData.oldPassword"
            :rules="[{ required: true, pattern:/^[a-zA-Z]{1}\w{5,15}$/,message: '密码6-16位且以字母开头' }]"
            label="原密码"
            placeholder="原密码"
          />
          <van-field
            v-model="passwordData.newPassword"
            :rules="[{ required: true, pattern:/^[a-zA-Z]{1}\w{5,15}$/,message: '密码6-16位且以字母开头' }]"
            type="text"
            label="新密码"
            placeholder="新密码"
          />
          <div class="btn-box">
            <van-button round block type="danger" native-type="submit">提交</van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script>
import "@/assets/css/secure.less";

export default {
  data() {
    return {
      isOpen: false,

      // 密码数据
      passwordData: {
        oldPassword: "",
        newPassword: ""
      }
    };
  },
  methods: {
    // 返回
    back() {
      this.$router.back(-1);
    },

    // 显示修改密码界面
    openPopup() {
      this.isOpen = true;
    },

    // 退出登录
    logout() {
      //清除token
      localStorage.removeItem("_Tk");

      // 跳转到登录页面
      this.$router.push({ name: "Submit" });
    },

    // 注销账户
    destroy() {
      this.$dialog
        .confirm({
          title: "注销账号",
          message: "一旦注销，数据无法恢复"
        })
        .then(() => {
          //点击确认

          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0
          });

          //发起注销请求
          this.axios({
            method: "post",
            url: "/destroyAccount",
            data: {
              appkey: this.appkey,
              tokenString: localStorage.getItem("_Tk")
            }
          })
            .then(result => {
              this.$toast.clear();

              if (result.data.code == "G001") {
                //清除token
                // 跳转到登录页面
                this.logout();
              } else {
                this.$toast(result.data.msg);
              }
            })
            .catch(err => {
              this.$toast.clear();
            });
        })
        .catch(err => {
          // 点击取消
          this.$toast("已取消注销");
        });
    },

    // 退出登录
    logout() {
      //清除token
      localStorage.removeItem("_Tk");

      // 跳转到登录页面
      this.$router.push({ name: "Submit" });
    },

    // 修改密码
    commit() {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "post",
        url: "/updatePassword",
        data: {
          appkey: this.appkey,
          tokenString: localStorage.getItem("_Tk"),
          //新的密码
          password: this.passwordData.newPassword,
          //原密码
          oldPassword: this.passwordData.oldPassword
        }
      })
        .then(res => {
          //关闭修改密码弹出框
          this.isOpen = false;
          if (res.data.code == "E001") {
            this.$toast.success("修改成功");
            this.logout();
          } else {
            this.$toast(res.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    }
  }
};
</script>
