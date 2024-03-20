<template>
  <div class="container">
    <div v-if="postList.length">
      <el-card
        class="card"
        v-for="item in postList"
        :key="`${item.postId}${item.postTitle}`"
        shadow="hover"
        @click="$router.push({ name: 'postDetail', query: { postId: item.postId }})"
      >
        <template #default>
          <div class="top">
            <div class="left">
              {{ item.postTitle }}
            </div>
            <div class="right">
              {{ item.courseName }}
            </div>
          </div>
          <div class="middle">
            {{ item.postContent.replace(/<[^>]*>/g, '')  }}
          </div>
          <el-divider direction="horizontal"/>
          <div class="bottom">
            <div class="bottom-left">
              <div> {{ item.studentName || `${item.teacherName}（教师）` }} </div>
              <div> {{ item.createdAt }}</div>
            </div>
            <div class="bottom-right">
              <div class="visit-count">
                <el-icon> <el-icon-view/> </el-icon>
                <div class="text">{{ item.postVisitCounts}}</div>
              </div>
              <div class="comment-count">
                <el-icon><el-icon-chat-dot-round/></el-icon>
                <div class="text">{{ item.commentCount}}</div>
              </div>
            </div>
          </div>
        </template>
      </el-card>
    </div>
    <div v-else>
      <el-empty/>
    </div>
  </div>
</template>

<script>
export default {
  name: "postList",
  props: {
    postList: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<style scoped lang="scss">
:deep(.el-divider) {
  margin: 16px 0 !important;
}
.container {
  margin-top: 16px !important;
}
.card {
  margin-bottom: 8px;
  &:hover {
    cursor: pointer;
  }
}
 .top {
   margin-bottom: 10px;
   position: relative;
   padding-left: 16px;
   display: flex;
   align-items: center;
   justify-content: space-between;
   .left {
     font-size: 20px;
     font-weight: bold;
     margin-right: 8px;
     overflow: hidden;
     white-space: nowrap;
     text-overflow: ellipsis;
   }
   .right {
     font-weight: bold;
   }
   &::before {
     content: '';
     height: 8px;
     width: 8px;
     border-radius: 50%;
     left: 0;
     top: 50%;
     transform: translate(0, -50%);
     position: absolute;
     background: var(--el-color-primary);
   }
 }
  .middle {
    margin-left: 16px;
    margin-bottom: 10px;
    font-size: 16px;
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .bottom {
    margin-left: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    //padding-top: 10px;
    color: var(--el-text-color-secondary);
    .bottom-left {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .bottom-right {
      display: flex;
      align-items: center;
      font-size: 16px;
      flex-shrink: 0;
      .comment-count, .visit-count  {
        margin-left: 12px;
        display: flex;
        align-items: center;
        .text {
          margin-left: 4px;
        }
      }
    }
  }
</style>
