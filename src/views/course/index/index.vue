<template>
  <div v-loading="isLoading" class="course-index">
    <el-container class="container">
      <el-main>
        <search-bar v-model="searchCourseName" @onSearch="toQuery" placeholder="请输入课程名称"/>
        <div class="my-course">
          <div class="title">
            <div class="title-text">我的课程</div>
            <div class="add-course">
              <el-button v-if="role==='STUDENT'" type="text" @click="addCourseSwitch=true"><el-icon><Plus/></el-icon> 添加课程</el-button>
              <el-button v-if="role==='TEACHER'" type="text" @click="$router.push({ name: 'courseEdit' })"><el-icon><Plus/></el-icon> 创建课程</el-button>
            </div>
          </div>
          <course-card-list :course-list="myCourseList"/>
        </div>
        <div class="recommend-course">
          <div class="title"><div class="title-text">推荐课程</div></div>
        </div>
        <div class=""></div>

        <el-dialog
          v-model="addCourseSwitch"
          title="添加课程"
          class="add-course-dialog"
          :close-on-click-modal="false"
        >
          <div v-loading="isLoadingDialog">
            <div class="add-course-tip">请输入加课码：</div>
            <el-input class="add-course-input" v-model="addCourseCode" placeholder="请输入"/>
            <el-button
              class="add-course-btn"
              type="primary"
              size="large"
              @click="chooseCourse"
            >
              <el-icon><Plus/></el-icon>
              加入课程
            </el-button>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import CourseCardList from '@/views/course/components/courseCardList.vue'
import SearchBar from '@/components/searchBar/index.vue'
import {Plus} from '@element-plus/icons-vue'
import tool from '@/utils/tool'

export default {
  name: "course",
  data () {
    return {
      isLoading: false,
      isLoadingDialog: false,
      searchCourseName: '',
      myCourseList: [],
      addCourseSwitch: false,
      addCourseCode: ''
    }
  },
  computed: {
    role () {
      return tool.data.get("USER_INFO").role
    }
  },
  components: { SearchBar, CourseCardList, Plus },
  methods: {
    toQuery () {
      this.$router.push({
        name: 'courseQuery',
        query: {
          courseName: this.searchCourseName
        }
      })
    },
    chooseCourse () {
      this.isLoadingDialog = true
      if (!this.addCourseCode.length) {
        this.$message({
          type: 'warning',
          message: '请输入加课码'
        })
        return
      }
      this.$API.course.course.choose.post({
        courseCode: this.addCourseCode
      }).then(() => {
        this.$message({
          type: 'success',
          message: '选课成功'
        })
        this.addCourseSwitch = false
        this.queryData()
      }).catch(() => {})
        .finally(() => {
        this.isLoadingDialog = false
      })
    },
    queryData () {
      this.isLoading = true
      this.$API.course.course.chooseCourseList.get().then(({ data: list }) => {
        this.myCourseList = list
      }).catch(() => {})
        .finally(() => {
          this.isLoading = false
        })
    },
  },
  mounted() {
    this.queryData()
  }
}
</script>



<style scoped lang="scss">
.course-index {
  height: 100%;
  overflow: auto;
}
.container {
  width: 100%;
  max-width: 1280px !important;
  margin: 0 auto;
}
.title{
  display: flex;
  align-items: center;
  padding: 5px 2px;
  .title-text {
    font-size: 20px;
    font-weight: bold;
    position: relative;
    padding-left: 20px;
    &::before {
      position: absolute;
      height: 60%;
      width: 8px;
      top: 50%;
      left: 0;
      content: '';
      border-radius: 4px;
      background: var(--el-color-primary);
      transform: translate(0, -45%);
    }
  }
  .add-course {
    margin-top: 3px;
    margin-left: 10px;
  }
}

:deep(.el-dialog) {
  width: 80% !important;
  max-width: 500px !important;
}
.add-course-dialog {
  .add-course-tip {
    margin-bottom: 10px;
  }
  .add-course-input {
    margin-bottom: 20px;
  }
  .add-course-btn {
    width: 100%;
  }
}
</style>
