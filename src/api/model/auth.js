import config from "@/config"
import http from "@/utils/request"

export default {
  login: {
    url: `${config.API_URL}/login`,
    name: "登录并获取TOKEN",
    post: async function (data = {}) {
      return await http.post(this.url, data);
    }
  }
}
