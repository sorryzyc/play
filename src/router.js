import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
    routes: [
        { path: '/', name: 'Login', component: () => import('@/components/Login.vue') }, //按需导入组件
        {
            path: '/home',name: 'Home',redirect:'/home/users',component: () => import('@/components/Home.vue'),
            children: [
                { path: '/home/users', name: 'Users',component: () => import('@/components/Users.vue') },
                { path: '/home/rights', name: 'Right',component: () => import('@/components/Right.vue') },
                { path: '/home/roles', name: 'Roles',component: () => import('@/components/Roles.vue') },
            ]
        },
    ]
})

//全局路由守卫
router.beforeEach((to, from, next) => {
    let token = localStorage.getItem('token')
    if (token != null || to.path == '/') {
        next()
    } else {
        next('/')
    }

})

export default router