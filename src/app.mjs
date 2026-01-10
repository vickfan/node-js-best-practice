import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'

import { errorHandler } from './middlewares/index.mjs'
import { healthRouter, testErrorRouter, usersRouter } from './routes/index.mjs'
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

app.use(errorHandler)

app.use(bodyParser())

app.use(usersRouter.routes())
app.use(healthRouter.routes())
app.use(testErrorRouter.routes())
app.use(router.routes())
app.use(router.allowedMethods())

export default app
