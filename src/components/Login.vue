<template>
    <div class="login">
        <el-form ref="form" :model="form" label-width="80px" :rules="rules"  size="mini">
            <img src="../assets/test.jpg" alt="">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username" placeholder="您的用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" :error="errorMsg">
                <el-input v-model="form.password" type="password" placeholder="密码" @keyup.enter.native="submitForm('form')" show-password></el-input>
            </el-form-item>
            <el-button @click="submitForm('form')" type="success" plain>登录</el-button>
            <el-button @click="resetForm('form')" type="success" plain>重置</el-button>
        </el-form>

    </div>
</template>

<script>
    export default {
        name: 'Login',
        data() {
            return {
                errorMsg: '',
                form: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
                    ],
                }
            }

        },
        methods: {
            //重置
            resetForm(form) {
                this.$refs[form].resetFields()
            },
            //登录表单验证
            submitForm(form) {
                this.$refs[form].validate(async (valid) => {
                    //成功
                    if (valid) {
                        //请求前先把error清空
                        this.errorMsg = ''
                        let res = await this.$axios.post('login', this.form)
                        let { meta: { status, msg }, data } = res.data
                        if (status === 200) {
                            //把返回的token存储到浏览器中
                            localStorage.setItem('token', data.token)
                            //路由跳转
                            this.$router.push('/home')
                        } else {
                            this.errorMsg = msg
                        }
                    } else {
                        // 失败
                        console.log('error submit!!')
                        return false
                    }
                });
            },
        }
    }
</script>


<style scoped>
    .el-form {
        width: 350px;
        height: 200px;
        margin: 200px auto;
        background-color: #fff;
        border-radius: 20px;
        padding: 40px 20px;
        box-sizing: border-box;
        position: relative;
    }

    .login {
        height: 100%;
        background-color: greenyellow;
        overflow: hidden;
    }

    .el-button {
        margin-top: 5px;
        margin-left: 55px;
    }

    img {
        height: 80px;
        width: 80px;
        position: absolute;
        left: 50%;
        top: -60px;
        transform: translateX(-50%);
        border-radius: 50%;
        border: 8px solid #fff;
    }
</style>