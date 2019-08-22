<template>
    <div class="right">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">权限管理</el-breadcrumb-item>
                <el-breadcrumb-item>权限列表</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 表格 -->
        <el-table :data="tableList">
                <el-table-column  width="100" type="index" >
                    </el-table-column>
            <el-table-column prop="authName" label="权限名称" width="200">
            </el-table-column>
            <el-table-column prop="path" label="路径" width="200">
            </el-table-column>
            <el-table-column  label="层级" >
                    <template slot-scope="scope">
                            {{scope.row.level|change}}
                        </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name:'right',
    data(){
        return{
            tableList:[],
        }
    },
    methods: {
       async getRightList(){
            let res=await this.$axios.get('rights/list')
            let {meta:{status},data}=res.data
            if(status===200){
                this.tableList=data
            }

        }
    },
    created() {
        this.getRightList()
    },
    filters:{
        change(data){
            if(data==0){
                return '一级'
            }else if(data==1){
                return '二级'
            }else if(data==2){
                return '三级'
            }
        }
    }
}
</script>

<style scoped>

</style>