import Joi from 'joi'
import Router from 'koa-router'

import { validation, authMiddleware } from '../middlewares/index.mjs'
import {
  BadRequestError,
  NotFoundError,
  ExternalServiceError,
  logger,
} from '../utils/index.mjs'

const router = new Router({ prefix: '/users' })

const getUserSchema = Joi.object({
  id: Joi.string().required(),
})

router.get('/', validation(getUserSchema, 'query'), async (ctx) => {
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
  age: Joi.number().integer().min(0).required(),
})

router.post('/', validation(createUserSchema, 'body'), async (ctx) => {
  const { name, email, age } = ctx.validated
  logger.info(`Creating user ${name} with email ${email}`)
  ctx.body = {
    success: true,
    name,
    email,
    age,
  }
})

router.get('/external/:username', async (ctx) => {
  try {
    const res = await fetch(
      `https://api.github.com/users/${ctx.params.username}`
    )
    if (!res.ok) {
      throw new ExternalServiceError('External service error')
    }
    const data = await res.json()
    ctx.body = { success: true, data }
  } catch (err) {
    ctx.throw(new ExternalServiceError('External service error'))
  }
})

router.get('/profile', authMiddleware, async (ctx) => {
  ctx.body = { success: true, user: ctx.state.user }
})

export default router
