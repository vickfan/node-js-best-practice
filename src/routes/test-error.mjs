import Router from 'koa-router'
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  InternalServerError
} from '../utils/error.mjs'

const router = new Router({ prefix: '/test-error' })

router.get('/bad-request', (ctx) => {
  throw new BadRequestError('Bad request')
})

router.get('/not-found', (ctx) => {
  throw new NotFoundError('Not found')
})

router.get('/unauthorized', (ctx) => {
  throw new UnauthorizedError('Unauthorized')
})

router.get('/programmer-error', (ctx) => {
  throw new InternalServerError('Internal server error')
})

router.get('/unhandled-promise', (ctx) => {
  Promise.reject(new Error('Unhandled promise'))
  ctx.body = {
    message: 'reject async'
  }
})

router.get('/sync-crash', (ctx) => {
  throw new Error('Sync crash')
})

export default router
