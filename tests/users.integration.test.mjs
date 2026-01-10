import { describe, test, expect, beforeAll, afterEach } from '@jest/globals'
import nock from 'nock'
import request from 'supertest'

import app from '../src/app.mjs'

describe('User API integration #integration #mock', () => {
  beforeAll(() => {
    nock.cleanAll()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  test('should return user profile when external API succeeds #happy #mock', async () => {
    // Arrange: mock 外部 HTTP request
    const mockUser = {
      id: 123,
      name: 'Mocked Alice',
      email: 'alice@external.com',
    }
    nock('https://api.github.com').get('/users/alice').reply(200, mockUser)

    // Act
    const response = await request(app.callback()).get('/users/external/alice')

    console.log({ response: response.body })
    // Assert
    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.name).toBe('Mocked Alice')
  })

  test('should return 502 when external API fails #error #mock', async () => {
    nock('https://api.github.com')
      .get('/users/alice')
      .reply(502, { message: 'Bad Gateway' })

    const response = await request(app.callback()).get('/users/external/alice')

    expect(response.status).toBe(502)
    expect(response.body.error.message).toContain('External service error')
  })
})
