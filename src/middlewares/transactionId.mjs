// src/middlewares/transactionId.mjs
import { randomUUID } from 'crypto'

import { logger } from '../utils/index.mjs'

export default async (ctx, next) => {
  // 生成 unique ID（UUID v4）
  const transactionId = randomUUID()

  // 加到 ctx.state，之後 logger 可以用
  ctx.state.transactionId = transactionId

  // 加到 response header，方便前端 / 其他服務追蹤
  ctx.set('X-Transaction-ID', transactionId)

  // 加到 logger context（如果用 Winston metadata）
  logger.defaultMeta = logger.defaultMeta || {}
  logger.defaultMeta.transactionId = transactionId

  await next()
}
