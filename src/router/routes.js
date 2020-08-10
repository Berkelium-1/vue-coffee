export const routes = [
    // 一级
    // 主界面
    {
        path: '/main',
        name: 'Main',
        component: () => import('@/views/Main.vue'),
        redirect: {
            name: 'Menu'
        },
        // 二级
        children: [
            // 首页 
            {
                path: 'menu',
                name: 'Menu',
                component: () => import('@/views/main/Menu.vue')
            },
            // 订单
            {
                path: 'order',
                name: 'Order',
                component: () => import('@/views/main/Order.vue'),
            },
            // 我的
            {
                path: 'my',
                name: 'My',
                component: () => import('@/views/main/My.vue'),
            }
        ]
    },
    // 购物车
    {
        path: '/cart',
        name: 'Cart',
        component: () => import('@/views/Cart.vue')
    },
    // 商品详情
    {
        path: '/details',
        name: 'Details',
        component: () => import('@/views/Details.vue')

    },
    // 登录注册
    {
        path: '/submit',
        name: 'Submit',
        component: () => import('@/views/Submit.vue')

    },
    // 支付界面
    {
        path: '/pay',
        name: 'Pay',
        component: () => import('@/views/Pay.vue')

    },
    // 我的地址
    {
        path: '/myAddress',
        name: 'MyAddress',
        component: () => import('@/views/MyAddress.vue')
    },
    // 编辑地址
    {
        path: '/address',
        name: 'Address',
        component: () => import('@/views/Address.vue')
    }, ,
    // 个人设置
    {
        path: '/account',
        name: 'Account',
        component: () => import('@/views/Account.vue'),
    },
    // 我的收藏
    {
        path: '/myLike',
        name: 'MyLike',
        component: () => import('@/views/MyLike.vue'),
    },
    // 个人设置
    {
        path: '/secure',
        name: 'Secure',
        component: () => import('@/views/Secure.vue'),
    },
    {
        path: '*',
        redirect: {
            name: 'Main'
        }
    }
];