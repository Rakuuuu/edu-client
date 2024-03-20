<template>
  <el-container class="container" v-loading="isLoading">
    <el-main class="main">
      <el-button type="text" @click="$router.push({ name: 'course' })"><el-icon><Back/></el-icon> 我的课程</el-button>
      <search-bar v-model="courseName" @onSearch="onSearch" placeholder="请输入课程名称"/>
      <sc-select-filter
        :data="publishStatus"
        :label-width="80"
        @on-change="onFilterChange"
      ></sc-select-filter>
      <course-card-list :course-list="courseList"/>
    </el-main>
    <el-footer class="footer">
      <el-pagination
        :page-size="pageSize"
        :current-page="currentPage"
        :total="total"
        class="pagination"
        @current-change="onPageChange"
      />
    </el-footer>
  </el-container>
</template>

<script>
import SearchBar from '@/components/searchBar/index.vue'
import CourseCardList from '@/views/course/components/courseCardList.vue'
import scSelectFilter from '@/components/scSelectFilter/index.vue'
import {isPublish} from '@/utils/enum'
import {Back} from '@element-plus/icons-vue'

export default {
  name: "courseQuery",
  components: {scSelectFilter, CourseCardList, SearchBar, Back },
  data () {
    return {
      courseName: '',
      currentPage: 1,
      pageSize: 20,
      total: 0,
      courseList: [],
      isLoading: false,
      isPublish: '',
      // “是否公开”的过滤器配置
      publishStatus: [
        {
          title: "是否公开",
          key: "isPublish",
          options: [{ label: '全部', value: ''}, ...isPublish]
        }
      ],
    }
  },
  methods: {
    onSearch () {
      this.currentPage = 1
      this.queryData()
    },
    onPageChange (currentPage) {
      this.currentPage = currentPage
      this.queryData()
    },
    onFilterChange ({ isPublish }) {
      console.log(isPublish)
      this.isPublish = isPublish
      this.queryData()
    },
    queryData () {
      this.isLoading = true
      const param = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        courseName: this.courseName
      }
      if (this.isPublish) {
        param.isPublish = this.isPublish
      }
      this.$API.course.course.queryCourse.get(param).then(({ data: { list, total }}) => {
        console.log(list)
        this.total = total
        this.courseList = list
      }).catch(() => {}).finally(() => { this.isLoading = false })
    }
  },
  created() {
    this.courseName = this.$route.query?.courseName || ''
    this.queryData()
  }
}
</script>


<style scoped lang="scss">
  .main {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
  }
  .footer {
    width: 100%;
    .pagination {
      width: 100%;
      max-width: 1280px !important;
      margin: 0 auto;
    }
  }
</style>
