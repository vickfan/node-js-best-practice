import { describe, test, expect } from '@jest/globals'
import request from 'supertest'

import app from '../src/app.mjs'

describe('User API Full Coverage #integration #users', () => {
  test('should create user and return 201 when all fields are valid #happy #create', async () => {
    const payload = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      age: 25,
    }
    const response = await request(app.callback()).post('/users').send(payload)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.name).toBe(payload.name)
    expect(response.body.email).toBe(payload.email)
    expect(response.body.age).toBe(payload.age)
  })

  test('should return 400 for bad request when name is not provided #error #create', async () => {
    const payload = {
      email: 'john.doe@example.com',
      age: 25,
    }
    const response = await request(app.callback()).post('/users').send(payload)

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

  test('should return 400 for bad request when the name is an empty string', async () => {
    const payload = {
      name: '',
      email: 'john.doe@example.com',
      age: 25,
    }
    const response = await request(app.callback()).post('/users').send(payload)

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error.message).toContain(
      'Validation error: "name" is not allowed to be empty'
    )
  })

  test('should return 400 for bad request when the age is a negative number', async () => {
    const payload = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      age: -1,
    }
    const response = await request(app.callback()).post('/users').send(payload)

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error.message).toContain(
      'Validation error: "age" must be greater than or equal to 0'
    )
  })
})
