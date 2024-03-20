<template>
  <div>
    <el-row :gutter="16" class="card-list-container" v-if="fileList.length">
      <el-col
        v-for="item in fileList"
        v-bind="cardAttributesBind"
        :key="`${item?.courseName}${item?.courseId}`"
      >
        <el-card
          class="card"
          shadow="hover"
          :body-style="{ padding: '0px' }"
        >
          <div class="dropdown" v-if="type !== 'select'">
            <!-- 此菜单仅对 1.文件持有者 2.课程所属教师（若位于课程详情页）展示，且不展示于课程文件绑定界面-->
            <el-dropdown size="large">
              <el-button plain><el-icon><MoreFilled/></el-icon></el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <!-- 举报：1.非该文件持有者 具有该权限 -->
                  <el-dropdown-item
                    v-if="dropdownButtonAuth(item, 'handle')"
                  >
                    <el-icon><Warning /></el-icon> 举报
                  </el-dropdown-item>
                  <!-- 重命名：1.文件持有者 具有该权限 -->
                  <el-dropdown-item
                    v-if="dropdownButtonAuth(item, 'rename')"
                    @click="onRenameFile(item)">
                    <el-icon><Edit /></el-icon> 重命名
                  </el-dropdown-item>
                  <!-- 将文件移出课程：1.文件持有者 2.课程所属教师 具有该权限； *只能在课程详情页操作* -->
                  <el-dropdown-item
                    v-if="dropdownButtonAuth(item, 'remove')"
                    @click="removeFromCourse(item)">
                    <el-icon><Remove /></el-icon> 从课程中移除
                  </el-dropdown-item>
                  <!-- 删除文件：1.文件持有者 具有该权限 -->
                  <el-dropdown-item
                    v-if="dropdownButtonAuth(item, 'delete')"
                    @click="onDeleteItem(item)">
                    <el-icon><Delete /></el-icon> 删除文件
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="selection" v-if="type === 'select'">
            <el-checkbox
              size="large"
              ref="checkbox"
              :disabled="item.isChose === 1"
              :model-value="item?.checked"
              @change="onSelectItem($event, item)"
            ></el-checkbox>
          </div>
          <div :class="['card-body', item.isChose === 1 && 'disabled']">
            <div class="top">
              <img
                class="file-img"
                :src="`/img/file_types/${getFileTypeFromMIME(item.fileType)}`"
              />
            </div>
            <div class="bottom">
              <div class="file-name">{{ item.fileName }}</div>
              <div class="file-size"> {{ formatBytes(item.fileSize) }}</div>
              <div class="file-uploader">
                <div class="avatar">
                  <el-avatar :size="24"/>
                </div>
                <div class="name">
                  {{ item?.edu_student?.studentName || `${item?.edu_teacher?.teacherName}（教师）` }}
                </div>
              </div>
              <div class="file-upload-time">{{ item.createdAt }}</div>
              <div class="file-download" v-if="type !== 'select'">
                <el-button
                  type="primary"
                  size="large"
                  @click="downloadFile(item)"
                  :disabled="downloadDisable"
                ><el-icon><Download /></el-icon> 下载</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row v-else class="empty">
      <el-empty/>
    </el-row>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="重命名文件"
      v-model="renameInfo.renameDialogVisible"
      class="rename-dialog"
    >
      <div v-loading="isLoadingDialog">
        <div class="rename-label">请输入文件名称：</div>
        <el-input
          class="rename-input"
          size="large"
          v-model="renameInfo.renameValuePre"
        >
          <template #append>
            .{{renameInfo.renameValueAppend}}
          </template>
        </el-input>
        <el-button class="rename-confirm" size="large" @click="onRenameFileConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {Download, Delete, Connection, MoreFilled, Remove, Edit, Warning} from '@element-plus/icons-vue'
import tool from '@/utils/tool'
import fileDownload from 'js-file-download'

