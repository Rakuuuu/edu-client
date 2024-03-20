<template>
  <el-container class="container" v-loading="isLoading">
    <el-main class="main">
      <search-bar placeholder="请输入帖子主题" @onSearch="toPostQuery" v-model="postTitle"/>
      <div class="title">
        <div class="title-text">我的帖子</div>
        <div class="add-post">
          <el-button type="text" @click="$router.push({ name: 'postEdit' })"><el-icon><Plus/></el-icon> 发帖</el-button>
        </div>
      </div>
      <post-list :post-list="list"/>
    </el-main>
    <el-footer class="footer">
      <el-pagination
        class="pagination"
        :total="total"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        @current-change="pageChange"
      />
    </el-footer>
  </el-container>
</template>
<script>
import SearchBar from '@/components/searchBar/index.vue'
import PostList from '@/views/post/components/postList.vue'
import {Plus} from '@element-plus/icons-vue'

export default {
  name: "post",
  components: {Plus, PostList, SearchBar },
  data () {
    return {
      // 搜索框的postTitle
      postTitle: '',
      isLoading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      list: []
    }
  },
  created() {
    this.queryData()
  },
  methods: {
    pageChange () {
      this.queryData()
    },
    queryData () {
      this.isLoading = true
      this.$API.post.post.list.get({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }).then(({ data }) => {
        this.list = data.list
        this.total = data.total
      }).catch(() => {}).finally(() => {
        this.isLoading = false
      })
    },
    toPostQuery () {
      this.$router.push({
        name: 'postQuery',
        query: {
          postTitle: this.postTitle
        }
      })
    }
  },
}
</script>


<style scoped lang="scss">
.container {
  width: 100%;
  margin: 0 auto;
}
.main {
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
}

.title{
  display: flex;
  align-items: center;
  padding: 5px 2px;
  .add-post {
    margin-top: 3px;
    margin-left: 10px;
  }
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

.pagination {
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
}
</style>
