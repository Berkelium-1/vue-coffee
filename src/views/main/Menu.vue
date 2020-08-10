<template>
  <div class="menu">
    <van-nav-bar title="菜单" fixed>
      <template #left>
        <div v-if="isLogin" class="login-is">
          <van-icon name="user-circle-o" size="16" color="red" @click="toPage({name:'Submit'})" />
          <span>登录</span>
        </div>
      </template>
      <template #right>
        <van-icon name="shopping-cart" size="24" color="red" @click="toPage({name:'Cart'})" />
      </template>
    </van-nav-bar>

    <div class="main">
      <!-- 轮播图 -->
      <van-swipe class="my-swipe" autoplay="3000" indicator-color="#aaa">
        <van-swipe-item v-for="(item,index) in bannerData" :key="index">
          <img :src="item.bannerImg" alt />
        </van-swipe-item>
      </van-swipe>

      <div class="menu-content">
        <!-- 侧边导航 -->
        <ul class="nav-left">
          <li
            v-for="(item,index) in typeData"
            :key="index"
            :class="{'active': item.isActive}"
            @click="toggleNav(item,index)"
          >{{item.typeDesc}}</li>
          <i ref="line" class="line" :style="'top:'+top+'px'"></i>
        </ul>

        <!-- 商品内容 -->
        <div class="content-right">
          <div
            class="goods-item"
            v-for="(item,index) in goodsData"
            :key="index"
            @click="getPid(item.pid)"
          >
            <van-card
              :price="item.price"
              :desc="item.desc"
              :title="item.name"
              :thumb="item.smallImg"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "@/assets/css/menu.less";

// mapState 辅助函数
import { mapState } from "vuex";

export default {
  data() {
    return {
      // 侧边导航 线条移动
      top: 0,

      isLogin: true,
    };
  },
  created() {
    // 检查是否登录 是否打开左上角登录图标
    if (localStorage.getItem("_Tk")) {
      this.isLogin = false;
    } else {
      this.isLogin = true;
    }

    // 轮播图
    this.getBannerData();

    // 侧边导航
    this.getTypeData();

    // 商品内容
    this.getGoodsData({ type: "isHot" });

    // 加载侧边导航线条的位置
    // this.getLineTop();
  },

  computed: {
    ...mapState(["bannerData", "typeData", "goodsData"]),
  },

  methods: {
    // 获取轮播图数据
    getBannerData() {
      // 有缓存时不请求数据
      if (this.bannerData.length != 0) {
        return;
      }

      this.axios({
        url: "/banner",
        params: {
          appkey: this.appkey,
        },
      })
        .then((res) => {
          if (res.data.code == 300) {
            // 将banner数据放在vuex
            this.$store.commit("getBannerData", res.data.result);
          }
        })
        .catch((err) => {
          this.$toast.fail("请求失败");
        });
    },

    //获取商品类型数据 侧边导航栏
    getTypeData() {
      this.axios({
        url: "/type",
        params: {
          appkey: this.appkey,
        },
      })
        .then((res) => {
          if (res.data.code == 400) {
            // 添加最新推荐
            res.data.result.unshift({
              id: 0,
              type: "isHot",
              typeDesc: "最新推荐",
            });

            // 添加高亮判断
            res.data.result.forEach((el, i) => {
              el.isActive = i == 0;
            });

            // 数据放在vuex
            this.$store.commit("getTypeData", res.data.result);
          }
        })
        .catch((err) => {
          this.$toast.fail("请求失败");
        });
    },

    // 侧边导航切换
    toggleNav(item, index) {
      if (item.isActive) {
        return;
      }

      this.typeData.forEach((el, i) => {
        el.isActive = i == index;
        if (i == index) {
          this.top = i * this.$refs.line.offsetHeight;
        }
      });

      //获得对应导航的商品内容
      this.getGoodsData(item);
    },

    //获得对应导航的商品内容
    getGoodsData(item) {
      // 加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true, // 是否禁止背景点击
        duration: 0, // 展示时长(ms) 值为 0 时 toast 不会消失
      });

      // 参数对象
      let params = {
        appkey: this.appkey,
        key: "type",
        value: item.type,
      };

      // 最近推荐
      if (item.type == "isHot") {
        params.key = "isHot";
        params.value = 1;
      }
      this.axios({
        url: "/typeProducts",
        params, //es6语法, 属性名和属性值同个名字可以直接写一个
      })
        .then((res) => {
          if (res.data.code == 500) {
            // 把数据放在vuex
            this.$store.commit("getGoodsData", res.data.result);

            // 关闭加载提示
            this.$toast.clear();
          } else {
            // 加载失败提示
            this.$toast.fail("加载失败");
          }
        })
        .catch((err) => {
          this.$toast.fail("请求失败");
        });
    },

    //跳转页面
    toPage(to) {
      this.$router.push(to);
    },

    // 把pid传给详情页
    getPid(pid) {
      // 跳转到详情页
      this.toPage({ name: "Details", query: { pid } });
    },
  },
};
</script>
