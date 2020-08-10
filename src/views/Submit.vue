<template>
  <div class="submit">
    <!-- 导航栏 -->
    <van-nav-bar right-text="关闭" @click-right="toPage({name:'Menu'})" placeholder fixed />

    <!-- 标签栏 -->
    <van-tabs v-model="active" line-width="30" :swipeable="true">
      <!-- 登录 -->
      <van-tab title="登录">
        <van-form @submit="login()">
          <van-field
            v-model="loginData.phone"
            name="phone"
            label="手机号"
            placeholder="请输入手机号"
            :rules="[{ required: true, pattern:/^1[3-9]\d{9}$/,message: '手机号格式不正确'}]"
            maxlength="11"
          />
          <van-field
            v-model="loginData.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true,pattern:/^[a-zA-Z]{1}\w{5,15}$/,message: '密码6-16位且以字母开头'}]"
          />
          <div style="margin: 16px;">
            <van-button round block color="red" native-type="submit">登录</van-button>
          </div>

          <div class="forget" @click="forget()">
            <span>忘记密码？</span>
          </div>
        </van-form>
      </van-tab>

      <!-- 注册 -->
      <van-tab title="注册">
        <van-form @submit="register()">
          <van-field
            v-model="registerData.nickName"
            name="nickName"
            label="昵称"
            placeholder="请输入昵称"
            :rules="[{ required: true,pattern:/^[\u4e00-\u9fa5\w]{1,10}$/, message: '昵称格式不正确' }]"
          />

          <van-field
            v-model="registerData.phone"
            name="phone"
            label="手机号"
            placeholder="请输入手机号"
            :rules="[{ required: true, pattern:/^1[3-9]\d{9}$/,message: '手机号格式不正确' }]"
            maxlength="11"
          />

          <van-field
            v-model="registerData.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, pattern:/^[a-zA-Z]{1}\w{5,15}$/,message: '密码6-16位且以字母开头' }]"
          />
          <div style="margin: 16px;">
            <van-button round block color="red" native-type="submit">注册</van-button>
          </div>
        </van-form>
      </van-tab>
    </van-tabs>

    <van-popup v-model="isOpen" position="bottom">
      <!-- 邮箱验证 -->
      <div v-if="isCode">
        <div class="v-popup">
          <van-form>
            <van-field
              v-model="codeData.email"
              type="text"
              label="邮箱"
              :rules="[{ required: true, message: '请填写邮箱'}]"
              placeholder="邮箱地址"
            />

            <!-- key: 防止当前表单域会将内容携带给其他表单域 -->
            <van-field
              key="code"
              v-model="codeData.codeNum"
              type="text"
              label="验证码"
              maxlength="6"
              placeholder="6位验证码"
            >
              <template #button>
                <van-button size="small" color="red" @click="sendCode()" :disabled="isSend">发送验证码</van-button>
              </template>
            </van-field>
            <div class="btn">
              <van-button round block color="red" native-type="submit" @click="next()">下一步</van-button>
            </div>
          </van-form>
        </div>
      </div>

      <!-- 新密码 -->
      <div v-else>
        <div class="v-popup">
          <van-form>
            <van-field
              v-model="newpassword.phone"
              type="text"
              label="手机号"
              :rules="[{ required: true, message: '请填写手机号'}]"
              placeholder="注册的手机号"
              maxlength="11"
            />

            <!-- key: 防止当前表单域会将内容携带给其他表单域 -->
            <van-field
              key="pw"
              v-model="newpassword.password"
              type="password"
              label="新密码"
              maxlength="16"
              placeholder="新密码"
            ></van-field>
            <div class="btn">
              <van-button round block color="red" native-type="submit" @click="setPasswrod()">提交</van-button>
            </div>
          </van-form>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import "@/assets/css/submit.less";

export default {
  data() {
    return {
      active: 0,

      // 登录数据
      loginData: {
        appkey: this.appkey,
        phone: "",
        password: "",
      },

      // 注册数据
      registerData: {
        nickName: "",
        phone: "",
        password: "",
      },

      // 邮箱和验证码
      codeData: {
        email: "",
        codeNum: "",
      },

      // 手机和新密码
      newpassword: {
        phone: "",
        password: "",
      },

      // 弹窗
      isOpen: false,

      // 是否禁用发送验证码按钮
      isSend: false,

      // 是否显示发送验证码页面
      isCode: true,
    };
  },
  methods: {
    // 页面跳转
    toPage(to) {
      this.$router.push(to);
    },

    // 登录
    login() {
      this.axios({
        method: "post",
        url: "/login",
        data: {
          appkey: this.appkey,
          phone: this.loginData.phone,
          password: this.loginData.password,
        },
      })
        .then((res) => {
          //
          if (res.data.code == 200) {
            this.$toast.success("登录成功");

            // 存储token
            localStorage.setItem("_Tk", res.data.token);

            // 跳转到菜单
            this.$router.push({ name: "Menu" });
          } else {
            this.$toast.fail(res.data.msg + res.data.code);
          }
        })
        .catch((err) => {
          this.$toast.fail("登录失败");
        });
    },

    // 注册
    register() {
      this.axios({
        method: "post",
        url: "/register",
        data: {
          appkey: this.appkey,
          nickName: this.registerData.nickName,
          phone: this.registerData.phone,
          password: this.registerData.password,
        },
      })
        .then((res) => {
          if (res.data.code == 100) {
            this.$toast.success("注册成功");

            // 跳转到登录
            this.active = 0;
          } else if (res.data.code == 102) {
            this.$toast.fail("手机号已被注册");
          } else {
            this.$toast.fail("注册失败 " + res.data.code);
          }
        })
        .catch((err) => {
          this.$toast.fail("注册失败");
        });
    },

    // 忘记密码
    forget() {
      // 打开弹窗
      this.isOpen = true;

      // 打开发送验证码按钮
      this.isSend = false;

      // 验证码
      this.isCode = true;
    },

    // 发送验证码
    sendCode() {
      let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      let email = this.codeData.email;

      // 验证邮箱格式
      if (reg.test(email)) {
        this.axios({
          method: "post",
          url: "/emailValidCode",
          data: {
            appkey: this.appkey,
            email,
          },
        })
          .then((res) => {
            //
            if (res.data.code == "J001") {
              this.$toast.success("发送成功");
              this.isSend = true;
            } else {
              this.$toast.fail(res.data.msg);
            }
          })
          .catch((err) => {});
      } else {
        this.$toast.fail("邮箱格式有误");
      }
    },

    // 下一步
    next() {
      this.axios({
        method: "post",
        url: "/checkValidCode",
        data: {
          appkey: this.appkey,
          validCode: this.codeData.codeNum,
        },
      })
        .then((res) => {
          //
          if (res.data.code == "K001") {
            this.isCode = false;
          } else {
            this.$toast.fail(res.data.msg);
          }
        })
        .catch((err) => {});
    },

    // 设置新密码
    setPasswrod() {
      this.axios({
        method: "post",
        url: "/retrievePassword",
        data: {
          appkey: this.appkey,
          phone: this.newpassword.phone,
          password: this.newpassword.password,
        },
      })
        .then((res) => {
          //
          if (res.data.code == "L001") {
            this.isOpen = false;
            this.$toast.success("成功，请登录");
          } else {
            this.$toast.fail(res.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.fail(res.data.msg);
        });
    },
  },
};
</script>
