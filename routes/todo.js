const router = require('koa-router')()
const util = require('./../utils/util')
const Todo = require('../models/todoSchema')
router.prefix('/todo')

router.get('/list', async (ctx) => {
    const { ...params } = ctx.request.body;
    let todoList = await Todo.find(params) || []
    ctx.body = util.success(todoList);
})

router.post('/edit', async (ctx) => {
    const { _id, ...params } = ctx.request.body;
    try {
        await Todo.findByIdAndUpdate(_id, params)
        ctx.body = util.success('', '编辑成功');
    }catch (e) {
        ctx.body = util.fail(e.stack);
    }
})

module.exports = router