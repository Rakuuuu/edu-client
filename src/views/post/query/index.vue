<template>
  <el-container class="container" v-loading="isLoading">
    <el-main class="main">
      <el-button type="text" @click="$router.push({ name: 'post' })"><el-icon><Back/></el-icon> 我的帖子</el-button>
      <search-bar v-model="postTitle" @onSearch="onSearch" placeholder="请输入帖子名称"/>
      <div class="post-title">
        <div> 搜索结果（共{{ total }}条） </div>
      </div>
      <post-list :post-list="postList"/>
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
import scSelectFilter from '@/components/scSelectFilter/index.vue'
import {isPublish} from '@/utils/enum'
import {Back} from '@element-plus/icons-vue'
import PostList from '@/views/post/components/postList.vue'

export default {
  name: "postQuery",
  components: {PostList, scSelectFilter, SearchBar, Back },
  data () {
    return {
      postTitle: '',
      currentPage: 1,
      pageSize: 20,
      total: 0,
      postList: [],
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
    queryData () {
      this.isLoading = true
      const param = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        postTitle: this.postTitle
      }
      // if (this.isPublish) {
      //   param.isPublish = this.isPublish
      // }
      this.$API.post.post.joinedList.get(param).then(({ data: { list, total }}) => {
        console.log(list)
        this.total = total
        this.postList = list
      }).catch(() => {}).finally(() => { this.isLoading = false })
    }
  },
  created() {
    this.postTitle = this.$route.query?.postTitle || ''
    this.queryData()
  }
}
</script>


<style scoped lang="scss">
.main {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  .post-title {
    margin: 32px 0 16px 0;
    font-size: 20px;
    font-weight: bold;
    display: flex;
    align-items: center;
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
.footer {
  width: 100%;
  .pagination {
    width: 100%;
    max-width: 1280px !important;
    margin: 0 auto;
  }
}
</style>
