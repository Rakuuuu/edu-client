<template>
  <el-container v-loading="isLoading">
    <el-header class="header">
      <div class="header-content">
        <el-button
          @click="$router.back()"
          class="header-left"
          type="text"
        ><el-icon><ArrowLeft /></el-icon><span>返回</span></el-button>
        <div class="header-middle">课程详情</div>
        <el-dropdown size="large" v-if="isSelfCourse || courseDetail.isJoined">
          <el-button type="text"><el-icon><MoreFilled/></el-icon></el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-if="courseDetail.isJoined"><el-icon><Connection /></el-icon> 课程反馈</el-dropdown-item>
              <el-dropdown-item v-if="isSelfCourse" @click="$router.push({ name: 'courseEdit', query: { courseId }})"><el-icon><Edit /></el-icon> 编辑</el-dropdown-item>
              <el-dropdown-item v-if="courseDetail.isJoined" @click="handleQuitCourse"><el-icon><Remove /></el-icon> 退出课程</el-dropdown-item>
              <el-dropdown-item v-if="isSelfCourse" @click="handleDeleteCourse"><el-icon><Remove /></el-icon> 删除课程</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <el-main class="main">
      <el-row :gutter="15">
        <el-col
          :md="10"
          :sm="12"
          :xs="24"
        >
          <div class="course-info">
            <div class="course-cover">
              <img alt src="https://img1.baidu.com/it/u=2205810988,4283060315&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500"/>
            </div>
            <div class="course-info-text">
              <div class="course-title">
                <span class="course-title-text">{{ courseDetail?.courseName }}</span>
                <el-tag size="large" class="tag" :type="courseDetail?.isPublish === '1' ? 'success' : 'danger'">
                  {{ courseDetail?.isPublish === '1' ? '公开课程' : '非公开课程' }}
                </el-tag>
              </div>
              <div class="course-description">{{ courseDetail?.courseDescription }}</div>
              <div class="course-department">所属专业：{{ courseDetail?.edu_speciality?.specialityName }}</div>
              <div class="course-type">课程类型：{{ courseTypeName }}</div><div class="create-time">创建时间：{{ courseDetail?.createdAt }}</div>
              <div class="student-count">选课人数：{{ courseDetail?.studentCount }}</div>
              <div class="course-teacher">
                <div class="course-teacher-left">
                  <el-avatar class="teacher-avatar">{{ courseDetail?.edu_teacher?.teacherName[0] }}</el-avatar>
                  <div class="teacher-name">
                    <div class="teacher-name-info">{{ courseDetail?.edu_teacher?.teacherName }}</div>
                    <div class="teacher-department-info">{{ courseDetail?.edu_teacher?.edu_speciality?.edu_department?.departmentName}} - {{ courseDetail?.edu_teacher?.edu_speciality?.specialityName }}</div>

                  </div>
                </div>
                <div class="course-teacher-right">
                  <el-tag size="large">课程教师</el-tag>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col
          :md="14"
          :sm="12"
          :xs="24"
          class="tabs-container"
        >
          <el-tabs
            class="tabs"
            type="border-card"
            v-model="activityTab"
          >
            <el-tab-pane label="公告" name="notice">Config</el-tab-pane>
            <el-tab-pane label="学生列表" name="student" :lazy="true">
              <course-student-list :course-detail="courseDetail"/>
            </el-tab-pane>
            <el-tab-pane label="作业" name="work">Role</el-tab-pane>
            <el-tab-pane label="帖子" name="post" :lazy="true">
              <course-post-list :course-id="courseId"/>
            </el-tab-pane>
            <el-tab-pane label="文件" name="file" :lazy="true">
              <course-file-list :course-id="courseId"/>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { ArrowLeft, MoreFilled, Connection, Remove, Edit } from '@element-plus/icons-vue'
