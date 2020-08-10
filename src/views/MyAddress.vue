<template>
  <div class="my-address">
    <!-- 导航栏 -->
    <van-nav-bar
      title="我的地址"
      left-text="返回"
      right-text="新增地址"
      @click-left="back()"
      @click-right="goAddress"
      left-arrow
      placeholder
      fixed
    ></van-nav-bar>

    <!-- 地址列表 -->
    <van-address-list
      v-model="chosenAddressId"
      :list="listAddressData"
      default-tag-text="默认"
      @select="selectAddress"
      @edit="goAddress"
    />
  </div>
</template>

<script>
import "@/assets/css/myAddress.less";

// mapState 辅助函数
import { mapState } from "vuex";

export default {
  data() {
    return {
      // 当前选中第几个地址
      chosenAddressId: "1",

      //是否显示按钮
      isPayin: false
    };
  },

  created() {
    // 查询是不是从订单页面进入此页面
    if (this.$route.query.from == "pay") {
      this.isPayin = true;
    } else {
      this.isPayin = false;
    }

    // 查询地址数据
    // this.queryAddressData();
    this.$store.dispatch("queryAddressData", this.appkey);
  },

  computed: {
    // 信息列表
    ...mapState(["listAddressData"])
  },

  methods: {
    // 编辑地址 组件自带参数  item: 地址对象，index: 索引
    goAddress(item, index) {
      let to = {
        name: "Address"
      };

      if (item) {
        to.query = { aid: item.aid };
      }

      this.$router.push(to);
    },

    // 选择地址 组件自带参数  item: 地址对象，index: 索引
    selectAddress(item, index) {
      if (this.isPayin) {
        // 选择地址
        this.$store.commit("getActiveAddressData", item);
        this.back();
      } else {
        // 编辑地址
        this.goAddress(item, index);
      }
    },

    // 返回
    back() {
      this.$router.back(-1);
    }
  }
};
</script>
