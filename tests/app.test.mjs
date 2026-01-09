import { describe, test, expect } from '@jest/globals'
import request from 'supertest'

import app from '../src/app.mjs'

describe('Application Health & Basic Routes', () => {
  test('should return 200 OK when calling health check endpoint', async () => {
    const expectedStatus = 200

    const response = await request(app.callback()).get('/health')

    expect(response.status).toBe(expectedStatus)
    expect(response.body).toEqual({ success: true, message: 'OK' })
  })

  test('should return 404 when calling non-existing route', async () => {
    const response = await request(app.callback()).get('/non-exist-page-123')

    expect(response.status).toBe(404)
    expect(response.body.success).toBe(false)
    expect(response.body.error.message).toContain('Not Found')
  })

  test('should return 400 for bad request when user id is not provided then return BadRequestError', async () => {
    const response = await request(app.callback()).get('/users')

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error.message).toContain(
      'Validation error: "id" is required'
    )
  })

  test('should return 404 for non-existing user then return NotFoundError', async () => {
    const response = await request(app.callback()).get('/users?id=123')

    expect(response.status).toBe(404)
    expect(response.body.success).toBe(false)
    expect(response.body.error.message).toContain('User not found')
  })

  test('should return 200 for posting a new user then return the new user', async () => {
    const response = await request(app.callback()).post('/users').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
    })

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.name).toBe('John Doe')
    expect(response.body.email).toBe('john.doe@example.com')
  })

  test('should return 400 for bad request when user name is not provided', async () => {
    const response = await request(app.callback()).post('/users').send({
      email: 'john.doe@example.com',
    })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error.message).toContain(
      'Validation error: "name" is required'
    )
  })

  test('should return 400 for bad request when user email is not provided', async () => {
    const response = await request(app.callback()).post('/users').send({
      name: 'John Doe',
    })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error.message).toContain(
      'Validation error: "email" is required'
    )
  })

  test('should return 400 for bad request when user email is not a valid email', async () => {
    const response = await request(app.callback()).post('/users').send({
      name: 'John Doe',
      email: 'john.doe.example.com',
    })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error.message).toContain(
      'Validation error: "email" must be a valid email'
    )
  })
})
