import http from "@/utils/request";
import config from "@/config";

export default {
  teacher: {
    register: {
      url: `${config.API_URL}/user/registerTeacher`,
      name: "教师注册",
      post: async function (params) {
        return await http.post(this.url, params);
      },
    },
    login: {
      url: `${config.API_URL}/user/loginTeacher`,
      name: "教师登录",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
  },
  student: {
    register: {
      url: `${config.API_URL}/user/registerStudent`,
      name: "学生注册",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
  	login: {
      url: `${config.API_URL}/user/loginStudent`,
      name: "学生登录",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    }
  }
}
