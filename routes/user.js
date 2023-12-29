const router = require('koa-router')()
const util = require('./../utils/util')
const User = require('./../models/userSchema')
const Counter = require('./../models/counterSchema')
router.prefix('/user')

router.get('/list', async (ctx) => {
    const { userId, username, status } = ctx.request.query
    const { page, skipIndex } = util.pager(ctx.request.query)
    let params = {}
    if (userId) params.userId = userId
    if (username) params.username = username
    if (status || status === 0) params.status = status
    try {
        const query = User.find({ ...params, status: { $ne: 2} },{ _id: 0, password: 0 })
        const list = await query.skip(skipIndex).limit(page.pageSize)
        const total = await User.countDocuments(params)
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

// 用户删除
router.post('/delete', async (ctx) => {
    const { userId } = ctx.request.body
    const res = await User.updateMany({ userId: { $in: userId } }, { status: 2 })
    // console.log('res', res)
    if (res.modifiedCount) {
        ctx.body = util.success(res, `删除${res.modifiedCount}条`)
        return
    }
    ctx.body = util.fail('删除失败')
})

// 用户新增
router.post('/add', async (ctx) => {
    const { username, password, sex} = ctx.request.body
    if (!username|| !password || !sex) {
        ctx.body = util.fail('参数错误', util.CODE.PARAM_ERROR)
        return;
    }
    const res = await User.findOne({ $or: [ { username } ] }, ' username ')
    if (res) {
        ctx.body = util.fail(`系统监测到有重复的用户，信息如下：${ username }`)
    } else {
        const doc = await Counter.findOneAndUpdate({ _id: 'userId' }, { $inc: { sequence_value: 1 } }, { new: true })
        try {
            const user = new User({
                userId: doc.sequence_value,
                username,
                password,
                sex
            })
            user.save()
            ctx.body = util.success('', '创建成功')
        }catch (error) {
            ctx.body = util.fail(error.stack, '用户创建失败');
        }
    }


})

// 用户编辑
router.post('/edit', async (ctx) => {
    const { userId, sex, roleList } = ctx.request.body
    if (!sex) {
        ctx.body = util.fail('性别不能为空', util.CODE.PARAM_ERROR)
        return;
    }
    try {
        await User.findOneAndUpdate({ userId }, { sex, roleList })
        ctx.body = util.success({}, '更新成功')
    }catch (error) {
        ctx.body = util.fail(error.stack, '更新失败')
    }
})


// 用户编辑
router.post('/status', async (ctx) => {
    const { userId, status } = ctx.request.body
    if (!userId) {
        ctx.body = util.fail('用户ID不能为空', util.CODE.PARAM_ERROR)
        return;
    }
    try {
        await User.findOneAndUpdate({ userId }, { status })
        ctx.body = util.success({}, '更新成功')
    }catch (error) {
        ctx.body = util.fail(error.stack, '更新失败')
    }
})

module.exports = router
