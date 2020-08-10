<template>
  <div class="order">
    <van-tabs
      v-model="active"
      background="black"
      title-active-color="red"
      title-inactive-color="white"
      @click="getOrderData()"
      swipeable
      lazy-render
    >
      <!-- 全部 -->
      <van-tab title="全部">
        <div class="order-content">
          <div class="order-item" v-for="(v, i) in orderData" :key="i">
            <van-card
              v-for="(item, index) in v"
              :key="index"
              :tag="item.name"
              :num="item.count"
              :price="item.price"
              :desc="'地址：'+item.address"
              :title="item.rule"
              :thumb="item.smallImg"
            ></van-card>
            <div class="item-btn">
              <!-- 确认收货按钮 -->
              <van-button
                type="danger"
                size="small"
                @click="confirm(v[0].oid)"
                v-if="v[0].status==1"
              >确认收货</van-button>

              <!-- 删除按钮 -->
              <van-button type="danger" size="small" @click="delOrder(v[0].oid,i)" v-else>删除订单</van-button>
            </div>
          </div>
        </div>
      </van-tab>

      <!-- 未收货 -->
      <van-tab title="未收货">
        <div class="order-content">
          <div class="order-item" v-for="(v, i) in orderData" :key="i">
            <van-card
              v-for="(item, index) in v"
              :key="index"
              :num="item.count"
              :price="item.price"
              :desc="item.rule"
              :title="item.name"
              :thumb="item.smallImg"
            ></van-card>
            <div class="item-btn">
              <!-- 确认收货按钮 -->
              <van-button type="danger" size="small" @click="confirm(v[0].oid)">确认收货</van-button>
            </div>
          </div>
        </div>
      </van-tab>

      <!-- 已收货 -->
      <van-tab title="已收货">
        <div class="order-content">
          <div class="order-item" v-for="(v, i) in orderData" :key="i">
            <van-card
              v-for="(item, index) in v"
              :key="index"
              :num="item.count"
              :price="item.price"
              :desc="item.rule"
              :title="item.name"
              :thumb="item.smallImg"
            ></van-card>
            <div class="item-btn">
              <!-- 删除按钮 -->
              <van-button type="danger" size="small" @click="delOrder(v[0].oid,i)">删除订单</van-button>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import "@/assets/css/order.less";

// mapState 辅助函数
import { mapState } from "vuex";

export default {
  data() {
    return {
      active: 0
    };
  },

  created() {
    // 查询订单
    this.getOrderData();
  },

  computed: {
    // 信息列表
    ...mapState(["orderData"])
  },

  methods: {
    // 查询订单
    getOrderData() {
      this.axios({
        url: "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString: localStorage.getItem("_Tk"),
          status: this.active
        }
      })
        .then(res => {
          //  
          if (res.data.code == 70000) {
            //降序排序
            res.data.result.sort((a, b) => {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            });

            // 获取所有oid 且让oid成为唯一值
            let oids = [];
            res.data.result.forEach(v => {
              if (oids.indexOf(v.oid) === -1) {
                oids.push(v.oid);
              }
            });

            let orderData = [];
            oids.forEach((v, i) => {
              orderData.push([]);
              res.data.result.forEach(el => {
                if (v == el.oid) {
                  orderData[i].push(el);
                }
              });
            });

            // 数据放在vuex
            this.$store.commit("getOrderData", orderData);
          }
        })
        .catch(err => {
           
        });
    },

    // 确认收货
    confirm(oid) {
      this.axios({
        method: "post",
        url: "/receive",
        data: {
          appkey: this.appkey,
          tokenString: localStorage.getItem("_Tk"),
          oid
        }
      })
        .then(res => {
          //  
          if (res.data.code == 80000) {
            this.$toast.success("收货成功");
            this.getOrderData();
          }
        })
        .catch(err => {
           
        });
    },

    // 删除订单 只能删除已收货的数据
    delOrder(oid, index) {
      this.axios({
        method: "post",
        url: "/removeOrder",
        data: {
          appkey: this.appkey,
          tokenString: localStorage.getItem("_Tk"),
          oid
        }
      })
        .then(res => {
          //  
          if (res.data.code == 90000) {
            this.$toast.success("删除成功");
            this.getOrderData();
          } else {
            this.$toast.fail("删除失败 " + res.data.code);
          }
        })
        .catch(err => {
           
        });
    }
  }
};
</script>
