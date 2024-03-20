<template>
  <div v-loading="isLoading" class="course-file">
    <div>
      <div class="file-title">文件列表
        <div class="add-file">
          <el-button type="text" @click="chooseFileDialog = true"><el-icon><Plus/></el-icon> 添加文件 </el-button>
        </div>
      </div>
      <file-card-list
        :file-list="fileList"
        type="course"
        @operateSuccess="queryData"
        @onRemove="onRemove"
      />
    </div>
    <el-pagination
      v-model:current-page="pageParam.currentPage"
      v-model:page-size="pageParam.pageSize"
      v-model:total="pageParam.total"
      @current-change="queryData"
      class="pagination"
    />
    <el-dialog
      v-model="chooseFileDialog"
      title="选择您的文件"
      destroy-on-close
      fullscreen
      class="dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <choose-file :course-id="courseId" @onSuccess="onAddSuccess"/>
    </el-dialog>
  </div>
</template>

<script>
import {Plus} from '@element-plus/icons-vue'
import FileCardList from '@/views/file/components/fileCardList.vue'
import ChooseFile from '@/views/course/detail/components/chooseFile.vue'

export default {
  name: "courseFileList",
  components: {ChooseFile, FileCardList, Plus},
  props: {
    courseId: String
  },
  data () {
    return {
      pageParam: {
        currentPage: 1,
        pageSize: 6,
        total: 0
      },
      fileList: [],
      isLoading: false,
      chooseFileDialog: false
    }
  },
  created() {
    this.queryData()
  },
  methods: {
    queryData () {
      const { currentPage, pageSize } = this.pageParam
      this.isLoading = true
      this.$API.file.file.courseFileList.get({
        currentPage,
        pageSize,
        courseId: this.courseId
      }).then(({ data: { list, total }}) => {
        this.fileList = list
        this.pageParam.total = total
      }).catch(() => {}).finally(() => {
        this.isLoading = false
      })
    },
    // 添加成功
    onAddSuccess () {
      this.chooseFileDialog = false
      this.queryData()
    },
    // 从课程中移除该文件
    async onRemove ({ fileId }) {
      try {
        await this.$confirm('确定要将此文件从课程中移除吗？', '提示', { type: 'warning' })
        await this.$API.file.file.removeCourseFile.post({
          fileId,
          courseId: this.courseId
        })
        this.$message({
          type: 'success',
          message: '移除成功'
        })
        this.queryData()
      } catch (err) {
        //
      }
    }
  }
}
</script>

<style scoped lang="scss">

.pagination {
  margin-top: 32px;
}

.course-file {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.file-title {
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 20px;
  .add-file {
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
  :deep(.el-overlay-dialog) {
    display: flex !important;
    align-items: center !important;
  }
  :deep(.el-dialog) {
    max-width: 1280px !important;
    max-height: 1000px !important;
    margin: 0 auto !important;
  }
  :deep(.el-dialog__body) {
    flex-shrink: 1;
    height: calc(100% - 54px);
    padding: 0 !important;
  }
</style>
