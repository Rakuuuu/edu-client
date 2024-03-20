<template>
  <el-container v-loading="isLoading">
    <el-header class="header">
      <div class="header-content">
        <el-button
          @click="$router.back()"
          class="header-left"
          type="text"
        ><el-icon><ArrowLeft /></el-icon><span>返回</span></el-button>
        <div class="header-middle">帖子详情</div>
        <el-dropdown size="large">
          <el-button type="text"><el-icon><MoreFilled/></el-icon></el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-if="!isSelfPost"
              >
                <el-icon><Connection /></el-icon> 举报
              </el-dropdown-item>
              <el-dropdown-item
                @click="$router.push({ name: 'postEdit', query: { postId }})"
                v-if="isSelfPost"
              ><el-icon><el-icon-edit/></el-icon> 编辑帖子 </el-dropdown-item>
              <el-dropdown-item
                @click="handleDeletePost"
                v-if="isSelfPost || isCourseTeacher"
              ><el-icon><Remove /></el-icon> 删除帖子 </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <el-main class="main">
      <div class="post-detail" v-if="commentPageParam.currentPage===1">
        <div class="user-box">
          <el-avatar class="user-avatar" size="large"></el-avatar>
          <div class="user-info">
            <div class="user-name">{{ postDetail?.edu_student?.studentName || postDetail?.edu_teacher?.teacherName }}</div>
            <div class="user-department">{{
                postDetail?.edu_student?.edu_speciality?.edu_department?.departmentName ||
                postDetail?.edu_teacher?.edu_speciality?.edu_department?.departmentName
              }} - {{
                postDetail?.edu_student?.edu_speciality?.specialityName ||
                postDetail?.edu_teacher?.edu_speciality?.specialityName
              }}</div>
          </div>
        </div>
        <div class="post-title">{{ postDetail.postTitle }}</div>
        <div class="title-time-icon">
          <div class="time">
            {{ postDetail.createdAt }}
          </div>
          <div class="icons">
            <div class="title-icon">
              <el-icon><el-icon-view/></el-icon>
              <div class="text">{{ postDetail.postVisitCounts }}</div>
            </div>
            <div class="title-icon">
              <el-icon><el-icon-chat-dot-round/></el-icon>
              <div class="text">{{ postDetail.commentCount }}</div>
            </div>
          </div>
        </div>
        <div class="post-content">
          <div v-html="postDetail.postContent"/>
        </div>
        <el-divider direction="horizontal"/>
        <div class="like-post">
          <el-button v-if="postDetail.isLiked === 1" disabled><el-icon color="#ff9047"><el-icon-star-filled/></el-icon>已点赞（{{postDetail.likedNum}}）</el-button>
          <el-button v-else @click="handleLikePost"><el-icon><el-icon-star/></el-icon>点赞（{{postDetail.likedNum}}）</el-button>
        </div>
      </div>
      <div class="comment-area">
        <div class="comment-title">
          <div> 评论列表（{{commentPageParam.total}}条） </div>
          <div class="add-comment">
            <el-button type="text" @click="scrollToTarget"><el-icon><Plus/></el-icon> 发评论</el-button>
          </div>
        </div>
        <comment-list
          :comment-list="commentList"
          @reply="handleReplyComment"
          @likeComment="handleLikeComment"
          @deleteItem="handleDeleteComment"
        />
        <div class="comment-title reply">
          <div> 发表评论 </div>
        </div>
        <el-tag
          class="reply-tag"
          closable
          size="large"
          @close="handleResetComment"
          v-if="toReplyComment.commentId"
        >回复评论“{{ toReplyComment?.commentContent?.replace(/<[^>]*>/g, '').substring(0, 10) }}……”</el-tag>
        <sc-editor
          v-model="replyCommentContent"
          :options="{ statusbar: false }"
          id="comment-editor"
          class="editor el-card"
        ></sc-editor>
        <div class="bottom-btn">
          <el-button :disabled="isCommentDisabled" class="reply-btn" type="primary" size="large" @click="submitReply">回复</el-button>
          <el-button :disabled="isCommentDisabled" class="reset-btn" size="large" @click="replyCommentContent=''">重置</el-button>
        </div>
      </div>
    </el-main>
    <el-footer>
      <el-pagination
        class="pagination"
        v-model:current-page="commentPageParam.currentPage"
        v-model:total="commentPageParam.total"
        v-model:page-size="commentPageParam.pageSize"
        @current-change="queryComment"
      />
    </el-footer>
  </el-container>
</template>

