import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import koaHelmet from 'koa-helmet'
import Router from 'koa-router'
import session from 'koa-session'

import { connectRedis, sessionConfig } from './config/redis.mjs'
import {
  errorHandler,
  transactionId,
  envGuard,
  rateLimit,
} from './middlewares/index.mjs'
import {
  healthRouter,
  testErrorRouter,
  usersRouter,
  sessionTestRouter,
} from './routes/index.mjs'
import { logger } from './utils/index.mjs'

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception! Shutting down...', {
    message: err.message,
    stack: err.stack,
  })
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled rejection at ${promise}, reason: ${reason}`)
})

const app = new Koa()
const router = new Router()

if (process.env.NODE_ENV === 'production') {
  app.proxy = true
}

await connectRedis()

app.use(envGuard)
app.use(transactionId)
app.use(rateLimit)
// 加 session middleware（放喺 transactionId 之後，helmet 之前）
app.keys = [process.env.SESSION_SECRET || 'your-secret-key-change-me'] // 必須！用來簽名 cookie
app.use(errorHandler)
app.use(
  koaHelmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
      },
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: {
      maxAge: 31536000, // 1 年
      includeSubDomains: true,
      preload: true,
    },
  })
)
app.use(session(sessionConfig, app))

app.use(bodyParser())

app.use(usersRouter.routes())
app.use(healthRouter.routes())
app.use(testErrorRouter.routes())
app.use(router.routes())
app.use(sessionTestRouter.routes())
app.use(router.allowedMethods())

export default app
