import http from "@/utils/request";
import config from "@/config";

export default {
  department: {
    list: {
      url: `${config.API_URL}/departmentManage/departmentList`,
      name: "获取学院列表",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    detail: {
      url: `${config.API_URL}/departmentManage/departmentDetail`,
      name: "获取学院详情",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    update: {
      url: `${config.API_URL}/departmentManage/updateDepartment`,
      name: "更新学院信息",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    }
  },
  speciality: {
    list: {
      url: `${config.API_URL}/specialityManage/specialityList`,
      name: "获取专业列表",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    detail: {
      url: `${config.API_URL}/specialityManage/specialityDetail`,
      name: "获取专业详情",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    all: {
      url: `${config.API_URL}/department/getAllSpeciality`,
      name: "依据学院获取所有专业",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    update: {
      url: `${config.API_URL}/specialityManage/updateSpeciality`,
      name: "更新专业信息",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    }
  },
}
