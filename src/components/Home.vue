<template>
    <el-container>
        <el-header>
            <a class="logo" href="/"></a>
            <div class="title">PLAY</div>
            <div class="logout">
                <span>欢迎光临，</span>
                <a href="javascript:;" @click="logout">退出</a>
            </div>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <!-- 侧边栏导航 -->
                <!-- 
                     el-menu：导航组件, 
                     default-active：当前激活菜单的index（就是让对应的index高亮）
                     el-menu-vertical-demo：这个样式可以不需要 
                     background-color：菜单的背景色（仅支持 hex 格式）
                     text-color：菜单的文字颜色（仅支持 hex 格式）
                     active-text-color：当前激活菜单的文字颜色（仅支持 hex 格式）
                     unique-opened：是否只保持一个子菜单的展开
                     router：是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转

                     子组件
                     el-submenu：子菜单
                     el-menu-item-group：子菜单中的分组（也可以不分组）
                     el-menu-item：子菜单分组中的每一项（不分组也可直接使用）
                     i：字体图标
                     span:文字

                -->
                <el-menu :default-active="$route.path" text-color="#fff" background-color="#545c64" active-text-color="#ffd04b" unique-opened router>
                    <el-submenu v-for="menu in menuList" :key="menu.id" :index="menu.path">
                        <template slot="title">
                            <i class="el-icon-star-on"></i>
                            <span>{{ menu.authName }}</span>
                        </template>
                        <el-menu-item v-for="item in menu.children" :key="item.id" :index="'/home/'+item.path" >
                            <i class="el-icon-star-off"></i>
                            <span>{{ item.authName }}</span>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>

            <el-main>
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: 'Home',
        data() {
            return {
                menuList: [],
            }
        },
        methods: {
            //退出
            logout() {
                this.$router.push('/'),
                    localStorage.removeItem('token')
            },
            
        },
        async created() {
            //获取左侧菜单的列表
            let res = await this.$axios.get(`menus`)
            let { meta: { status }, data } = res.data
            if (status === 200) {
                this.menuList = data
            }
            
        }
    }
</script>

<style scoped>
    .el-container.is-vertical {
        height: 100%;
    }

    .el-header {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
        display: flex;
        justify-content: space-between;
    }

    .el-aside {
        background-color: #545c64;
        color: #fff;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
    }

    .logo {
        display: block;
        width: 60px;
        height: 60px;
        background: url('../assets/test.jpg');
        background-size: 60px;
        border-radius: 50%;
    }

    .title {
        font-size: 30px;
        color: #fff;
    }

    .logout {
        font-weight: 700;
    }

    .el-submenu {
        width: 200px;
    }
</style>