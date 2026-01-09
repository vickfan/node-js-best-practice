import Joi from 'joi'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'

import { errorHandler, validation } from './middlewares/index.mjs'
import { healthRouter, testErrorRouter } from './routes/index.mjs'
import { BadRequestError, NotFoundError, logger } from './utils/index.mjs'

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

const getUserSchema = Joi.object({
  id: Joi.string().required(),
})

router.get('/users', validation(getUserSchema, 'query'), async (ctx) => {
  const userId = ctx.query.id
  if (!userId) {
    throw new BadRequestError('User ID is required')
  }

  const user = null
  if (!user) {
    throw new NotFoundError('User not found')
  }

  ctx.body = {
    success: true,
    data: user,
  }
})

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
})

router.post('/users', validation(createUserSchema, 'body'), async (ctx) => {
  const { name, email } = ctx.validated
  logger.info(`Creating user ${name} with email ${email}`)
  ctx.body = {
    success: true,
    name,
    email,
  }
})

app.use(healthRouter.routes())
app.use(testErrorRouter.routes())
app.use(router.routes())
app.use(router.allowedMethods())

export default app
