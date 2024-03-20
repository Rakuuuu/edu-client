<template>
  <el-container v-loading="isLoading">
    <el-main>
      <file-card-list :file-list="fileList" type="select" @onSelect="onSelect"/>
    </el-main>
    <el-footer>
      <el-pagination
        layout="prev, pager, next, total, ->, slot"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        v-model:total="total"
        @current-change="queryData"
      >
          <el-button
            class="add-btn"
            type="text"
            plain
            :disabled="!selectionList.length"
            @click="addFileConfirm"
          >确定（{{ selectionList.length }}）</el-button>
      </el-pagination>
    </el-footer>
  </el-container>
</template>

<script>
import FileCardList from '@/views/file/components/fileCardList.vue'

export default {
  name: "chooseFile",
  emits: ['onSuccess'],
  components: { FileCardList },
  props: {
    courseId: String
  },
  data () {
    return {
      chooseFileSHow: false,
      isLoading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      fileList: [],
      selectionList: []
    }
  },
  created() {
    this.queryData()
  },
  methods :{
    onSelect (list) {
      this.selectionList = list
    },
    async addFileConfirm () {
      try {
        await this.$confirm('确定要添加文件至该课程吗？', '提示', { type: 'warning' })
        this.isLoading = true
        await this.$API.file.file.addCourseFile.post({
          courseId: this.courseId,
          fileIdList: this.selectionList.map(({ fileId }) => fileId)
        })
        this.$message({
          type: 'success',
          message: '添加成功'
        })
        this.$emit('onSuccess')
      } catch (err) {
        //
      } finally {
        this.isLoading = false
      }
    },
    queryData () {
      this.isLoading = true
      this.$API.file.file.list.get({
        // 指定课程，筛选出已经添加至该课程的文件
        courseId: this.courseId,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }).then(({ data: { list, total }}) => {
        this.total = total
        this.fileList = list.map((v) => {
          return {
            ...v,
            checked: false
          }
        })
      }).catch(() => {}).finally(() => {
        this.isLoading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .add-btn {
    display: flex;
    align-items: center;
    line-height: 100%;
    &, button {
      padding: 0 10px 0 15px;
      margin-left: 16px;
      margin-top: 2px;
    }
  }
</style>
