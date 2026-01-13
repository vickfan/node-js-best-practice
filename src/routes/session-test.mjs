// src/routes/session-test.mjs
import Router from 'koa-router'

const router = new Router({ prefix: '/session' })

router.get('/set', async (ctx) => {
  ctx.session.user = {
    id: 123,
    name: 'Test User',
    role: 'admin',
  }
  ctx.body = { success: true, message: 'Session set!' }
})

router.get('/get', async (ctx) => {
  if (ctx.session.user) {
    ctx.body = { success: true, user: ctx.session.user }
  } else {
    ctx.body = { success: false, message: 'No session found' }
  }
})

router.get('/clear', async (ctx) => {
  ctx.session = null
  ctx.body = { success: true, message: 'Session cleared' }
})

export default router
