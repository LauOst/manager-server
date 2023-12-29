const Koa = require('koa')
const koaJwt = require('koa-jwt')
const util = require('./utils/util')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const log4js = require('./utils/log4j')

const index = require('./routes/index')
const user = require('./routes/user')
const menu = require('./routes/menu')
const note = require('./routes/note')
const role = require('./routes/role')
const dict = require('./routes/dict')
const todo = require('./routes/todo')
const router = require('koa-router')()

// error handler
onerror(app)
require('./config/db')


// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  log4js.info(`get params:${JSON.stringify(ctx.request.query)}`)
  log4js.info(`post params:${JSON.stringify(ctx.request.body)}`)
  await next().catch((err) => {
    console.log('err=>>', err)
    if (err.status === 401) {
      ctx.status = 200
      ctx.body = util.fail('Token认证失败', util.CODE.AUTH_ERROR)
    } else {
      throw err
    }
  })
})

app.use(koaJwt({ secret: 'note' }).unless({
  path: [/^\/api\/login/, /^\/api\/logout/]
}))


// routes
router.prefix('/api')
router.use(index.routes(), index.allowedMethods())
router.use(user.routes(), user.allowedMethods())
router.use(menu.routes(), menu.allowedMethods())
router.use(note.routes(), note.allowedMethods())
router.use(role.routes(), role.allowedMethods())
router.use(dict.routes(), dict.allowedMethods())
router.use(todo.routes(), todo.allowedMethods())
app.use(router.routes(), router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  log4js.error(`${err.stack}`)
});

module.exports = app