export default {
  name: "fileCardList",
  emits: ['operateSuccess', 'onSelect', 'onRemove'],
  inject: {
    isSelfCourse: {
      default: false
    }
  },
  props: {
    fileList: {
      type: Array,
      default () {
        return []
      }
    },
    /**
     * type 文件卡片类型
     * </br>默认不传，课程详情传"course"，课程文件选择传"select"
     */
    type: {
      type: String,
      default: ''
    }
  },
  watch: {
    fileList: {
      handler () {
        this.selectionList = []
        this.$emit('onSelect', [])
      },
    }
  },
  components: {
    Edit, Remove, MoreFilled, Connection,
    Download,
    Delete,
    Warning
  },
  data () {
    return {
      isLoadingDialog: false,
      downloadDisable: false,
      // 多选列表
      selectionList: [],
      renameInfo: {
        renameDialogVisible: false,
        renameId: '',
        // 前缀
        renameValuePre: '',
        // 后缀文件类型不支持修改
        renameValueAppend: ''
      },
    }
  },
  computed: {
    // 是否处于课程详情页面
    cardAttributesBind () {
      if (this.type === 'course') {
        return {
          xl: 8,
          lg: 8,
          md: 12,
          sm: 12,
          xs: 12,
        }
      } else {
        return {
          xl: 6,
          lg: 6,
          md: 8,
          sm: 12,
          xs: 24
        }
      }
    }
  },
  methods: {
    // 按钮权限
    dropdownButtonAuth (item, type) {
      switch (type) {
        case 'handle': // 举报
          return !this.isSelfFile(item)
        case 'remove': // 从课程中移除
          return this.type === 'course' && (this.isSelfFile(item) || this.isSelfCourse)
        case 'delete': // 上传者删除该文件
        case 'rename': // 上传者重命名
          return this.isSelfFile(item)
        default:
          return false
      }
    },
    // 计算是否是自己的文件
    isSelfFile (item) {
      const { studentId, teacherId } = tool.data.get('USER_INFO')
      if (studentId) {
        return studentId === item.studentId
      } else if (teacherId) {
        return teacherId === item.teacherId
      } else {
        return false
      }
    },
    // 点击checkbox操作
    onSelectItem (ev, item) {
      const hasItem = this.selectionList.find(v => v.fileId === item.fileId)
      const itemIndex = this.selectionList.findIndex(v => v.fileId === item.fileId)
      if (ev && !hasItem) {
        item.checked = true
        this.selectionList.push({ ...item })
      } else if (!ev && hasItem) {
        item.checked = false
        this.selectionList.splice(itemIndex, 1)
      }
      console.log(this.selectionList)
      this.$emit('onSelect', this.selectionList)
    },
    // 重命名文件的弹窗开启
    onRenameFile ({ fileId, fileName }) {
      this.renameInfo.renameDialogVisible = true
      // 获取最后一个"."的坐标
      const lastDotIndex = fileName.lastIndexOf(".");
      const name = fileName.slice(0, lastDotIndex);
      const extension = fileName.slice(lastDotIndex + 1);
      // 更新参数
      this.renameInfo.renameId = fileId
      this.renameInfo.renameValuePre = name
      this.renameInfo.renameValueAppend = extension
    },
    // 提交重命名的请求
    async onRenameFileConfirm () {
      try {
        if (!this.renameInfo.renameValuePre.length) {
          this.$message({
            type: 'warning',
            message: '请输入文件名称'
          })
          return
        }
        await this.$confirm('确定要重命名吗？', '提示', { type: 'warning'})
        this.isLoadingDialog = true
        await this.$API.file.file.rename.post({
          fileId: this.renameInfo.renameId,
          newFileName: `${this.renameInfo.renameValuePre}.${this.renameInfo.renameValueAppend}`
        })
        this.$message({
          type: 'success',
          message: '重命名成功'
        })
        this.renameInfo.renameDialogVisible = false
        this.$emit('operateSuccess')
      } catch (err) {
        //
      } finally {
        this.isLoadingDialog = false
      }
    },
    // 从课程中移除
    async removeFromCourse (item) {
      this.$emit('onRemove', item)
    },
    // 删除文件
    async onDeleteItem ({ fileId }) {
      try {
        console.log(fileId)
        await this.$confirm('确定要删除该文件吗？', '提示', { type: 'warning' })
        await this.$API.file.file.delete.post({ fileId })
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.$emit('operateSuccess')
      } catch (err) {
        //
      }
    },
    // 获取文件类型，展示不同的图标
    getFileTypeFromMIME (mimeType) {
      switch (mimeType) {
        case 'application/illustrator': // .ai文件
          return 'AI.svg';
        case 'application/vnd.ms-excel': // Excel文件
          return 'excel.svg';
        case 'image/gif': // GIF文件
          return 'GIF.svg';
        case 'text/html': // HTML文件
          return 'HTML.svg';
        case 'image/jpeg': // JPG文件
        case 'image/png':
          return 'tupian.svg';
        case 'application/pdf': // PDF文件
          return 'PDF';
        case 'application/vnd.ms-powerpoint': // PPT文件
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
          return 'PPT.svg';
        case 'image/vnd.adobe.photoshop': // PSD文件
          return 'PSD.svg';
        case 'video/mp4': // 视频文件
          return 'shipin.svg';
        case 'image/svg+xml': // SVG文件
          return 'SVG.svg';
        case 'text/plain': // TXT文件
          return 'txt.svg';
        case 'application/msword': // Word文档
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          return 'word.svg';
        case 'application/zip': // 压缩包
          return 'yasuo.svg';
        case 'audio/mpeg': // 音频文件
          return 'yinpin.svg';
        case 'application/octet-stream': // EXE
        case 'application/x-msdos-program':
        case 'application/x-msdownload':
          return 'EXE.svg'
        default:
          return 'weizhiwenjian.svg';
      }
    },
    async downloadFile ({ fileId, fileName }) {
      try {
        this.downloadDisable = true
        const file = await this.$API.file.file.download.get({ fileId })
        fileDownload(file, fileName)
      } catch (e) {
        //
      } finally {
        this.downloadDisable = false
      }
    },
    // 获取文件大小包括单位
    formatBytes (bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
  }
}
</script>

<style scoped lang="scss">
.card-list-container {
  margin-top: 15px;
}
.el-card {
  margin-bottom: 15px;
}

.card {
  position: relative;
  .dropdown {
    position: absolute;
    right: 16px;
    top: 16px;
  }
  .selection {
    position: absolute;
    left: 16px;
    top: 12px;
  }
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

.card-body {
  padding: 16px;
  &.disabled {
    background: var(--el-bg-color-page) !important;
    cursor: not-allowed;
  }
  .top {
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 128px;
      height: 128px;
    }
  }
  .bottom {
    display: flex;
    flex-direction: column;
    .file-name {
      margin-top: 8px;
      width: 100%;
      text-align: center;
      font-weight: bold;
      font-size: 16px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .file-size {
      font-size: 14px;
      width: 100%;
      text-align: center;
      margin-top: 8px;
    }
    .file-uploader {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      margin-top: 16px;
      font-size: 14px;
      .avatar {

      }
      .name {
        //line-height: 24px;
        margin-bottom: 4px;
        margin-left: 4px;
        color: var(--el-text-color-secondary);
      }
    }
    .file-upload-time {
      margin-top: 4px;
      font-size: 14px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      color: var(--el-text-color-secondary);
    }

    .file-download {
      margin-top: 16px;
      width: 100%;
      display: flex;
      justify-content: center;
      button {
        width: 40%;
        min-width: 100px;
        margin: 12px;
      }
    }
  }

}

.rename-dialog{
  font-size: 14px;
  width: 80% !important;
  max-width: 400px !important;
  .rename-label {
    font-size: 14px;
    margin-bottom: 8px;
  }
  .rename-input {
    margin-bottom: 24px;
  }
  .rename-confirm {
    width: 100%;
  }
}

:deep(.el-dialog__body) {
  padding-top: 0 !important;
}

:deep(.el-checkbox__inner) {
  width: 24px !important;
  height: 24px !important;
}

:deep(.el-checkbox__inner::after) {
  width: 5px !important;
  height: 12px !important;
  left: 8px !important;
}


.empty {
  height: 100%;
}
</style>
