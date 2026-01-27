// src/middlewares/auth.mjs
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-change-me'

const authMiddleware = async (ctx, next) => {
  const authHeader = ctx.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ctx.throw(401, 'No token provided')
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    ctx.state.user = decoded // 放 user info 到 ctx.state
    await next()
  } catch (err) {
    ctx.throw(401, 'Invalid or expired token')
  }
}

// 簡單生成 token function（用喺 login）
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' } // 1 小時過期
  )
}

export { authMiddleware, generateToken }