import CourseStudentList from '@/views/course/detail/components/courseStudentList.vue'
import CoursePostList from '@/views/course/detail/components/coursePostList.vue'
import tool from '@/utils/tool'
import {courseType} from '@/utils/enum'
import CourseFileList from '@/views/course/detail/components/courseFileList.vue'
import {computed} from 'vue'
export default {
  name: "courseDetail",
  provide () {
    return {
      isSelfCourse: computed(() => this.isSelfCourse)
    }
  },
  data () {
    return {
      isLoading: false,
      courseId: '',
      courseDetail: {},
      activityTab: 'notice'
    }
  },
   components: {
     CourseFileList,
     CoursePostList,
     CourseStudentList,
     ArrowLeft,
     MoreFilled,
     Connection,
     Remove,
     Edit
   },
  created () {
    this.isLoading = true
    this.courseId = this.$route.query.courseId || ''
    this.$API.course.course.detail.get({ courseId: this.courseId }).then(({ data }) => {
      this.courseDetail = data
    }).catch(() => {}).finally(() => {
      this.isLoading = false
    })
  },
  computed: {
    // 是否是当前登录教师的课程
    isSelfCourse () {
      if (tool.data.get('USER_INFO')?.teacherId) {
        return tool.data.get('USER_INFO')?.teacherId === this.courseDetail?.teacherId
      } else {
        return false
      }
    },
    // 课程类型
    courseTypeName () {
      const matchRecord = courseType.find(v => v.value === this.courseDetail.courseType)
      return matchRecord?.label
    }
  },
  methods: {
    // 学生退课
    handleQuitCourse () {
      this.$confirm('确定要退课吗', '提示', { type: 'warning' }).then(() => {
        this.isLoading = true
        this.$API.course.course.quit.post({
          courseId: this.courseId
        }).then(() => {
          this.$message({
            type: 'success',
            message: '退课成功'
          })
          this.$router.back()
        }).catch(() => {}).finally(() => {
          this.isLoading = false
        })
      }).catch(() => {})
    },
    // 教师删除课程
    handleDeleteCourse () {
      this.$confirm('确定要删除该课程吗', '提示', { type: 'warning' }).then(() => {
        this.isLoading = true
        this.$API.course.course.delete.post({
          courseId: this.courseId
        }).then(() => {
          this.$message({
            type: 'success',
            message: '退课成功'
          })
          this.$router.back()
        }).catch(() => {}).finally(() => {
          this.isLoading = false
        })
      }).catch(() => {})
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
    .header-right {

    }
  }
}

.main {
  max-width: 1280px !important;
  width: 100%;
  margin: 0 auto;
  .course-info {
    .course-cover {
      width: 100%;
      img {
        width: 100%;
        border-radius: 4px;
      }
    }
    .course-info-text {
      padding: 0 8px;
      .course-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        &-text {
          font-size: 32px;
          font-weight: bold;
          max-width: 75%;
          margin: 12px 12px 12px 0;
        }
        .tag {
          margin-top: 4px;
        }
      }
      .course-description {
        color: var(--el-text-color-secondary);
        font-size: 16px;
        margin-bottom: 24px;
      }
      .course-department {
        color: var(--el-text-color-secondary);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .create-time {
        color: var(--el-text-color-secondary);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .course-type {
        color: var(--el-text-color-secondary);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .student-count {
        color: var(--el-text-color-secondary);
        font-size: 16px;
        margin-bottom: 24px;
      }
      .course-teacher {
        border-top: 1px solid rgba(0,0,0, .1);
        padding: 12px 0 24px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .course-teacher-left {
          display: flex;
          align-items: center;
          .teacher-avatar {
          }
          .teacher-name {
            &-info {
              margin-left: 12px;
              font-size: 20px;
            }
            .teacher-department-info {
              font-size: 12px;
              margin-left: 12px;
              margin-top: 4px;
              color: var(--el-text-color-primary);
            }
          }
        }
        .course-teacher-right {

        }
      }
    }
  }
  .tabs-container {
    display: flex;
  }
  .tabs {
    width: calc(100% - 16px);
    margin: 0 8px;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  :deep(.el-tabs__content) {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  :deep(.el-tab-pane) {
    flex-grow: 1;
  }
}

</style>
