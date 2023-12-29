const router = require('koa-router')()
const util = require('./../utils/util')
const Note = require('../models/noteSchema')
router.prefix('/note')

router.get('/list', async (ctx) => {
    const { ...params } = ctx.request.body;
    let rootList = await Note.find(params) || []
    ctx.body = util.success(rootList);
})

router.post('/add', async (ctx) => {
    const { _id, ...params } = ctx.request.body;
    try {
        await Note.create(params)
        ctx.body = util.success('', '创建成功');
    }catch (e) {
        ctx.body = util.fail(e.stack);
    }
})

router.post('/edit', async (ctx) => {
    const { _id, ...params } = ctx.request.body;
    try {
        params.updateTime = new Date()
        await Note.findByIdAndUpdate(_id, params)
        ctx.body = util.success('', '编辑成功');
    }catch (e) {
        ctx.body = util.fail(e.stack);
    }
})

router.post('/delete', async (ctx) => {
    const { _id } = ctx.request.body;
    try {
        res = await Note.findByIdAndRemove(_id)
        await Note.deleteMany({parentId: { $all: [_id] } })
        ctx.body = util.success('', '删除成功');
    }catch (e) {
        ctx.body = util.fail(e.stack);
    }
})

module.exports = router