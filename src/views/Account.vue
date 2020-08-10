<template>
  <div class="account">
    <!-- 导航栏 -->
    <van-nav-bar title="个人设置" left-text="返回" @click-left="back()" left-arrow placeholder fixed></van-nav-bar>

    <!-- 内容 -->
    <div class="content">
      <van-cell-group>
        <van-cell title="头像" class="cell-head">
          <template #default>
            <div class="head-img">
              <van-uploader :after-read="uploadHaed">
                <img class="img-auto" :src="accountData.userImg" />
              </van-uploader>
            </div>
          </template>
        </van-cell>

        <van-cell title="昵称" class="head-name">
          <template #default>
            <input type="text" v-model="accountName" @blur="editName()" />
          </template>
        </van-cell>

        <van-cell title="用户id" :value="accountData.userId" />
        <van-cell title="手机号" :value="accountData.phone" />

        <van-cell title="签名" class="text">
          <template #label>
            <textarea
              name
              id
              cols="10"
              rows="3"
              v-model="accountDesc"
              placeholder="这个人很懒，什么也没写..."
              @blur="editDesc()"
            ></textarea>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import "@/assets/css/account.less";

export default {
  data() {
    return {
      // 账号数据
      accountData: {},

      // 昵称
      accountName: "",

      // 签名
      accountDesc: ""
    };
  },
  created() {
    // 获取账号数据
    this.getAccountData();
  },
  methods: {
    // 返回
    back() {
      this.$router.back(-1);
    },

    // 获取账号数据
    getAccountData() {
      // 加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true, // 是否禁止背景点击
        duration: 0 // 展示时长(ms) 值为 0 时 toast 不会消失
      });

      this.axios({
        url: "/findAccountInfo",
        params: {
          appkey: this.appkey,
          tokenString: localStorage.getItem("_Tk")
        }
      })
        .then(res => {
           
          if (res.data.code == "B001") {
            // 关闭加载提示
            this.$toast.clear();
            this.accountData = res.data.result[0];
            this.accountName = res.data.result[0].nickName;
            this.accountDesc = res.data.result[0].desc;
          } else {
            this.$toast.fail("加载失败");
          }
        })
        .catch(err => {
           
        });
    },

    // 上传头像
    uploadHaed(file) {
       
      //获取图片base64
      let serverBase64Img = file.content.replace(
        /^data:image\/[A-Za-z]+;base64,/,
        ""
      );

      //获取图片类型
      let imgType = file.file.type.split("/")[1];

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "post",
        url: "/updateAvatar",
        data: {
          appkey: this.appkey,
          tokenString: localStorage.getItem("_Tk"),
          imgType,
          serverBase64Img
        }
      })
        .then(res => {
           

          if (res.data.code == "H001") {
            this.$toast.clear();

            // 刷新数据
            this.getAccountData();
          } else {
            this.$toast(res.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
           
        });
    },

    // 编辑签名
    editDesc() {
      this.axios({
        method: "post",
        url: "/updateDesc",
        data: {
          appkey: this.appkey,
          tokenString: localStorage.getItem("_Tk"),
          desc: this.accountDesc
        }
      })
        .then(res => {
          //    
          if (res.data.code == "D001") {
            this.$toast.success("修改成功");
          } else {
            this.$toast.fail("修改失败 " + res.data.code);
          }
        })
        .catch(err => {
           
        });
    },

    // 编辑昵称
    editName() {
      this.axios({
        method: "post",
        url: "/updateNickName",
        data: {
          appkey: this.appkey,
          tokenString: localStorage.getItem("_Tk"),
          nickName: this.accountName
        }
      })
        .then(res => {
          //    
          if (res.data.code == "C001") {
            this.$toast.success("修改成功");
          } else {
            this.$toast.fail("修改失败 " + res.data.code);
          }
        })
        .catch(err => {
           
        });
    }
  }
};
</script>
