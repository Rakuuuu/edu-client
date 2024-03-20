<template>
  <common-page title="注册新账号"  v-loading="loading">
    <el-steps :active="stepActive" simple finish-status="success">
      <el-step title="基础信息"/>
      <el-step title="详细信息"/>
      <el-step title="完成注册"/>
    </el-steps>
    <el-form v-if="stepActive==0" ref="stepForm_0" :model="form" :rules="rules" :label-width="120">
      <el-form-item label="手机号" prop="user">
        <el-input v-model="form.user" placeholder="请输入手机号" type="number"></el-input>
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-input v-model="form.password" type="password" show-password placeholder="请输入登录密码"></el-input>
        <sc-password-strength v-model="form.password"></sc-password-strength>
        <div class="el-form-item-msg">请输入包含英文、数字的8位以上密码</div>
      </el-form-item>
      <el-form-item label="确认密码" prop="password2">
        <el-input v-model="form.password2" type="password" show-password
                  placeholder="请再一次输入登录密码"></el-input>
      </el-form-item>
      <el-form-item label="" prop="agree">
        <el-checkbox v-model="form.agree" label="">已阅读并同意</el-checkbox>
        <span class="link" @click="showAgree=true">《平台服务协议》</span>
      </el-form-item>
    </el-form>
    <el-form v-if="stepActive==1" ref="stepForm_1" :model="form" :rules="rules" :label-width="120">
      <el-form-item label="真实姓名" prop="userName">
        <el-input v-model="form.userName" placeholder="请输入真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱地址"></el-input>
      </el-form-item>
      <el-form-item label="账号类型" prop="userType">
        <el-radio-group v-model="form.userType">
          <el-radio-button label="student">学生</el-radio-button>
          <el-radio-button label="teacher">教师</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="学号" prop="userNo" type="number" v-if="form.userType === 'student'">
        <el-input v-model="form.userNo" placeholder="请输入学号"></el-input>
      </el-form-item>
      <el-form-item label="教师号" prop="userNo" type="number" v-if="form.userType === 'teacher'">
        <el-input v-model="form.userNo" placeholder="请输入教师号"></el-input>
      </el-form-item>
    </el-form>
    <div v-if="stepActive==2">
      <el-result icon="success" title="注册成功" sub-title="可以使用手机号登录系统">
        <template #extra>
          <el-button type="primary" @click="goLogin">前去登录</el-button>
        </template>
      </el-result>
    </div>
    <el-form style="text-align: center;">
      <el-button v-if="stepActive>0 && stepActive<2" @click="pre">上一步</el-button>
      <el-button v-if="stepActive<1" type="primary" @click="next">下一步</el-button>
      <el-button v-if="stepActive==1" type="primary" @click="save">提交</el-button>
    </el-form>
    <el-dialog v-model="showAgree" title="平台服务协议" :width="800" destroy-on-close>
      平台服务协议
      <template #footer>
        <el-button @click="showAgree=false">取消</el-button>
        <el-button type="primary" @click="showAgree=false;form.agree=true;">我已阅读并同意</el-button>
      </template>
    </el-dialog>
  </common-page>
</template>

<script>
import scPasswordStrength from '@/components/scPasswordStrength';
import commonPage from './components/commonPage'

export default {
  components: {
    commonPage,
    scPasswordStrength
  },
  data() {
    return {
      stepActive: 0,
      showAgree: false,
      loading: false,
      form: {
        user: "",
        password: "",
        password2: "",
        agree: false,
        userName: "",
        email: "",
        userNo: '',
        userType: "student",
        open: []
      },
      rules: {
        user: [{
          required: true,
          validator: (rule, value, callback) => {
            if (!/^1[3456789]\d{9}$/.test(value)) {
              callback(new Error('请输入正确格式的手机号'));
            } else {
              callback()
            }
          }
        }],
        password: [
          {required: true, message: '请输入密码'},
          {
            validator: (rule, value, callback) => {
              const hasNumber = /[0-9]/.test(value);
              const hasLetter = /[a-zA-Z]/.test(value);
              if (!hasNumber || !hasLetter) {
                callback(new Error('请输入正确格式的密码'));
              } else if (value.length < 8) {
                callback(new Error('请输入8位以上的密码'));
              } else {
                callback();
              }
            }
          }
        ],
        password2: [
          { required: true, message: '请再次输入密码' },
          {
            validator: (rule, value, callback) => {
              if (value !== this.form.password) {
                callback(new Error('两次输入密码不一致'));
              } else {
                callback();
              }
            }
          }
        ],
        agree: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请阅读并同意协议'));
              } else {
                callback();
              }
            }
          }
        ],
        userName: [
          {required: true, message: '请输入真实姓名'}
        ],
        email: [
          { required: true, message: '请输入邮箱地址' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        userType: [
          {required: true, message: '请选择账户类型'}
        ],
        userNo: [
          {required: true, message: '必填'}
        ],
        open: [
          {required: true, message: '请选择开通类别'}
        ]
      }
    }
  },
  mounted() {

  },
  methods: {
    pre() {
      this.stepActive -= 1
    },
    next() {
      const formName = `stepForm_${this.stepActive}`
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.stepActive += 1
        } else {
          return false
        }
      })
    },
    save() {
      const formName = `stepForm_${this.stepActive}`
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true
            switch (this.form.userType) {
              case 'student': {
                const {userName, user, userNo, email, password} = this.form
                await this.$API.user.student.register.post({
                  studentName: userName,
                  studentPhone: user,
                  studentEmail: email,
                  studentNo: userNo,
                  password: this.$TOOL.crypto.MD5(password)
                })
              }
                break
              case 'teacher': {
                const {userName, user, userNo, email, password} = this.form
                await this.$API.user.teacher.register.post({
                  teacherName: userName,
                  teacherPhone: user,
                  teacherEmail: email,
                  teacherNo: userNo,
                  password: this.$TOOL.crypto.MD5(password)
                })
              }
                break
            }
          } catch (e) {
            /* empty */
            return
          } finally {
            this.loading = false
          }
          this.stepActive += 1
        }
      })
    },
    goLogin() {
      this.$router.push({
        path: '/login'
      })
    }
  }
}
</script>

<style scoped lang="scss">
  :deep(.common-title) {
    text-align: center;
  }
</style>
