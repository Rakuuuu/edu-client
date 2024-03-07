import config from '@/config'
import http from '@/utils/request'

export default {
  post: {
    list: {
      url: `${config.API_URL}/postManage/postList`,
      name: "获取帖子列表",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    detail: {
      url: `${config.API_URL}/postManage/getPostDetail`,
      name: "获取帖子详情",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    save: {
      url: `${config.API_URL}/postManage/savePostDetail`,
      name: "保存帖子详情",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    delete: {
      url: `${config.API_URL}/postManage/deletePost`,
      name: "批量删除帖子",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    }
  },
  comment: {
    list: {
      url: `${config.API_URL}/commentManage/commentList`,
      name: "获取评论列表",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    detail: {
      url: `${config.API_URL}/commentManage/getCommentDetail`,
      name: "获取评论详情",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    delete: {
      url: `${config.API_URL}/commentManage/deleteComment`,
      name: "批量删除评论",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    }
  }
}
