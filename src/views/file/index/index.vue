<template>
  <div v-loading="isLoading" class="file-index">
    <el-container class="container">
      <el-main class="main">
        <search-bar v-model="searchFileName" @onSearch="toQuery" placeholder="请输入文件名称"/>
        <div class="my-course">
          <div class="title">
            <div class="title-text">我的文件</div>
            <div class="add-file">
              <el-button type="text" @click="$router.push({ name: 'fileUpload' })"><el-icon><Plus/></el-icon> 上传文件</el-button>
            </div>
          </div>
          <file-card-list
            :file-list="myFileList"
            @operateSuccess="queryData"
          />
        </div>
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
  </div>
</template>

<script>
import FileCardList from '@/views/file/components/fileCardList.vue'
import SearchBar from '@/components/searchBar/index.vue'
import {Plus} from '@element-plus/icons-vue'

export default {
  name: "file",
  data() {
    return {
      isLoading: false,
      isLoadingDialog: false,
      searchFileName: '',
      myFileList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
    }
  },
  components: {SearchBar, FileCardList, Plus},
  methods: {
    pageChange () {
      this.queryData()
    },
    toQuery() {
      // this.$router.push({
      //   name: 'courseQuery',
      //   query: {
      //     courseName: this.searchFileName
      //   }
      // })
    },
    queryData() {
      this.isLoading = true
      this.$API.file.file.list.get({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }).then(({data: { list, total }}) => {
        this.myFileList = list
        this.total = total
      }).catch(() => {
      })
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
.file-index {
  height: 100%;
  overflow: auto;
}

.main {
  width: 100%;
  max-width: 1280px !important;
  margin: 0 auto;
}

.title {
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

  .add-file {
    margin-top: 3px;
    margin-left: 10px;
  }
}
.footer {
  width: 100%;
  .pagination {
    width: 100%;
    margin: 0 auto;
    max-width: 1280px;
  }
}

</style>
