import http from "@/utils/request";
import config from "@/config";

export default {
  file: {
    upload: {
      url: `${config.API_URL}/file/uploadUserFile`,
      name: "上传用户文件",
      post: async function (params) {
        console.log(params, typeof params)
        return await http.post(this.url, params, {
        });
      }
    },
    list: {
      url: `${config.API_URL}/file/getUserFileList`,
      name: "获取用户文件列表",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    download: {
      url: `${config.API_URL}/file/downloadUserFile`,
      name: "下载用户文件",
      get: async function (params) {
        return await http.get(this.url, params, { responseType: 'blob' });
      }
    },
    rename: {
      url: `${config.API_URL}/file/renameUserFile`,
      name: "重命名用户文件",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    delete: {
      url: `${config.API_URL}/file/deleteUserFile`,
      name: "删除用户文件",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    courseFileList: {
      url: `${config.API_URL}/file/getCourseFile`,
      name: "获取课程文件列表",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    addCourseFile: {
      url: `${config.API_URL}/file/addCourseFile`,
      name: "添加课程文件",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    removeCourseFile: {
      url: `${config.API_URL}/file/deleteCourseFile`,
      name: "添加课程文件",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    }
  },
}
