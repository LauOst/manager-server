const router = require('koa-router')()
const util = require('./../utils/util')
router.prefix('/menu')

router.get('/list',  (ctx) => {
let menu = [{
    "path": "/about",
    "redirect": "noRedirect",
    "component": "Layout",
    "children": [{
        "path": '/about',
        "name": 'About',
        "component": "about/index",
        "meta": {
            "title": 'About',
            "icon": 'dashboard',
            "hidden": false,
            "noCache": false
        },
    }]
},{
    "path": "/system",
    "name": "System",
    "redirect": "noRedirect",
    "component": "Layout",
    "meta": {
        "icon": "system",
        "title": "系统管理",
        "hidden": false,
    },
    "children": [{
        "path": "user",
        "name": "User",
        "component": "system/user/index",
        "meta": {
            "icon": "peoples",
            "title": "用户管理",
            "hidden": false,
        }
    },
        {
            "path": "/role",
            "name": "Role",
            "component": "system/role/index",
            "meta": {
                "icon": "user",
                "title": "角色管理",
                "hidden": false,
            }
        }
    ]
}]

    ctx.body = util.success(menu)
})

module.exports = router
