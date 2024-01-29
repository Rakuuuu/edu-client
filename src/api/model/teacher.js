import http from "@/utils/request";

export default {
    list: {
        url: `/api/admin/teacherManage/teacherList`,
        name: "获取教师列表",
        get: async function (params) {
            return await http.get(this.url, params);
        }
    }
}
