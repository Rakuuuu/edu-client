<template>
  <el-container v-loading="isLoading">
    <el-header class="header">
      <div class="header-content">
        <el-button
          @click="$router.back()"
          class="header-left"
          type="text"
        ><el-icon><ArrowLeft /></el-icon><span>返回</span></el-button>
        <div class="header-middle">{{ editText }}帖子</div>
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
        <el-form-item label="帖子标题" prop="postTitle">
          <el-input v-model="form.postTitle"/>
        </el-form-item>
        <el-form-item label="所属课程" prop="courseId">
          <el-select v-model="form.courseId" :disabled="editType==='edit'">
            <el-option
              v-for="item in courseOptions"
              :key="item.courseName"
              :value="item.courseId.toString()"
              :label="item.courseName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="帖子内容" prop="postContent">
          <sc-editor
            :options="{ statusbar: false }"
            v-model="form.postContent"
          />
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
import {ArrowLeft, MoreFilled, Connection, Remove, Plus} from '@element-plus/icons-vue'
import CourseStudentList from '@/views/course/detail/components/courseStudentList.vue'
import CommentList from '@/views/post/components/commentList.vue'
import ScEditor from '@/components/scEditor/index.vue'
export default {
  name: "postEdit",
  data () {
    return {
      isLoading: false,
      postId: '',
      postDetail: {},
      form: {
        postTitle: '',
        postContent: '',
        courseId: ''
      },
      courseOptions: [],
      formRules: {
        postTitle: [
          { required: true, message: '请输入帖子标题', trigger: 'blur' }
        ],
        postContent: [
          { required: true, message: '请输入帖子标题', trigger: 'blur' }
        ],
        courseId: [
          { required: true, message: '请选择所属课程', trigger: 'blur' }
        ]
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
    ScEditor
  },
  created() {
    this.postId = this.$route.query.postId || ''
    this.form.courseId = this.$route.query.courseId || ''
    console.log(typeof this.form.courseId)
    this.queryCourseList()
    if (this.editType === 'edit') {
      this.queryPostDetail()
    }
  },
  computed: {
    editType () {
      return this.postId !== '' ? 'edit' : 'add'
    },
    editText () {
      return this.postId !== '' ? '编辑' : '新建'
    }
  },
  methods: {
    async submit () {
      try {
        await this.$refs.form.validate()
        this.isLoading = true
        if(this.editType === 'edit') {
          await this.$API.post.post.save.post({
            postId: this.postId,
            postTitle: this.form.postTitle,
            postContent: this.form.postContent
          })
        } else {
          await this.$API.post.post.add.post({
            courseId: this.form.courseId,
            postTitle: this.form.postTitle,
            postContent: this.form.postContent
          })
        }
        this.$message({
          type: 'success',
          message: '帖子' + this.editText + '成功'
        })
        this.$router.back()
      } catch (e) {
        /* empty */
      } finally {
        this.isLoading = false
      }
    },
    // 获取学生选课列表，或者教师所拥有的课程列表
    queryCourseList () {
      this.$API.course.course.chooseCourseList.get().then(({ data }) => {
        this.courseOptions = data
      })
    },
    // 获取帖子详情
    queryPostDetail () {
      this.isLoading = true
      this.$API.post.post.detail.get({
        postId: this.postId
      }).then(({ data }) => {
        this.form.postTitle = data.postTitle
        this.form.postContent = data.postTitle
        this.form.courseId = data?.edu_course.courseId
      }).catch(() => {}).finally(() => {
        this.isLoading = false
      })
    }
  }
}
</script>


<style scoped lang="scss">
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
:deep(.sceditor) {
  width: 100% !important;
}

:deep(.tox-tinymce) {
  height: 300px !important;
}

.submit-btn {
  margin-top: 22px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
