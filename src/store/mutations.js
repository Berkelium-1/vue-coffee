export default {

    // 获取轮播图数据
    getBannerData(state, data) {
        state.bannerData = data;
    },

    // 获取商品类型数据 侧边导航
    getTypeData(state, data) {
        state.typeData = data;
    },

    // 获取商品类型对应的商品数据
    getGoodsData(state, data) {
        state.goodsData = data;
    },

    // 把pid存在state 用于详情页请求时的参数
    getPid(state, pid) {
        state.pid = pid;
    },

    // 获取商品详情
    getDetailsData(state, data) {
        state.detailsData = data[0];
        state.demandsData = data[1];
    },

    // 获取所有购物车数据
    getAllCartData(state, data) {
        state.allCartData = data;
    },

    //获得所有地址数据
    getListAddressData(state, data) {
        state.listAddressData = data;
    },

    //获得默认地址数据
    getActiveAddressData(state, data) {
        state.activeAddress = data;
    },

    // 获取订单
    getOrderData(state, data) {
        state.orderData = data;
    },

    // 获取我的数据
    getMyData(state, data) {
        state.myData = data;
    }



}