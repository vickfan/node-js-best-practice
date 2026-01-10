import { describe, test, expect, beforeEach } from '@jest/globals'
import Joi from 'joi'
import Koa from 'koa'
import request from 'supertest'

import errorHandler from '../../src/middlewares/error.mjs'
import validation from '../../src/middlewares/validation.mjs'

describe('Validation Middleware #middleware #unit', () => {
  let app
  beforeEach(() => {
    app = new Koa()
    app.use(errorHandler)
  })

  test('should return 400 if id is not provided in query', async () => {
    const requireIdAndNameSchema = Joi.object({
      id: Joi.string().required(),
      name: Joi.string().required(),
    })
    app.use(validation(requireIdAndNameSchema, 'query'))
    const response = await request(app.callback()).get('/users?name=John')

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error.message).toContain(
      'Validation error: "id" is required'
    )
  })

  test('should return 400 if id is not provided in params', async () => {
    const requireIdSchema = Joi.object({
      id: Joi.string().required(),
    })
    app.use(validation(requireIdSchema, 'params'))
    const response = await request(app.callback()).get('/users')

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error.message).toContain(
      'Validation error: "id" is required'
    )
  })

  test('should return 400 if name is not provided in body', async () => {
    const requireNameSchema = Joi.object({
      name: Joi.string().required(),
    })
    app.use(validation(requireNameSchema, 'body'))
    const response = await request(app.callback()).post('/users').send({
      email: 'john.doe@example.com',
    })
    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error.message).toContain(
      'Validation error: "name" is required'
    )
  })
})
