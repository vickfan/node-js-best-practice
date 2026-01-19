// src/middlewares/rateLimit.mjs
import ratelimit from 'koa-ratelimit'

const db = new Map()

export default ratelimit({
  driver: 'memory',
  db,
  duration: 60 * 1000, // 1 分鐘
  max: 5, // 最多 5 次
  errorMessage: {
    success: false,
    error: 'Too many requests, please try again later',
  },
  id: (ctx) => ctx.ip,
  whitelist: (ctx) => ctx.path === '/health',
  headers: true,
})
