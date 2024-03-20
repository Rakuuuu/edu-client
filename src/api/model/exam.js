import http from "@/utils/request";
import config from "@/config";

export default {
  question: {
    list: {
      url: `${config.API_URL}/exam/getQuestionList`,
      name: "获取课程题目列表",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    detail: {
      url: `${config.API_URL}/exam/getQuestionDetail`,
      name: "获取课程题目列表",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
  },
}
