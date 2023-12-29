const router = require('koa-router')()
const util = require('./../utils/util')
const Menu = require('../models/menuSchema')
const Role = require('../models/roleSchema')
const {verify} = require("jsonwebtoken");
router.prefix('/menu')

router.get('/lists', async (ctx) => {
    const { ...params } = ctx.request.body;
    let rootList = await Menu.find(params) || []
    ctx.body = util.success(rootList);
})
router.get('/list/tree', async (ctx) => {
    const { ...params } = ctx.request.body;
    let rootList = await Menu.find(params, '_id menuName parentId children') || []
    const permissionList = getTreeMenu(rootList, '0', [])
    ctx.body = util.success(permissionList);
})

const getTreeMenu = (rootList, id, list) => {
    for (let i = 0; i < rootList.length; i++) {
        let item = {
            id: rootList[i]._id,
            parentId: rootList[i].parentId,
            label: rootList[i].menuName,
            children: rootList[i].children,
        }
        if (String(item.parentId) === String(id)) {
            list.push(item)
        }
    }
    list.map(item => {
        getTreeMenu(rootList, item.id, item.children)
        if (item.children.length === 0) {
            delete item.children;
        }
    })
   return list
}

router.post('/add', async (ctx) => {
    const { _id, ...params } = ctx.request.body;
    try {
        await Menu.create(params)
        ctx.body = util.success('', '创建成功');
    }catch (e) {
        ctx.body = util.fail(e.stack);
    }
})

router.post('/edit', async (ctx) => {
    const { _id, ...params } = ctx.request.body;
    console.log('id', _id)
    try {
        params.updateTime = new Date()
        await Menu.findByIdAndUpdate(_id, params)
        ctx.body = util.success('', '编辑成功');
    }catch (e) {
        ctx.body = util.fail(e.stack);
    }
})

router.post('/delete', async (ctx) => {
    const { _id } = ctx.request.body;
    try {
        res = await Menu.findByIdAndRemove(_id)
        await Menu.deleteMany({parentId: { $all: [_id] } })
        ctx.body = util.success('', '删除成功');
    }catch (e) {
        ctx.body = util.fail(e.stack);
    }
})

router.get('/list',  async (ctx) => {
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
        "path": "/user",
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
        },
        {
            "path": "/menu",
            "name": "Menu",
            "component": "system/menu/index",
            "meta": {
                "icon": "user",
                "title": "菜单管理",
                "hidden": false,
            }
        }
    ]
},{
    "path": "/project",
    "name": "Project",
    "redirect": "noRedirect",
    "component": "Layout",
    "meta": {
        "icon": "system",
        "title": "项目管理",
        "hidden": false,
    },
    "children": [{
        "path": "/note",
        "name": "Note",
        "component": "project/note/index",
        "meta": {
            "icon": "peoples",
            "title": "项目记录",
            "hidden": false,
        },
    },
        {
            "path": "/note/detail/:id(\\d+)",
            "name": "Detail",
            "component": "project/note/detail",
            "meta": {
                "title": "项目详情",
                "hidden": true,
            },
        },
        {
            "path": "/file",
            "name": "File",
            "component": "project/file/index",
            "meta": {
                "icon": "user",
                "title": "文件管理",
                "hidden": false,
            }
        }
    ]
}]

    ctx.body = util.success(menu)
})


router.get('/router/list',  async (ctx) => {
    const token = ctx.headers.authorization

    let payload = await verify(token.split(' ')[1], 'note')
    console.log('payload', payload)
    let menuList = await getMenuList(payload.data.roles, payload.data.roleList)

    ctx.body = util.success(menuList)
})

getMenuList = async (userRole, roleKeys) => {
    let rootList = ''
    console.log('userRole', userRole)
    rootList = await Role.find({_id: { $in: roleKeys } })
    // if (userRole.includes('admin')) {
    //     rootList = await Menu.find({}) || []
    // } else {
    //
    // }
    return rootList
}
module.exports = router
