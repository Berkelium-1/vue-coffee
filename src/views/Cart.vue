<template>
  <div class="cart">
    <!-- 导航栏 -->
    <van-nav-bar
      title="购物车"
      left-text="返回"
      :right-text="isDel ? '完成':'管理'"
      @click-left="back()"
      @click-right="isDel=!isDel"
      placeholder
      left-arrow
      fixed
    />

    <!-- 空状态 -->
    <div v-if="allCartData.length == 0">
      <van-empty description="购物车空空如也，逛一逛" />
    </div>

    <div v-else>
      <!-- 内容 -->
      <div class="content" ref="checkboxGroup">
        <div class="cart-item" v-for="(item,index) in allCartData" :key="index">
          <van-swipe-cell>
            <!-- 商品卡片 -->
            <!-- <van-swipe-cell class="item-card"> -->
            <div class="card">
              <!-- 复选框 -->
              <div class="card-check" @click="checkedInvert(item)">
                <van-checkbox v-model=" item.isChecked"></van-checkbox>
              </div>

              <div class="goods-item" @click="toDetails(item.pid)">
                <div class="goods-img">
                  <img :src="item.small_img" alt srcset />
                </div>
                <div class="goods-info">
                  <div class="info-title">{{item.name}}</div>
                  <div class="info-desc">{{item.desc}}</div>
                  <div class="info-rule">规格：{{item.rule}}</div>

                  <div class="info-bottom">
                    <span class="price">￥{{item.price}}</span>
                    <!-- <span class="count">×{{item.count}}</span> -->
                    <span class="count" @click.stop>
                      <van-stepper v-model="item.count" integer @change="editCartNum(item)" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <template #right>
              <van-button square type="danger" text="删除" @click="delCartItem([item.sid])" />
            </template>
          </van-swipe-cell>
        </div>
      </div>

      <!-- 底部提交组件 -->
      <van-submit-bar
        class="submit-bar"
        :price="sumPrice*100"
        :button-text="isDel ? '删除':'提交订单'"
        :button-type="isDel ? 'danger':'info'"
        @submit="isDel ? delManyCartItem() : submitOrder()"
      >
        <van-checkbox v-model="checkedAll" @click="checkAll()">全选</van-checkbox>
      </van-submit-bar>
    </div>
  </div>
</template>

<script>
import '@/assets/css/cart.less';

// mapState 辅助函数
import { mapState } from 'vuex';

export default {
  name: 'Cart',
  data() {
    return {
      sumPrice: 0,

      // 右上角按钮
      isDel: false,

      // 全选
      checkedAll: false
    };
  },

  created() {
    // 查询所有购物车数据
    this.queryCart();
  },

  computed: {
    ...mapState(['allCartData'])
  },

  methods: {
    // 查询购物车数据
    queryCart() {
      // 加载提示
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true, // 是否禁止背景点击
        duration: 0 // 展示时长(ms) 值为 0 时 toast 不会消失
      });

      this.axios({
        url: '/findAllShopcart',
        params: {
          appkey: this.appkey,
          tokenString: localStorage.getItem('_Tk')
        }
      })
        .then((res) => {
          //
          if (res.data.code == 5000) {
            res.data.result.forEach((v) => {
              v.isChecked = false;
            });
            // 把数据放在vuex
            this.$store.commit('getAllCartData', res.data.result);

            // 关闭加载
            this.$toast.clear();
          } else if (res.data.code == 700) {
            this.$toast.fail('请先登录');
          } else {
            this.$toast.fail('加载失败 ' + res.data.code);
          }
        })
        .catch((err) => {
          this.$toast.fail('加载失败');
        });
    },

    // 总价格
    getSumPrice() {
      let price = 0;
      this.allCartData.forEach((v) => {
        if (v.isChecked) {
          price += v.price * v.count;
        }
      });

      this.sumPrice = price;
    },

    // 单选
    checkedInvert(item) {
      item.isChecked = !item.isChecked;

      // 如果都选中则全选也选中
      for (var i = 0; i < this.allCartData.length; i++) {
        this.checkedAll = this.allCartData[i].isChecked;
        if (!this.allCartData[i].isChecked) {
          break;
        }
      }

      // 总价格
      this.getSumPrice();
    },

    // 全选
    checkAll() {
      this.allCartData.forEach((v) => {
        v.isChecked = this.checkedAll;
      });

      // 总价格
      this.getSumPrice();
    },

    // 返回
    back() {
      this.$router.back(-1);
    },

    // 跳转到详情页
    toDetails(pid) {
      this.$router.push({ name: 'Details', query: { pid } });
    },

    // 修改购物车数量
    editCartNum(item) {
      this.axios({
        method: 'post',
        url: '/modifyShopcartCount',
        data: {
          appkey: this.appkey,
          tokenString: localStorage.getItem('_Tk'),
          sid: item.sid,
          count: item.count
        }
      })
        .then((res) => {
          //
          if (res.data.code === 6000) {
            if (item.isChecked) {
              this.getSumPrice();
            }
          } else {
            this.$toast.fail('修改数量出错！ ' + res.data.code);
          }
        })
        .catch((err) => {
          this.$toast.fail('修改数量出错！');
        });
    },

    // 删除购物车商品
    delCartItem(arr) {
      this.axios({
        method: 'post',
        url: '/deleteShopcart',
        data: {
          appkey: this.appkey,
          tokenString: localStorage.getItem('_Tk'),
          sids: JSON.stringify(arr)
        }
      })
        .then((res) => {
          //
          if (res.data.code == 7000) {
            // 刷新购物车数据
            this.queryCart();
          } else {
            this.$toast.fail('删除失败 ' + res.data.code);
          }
        })
        .catch((err) => {
          this.$toast.fail('删除失败');
        });
    },

    // 删除多个购物车商品
    delManyCartItem() {
      // 获得选中的商品sid
      let arr = [];
      this.allCartData.forEach((v) => {
        if (v.isChecked) {
          arr.push(v.sid);
        }
      });

      // 执行删除
      this.delCartItem(arr);
    },

    // 提交订单数据
    submitOrder() {
      let isChecked = false;

      // 查询是否有选中商品
      for (let i in this.allCartData) {
        if (this.allCartData[i].isChecked) {
          isChecked = true;
          break;
        }
      }

      if (isChecked) {
        // 获取地址数据
        this.$store.dispatch('queryAddressData', this.appkey);

        let sids = [];
        this.allCartData.forEach((v) => {
          if (v.isChecked) {
            sids.push(v.sid);
          }
        });
        // 跳转到支付界面 并传递参数
        this.$router.push({
          name: 'Pay',
          query: {
            sids: sids.join('-')
          }
        });
      } else {
        this.$toast.fail('请选择商品');
      }
    }
  }
};
</script>
