<template>
  <div v-loading="isLoading" class="course-post">
    <div>
      <div class="post-title">帖子列表
        <div class="add-post">
          <el-button type="text" @click="$router.push({ name: 'postEdit', query: { courseId } })"><el-icon><Plus/></el-icon> 发帖</el-button>
        </div>
      </div>
    <post-list :post-list="postList"/>
    </div>
    <el-pagination
      v-model:current-page="pageParam.currentPage"
      v-model:page-size="pageParam.pageSize"
      v-model:total="pageParam.total"
      @current-change="queryData"
      class="pagination"
    />
  </div>
</template>

<script>
import PostList from '@/views/post/components/postList.vue'
import {Plus} from '@element-plus/icons-vue'

export default {
  name: "coursePostList",
  components: { Plus, PostList },
  props: {
    courseId: String
  },
  data () {
    return {
      pageParam: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      postList: [],
      isLoading: false
    }
  },
  created() {
    this.queryData()
  },
  methods: {
    queryData () {
      const { currentPage, pageSize } = this.pageParam
      this.isLoading = true
      this.$API.post.post.courseList.get({
        currentPage,
        pageSize,
        courseId: this.courseId
      }).then(({ data: { list, total }}) => {
        this.postList = list
        this.pageParam.total = total
      }).catch(() => {}).finally(() => {
        this.isLoading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .pagination {
    margin-top: 32px;
  }

  .course-post {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .post-title {
    font-size: 20px;
    font-weight: bold;
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 20px;
    & .add-comment {
      display: flex;
      align-items: center;
      padding-top: 4px;
    }
    .add-post {
      margin-top: 3px;
      margin-left: 10px;
    }
    &::before {
      position: absolute;
      height: 60%;
      width: 8px;
      top: 50%;
      left: 0;
      content: '';
      border-radius: 4px;
      background: var(--el-color-primary);
      transform: translate(0, -50%);
    }
  }
</style>
