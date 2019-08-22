<template>
    <div class="users">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 搜索框 -->
        <el-input placeholder="请输入内容" v-model="page.query" class="input-search" @keyup.enter.native="search">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
        <!-- 添加用户按钮 -->
        <el-button type="success" plain @click="showAddDialog">添加用户</el-button>

        <!-- 表格 -->
        <!-- 
            el-table:表格组件
            :data：表格显示的数据
            el-table-column：表格的一列
            prop：每一列要显示的数据
            label：表头的描述信息
            template标签：自定义每一列显示的内容

         -->
        <el-table :data="tableData" style="width: 100%">
            <el-table-column label="姓名" prop="username">
            </el-table-column>
            <el-table-column label="邮箱" prop="email">
            </el-table-column>
            <el-table-column label="电话" prop="mobile">
            </el-table-column>
            <el-table-column label="用户状态">
                <!-- 自定义列模板 -->
                <template slot-scope="scope">
                    <!-- 
                        el-switch:开关按钮
                        绑定v-model到一个Boolean类型的变量。可以使用active-color属性与inactive-color属性来设置开关的背景色。
                        event
                        change 改变状态触发
                     -->
                    <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="changeState(scope.row)">
                    </el-switch>
                </template>

            </el-table-column>
            <el-table-column label="操作">
                <!-- 自定义列模板 -->
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" plain @click="showEditDialog(scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" plain @click="delUser(scope.row)"></el-button>
                    <el-button type="success" icon="el-icon-check" size="mini" plain @click="showAssignRole(scope.row)">分配角色</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <!-- 
            el-pagination：分页组件
            background：是否为分页按钮添加背景色	
            :total:	总条目数
            :page-size：每一页显示的条数
            layout:	要显示的组件布局，子组件名用逗号分隔 【total：总条数组件，sizes：每页显示的条数组件，jumper：跳到哪一页组件】
            :total：总条数（对应total组件）
            :page-sizes：每页显示的条数（值是个数组，对应sizes组件）
            :page-size：每页显示的条数
            :current-page：当前页码
         -->
        <el-pagination background layout="total,sizes,prev, pager, next,jumper" :total="page.total" :page-sizes="[2, 4, 6]" :page-size="page.pagesize" :current-page="page.pagenum" @current-change="handleCurrentChange" @size-change="handleSizeChange">
        </el-pagination>

        <!-- 添加用户对话框组件 -->
        <!-- 
            el-dialog: 对话框（模态框）组件
            title: 对话框的标题内容
            :visible.sync: 是否显示 给个布尔值
            :before-close： 不需要，可以删除
            
        -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%">
            <!-- 表单组件 -->
            <!-- 
                el-form: 表单组件
                :model：表单要使用的数据
                ref: 为了获取表单（提交按钮再次验证需要）
                label-width: 表单前面内容的宽度
                el-form-item:表单每一项
                label: 表单前面的内容
                el-input: input框
                el-form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 el-form-item 的 prop 属性设置为需校验的字段名即可。
             -->
            <el-form :model="addForm" label-width="70px" :rules="rules" ref="addForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser('addForm')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改用户信息对话框 -->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="30%">
            <el-form :model="editForm" label-width="70px" :rules="rules" ref="editForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配角色对话框 -->
        <el-dialog title="分配角色" :visible.sync="assignDialogVisible" width="30%">
            <el-form :model="assignRoleForm" label-width="60px" ref="assignForm">
                <el-form-item label="用户名">
                    <el-input v-model="assignRoleForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="选择角色" label-width="70px">
                    <el-select v-model="assignRoleForm.rid" placeholder="请分配角色">
                        <el-option v-for="item in options" :label="item.roleName" :value="item.id" :key="item.id"></el-option>

                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="assignDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="assignRole">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'Users',
        data() {
            return {
                tableData: [],
                page: {
                    query: '', //查询的关键字
                    pagenum: 1, //当前页码 不能为空
                    pagesize: 2, //每页显示条数 不能为空
                    total: 3, //总条目数
                },
                addDialogVisible: false,
                addForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                editForm: {
                    username: '',
                    id: '',
                    email: '',
                    mobile: ''
                },
                assignRoleForm: {
                    id: '', //用户的id
                    username: '', //用户的角色名
                    rid: '' //用户的角色id
                },
                editDialogVisible: false,
                assignDialogVisible: false,
                options: [],
                /* 表单验证规则 
                required:true 必填
                message: 格式不正确提示信息
                trigger:'blur' 验证方式为光标离开输入框
                min；最小长度  max:最大长度
                type:'email' 格式为邮箱
                pattern: 自定义格式为正则表达式
                 */
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
                    ],
                    email: [
                        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                    ],
                    mobile: [
                        { pattern: /^1[3456789]\d{9}$/, message: '手机格式不正确', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            async getUserList() {
                let res = await this.$axios.get('users', { params: this.page }) //axios发送get请求=携带参数需要加params
                let { meta: { status }, data } = res.data
                if (status === 200) {
                    this.tableData = data.users
                    this.page.total = data.total
                }
            },
            handleCurrentChange(val) {
                //val当前页
                this.page.pagenum = val
                //重新渲染，因为pagenum当前页发生了改变
                this.getUserList()
            },
            handleSizeChange(val) {
                //val每页显示条数
                this.page.pagesize = val
                //修改当前页为1
                this.page.pagenum = 1
                //重新渲染，因为 pagesize当前页发生了改变
                this.getUserList()
            },
            search() {
                //让当前页变为1
                this.page.pagenum = 1
                this.getUserList()
            },
            async changeState(row) {
                let res = await this.$axios.put(`users/${row.id}/state/${row.mg_state}`)
                let { meta: { status } } = res.data
                if (status === 200) {
                    this.$message({
                        message: '状态成功修改',
                        type: 'success',
                        duration: 1000
                    })
                }
            },
            delUser(row) {
                //提示是否删除
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let res = await this.$axios.delete(`users/${row.id}`)
                    let { meta: { status } } = res.data
                    if (status === 200) {
                        if (this.tableData.length === 1 && this.pagenum > 1) {
                            this.pagenum--
                        }
                        this.$message({
                            type: 'success',
                            message: '删除成功!',
                            duration: 1000
                        })
                        this.getUserList()
                    }
                })
            },
            //显示添加用户模态框
            showAddDialog() {
                this.addDialogVisible = true
            },
            addUser(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        let res = await this.$axios.post('users', this.addForm)
                        let { meta: { status } } = res.data
                        if (status === 201) {
                            this.$message({
                                message: '添加用户成功',
                                type: 'success',
                                duration: 1000
                            })
                            //重置表单
                            this.$refs[formName].resetFields()
                            //关闭添加对话框
                            this.addDialogVisible = false
                            //重新渲染
                            this.getUserList()
                        }
                    } else {
                        return false
                    }
                })
            },
            showEditDialog(row) {
                this.editDialogVisible = true
                //回显
                this.editForm.username = row.username
                this.editForm.id = row.id
                this.editForm.email = row.email
                this.editForm.mobile = row.mobile
            },
            editUser() {
                //1.表单校验
                this.$refs.editForm.validate(async (valid) => {
                    if (valid) {
                        let res = await this.$axios.put(`users/${this.editForm.id}`, this.editForm)
                        let { meta: { status } } = res.data
                        if (status === 200) {
                            this.$message({
                                message: '修改用户成功',
                                type: 'success',
                                duration: 1000
                            })
                            //关闭修改对话框
                            this.editDialogVisible = false
                            //重新渲染
                            this.getUserList()
                        }
                    } else {
                        return false
                    }
                })

            },
            async showAssignRole(row) {
                this.assignDialogVisible = true
                this.assignRoleForm.username = row.username
                this.assignRoleForm.id = row.id
                //回显rid,发送￥axios获取用户的角色id
                let res2 = await this.$axios.get(`users/${row.id}`)
                if (res2.data.meta.status === 200) {
                    this.assignRoleForm.rid = res2.data.data.rid
                }

                //获取options数据
                let res = await this.$axios.get(`roles`)
                let { meta: { status }, data } = res.data
                if (status === 200) {
                    this.options = data
                }
            },
            async assignRole() {
                let res = await this.$axios.put(`users/${this.assignRoleForm.id}/role`, { rid: this.assignRoleForm.rid })
                let { meta: { status, msg } } = res.data
                if (status === 200) {
                    this.$message({
                        type: 'success',
                        message: msg,
                        duration: 1000
                    })
                    this.assignDialogVisible = false
                    this.getUserList()
                }
            }
        },
        created() {
            this.getUserList()
        },
    }
</script>

<style scoped>
    .input-search {
        width: 300px;
        margin-bottom: 5px;
        margin-right: 10px;
    }
</style>