import Router from 'koa-router'

const router = new Router({ prefix: '/health' })

router.get('/', async (ctx) => {
  ctx.body = {
    success: true,
    message: 'OK',
  }
})

export default router
