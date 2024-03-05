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
    }
  }
}
