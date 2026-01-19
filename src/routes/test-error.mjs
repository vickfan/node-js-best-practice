import Router from 'koa-router'

import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
} from '../utils/index.mjs'
import logger from '../utils/logger.mjs'

const router = new Router({ prefix: '/test-error' })

router.get('/bad-request', () => {
  throw new BadRequestError('Bad request')
})

router.get('/not-found', () => {
  throw new NotFoundError('Not found')
})

router.get('/unauthorized', () => {
  throw new UnauthorizedError('Unauthorized')
})

router.get('/programmer-error', () => {
  throw new InternalServerError('Internal server error')
})

router.get('/unhandled-promise', (ctx) => {
  Promise.reject(new Error('Unhandled promise'))
  ctx.body = {
    message: 'reject async',
  }
})

router.get('/sync-crash', () => {
  throw new Error('Sync crash')
})

router.get('/crash', async () => {
  logger.error('Test log for Kibana', { test: 'this should appear in ES' })
  // 故意拋一個 programmer error
  throw new InternalServerError(
    'This is a deliberate crash for testing Kibana logging!'
  )
})

router.get('/validation-fail', async () => {
  // 故意觸發 validation error
  throw new BadRequestError('Missing required field for testing')
})

export default router
