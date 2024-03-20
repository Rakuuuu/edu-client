<template>
  <el-container v-loading="isLoading">
    <el-header class="header">
      <div class="header-content">
        <el-button
          @click="$router.back()"
          class="header-left"
          type="text"
        ><el-icon><ArrowLeft /></el-icon><span>返回</span></el-button>
        <div class="header-middle">上传文件</div>
      </div>
    </el-header>
    <el-main class="main upload-main">
      <div>
        <el-upload
          class="upload"
          drag
          name="files"
          with-credentials
          :action="action"
          :on-success="uploadSuccess"
          :on-error="uploadError"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            拖动文件到此区域 或 <em>点击此区域上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              （支持任意格式的文件）
            </div>
          </template>
        </el-upload>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import {ArrowLeft, MoreFilled, Connection, Remove, Plus, UploadFilled} from '@element-plus/icons-vue'
import CourseStudentList from '@/views/course/detail/components/courseStudentList.vue'
import CommentList from '@/views/post/components/commentList.vue'
import ScEditor from '@/components/scEditor/index.vue'
export default {
  name: "postEdit",
  data () {
    return {
      isLoading: false,
      action: this.$API.file.file.upload.url
    }
  },
  components: {
    Plus,
    CommentList,
    CourseStudentList,
    ArrowLeft,
    MoreFilled,
    Connection,
    Remove,
    ScEditor,
    UploadFilled
  },
  created() {
  },
  computed: {
  },
  methods: {
    uploadSuccess () {
      this.$message({
        type: 'success',
        message: '上传成功'
      })
      this.$router.back()
    },
    uploadError () {
      this.$message({
        type: 'error',
        message: '上传失败'
      })
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
  }
}

.main {
  max-width: 1280px !important;
  width: 100%;
  margin: 0 auto;
  background: var(--el-bg-color) url("../../../../public/img/upload-bg.png") no-repeat;
  background-size: 50%;
  background-position: center 300px;
  padding: 16px;
  position: relative;
  .upload {
    max-width: 800px;
    margin: 32px auto;
    width: 100%;
    z-index: 99;
  }
  :deep(.el-upload__tip) {
    text-align: center;
    font-size: 14px;
    margin-top: 16px;
  }
  :deep(.el-upload-dragger) {
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

</style>