<script>
import {ArrowLeft, MoreFilled, Connection, Remove, Plus} from '@element-plus/icons-vue'
import CourseStudentList from '@/views/course/detail/components/courseStudentList.vue'
import CommentList from '@/views/post/components/commentList.vue'
import ScEditor from '@/components/scEditor/index.vue'
export default {
  name: "postDetail",
  data () {
    return {
      isLoading: false,
      isCommentDisabled: false,
      postId: '',
      postDetail: {},
      // 评论列表
      commentList: [],
      // 回复评论参数
      replyCommentContent: '',
      // 评论列表分页参数
      commentPageParam: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // 回复评论的对象
      toReplyComment: {
        commentContent: '',
        commentId: ''
      },
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
    ScEditor
  },
  computed: {
    isSelfPost () {
      const userInfo = this.$TOOL.data.get("USER_INFO");
      if (this.postDetail?.edu_student?.studentId) {
        return userInfo.studentId === this.postDetail?.edu_student?.studentId
      } else if (this.postDetail?.item?.edu_teacher?.teacherId) {
        return userInfo.teacherId === this.postDetail?.edu_teacher?.teacherId
      } else {
        return false
      }
    },
    // 该帖子对应课程的教师
    isCourseTeacher () {
      const teacherId = this.$TOOL.data.get("USER_INFO")?.teacherId;
      return this.postDetail?.edu_course?.teacherId === teacherId
    }
  },
  created() {
    this.postId = this.$route.query.postId || ''
    this.queryComment()
    this.queryPostDetail()
  },
  methods: {
    // 单项评论回复点击时
    handleReplyComment ({commentId, commentContent}) {
      this.toReplyComment.commentContent = commentContent
      this.toReplyComment.commentId = commentId
      this.scrollToTarget()
    },
    // 清空待回复评论的信息
    handleResetComment () {
      this.toReplyComment.commentContent = ''
      this.toReplyComment.commentId = ''
    },
    // 滑动至编辑框
    scrollToTarget() {
      const targetElement = document.getElementById('comment-editor'); // 根据id获取目标元素
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' }); // 平滑滚动到目标位置
      }
    },
    // 提交回复
    submitReply () {
      if (!this.replyCommentContent.length) {
        this.$message({
          type: 'warning',
          message: '回复不能为空'
        })
        return
      }
      this.isCommentDisabled = true
      this.$API.post.comment.reply.post({
        postId: this.postId,
        commentContent: this.replyCommentContent,
        parentId: this.toReplyComment.commentId || undefined
      }).then(() => {
        this.$message({
          type: 'success',
          message: '回复成功'
        })
        this.replyCommentContent = ''
        this.currentPage = 1
        this.handleResetComment()
        this.queryComment()
      }).catch(() => {}).finally(() => {
        this.isCommentDisabled = false
      })
    },
    // 点赞帖子或评论
    handleLike ({ postId, commentId, commentIndex }) {
      // 记录点赞的类型
      const type = postId ? 'post' : 'comment'
      this.$API.post.post.like.post({
        postId,
        commentId
      }).then(() => {
        this.$message({
          type: 'success',
          message: '点赞成功'
        })
        if (type === 'post') {
          this.postDetail.likedNum ++
          this.postDetail.isLiked = 1
        } else {
          console.log(commentIndex)
          this.commentList[commentIndex].likedNum ++
          this.commentList[commentIndex].isLiked = 1
        }
      }).catch(() => {})
    },
    // 点赞帖子
    handleLikePost() {
      this.handleLike({
        postId: this.postId
      })
    },
    // 点赞评论
    handleLikeComment ({ commentId }, commentIndex) {
      this.handleLike({
        commentId,
        commentIndex
      })
    },
    // 删除自己的评论
    async handleDeleteComment ({ commentId }) {
      try {
        await this.$confirm('确定要删除该评论吗？', '提示', { type: 'warning' })
        this.isLoading = true
        await this.$API.post.comment.delete.post({ commentId })
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.queryComment()
      } catch (e) {
        /* empty */
      }
    },
    // 获取评论列表
    queryComment () {
      this.handleResetComment()
      const { currentPage, pageSize } = this.commentPageParam
      const param = {
        currentPage,
        pageSize,
        postId: this.postId
      }
      this.isLoading = true
      this.$API.post.comment.list.get(param).then(({ data: { list, total }}) => {
        this.commentList = list
        this.commentPageParam.total = total
      }).catch(() => {}).finally(() => {
        this.isLoading = false
      })
    },
    // 获取评论列表
    queryPostDetail () {
      this.isLoading = true
      this.$API.post.post.detail.get({
        postId: this.postId
      }).then(({ data }) => {
        this.postDetail = data
      }).catch(() => {}).finally(() => {
        this.isLoading = false
      })
    },
    // 删除帖子
    async handleDeletePost () {
      try {
        await this.$confirm('确定要删除该帖子吗？', '提示', { type: 'warning' })
        this.isLoading = true
        await this.$API.post.post.delete.post({ postId: this.postId })
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.$router.back()
      } catch (e) {
        /* empty */
      } finally {
        this.isLoading = false
      }
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
    .header-right {

    }
  }
}

.main {
  max-width: 1280px !important;
  width: 100%;
  margin: 0 auto;
  background: var(--el-bg-color);
  padding: 0;
  .post-detail {
    padding: 16px 24px;
    .user-box {
      display: flex;
      align-items: center;
      padding-top: 8px;
      .user-avatar {
      }
      .user-info {
        margin-left: 16px;
        .user-name {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        .user-department {
          color: var(--el-text-color-secondary)
        }
      }
    }
    .post-title {
      font-weight: bold;
      font-size: 24px;
      padding: 0 8px;
      margin-top: 24px;
    }
    .title-time-icon {
      padding: 0 8px;
      margin-top: 8px;
      color: var(--el-text-color-secondary);
      .time {
        margin-top: 16px;
        margin-bottom: 8px;
        font-size: 16px;
      }
      .icons {
        display: flex;
        align-items: center;
        .title-icon {
          margin-right: 16px;
          font-size: 16px;
          display: flex;
          align-items: center;
          .text {
            margin-left: 8px;
          }
        }
      }
    }
    .post-content {
      margin-top: 16px;
      padding: 0 8px;
    }
    .like-post {
      display: flex;
      justify-content: center;
    }
  }
  .comment-area {
    padding: 16px 24px;
    .comment-title {
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
      &.reply {
        margin-top: 24px;
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
  }

  .reply-tag {
    margin-top: 16px;
    font-weight: bold;
  }

  .bottom-btn {
    margin: 32px 0 16px 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}


.editor {
  height: 100%;
  margin-top: 16px !important;
}

:deep(.tox-tinymce) {
  //margin-top: 0 !important;
  height: 300px !important;
  //box-shadow: 0px 6px 24px 4px rgba(0, 0, 0, 0.04);
  border-radius: 4px !important;
  overflow: hidden;
}

.pagination {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}

</style>
