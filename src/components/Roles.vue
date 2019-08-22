<template>
    <div class="roles">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 添加按钮 -->
        <el-button type="success" size="small" plain @click="showAddDialog">添加角色</el-button>

        <!-- 表格 -->
        <el-table :data="roleList">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row v-if="scope.row.children.length===0">
                        <span>暂无权限</span>
                    </el-row>
                    <el-row v-for="level1 in scope.row.children" :key="level1.id">
                        <el-col :span="4">
                            <el-tag closable @close="delDesc(scope.row,level1.id)">{{ level1.authName }}</el-tag><i class="el-icon-arrow-right"></i>
                        </el-col>
                        <el-col :span="20">
                            <el-row v-for="level2 in level1.children" :key="level2.id">
                                <el-col :span="4">
                                    <el-tag type="success" closable @close="delDesc(scope.row,level2.id)">{{ level2.authName }}</el-tag><i class="el-icon-arrow-right
                                    "></i>
                                </el-col>
                                <el-col :span="20">
                                    <el-tag type="danger" v-for="level3 in level2.children" :key="level3.id" closable class="level3" @close="delDesc(scope.row,level3.id)">{{ level3.authName }}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column width="100" label="#">
                <template slot-scope="scope">
                    {{scope.$index+1}}
                </template>
            </el-table-column>
            <el-table-column label="角色名称" prop="roleName" width="200">
            </el-table-column>
            <el-table-column label="描述" prop="roleDesc" width="200">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" plain @click="showEditDialog(scope.row)"> </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" plain @click="delRole(scope.row)"></el-button>
                    <el-button type="success" icon="el-icon-check" size="mini" plain @click="showRightDialog(scope.row)">分配权限</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加用户对话框 -->
        <el-dialog title="添加角色" :visible.sync="roleVisible" width="500px">
            <el-form :model="form" :rules="rules" ref="addRole">
                <el-form-item label="角色名称" label-width="80px" prop="roleName">
                    <el-input v-model="form.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" label-width="80px">
                    <el-input v-model="form.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="roleVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 修改用户对话框 -->
        <el-dialog title="修改角色" :visible.sync="editRoleVisible" width="500px">
            <el-form :model="editForm" :rules="rules" ref="editRole">
                <el-form-item label="角色名称" label-width="80px" prop="roleName">
                    <el-input v-model="editForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" label-width="80px">
                    <el-input v-model="editForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editRoleVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRole">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 分配权限对话框 -->
        <el-dialog title="分配权限" :visible.sync="rightVisible" width="500px">
            <!--
                 el-tree: 树型组件
                 show-checkbox：显示复选框
                 default-expand-all： 默认展开所有
                 node-key： 每个节点唯一关键字
                 ref： 可以通过this.$refs获取
                 highlight-current：选中的高亮显示
                 :props="defaultProps" 默认的属性名，指定名字label用哪个属性，孩子children用哪个属性
             -->
            <el-tree :data="right" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current :props="defaultProps">
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="rightVisible = false">取 消</el-button>
                <el-button type="primary" @click="assignRight">分 配</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'Roles',
        data() {
            return {
                roleList: [],
                roleVisible: false,
                editRoleVisible: false,
                rightVisible: false,
                form: {
                    roleName: '',
                    roleDesc: ''
                },
                editForm: {
                    roleName: '',
                    roleDesc: '',
                    id: ''
                },
                rules: {
                    roleName: [
                        { required: true, message: '角色名不能为空', trigger: 'blur' }
                    ]
                },
                right: [],
                defaultProps: {
                    children: 'children',
                    label: 'authName'
                },
                roleID: ''
            }

        },
        methods: {
            async getRoleList() {
                let res = await this.$axios.get('roles')
                let { meta: { status }, data } = res.data
                if (status === 200) {
                    this.roleList = data
                }
            },
            async delRole(row) {
                try {
                    await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    let res = await this.$axios.delete(`roles/${row.id}`)
                    let { meta: { status } } = res.data
                    this.getRoleList()
                    if (status === 200) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!',
                            duration: 1000
                        });
                    }
                } catch (e) {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                        duration: 1000
                    });
                }

            },
            showAddDialog() {
                this.roleVisible = true
            },
            addRole() {
                this.$refs.addRole.validate(async valid => {
                    if (valid) {
                        let res = await this.$axios.post(`roles`, this.form)
                        let { meta: { status } } = res.data
                        if (status === 201) {
                            this.getRoleList()
                            this.$message({
                                type: 'success',
                                message: '添加成功!',
                                duration: 1000
                            });
                            this.form.roleName = ''
                            this.form.roleDesc = ''
                            this.roleVisible = false
                        }
                    }
                })

            },
            showEditDialog(row) {
                this.editRoleVisible = true
                this.editForm.roleName = row.roleName
                this.editForm.roleDesc = row.roleDesc
                this.editForm.id = row.id
            },
            async editRole() {
                let res = await this.$axios.put(`roles/${this.editForm.id}`, this.editForm)
                let { meta: { status } } = res.data
                if (status === 200) {
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        duration: 1000
                    })
                }
                this.getRoleList()
                this.editRoleVisible = false
            },
            async delDesc(row, id) {
                let res = await this.$axios.delete(`roles/${row.id}/rights/${id}`)
                let { meta: { status }, data } = res.data
                if (status === 200) {
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        duration: 1000
                    })
                    //只重新渲染表格
                    row.children = data
                }
            },
            async showRightDialog(row) {
                this.rightVisible = true
                //发送axios请求，获取所有的权限信息
                this.roleId = row.id
                let res = await this.$axios.get(`rights/tree`)
                let { meta: { status }, data } = res.data
                if (status === 200) {
                    this.right = data
                    let checkedId = []
                    row.children.forEach(level1 => {
                        level1.children.forEach(level2 => {
                            level2.children.forEach(level3 => {
                                checkedId.push(level3.id)
                            })
                        })
                    })
                    this.$refs.tree.setCheckedKeys(checkedId);
                }
            },
            async assignRight() {
                let keys = this.$refs.tree.getCheckedKeys()
                let halfkeys = this.$refs.tree.getHalfCheckedKeys()
                let allkeys = keys.concat(halfkeys).join()
                //    发送axios请求
                let res = await this.$axios.post(`roles/${this.roleId}/rights`, { rids: allkeys })
                let { meta: { status } } = res.data
                if (status === 200) {
                    this.$message({
                        type: 'success',
                        message: '分配权限成功',
                        duration: 1000
                    })
                    // 关闭分配权限对话框
                    this.rightVisible=false
                    //重新渲染
                    this.getRoleList()
                }
            }
        },
        created() {
            this.getRoleList()
        },
    }
</script>

<style scoped>
    .level3 {
        margin: 0px 5px 5px 0px;
    }
</style>