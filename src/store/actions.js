import axios from 'axios';
import {
    Toast
} from 'vant'


export default {
    // 查询获得地址数据
    queryAddressData({
        commit
    }, appkey) {
        // 加载提示
        Toast.loading({
            message: "加载中...",
            forbidClick: true, // 是否禁止背景点击
            duration: 0 // 展示时长(ms) 值为 0 时 toast 不会消失
        });

        axios({
                url: "/findAddress",
                params: {
                    appkey,
                    tokenString: localStorage.getItem("_Tk")
                }
            })
            .then(res => {
                //  
                if (res.data.code == 20000) {
                    // 关闭加载提示
                    Toast.clear();

                    // 默认地址
                    let activeAddress = {};

                    // 添加收货地址
                    res.data.result.forEach((v, i) => {
                        // 省+市+区+详细地址
                        v.address = v.province + v.city + v.county + v.addressDetail;

                        if (v.isDefault) {
                            activeAddress = res.data.result[i];
                        }
                    });

                    // 把数据放到vuex
                    commit("getListAddressData", res.data.result);
                    commit("getActiveAddressData", activeAddress);
                } else {
                    Toast.fail("加载失败 " + res.data.code);
                }
            })
            .catch(err => {
                 
            });
    },
}