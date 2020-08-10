<template>
  <div class="pay">
    <!-- 导航栏 -->
    <van-nav-bar title="订单提交" placeholder fixed>
      <template #right>
        <van-icon name="cross" size="24" color="red" @click=" back()" />
      </template>
    </van-nav-bar>

    <!-- 收货地址 -->
    <div class="add-location" @click="goMyAddress()">
      <!-- 添加收货地址 -->
      <van-button type="default" size="100" v-if="activeAddress.isDefault==undefined||null">
        <div class="location-icon">
          <van-icon name="plus" size="46" />
        </div>
        <div class="location-title">添加收货地址</div>
      </van-button>

      <!-- 默认地址 -->
      <div class="default-location" v-else>
        <div class="location-info">
          <div class="location-name">姓名：{{activeAddress.name}}</div>
          <div class="location-tel">手机：{{activeAddress.tel}}</div>
        </div>
        <div class="location-address">地址：{{activeAddress.address}}</div>
        <span>更多>></span>
      </div>
    </div>

    <!-- 订单数据 -->
    <div class="content">
      <van-card
        v-for="(item, index) in orderData"
        :key="index"
        :num="item.count"
        :price="item.price"
        :desc="item.rule"
        :title="item.name"
        :thumb="item.small_img"
      />
    </div>

    <!-- 提交订单 -->
    <van-submit-bar :price="sumPrice*100" button-text="立即结算" @submit="checkOut()" />
  </div>
</template>

<script>
import '@/assets/css/pay.less';

// mapState 辅助函数
import { mapState } from 'vuex';

export default {
  data() {
    return {
      // 合计
      sumPrice: 0,

      sids: [],

      // 提交订单数据
      orderData: []
    };
  },

  created() {
    //截取查询参数sids
    this.sids = this.$route.query.sids.split('-');

    if (this.sids) {
      // 接收购物车提交订单数据
      this.receiveCartData();
    } else {
      // 如果有人为在地址栏输入地址不带参数
      this.$router.push({ name: 'Menu' });
    }
    // 是否有地址
    if (!this.$store.state.activeAddress.isDefault == undefined || null) {
      // 获取地址数据
      this.$store.dispatch('queryAddressData', this.appkey);
    }
  },

  computed: {
    // 信息列表
    ...mapState(['listAddressData', 'activeAddress'])
  },

  methods: {
    // 返回
    back() {
      this.$dialog
        .confirm({
          title: '',
          message: '是否取消结算订单'
        })
        .then(() => {
          this.$router.back(-1);
        })
        .catch((err) => {});
    },

    // 进入地址管理界面
    goMyAddress() {
      this.$router.push({ name: 'MyAddress', query: { from: 'pay' } });
    },

    // 接收购物车提交订单数据
    receiveCartData() {
      this.axios({
        url: '/commitShopcart',
        params: {
          appkey: this.appkey,
          tokenString: localStorage.getItem('_Tk'),
          sids: JSON.stringify(this.sids)
        }
      })
        .then((res) => {
          //
          if (res.data.code == 50000) {
            let sumPrice = 0;
            res.data.result.forEach((v) => {
              sumPrice += v.price * v.count;
            });
            this.sumPrice = sumPrice;

            this.orderData = res.data.result;
          } else {
            this.$toast.fail('订单获取失败 ' + res.data.code);
          }
        })
        .catch((err) => {});
    },

    // 结算订单
    checkOut() {
      // 加载提示
      this.$toast.loading({
        message: '结算中...',
        forbidClick: true, // 是否禁止背景点击
        duration: 0 // 展示时长(ms) 值为 0 时 toast 不会消失
      });

      if (this.activeAddress.isDefault == undefined || null) {
        this.$toast.fail('请选择收货地址');
      } else {
        this.axios({
          method: 'post',
          url: '/pay',
          data: {
            appkey: this.appkey,
            tokenString: localStorage.getItem('_Tk'),
            sids: JSON.stringify(this.sids),
            phone: this.activeAddress.tel,
            address: this.activeAddress.address,
            receiver: this.activeAddress.name
          }
        })
          .then((res) => {
            if (res.data.code == 60000) {
              this.$toast.success('结算成功');

              // 跳转到订单界面
              this.$router.push({ name: 'Order' });
            } else {
              this.$toast.fail('结算失败 ' + res.data.code);
            }
          })
          .catch((err) => {});
      }
    }
  }
};
</script>
