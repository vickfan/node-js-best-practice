// tests/middlewares/error.test.mjs
import { describe, test, expect, beforeEach } from '@jest/globals'
import Koa from 'koa'
import request from 'supertest'

import errorHandler from '../../src/middlewares/error.mjs'

describe('Error Middleware #middleware #unit', () => {
  let app

  beforeEach(() => {
    app = new Koa()
    app.use(errorHandler)

    app.use(async (ctx) => {
      ctx.throw(404, 'Custom Not Found')
    })
  })

  test('should catch and format thrown error #unit', async () => {
    const response = await request(app.callback()).get('/anything')

    expect(response.status).toBe(404)
    expect(response.body.success).toBe(false)
    expect(response.body.error.message).toBe('Custom Not Found')
  })
})
