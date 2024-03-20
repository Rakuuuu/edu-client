import http from "@/utils/request";
import config from "@/config";

export default {
  course: {
    list: {
      url: `${config.API_URL}/courseManage/courseList`,
      name: "获取课程列表",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    type: {
      url: `${config.API_URL}/courseManage/getAllCourseType`,
      name: "获取课程类型",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    detail: {
      url: `${config.API_URL}/course/getCourseDetail`,
      name: "获取课程详情",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    choose: {
      url: `${config.API_URL}/course/chooseCourse`,
      name: "学生选课",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    add: {
      url: `${config.API_URL}/course/addCourse`,
      name: "添加课程信息",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    update: {
      url: `${config.API_URL}/course/saveCourse`,
      name: "更新课程信息",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    delete: {
      url: `${config.API_URL}/course/deleteCourse`,
      name: "批量删除课程信息",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    quit: {
      url: `${config.API_URL}/course/quitCourse`,
      name: "学生退课",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    chooseCourseList: {
      url: `${config.API_URL}/course/getChooseCourseList`,
      name: "获取学生选课列表",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    courseStudentList: {
      url: `${config.API_URL}/course/courseStudentList`,
      name: "获取课程所有学生列表",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    queryCourse: {
      url: `${config.API_URL}/course/queryCourse`,
      name: "获取课程列表",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    code: {
      url: `${config.API_URL}/course/generateCourseCode`,
      name: "获取随机课程码",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    deleteChooseInfo: {
      url: `${config.API_URL}/courseManage/removeStudentFromCourse`,
      name: "批量删除课程信息",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    }
  }
}
