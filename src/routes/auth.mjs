import Router from 'koa-router'

import { generateToken } from '../middlewares/auth.mjs'
import { hashPassword, comparePassword } from '../services/userService.mjs'

const router = new Router({ prefix: '/auth' })

// 假數據 store（生產用 DB）
const users = [] // { username, passwordHash, id }

router.post('/register', async (ctx) => {
  const { username, password } = ctx.request.body
  if (!username || !password) {
    ctx.throw(400, 'Missing username or password')
  }

  const existing = users.find((u) => u.username === username)
  if (existing) {
    ctx.throw(409, 'Username already exists')
  }

  const passwordHash = await hashPassword(password)
  const user = { id: users.length + 1, username, passwordHash }
  users.push(user)

  ctx.status = 201
  ctx.body = { success: true, message: 'User registered' }
})

router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body
  const user = users.find((u) => u.username === username)
  if (!user || !(await comparePassword(password, user.passwordHash))) {
    ctx.throw(401, 'Invalid credentials')
  }

  const token = generateToken(user)
  ctx.body = { success: true, token }
})

export default router
