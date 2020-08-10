<template>
  <div class="wraper">
    <div class="content">
      <router-view></router-view>
    </div>
    <van-tabbar active-color="red" fixed route border class="tabbars">
      <van-tabbar-item
        v-for="(item,index) in items"
        :key="index"
        :to="{name:item.routeName}"
        :icon="item.iconName"
      >{{item.title}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "Main",
  data() {
    return {
      items: [
        {
          title: "菜单",
          routeName: "Menu",
          iconName: "shop",
        },
        {
          title: "订单",
          routeName: "Order",
          iconName: "more",
        },
        {
          title: "我的",
          routeName: "My",
          iconName: "manager",
        },
      ],
      isShow: true,
    };
  },
};
</script>

<style lang="less" scoped>
.wraper {
  width: 100vw;
  height: 100vh;
  .content {
    height: calc(100vh - 49px);
  }
  .tabbars {
    height: 49px;
    background-color: black;
  }
}
</style>