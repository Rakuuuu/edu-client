<template>
  <div class="main">
    <div v-if="commentList.length">
      <el-card
        v-for="(item, index) in commentList"
        :key="item.commentContent"
        class="card"
        shadow="hover"
      >
        <div class="user-box">
          <div class="inner">
            <el-avatar class="user-avatar"></el-avatar>
            <div class="user-info">
              <div class="user-name">{{ item?.edu_student?.studentName || item?.edu_teacher?.teacherName }}</div>
              <div class="user-department">{{
                  item?.edu_student?.edu_speciality?.edu_department?.departmentName ||
                  item?.edu_teacher?.edu_speciality?.edu_department?.departmentName
                }} - {{
                  item?.edu_student?.edu_speciality?.specialityName ||
                  item?.edu_teacher?.edu_speciality?.specialityName
                }}</div>
            </div>
          </div>
          <el-button
            plain
            type="danger"
            class="delete-btn"
            @click="toDelete(item, index)"
            v-if="isSelfComment(item)"
          >
            <el-icon><el-icon-delete/></el-icon>
          </el-button>
        </div>
        <div class="content">
          <div class="parent-comment" v-if="item.parentComment">
            <div class="response">回复
              <b>
                {{ item?.parentComment?.edu_student?.studentName || `${item?.parentComment?.edu_teacher?.teacherName}（教师）` }}</b> 的评论：
            </div>
            {{ item?.parentComment?.commentContent.replace(/<[^>]*>/g, '') }}
          </div>
          <div class="comment">
            <div v-html="item.commentContent"></div>
          </div>
        </div>
        <el-divider/>
        <div class="footer">
          <div class="left">
            {{ item.createdAt }}
          </div>
          <div class="right">
            <div class="reply-btn">
              <el-button size="small" @click="toReply(item)"><el-icon><el-icon-position/></el-icon>回复</el-button>
              <el-button v-if="item.isLiked !== 0" disabled size="small"><el-icon color="#ff9047"><el-icon-star-filled/></el-icon>已点赞（{{item.likedNum}}）</el-button>
              <el-button v-else size="small" @click="likeComment(item, index)"><el-icon><el-icon-star/></el-icon>点赞（{{item.likedNum}}）</el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <el-empty v-else description="暂无评论"/>
  </div>
</template>

<script>
export default {
  name: "commentList",
  emits: [
    'reply',
    'likeComment',
    'deleteItem'
  ],
  props: {
    commentList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    // 判断是否是自己的评论
    isSelfComment (item) {
      const userInfo = this.$TOOL.data.get("USER_INFO");
      if (item?.edu_student?.studentId) {
        return userInfo.studentId === item?.edu_student?.studentId
      } else if (item?.item?.edu_teacher?.teacherId) {
        return userInfo.teacherId === item?.edu_teacher?.teacherId
      }
    },
    // 点击回复按钮事件
    toReply (item) {
      this.$emit('reply', item)
    },
    // 点击点赞按钮事件
    likeComment (item, index) {
      this.$emit('likeComment', item, index)
    },
    // 点击删除按钮事件
    toDelete (item, index) {
      this.$emit('deleteItem', item, index)
    }
  }
}
</script>

<style scoped lang="scss">
:deep(.el-divider) {
  margin: 12px 0 !important;
}
  .main {
    margin: 16px 0 !important;
    .card {
      margin: 32px 0;
      &:nth-child(1) {
        margin-top: 0 !important;
      }
      :deep(.el-card__body) {
        padding: 8px !important;
      }
    }
    .user-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;
      .inner {
        display: flex;
        align-items: center;
        justify-content: start;
      }
      .user-avatar {
      }
      .user-info {
        margin-left: 8px;
        .user-name {
          font-size: 16px;
          margin-top: 4px;
        }
        .user-department {
          color: var(--el-text-color-secondary)
        }
      }
      .delete-btn {
        justify-items: end;
        margin-right: 4px;
      }
    }
    .content {
      //padding-left: 16px;
      padding-top: 16px;
      padding-bottom: 16px;
      box-sizing: border-box;
      font-size: 16px;
      .parent-comment {
        padding: 16px;
        background: var(--el-bg-color-page);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 640px;
        margin-bottom: 16px !important;
        border-radius: 4px;
        .response {
          margin-bottom: 8px;
        }
      }
      .comment {
        margin-left: 8px;
      }
    }
    .footer {
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 8px;
      .left {
        margin-bottom: 2px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .right {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        margin-left: 8px;
      }
    }
  }
</style>
