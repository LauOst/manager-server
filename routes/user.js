const router = require('koa-router')()
const util = require('./../utils/util')
const User = require('./../models/userSchema')
router.prefix('/user')

router.get('/list', async (ctx) => {
    const { userId, username, status } = ctx.request.query
    const { page, skipIndex } = util.pager(ctx.request.query)
    let params = {}
    if (userId) params.userId = userId
    if (username) params.username = username
    if (status || status === 0) params.status = status
    try {
        const query = User.find(params,{ password: 0 })
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

module.exports = router
