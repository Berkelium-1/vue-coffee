<template>
  <div class="details">
    <van-nav-bar
      :title="detailsData.name"
      left-text="返回"
      @click-left="back()"
      placeholder
      left-arrow
      fixed
    />
    <van-image width="100%" height="auto" :src="detailsData.small_img" />
    <div class="content">
      <div class="desc">
        <h4>商品描述：</h4>
        <span>{{detailsData.desc}}</span>
        {{detailsData.desc}}
      </div>
      <div class="demands">
        <div class="demands-item" v-for="(item, index) in demandsData" :key="index">
          <h4>{{item.title}}</h4>
          <ul>
            <li
              v-for="(v, i) in item.content"
              :key="i"
              :class="{'active':v.isActive}"
              @click="toggleActive(item.content, i)"
            >{{v.text}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="price">
      <div>
        ￥
        <span>{{detailsData.price*value}}</span>
      </div>
      <van-stepper v-model="value" theme="round" button-size="22" />
    </div>
    <van-goods-action safe-area-inset-bottom class="cart">
      <van-goods-action-icon :info="num" icon="cart-o" text="购物车" :to="{name:'Cart'}" />
      <van-goods-action-icon
        icon="star"
        :text="isLike?'已收藏':'收藏'"
        :color="isLike?'#ff5000':'#ddd'"
        @click="setLike()"
      />
      <van-goods-action-button text="加入购物车" color="#00a8ff" @click="addCart()" />
      <van-goods-action-button text="立即购买" color="#e84118" @click="addCart(true)" />
    </van-goods-action>
  </div>
</template>

<script>
import '@/assets/css/details.less';

// mapState 辅助函数
import { mapState } from 'vuex';

export default {
  data() {
    return {
      value: '0',

      // 购物车总数量
      num: null,

      pid: '',

      // 是否收藏
      isLike: false
    };
  },
  created() {
    // 获取pid
    this.pid = this.$route.query.pid;

    // 判断是否登录
    if (!localStorage.getItem('_Tk')) {
      this.$router.push({ name: 'Submit' });
    }

    // 获取详情信息
    this.getDetailsData();

    // 获取购物车商品总数量
    this.getCartNum();

    //查询是否收藏
    this.queryLike();
  },
  computed: {
    ...mapState(['detailsData', 'demandsData'])
  },
  methods: {
    // 获取商品详情 商品规格
    getDetailsData() {
      // 加载提示
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true, // 是否禁止背景点击
        duration: 0 // 展示时长(ms) 值为 0 时 toast 不会消失
      });

      this.axios({
        url: '/productDetail',
        params: {
          appkey: this.appkey,
          pid: this.pid
        }
      })
        .then((res) => {
          //
          if (res.data.code == 600) {
            // 关闭加载提示
            this.$toast.clear();

            let detailsData = res.data.result[0];

            // 处理商品规格数据
            let demands = [];

            for (let k in detailsData) {
              if (k.indexOf('_desc') != -1 && k.indexOf('type') == -1) {
                demands.push(k.slice(0, k.indexOf('_desc')));
              }
            }

            let demandsData = [];
            demands.forEach((v) => {
              if (detailsData[v] != '') {
                demandsData.push({
                  title: detailsData[v + '_desc'],
                  content: detailsData[v].split('/')
                });
              }
            });

            // 添加高亮判断属性
            demandsData.forEach((v) => {
              let arr = [];
              v.content.forEach((el, i) => {
                arr.push({ text: el, isActive: i == 0 });
              });
              v.content = arr;
            });

            // 数据放在vuex
            this.$store.commit('getDetailsData', [detailsData, demandsData]);
          } else {
            // 加载失败提示
            this.$toast.fail('加载失败 ' + res.data.code);
          }
        })
        .catch((err) => {
          this.$toast.fail('请求失败');
        });
    },

    // 获取购物车商品总数量
    getCartNum() {
      this.axios({
        url: '/shopcartCount',
        params: {
          appkey: this.appkey,
          tokenString: localStorage.getItem('_Tk')
        }
      }).then((res) => {
        if (res.data.code == 4000) {
          this.num = res.data.result;
        }
      });
    },

    // 切换规格
    toggleActive(item, index) {
      item.forEach((v, i) => {
        v.isActive = i == index;
      });
    },

    // 收藏 or 取消收藏
    setLike() {
      this.axios({
        method: 'post',
        url: this.isLike ? '/notlike' : '/like',
        data: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString: localStorage.getItem('_Tk')
        }
      })
        .then((res) => {
          if (res.data.code == 800 || 900) {
            this.isLike = !this.isLike;
          } else {
            this.$toast.fail('网络异常 ' + res.data.code);
          }
        })
        .catch((err) => {});
    },

    // 查询是否收藏
    queryLike() {
      this.axios({
        url: '/findlike',
        params: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString: localStorage.getItem('_Tk')
        }
      })
        .then((res) => {
          //
          if (res.data.code == 1000) {
            // 查询是否有收藏数据
            this.isLike = res.data.result.length > 0;
          } else {
            //如果如果没有pid 或者 token无效，则跳转到登录页面
            this.$router.push({ name: 'Submit' });
          }
        })
        .catch((err) => {});
    },

    //返回菜单
    back() {
      this.$router.back(-1);
    },

    // 加入购物车 or 立即支付
    addCart(isPay) {
      // 商品规格
      let text = [];
      this.demandsData.forEach((v) => {
        v.content.forEach((el) => {
          if (el.isActive) {
            text.push(el.text);
          }
        });
      });

      // 参数
      let data = {
        pid: this.pid,
        count: this.value,
        rule: text.join('/'),
        appkey: this.appkey,
        tokenString: localStorage.getItem('_Tk')
      };

      this.axios({
        method: 'post',
        url: '/addShopcart',
        data
      })
        .then((res) => {
          // 获取购物车商品总数量
          this.getCartNum();

          //如果是立即购买, 先将商品加入到购物车，在跳转到结算页面(提交订单页面)
          if (isPay === true) {
            this.$router.push({
              name: 'Pay',
              query: { sids: res.data.sid }
            });
          }
        })
        .catch((err) => {
          $toast.fail('加入购物车失败');
        });
    }
  }
};
</script>
