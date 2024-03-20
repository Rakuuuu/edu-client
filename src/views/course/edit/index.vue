<template>
  <el-container v-loading="isLoading">
    <el-header class="header">
      <div class="header-content">
        <el-button
          @click="$router.back()"
          class="header-left"
          type="text"
        ><el-icon><ArrowLeft /></el-icon><span>返回</span></el-button>
        <div class="header-middle">{{ editText }}课程</div>
      </div>
    </el-header>
    <el-main class="main">
      <el-form
        class="form"
        :model="form"
        ref="form"
        :rules="formRules"
        label-position="top"
        size="large"
      >
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="form.courseName"/>
        </el-form-item>
        <el-form-item label="课程描述" prop="courseDescription">
          <el-input type="textarea" v-model="form.courseDescription" class="textarea"/>
        </el-form-item>
        <el-form-item label="课程类型" prop="courseType">
          <el-select v-model="form.courseType" :disabled="editType==='edit'">
            <el-option
              v-for="item in courseType"
              :key="item.label"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="课程所属专业" prop="specialityId" :disabled="editType==='edit'">
          <el-select
            v-model="form.specialityId"
            placeholder="请选择"
            :disabled="editType!=='add'"
          >
            <el-option-group
              v-for="group in specialityOptions"
              :key="group.departmentName"
              :label="group.departmentName"
            >
              <el-option
                v-for="item in group.edu_specialities"
                :key="item.specialityName"
                :label="item.specialityName"
                :value="item.specialityId"
              />
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="是否公开" prop="isPublish">
          <el-select v-model="form.isPublish" :disabled="editType==='edit'">
            <el-option
              v-for="item in isPublish"
              :key="item.label"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="加课码（6位）" prop="courseCode">
          <el-input clearable maxlength="6" v-model="form.courseCode">
            <template #suffix>
              <el-icon @click="generateCourseCode"><Refresh/></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <div class="submit-btn">
            <el-button type="primary" @click.prevent="submit">提交</el-button>
            <el-button>重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import {ArrowLeft, MoreFilled, Connection, Remove, Plus, Refresh, Loading } from '@element-plus/icons-vue'
import CourseStudentList from '@/views/course/detail/components/courseStudentList.vue'
import CommentList from '@/views/post/components/commentList.vue'
import { courseType, isPublish } from '@/utils/enum'
export default {
  name: "postEdit",
  data () {
    return {
      isLoading: false,
      courseId: '',
      postDetail: {},
      form: {
        courseName: '',
        courseDescription: '',
        courseType: '',
        specialityId: '',
        isPublish: '',
        courseCode: '',
      },
      // 专业动态枚举
      specialityOptions: [],
      courseType,
      isPublish,
      courseOptions: [],
      formRules: {
        courseName: [
          { required: true, message: '请输入课程名称', trigger: 'blur' }
        ],
        courseDescription: [
          { required: true, message: '请输入课程描述', trigger: 'blur' }
        ],
        courseType: [
          { required: true, message: '请选择课程类型', trigger: 'change' }
        ],
        isPublish: [
          { required: true, message: '请选择课程是否公开', trigger: 'change' }
        ],
        courseCode: [
          { required: true, message: '请输入加课码', trigger: 'blur' }
        ],
        specialityId: [
          { required: true, message: '请选择所属专业', trigger: 'change' }
        ],
      }
    }
  },
  components: {
    Plus,
    CommentList,
    CourseStudentList,
    ArrowLeft,
    MoreFilled,
    Connection,
    Remove,
    Refresh,
    Loading
  },
  created() {
    this.courseId = this.$route.query.courseId || ''
    this.querySpecialityList()
    if (this.editType === 'edit') {
      this.queryCourseDetail()
    }
  },
  computed: {
    editType () {
      return this.courseId !== '' ? 'edit' : 'add'
    },
    editText () {
      return this.courseId !== '' ? '编辑' : '新建'
    }
  },
  methods: {
    async submit () {
      try {
        await this.$refs.form.validate()
        this.isLoading = true
        if(this.editType === 'add') {
          const { courseName, courseDescription, courseType, isPublish, courseCode, specialityId } = this.form
          await this.$API.course.course.add.post({
            courseName,
            courseDescription,
            courseType,
            isPublish,
            courseCode,
            specialityId
          })
        } else {
          const { courseName, courseDescription, courseCode } = this.form
          await this.$API.course.course.update.post({
            courseId: this.courseId,
            courseName,
            courseDescription,
            courseCode
          })
        }
        this.$message({
          type: 'success',
          message: '课程' + this.editText + '成功'
        })
        this.$router.back()
      } catch (e) {
        //
      } finally {
        this.isLoading = false
      }
    },
    // 获取所有以学院为划分的专业
    async querySpecialityList () {
      try {
        this.specialityOptions = (await this.$API.department.speciality.all.get()).data
      } catch (err) {
        //
      }
    },
    // 获取帖子详情
    queryCourseDetail () {
      this.isLoading = true
      this.$API.course.course.detail.get({
        courseId: this.courseId
      }).then(({ data }) => {
        this.form.courseName = data.courseName
        this.form.courseDescription = data.courseDescription
        this.form.courseCode = data.courseCode
        this.form.specialityId = data.specialityId
        this.form.courseType = data.courseType
        this.form.isPublish = data.isPublish
      }).catch(() => {}).finally(() => {
        this.isLoading = false
      })
    },
    // 获取随机课程码
    async generateCourseCode () {
      try {
        this.form.courseCode = (await this.$API.course.course.code.get()).data
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>


<style scoped lang="scss">
:deep(.el-textarea__inner){
  height: 200px;
  resize: none;
}
.header {
  width: 100%;
  .header-content {
    width: 100%;
    max-width: 1280px !important;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    position: relative;
    .header-left {
      span {
        margin-left: 4px;
        margin-top: 2px;
      }
    }
    .header-middle {
      font-size: 16px;
      font-weight: bold;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

.main {
  max-width: 1280px !important;
  width: 100%;
  margin: 0 auto;
  background: var(--el-bg-color);
  padding: 16px;
  .form {
    flex-grow: 1;
    width: 100% !important;
    overflow: hidden;
    :deep(.el-form-item) {
      max-width: 1000px;
      width: 100%;
      margin: 0 auto 22px auto;
    }
  }
}

.submit-btn {
  margin-top: 22px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
