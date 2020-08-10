<template>
  <div class="my">
    <div class="my-header" :style="{backgroundImage: 'url(' + myData.userBg + ')'}">
      <div class="header-box">
        <div class="head-img">
          <img class="img-auto" :src="myData.userImg" alt="头像" />
        </div>
        <div class="head-info">
          <h4 class="info-name">{{myData.nickName}}</h4>
          <div class="info-desc">签名：{{myData.desc ||'这个人很懒，什么也没写...'}}</div>
        </div>
      </div>

      <!-- 背景 -->
      <div class="header-bg">
        <van-uploader :after-read="uploadFile">
          <van-button icon="photo-o" size="small" plain hairline>更换背景</van-button>
        </van-uploader>
      </div>
    </div>

    <!-- 列表 -->
    <van-cell-group>
      <van-cell
        v-for="(item, index) in litsData"
        :key="index"
        @click="toPage({name:item.routeName})"
        :title="item.title"
        is-link
      />
    </van-cell-group>
  </div>
</template>

<script>
import "@/assets/css/my.less";

// mapState 辅助函数
import { mapState } from "vuex";

export default {
  data() {
    return {
      litsData: [
        {
          title: "个人设置",
          routeName: "Account"
        },

        {
          title: "我的收藏",
          routeName: "MyLike"
        },

        {
          title: "地址管理",
          routeName: "MyAddress"
        },

        {
          title: "账号中心",
          routeName: "Secure"
        }
      ]
    };
  },

  created() {
    // 是否登录
    if (localStorage.getItem("_Tk")) {
      this.getMyData();
    }
  },

  computed: {
    // 信息列表
    ...mapState(["myData"])
  },

  methods: {
    //跳转页面
    toPage(to) {
      this.$router.push(to);
    },

    // 获取我的数据
    getMyData() {
      this.axios({
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString: localStorage.getItem("_Tk")
        }
      })
        .then(res => {
          //  
          if (res.data.code == "A001") {
            // getMyData
            this.$store.commit("getMyData", res.data.result[0]);
          }
        })
        .catch(err => {
           
        });
    },

    //获取上传文件的base64
    uploadFile(file) {
      //  
      //获取图片base64
      let serverBase64Img = file.content.replace(
        /^data:image\/[A-Za-z]+;base64,/,
        ""
      );

      //获取图片类型
      let imgType = file.file.type.split("/")[1];

      // let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/updateUserBg",
        data: {
          appkey: this.appkey,
          tokenString: localStorage.getItem("_Tk"),
          imgType,
          serverBase64Img
        }
      })
        .then(res => {
           

          if (res.data.code == "I001") {
            this.$toast.clear();

            // 刷新数据
            this.getMyData();
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
