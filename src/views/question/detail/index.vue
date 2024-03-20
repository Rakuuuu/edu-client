<template>
  <el-container v-loading="isLoading">
    <el-header class="header">
      <div class="header-content">
        <el-button
          @click="$router.back()"
          class="header-left"
          type="text"
        ><el-icon><ArrowLeft /></el-icon><span>返回</span></el-button>
        <div class="header-middle">{{ editText }}题目</div>
      </div>
    </el-header>
    <el-main class="main">
      <el-form :model="form" label-position="top" class="form">
        <el-form-item label="题目内容">
          <sc-editor
            :options="{ statusbar: false }"
            id="comment-editor"
            class="editor"
            disabled
            v-model="form.questionContent"
          ></sc-editor>
        </el-form-item>
        <el-form-item label="题目类型">
          <el-select v-model="form.questionType" size="large">
            <el-option
              v-for="item in questionType"
              :key="item"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="单选题配置" v-show="form.questionType === '1'">
          <select-question ref="singleSelect" :question-type="form.questionType"/>
        </el-form-item>
        <el-form-item label="多选题配置" v-show="form.questionType === '6'">
          <select-question ref="multiSelect" :question-type="form.questionType"/>
        </el-form-item>
        <el-form-item label="判断题配置" v-if="form.questionType === '3'">
          <el-radio-group v-model="form.questionAnswer">
            <el-radio label="1" size="large">正确</el-radio>
            <el-radio label="0" size="large">错误</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="填空题配置（多答案请用英文逗号隔开）" v-if="form.questionType === '2'">
          <fill-space-question/>
        </el-form-item>
        <el-form-item label="简答题配置"  v-if="form.questionType === '4'">
          <el-input type="textarea"/>
        </el-form-item>
        <el-form-item label="主观题配置" v-if="form.questionType === '5'">
          <sc-editor
            :options="{ statusbar: false }"
            id="comment-editor"
            class="editor"
            disabled
            v-model="form.questionContent"
          ></sc-editor>
        </el-form-item>
        <el-form-item label="题目解析">
          <sc-editor
            :options="{ statusbar: false }"
            id="comment-editor"
            class="editor"
            disabled
            v-model="form.questionAnalytic"
          ></sc-editor>
        </el-form-item>
        <el-form-item>
          <el-button @click="$refs.multiSelect.getData()">保存</el-button>
          <el-button @click="$refs.multiSelect.getData()">查看</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import {ArrowLeft, Refresh} from '@element-plus/icons-vue'
import ScEditor from '@/components/scEditor/index.vue'
import {questionType} from '@/utils/enum'
import SelectQuestion from '@/views/question/detail/components/selectQuestion.vue'
import FillSpaceQuestion from '@/views/question/detail/components/fillSpaceQuestion.vue'

export default {
  name: "questionEdit",
  components: {FillSpaceQuestion, SelectQuestion, ScEditor, ArrowLeft, Refresh},
  data () {
    return {
      isLoading: true,
      questionId: '',
      // preview || edit
      editType: 'edit',
      form: {
        questionContent: '',
        questionType: '1',
        questionAnswer: '',
        questionAnalytic: ''
      },
      questionType
    }
  },
  computed: {
    isEdit () {
      return this.editType === 'edit'
    },
    editText () {
      return this.editType === 'edit' ? '编辑' : '查看'
    }
  },
  mounted() {
    const { questionId, editType } = this.$route.query
    this.questionId = questionId
    this.editType = editType
    this.isLoading = true
    this.$API.exam.question.detail.get({
      questionId: this.questionId
    }).then(({data}) => {
      this.form = data
      this.$nextTick(() => {
        if (data.questionType === '1') {
          this.$refs.singleSelect.setData(this.form)
        } else if (data.questionType === '6') {
          this.$refs.multiSelect.setData(this.form)
        }
      })
    }).catch(() => {}).finally(() => {
      this.isLoading = false
    })
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
  background: var(--el-bg-color);
  padding: 16px;
  .form {
    flex-grow: 1;
    width: 100% !important;
    overflow: hidden;
    :deep(.el-form-item) {
      max-width: 1000px;
      width: 100%;
      margin: 0 auto 22px auto;
    }
  }
}


.form {
  flex-grow: 1;
  width: 100% !important;
  overflow: hidden;
  :deep(.el-form-item) {
    max-width: 1000px;
    width: 100%;
    margin: 0 auto 22px auto;
  }
}

.editor {
  width: 100% !important;
}

:deep(.tox-tinymce) {
  //margin-top: 0 !important;
  height: 300px !important;
  //box-shadow: 0px 6px 24px 4px rgba(0, 0, 0, 0.04);
  border-radius: 4px !important;
  overflow: hidden;
}

:deep(.el-textarea__inner) {
  height: 200px !important;
  resize: none !important;
}
</style>
