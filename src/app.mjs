import Koa from 'koa'
import errorHandler from './middlewares/error.mjs'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import { BadRequestError, NotFoundError } from './utils/error.mjs'

const app = new Koa()
const router = new Router()

app.use(errorHandler)

app.use(bodyParser())

router.get('/users', async (ctx) => {
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
    data: user
  }
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
