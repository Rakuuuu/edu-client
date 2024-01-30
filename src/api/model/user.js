import http from "@/utils/request";
import config from "@/config";

export default {
  teacher: {
    list: {
      url: `${config.API_URL}/teacherManage/teacherList`,
      name: "获取教师列表",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    detail: {
      url: `${config.API_URL}/teacherManage/getTeacherDetail`,
      name: "获取教师详情",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    add: {
      url: `${config.API_URL}/teacherManage/addTeacher`,
      name: "添加教师信息",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    update: {
      url: `${config.API_URL}/teacherManage/updateTeacher`,
      name: "更新教师信息",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    delete: {
      url: `${config.API_URL}/teacherManage/deleteTeachers`,
      name: "批量删除教师",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    }
  }
}
