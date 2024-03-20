<template>
  <div>
    <el-row :gutter="16" class="card-list-container" v-if="courseList.length">
      <el-col
        :xl="6"
        :lg="6"
        :md="8"
        :sm="12"
        :xs="12"
        v-for="item in courseList"
        :key="`${item?.courseName}${item?.courseId}`"
      >
        <el-card shadow="hover" :body-style="{ padding: '0px' }" @click="toCourseDetail(item.courseId)">
          <div class="code-item">
            <div class="img" :style="{ background: `#ececec` }">
              <el-icon
                :style="`background-image: -webkit-linear-gradient(top left, #fff, ${item.color} 100px)`">
                <component :is="item.icon"/>
              </el-icon>
            </div>
            <div class="title">
              <h2>{{ item?.courseName }}</h2>
              <h4>{{ item?.courseDescription }}</h4>
              <div class="bottom">
                <el-tag :type="item.isPublish === '1' ? 'success' : 'danger'">{{ item?.isPublish === '1' ? '公开' : '非公开' }}</el-tag>
                <div>
                  <el-icon style="color: var(--el-text-color-secondary)"><UserFilled /></el-icon>
                  <span class="student-count">{{ item.studentCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row v-else class="empty">
      <el-empty/>
    </el-row>
  </div>
</template>

<script>

import { UserFilled } from '@element-plus/icons-vue'

export default {
  name: "courseCardList",
  components: { UserFilled },
  props: {
    courseList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    toCourseDetail (courseId) {
      this.$router.push({
        name: 'courseDetail',
        query: {
          courseId
        }
      })
    }
  }
}
</script>

<style scoped>
.card-list-container {
  margin-top: 15px;
}
.el-card {
  margin-bottom: 15px;
}

.code-item {
  cursor: pointer;
}

.code-item .img {
  width: 100%;
  height: 120px;
  background: #09f;
  display: flex;
  align-items: center;
  justify-content: center;
}

.code-item .img i {
  font-size: 100px;
  color: #fff;
  background-image: -webkit-linear-gradient(top left, #fff, #09f 100px);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.code-item .title {
  padding: 15px;
}

.code-item .title h2 {
  font-size: 16px;
}

.code-item .title h4 {
  font-size: 12px;
  color: #999;
  font-weight: normal;
  margin-top: 5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.code-item .title p {
  margin-top: 15px;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.title h4 {
  padding: 0 2px ;
}

.bottom {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.student-count {
  margin-left: 4px;
  margin-bottom: 2px;
  color: var(--el-text-color-secondary)
}
</style>
