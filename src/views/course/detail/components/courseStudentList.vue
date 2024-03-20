<template>
  <div class="content" v-loading="isLoading">
    <div v-if="studentList.length">
      <div class="count">共{{studentList.length}}条数据</div>
      <div v-for="item in studentList" :key="item" class="student-item">
        <div class="item-left">
          <el-avatar class="student-avatar">
            {{ item.studentName[0] }}
          </el-avatar>
          <div class="student-name">{{ item.studentName }}</div>
        </div>
        <div class="item-right" v-if="operateStudentAuth">
          <el-button type="danger">移出</el-button>
        </div>
      </div>
    </div>
    <div v-else class="empty"><el-empty/></div>
  </div>
</template>

<script>
import tool from '@/utils/tool'

export default {
  name: "courseStudentList",
  props: {
    courseDetail: {
      type: Object,
      default () {
        return {}
      }
    },
  },
  data () {
    return {
      studentList: [],
      isLoading: false,
      operateStudentAuth: tool.data.get('userInfo')?.teacherId === this.courseDetail?.teacherId
    }
  },
  created() {
    this.isLoading = true
    this.$API.course.course.courseStudentList.get({
      courseId: this.courseDetail.courseId
    }).then(({ data: list }) => {
      this.studentList = list
    }).catch(() => {}).finally(() => {
      this.isLoading = false
    })
  }
}
</script>


<style scoped lang="scss">
.content {
  height: 100%;
}
.count {
  margin-bottom: 8px;
  color: var(--el-text-color-secondary)
}
  .student-item {
    border-top: 1px solid rgba(0,0,0, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 2px;
    .item-left {
      display: flex;
      align-items: center;
      .student-name {
        font-size: 16px;
        margin-left: 16px;
      }
    }
    .item-right {
    }
  }
</style>
