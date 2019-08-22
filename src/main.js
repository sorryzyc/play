import Vue from 'vue'
import App from './App.vue'
import router from './router'

//引入ElementUI插件
import ElementUI from 'element-ui'
//引入ElementUI样式
import 'element-ui/lib/theme-chalk/index.css'
//vue使用ElementUI插件
Vue.use(ElementUI);

//导入公共样式
import '@/assets/common.css'

//导入axios
import axios from 'axios'
Vue.prototype.$axios = axios
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// let token=localStorage.getItem('token')
// axios.defaults.headers.common['Authorization'] = token;

// 添加请求拦截器(因为token如果设置默认值无论怎么切换用户token不变，只能设置拦截器，不然会有切换用户时权限菜单一样的bug)
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // config.baseURL='http://localhost:8888/api/private/v1/'
    config.headers.Authorization=localStorage.getItem('token')
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });
//开发环境的时候，vue会提供报错信息，而上线以后不需要，这句话就是上线的时候把报错信息关闭
Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
