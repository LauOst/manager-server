const router = require('koa-router')()
const util = require('./../utils/util')
const Role = require('./../models/roleSchema')
router.prefix('/role')

router.get('/allList', async (ctx) => {
    try {
        const list = await Role.find({}, " _id, roleName ")
        ctx.body = util.success(list)
    }catch (error) {
        ctx.body = util.fail(`查询异常:${error.stack}`)
    }
})

router.get('/list', async (ctx) => {
    const {  roleName } = ctx.request.query
    const { page, skipIndex } = util.pager(ctx.request.query)
    let params = {}
    if (roleName) params.roleName = roleName
    try {
        const query = Role.find(params)
        const list = await query.skip(skipIndex).limit(page.pageSize)
        const total = await Role.countDocuments(params)
        ctx.body = util.success({
            page: {
                ...page,
                total
            },
            list
        })
    }catch (error) {
        ctx.body = util.fail(`查询异常:${error.stack}`)
    }
})

router.post('/add', async (ctx) => {
    const {  roleName, remark } = ctx.request.body
    try {
        const  res = await Role.create({ roleName, remark })
        ctx.body = util.success(res, '创建成功')
    } catch (e) {
        ctx.body = util.fail(`创建失败`)
    }

})

router.post('/edit', async (ctx) => {
    const { _id, roleName, remark } = ctx.request.body
    if (!roleName) {
        ctx.body = util.fail('角色名称不能为空', util.CODE.PARAM_ERROR)
        return;
    }
    try {
        let params = { roleName, remark }
        params.update = new Date()
        const  res = await Role.findByIdAndUpdate(_id, params)
        ctx.body = util.success(res, '编辑成功')
    } catch (e) {
        ctx.body = util.fail(`编辑失败`)
    }

})

router.post('/delete', async (ctx) => {
    const { _id } = ctx.request.body
    try {
        const  res = await Role.findByIdAndRemove(_id)
        ctx.body = util.success(res, '删除成功')
    } catch (e) {
        ctx.body = util.fail(`删除失败`)
    }

})

router.post('/update/permission', async (ctx) => {
    const { _id, permissionId } = ctx.request.body

    try {
        let params = { permissionId, update: new Date() }
        const res = await Role.findByIdAndUpdate(_id, params)
        console.log('res==>', res)
        ctx.body = util.success('', '权限设置成功')
    } catch (e) {
        ctx.body = util.fail(`权限设置失败`)
    }
})

module.exports = router