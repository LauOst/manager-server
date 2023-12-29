const router = require('koa-router')()
const User = require('./../models/userSchema')
const util = require('./../utils/util')
const { sign, verify } = require('jsonwebtoken')

router.prefix('/')

router.post('/login', async (ctx) => {
    try {
        const { username, password} = ctx.request.body
        const res = await User.findOne({
            username, password
        })
        const token = sign({
            data: res
        }, 'note', {expiresIn: '5h'})

        if (res) {
            ctx.body = util.success({access_token: token})
        } else {
            ctx.body = util.fail("账号密码错误")
        }
    }catch (error) {
        ctx.body = util.fail(error)
    }
})

router.post('/logout', async (ctx) => {
    try {
        ctx.body = util.success()
    }catch (error) {
        ctx.body = util.fail(error)
    }
})

router.get('/userInfo',  async (ctx) => {
    const token = ctx.headers.authorization
    let payload
    if (token) {
        payload = await verify(token.split(' ')[1], 'note')
        ctx.body = util.success({...payload })
    } else {
        ctx.body = util.fail("token error")
    }
})

module.exports = router
