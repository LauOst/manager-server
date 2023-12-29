const router = require('koa-router')()
const util = require('./../utils/util')
router.prefix('/dict')


router.get('/directors', async (ctx) => {
    try {
        const list = [
            {
                directorLabel: '冯万事',
                directorValue: '1',
            },
            {
                directorLabel: '刘协',
                directorValue: '2',
            },
            {
                directorLabel: '肖宁彪',
                directorValue: '3',
            }]
        ctx.body = util.success(list)
    }catch (error) {
        ctx.body = util.fail(`查询异常:${error.stack}`)
    }
})

router.get('/status', async (ctx) => {
    try {
        const list = [
            {
                noteLabel: '关闭',
                noteValue: '0',
            },
            {
                noteLabel: '开启',
                noteValue: '1',
            },]
        ctx.body = util.success(list)
    }catch (error) {
        ctx.body = util.fail(`查询异常:${error.stack}`)
    }
})

module.exports = router