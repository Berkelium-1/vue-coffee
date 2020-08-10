import Vue from 'vue'
import VueRouter from 'vue-router'
import {
  routes
} from './routes'

// 引入vant组件
import {
  Toast
} from 'vant';

Vue.use(VueRouter)



const router = new VueRouter({
  routes
})


// 路由守卫
router.beforeEach((to, from, next) => {

  if (to.name == "Submit" || to.name == "Menu" || to.name == "Cart") { //如果用户本来是想去登录页或者菜单或者购物车
    next(); //放行
  } else {
    //如果isLogin是真允许正常跳转，如果为假，回到登录页面去
    if (localStorage.getItem('_Tk')) {
      next();
    } else {
      next({
        name: "Submit"
      });

      Toast.fail('请先登录');
    }
  }

});



export default router