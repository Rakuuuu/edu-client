<template>
  <el-dialog :title="titleMap[mode]" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
    <el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px">
      <el-form-item label="课程名称" prop="courseName">
        <el-input v-model="form.courseName" placeholder="请输入课程名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="课程描述" prop="courseDescription">
        <el-input type="textarea" v-model="form.courseDescription" resize="none"/>
      </el-form-item>
      <el-form-item label="课程类型" prop="courseType">
        <el-select
          v-model="form.courseType"
          :disabled="mode!=='add'"
        >
          <el-option
            v-for="item in courseTypes"
            :value="item.courseType"
            :key="item.courseTypeName"
            :label="item.courseTypeName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程教师" prop="courseType">
        <el-select
          v-model="form.teacherId"
          :disabled="mode!=='add'"
        >
          <el-option
            v-for="item in teacherList"
            :value="item.value"
            :key="`teacher${item.teacherId}`"
            :label="item.label"
          >
            <div>
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #999; font-size: 13px">{{ item.teacherNo }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="加课码" prop="adminEmail">
        <el-input v-model="form.courseCode" placeholder="请输入加课码" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible=false">取 消</el-button>
      <el-button v-if="mode!='show'" type="primary" :loading="isSaveing" @click="submit()">保 存</el-button>
    </template>
  </el-dialog>
</template>

<script>
// import {emailReg, phoneReg} from "@/utils/regs";

export default {
  emits: ['success', 'closed'],
  data() {
    return {
      mode: "add",
      titleMap: {
        add: '新增课程',
        edit: '编辑课程',
        show: '查看课程'
      },
      visible: false,
      isSaveing: false,
      //表单数据
      form: {
        courseName: '',
        courseDescription: '',
        courseType: '',
        courseCode: '',
        teacherId: ''
        // adminSex: "男",
        // adminPhone: "",
        // adminEmail: ""
      },
      courseTypes: [],
      teacherList: [],
      //验证规则
      rules: {
        courseName: [
          {required: true, message: '请输入课程名称', trigger: 'blur' }
        ],
        // adminPhone: [
        //   {
        //     required: true,
        //     trigger: 'blur',
        //     validator: (rules, value, callback) => {
        //       if (!phoneReg.test(value) && value) {
        //         callback(new Error('请输入正确格式的手机号码'))
        //       }
        //       if (!value) {
        //         callback(new Error('请输入手机号码'))
        //       }
        //       callback()
        //     }
        //   }
        // ],
        // adminEmail: [
        //   {
        //     trigger: 'blur',
        //     validator: (rules, value, callback) => {
        //       if (!emailReg.test(value) && value) {
        //         console.log(111)
        //         callback(new Error('请输入正确格式的邮箱'))
        //       }
        //       callback()
        //     }
        //   }
        // ]
      },
      //所需数据选项
      groups: [],
      groupsProps: {
        value: "id",
        emitPath: false,
        checkStrictly: true
      }
    }
  },
  mounted() {

  },
  methods: {
    //显示
    open(mode = 'add') {
      this.$API.course.course.type.get().then(({ data }) => {
        this.courseTypes = data
      }).catch(() => {
      })
      this.$API.user.teacher.getTeacherByNameOrNo.get().then(({ data }) => {
        this.teacherList = data
      }).catch(() => {
      })
      this.mode = mode;
      this.visible = true;
      return this
    },
    //表单提交方法
    async submit() {
      const operate = this.mode === 'edit' ? 'update' : 'add'
      try {
        await this.$refs.dialogForm.validate()
        await this.$API.course.course[operate].post(this.form)
        this.$message({
          type: 'success',
          message: `${this.titleMap[this.mode]}成功`
        })
        this.visible = false
        this.$emit('success')
      } catch (err) {
        /* empty */
      }
    },
    //表单注入数据
    setData({ courseId }) {
      this.$API.course.course.detail.get({ courseId }).then(({data}) => {
        this.form = data
      }).catch(() => {
      })
    }
  }
}
</script>

<style>
</style>
