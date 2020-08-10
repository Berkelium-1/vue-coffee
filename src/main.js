import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入用于设置 rem 基准值模块
import 'lib-flexible';

// 导入axios
import axios from 'axios'
import VueAxios from 'vue-axios'

// 导入路由插件
import VueRouter from 'vue-router'


// 引入vant组件
import {
  Icon,
  Tabbar,
  TabbarItem,
  Search,
  Popup,
  Swipe,
  SwipeItem,
  Sidebar,
  SidebarItem,
  Card,
  Overlay,
  Image as VanImage,
  Stepper,
  NavBar,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  SwipeCell,
  Button,
  SubmitBar,
  Checkbox,
  CheckboxGroup,
  Empty,
  Tab,
  Tabs,
  Form,
  Field,
  Toast,
  AddressEdit,
  AddressList,
  Uploader,
  Cell,
  CellGroup
} from 'vant';

// 注册axios
Vue.use(VueAxios, axios)

// 注册vant组件
Vue.use(Icon);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(Search);
Vue.use(Popup);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Sidebar);
Vue.use(SidebarItem);
Vue.use(Card);
Vue.use(Overlay);
Vue.use(VanImage);
Vue.use(Stepper);
Vue.use(NavBar);
Vue.use(GoodsAction);
Vue.use(GoodsActionIcon);
Vue.use(GoodsActionButton);
Vue.use(SwipeCell);
Vue.use(Button);
Vue.use(SubmitBar);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Empty);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Form);
Vue.use(Field);
Vue.use(Toast);
Vue.use(AddressEdit);
Vue.use(AddressList);
Vue.use(Uploader);
Vue.use(Cell);
Vue.use(CellGroup);

// 配置请求基础路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'
// axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1'


// 配置请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'


// 发起post请求之前处理
axios.interceptors.request.use(config => {
  // 
  if (config.method == "post") {
    let dataString = ''
    // post请求序列化,转成字符串
    for (var key in config.data) {
      // 转字符集
      dataString += key + '=' + config.data[key] + '&'
    }
    // 去除最后一个&,不然数据传不了后台,会报状态码为500错误,服务器拒绝访问
    config.data = dataString.slice(0, -1)
    // 
  }

  return config;
})

//防止点击同一路由或者路由守卫拦截出现错误
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function (location) {
  return originalPush.call(this, location).catch(err => err);
}

//添加appkey属性保存appkey
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')