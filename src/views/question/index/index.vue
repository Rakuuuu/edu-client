<template>
  <div class="question-index">
    <el-container class="container">
      <el-aside v-loading="isLoadingCourse" v-if="!ismobile" width="275px">
        <el-container>
          <el-header>
            <div class="title">
              <div class="title-text">我的课程</div>
            </div>
          </el-header>
          <el-main class="nopadding">
            <el-scrollbar>
              <div v-if="myCourseList.length">
                <el-button
                  class="course-btn"
                  @click="currentCourse = {}"
                  :class="!currentCourse.courseId && 'active'"
                >所有课程</el-button>
                <el-button
                  class="course-btn"
                  v-for="item in myCourseList"
                  :key="item"
                  :class="isActive(item) &&'active'"
                  @click="currentCourse = item"
                >
                  {{ item.courseName }}
                </el-button>
              </div>
              <el-empty class="empty" v-else/>
            </el-scrollbar>
          </el-main>
        </el-container>
      </el-aside>
      <div v-else>
        <el-button class="float-btn" round>666</el-button>
      </div>
      <el-main class="nopadding">
        <question-list :current-course="currentCourse"/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import CourseCardList from '@/views/course/components/courseCardList.vue'
import SearchBar from '@/components/searchBar/index.vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import QuestionList from '@/views/question/index/components/questionList.vue'

export default {
  name: "question",
  data () {
    return {
      isLoadingCourse: false,
      myCourseList: [],
      currentCourse: {}
    }
  },
  computed: {
    // 计算是否是移动设备
    ismobile () {
      return this.$store.state.global.ismobile
    }
  },
  components: {QuestionList, SearchBar, CourseCardList, Plus, Delete },
  methods: {
    // 查询课程
    queryCourse () {
      this.isLoadingCourse = true
      this.$API.course.course.chooseCourseList.get().then(({ data: list }) => {
        this.myCourseList = list
      }).catch(() => {})
        .finally(() => {
          this.isLoadingCourse = false
        })
    },
    isActive (item) {
      return this.currentCourse.courseId && this.currentCourse.courseId === item.courseId
    }
  },
  mounted() {
    this.queryCourse()
  }
}
</script>



<style scoped lang="scss">
.question-index {
  height: 100%;
  overflow: auto;
}
.container {
  width: 100%;
  max-width: 1280px !important;
  margin: 0 auto;
}
:deep(.title) {
  display: flex;
  align-items: center;
  padding: 5px 2px;
  .title-text {
    font-size: 16px;
    color: var(--el-text-color-primary);
    //font-weight: bold;
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
}
.float-btn {
  position: absolute;
  left: 16px;
  bottom: 128px;
}

.course-btn {
  width: 100%;
  border: none !important;
  display: block;
  margin: 0;
  padding: 24px;
  height: fit-content;
  text-align: left;
  border-radius: 0;
}
.active {
  color: var(--el-button-hover-text-color);
  border-color: var(--el-button-hover-border-color);
  background-color: var(--el-button-hover-bg-color);
  outline: 0;
}

.empty {
  height: 100%;
}



</style>
