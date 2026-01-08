import Router from 'koa-router'

import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
} from '../utils/index.mjs'

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

export default router
