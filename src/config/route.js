// 静态路由配置
// 书写格式与动态路由格式一致，全部经由框架统一转换
// 比较动态路由在meta中多加入了role角色权限，为数组类型。一个菜单是否有权限显示，取决于它以及后代菜单是否有权限。
// routes 显示在左侧菜单中的路由(显示顺序在动态路由之前)
// 示例如下

const routes = [
  {
    name: "index",
    path: "/index",
    component: "index/index",
    meta: {
      icon: "el-icon-home-filled",
      title: "首页",
      cache: true
    }
  },
  {
    name: "course",
    path: "/course/index",
    component: "course/index/index",
    meta: {
      icon: "el-icon-histogram",
      title: "课程"
    },
  },
  {
    name: "courseQuery",
    path: "/course/query",
    component: "course/query/index",
    meta: {
      title: "查找课程",
      hidden: true,
      cache: true
    }
  },
  {
    name: "courseEdit",
    path: "/course/edit",
    component: "course/edit/index",
    meta: {
      title: "课程编辑",
      hidden: true,
      fullpage: true
    }
  },
  {
    name: "courseDetail",
    path: "/course/detail",
    component: "course/detail/index",
    meta: {
      title: "课程详情",
      hidden: true,
      fullpage: true
    }
  },
  {
    name: "courseQuery",
    path: "/course/query",
    component: "course/query/index",
    meta: {
      title: "查找课程",
      hidden: true,
      cache: true
    }
  },
  {
    name: "post",
    path: "/post/index",
    component: "post/index/index",
    meta: {
      title: "帖子",
      icon: "el-icon-flag",
      cache: true
    }
  },
  {
    name: "postQuery",
    path: "/post/query",
    component: "post/query/index",
    meta: {
      title: "查找帖子",
      hidden: true,
      cache: true
    }
  },
  {
    name: "postDetail",
    path: "/post/detail",
    component: "post/detail/index",
    meta: {
      title: "帖子详情",
      hidden: true,
      fullpage: true
    }
  },
  {
    name: "postEdit",
    path: "/post/edit",
    component: "post/edit/index",
    meta: {
      title: "帖子编辑",
      hidden: true,
      fullpage: true
    }
  },
  {
    name: "question",
    path: "/question/index",
    component: "question/index/index",
    meta: {
      title: "题目",
      icon: "el-icon-list",
      role: ['TEACHER'],
      cache: true
    }
  },
  {
    name: "questionDetail",
    path: "/question/detail",
    component: "question/detail/index",
    meta: {
      title: "题目详情",
      icon: "el-icon-list",
      role: ['TEACHER'],
      hidden: true,
      fullpage: true
    }
  },
  {
    name: "file",
    path: "/file/index",
    component: "file/index/index",
    meta: {
      title: "文件",
      icon: "el-icon-menu",
      cache: true
    }
  },
  {
    name: "fileUpload",
    path: "/file/upload",
    component: "file/upload/index",
    meta: {
      title: "文件上传",
      hidden: true,
      fullpage: true
    }
  },
]

export default routes;
