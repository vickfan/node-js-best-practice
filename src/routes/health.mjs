import Router from 'koa-router'

const router = new Router({ prefix: '/health' })

router.get('/', async (ctx) => {
  ctx.body = {
    success: true,
    message: 'OK',
  }
})

router.get('/ready', async (ctx) => {
  ctx.body = { status: 'ready' }
  ctx.status = 200
})

router.get('/metrics', async (ctx) => {
  ctx.body = { status: 'metrics' }
  ctx.status = 200
})

export default router
