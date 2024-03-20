import config from '@/config'
import http from '@/utils/request'

export default {
  post: {
    courseList: {
      url: `${config.API_URL}/post/getCoursePost`,
      name: "获取指定课程的帖子列表",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    joinedList: {
      url: `${config.API_URL}/post/getJoinedCoursePost`,
      name: "获取已选课程的帖子列表",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    list: {
      url: `${config.API_URL}/post/getAllPost`,
      name: "获取我的所有帖子列表",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    detail: {
      url: `${config.API_URL}/post/getPostDetail`,
      name: "获取帖子详情",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    add: {
      url: `${config.API_URL}/post/addPost`,
      name: "新增帖子",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    save: {
      url: `${config.API_URL}/post/savePost`,
      name: "保存帖子",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    delete: {
      url: `${config.API_URL}/post/deletePost`,
      name: "删除帖子",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    like: {
      url: `${config.API_URL}/post/likePostComment`,
      name: "点赞帖子或评论",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    }
  },
  comment: {
    list: {
      url: `${config.API_URL}/post/getPostComment`,
      name: "获取帖子评论列表",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    reply: {
      url: `${config.API_URL}/post/replyPost`,
      name: "回复评论",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    delete: {
      url: `${config.API_URL}/post/deleteComment`,
      name: "删除评论",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    }
  }
}
