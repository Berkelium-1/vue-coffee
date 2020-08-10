<template>
  <div class="my-like">
    <!-- 导航栏 -->
    <van-nav-bar title="我的收藏" left-text="返回" @click-left="back()" left-arrow placeholder fixed></van-nav-bar>

    <div class="content">
      <van-card
        v-for="(item, index) in allLikeData"
        :key="index"
        tag="收藏"
        :price="item.price"
        :desc="item.desc"
        :title="item.name"
        :thumb="item.smallImg"
        @click="toDetails(item.pid)"
      />
    </div>
  </div>
</template>

<script>
import "@/assets/css/myLike.less";

export default {
  data() {
    return {
      // 所有收藏数据
      allLikeData: []
    };
  },
  created() {
    this.getAllLikeData();
  },
  methods: {
    // 返回
    back() {
      this.$router.back(-1);
    },

    // 获取所有收藏
    getAllLikeData() {
      // 加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true, // 是否禁止背景点击
        duration: 0 // 展示时长(ms) 值为 0 时 toast 不会消失
      });

      this.axios({
        url: "/findAllLike",
        params: {
          appkey: this.appkey,
          tokenString: localStorage.getItem("_Tk")
        }
      })
        .then(res => {
           
          if (res.data.code == 2000) {
            this.allLikeData = res.data.result;
            // 关闭加载提示
            this.$toast.clear();
          } else {
            this.$toast.fail("加载失败 " + res.data.code);
          }
        })
        .catch(err => {
           
        });
    },

    // 跳转详情
    toDetails(pid) {
      // 跳转到详情页
      this.$router.push({ name: "Details", query: { pid } });
    }
  }
};
</script>
