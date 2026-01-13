// src/config/redis.mjs
import RedisStore from 'koa-redis-session'
import { createClient } from 'redis'

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

export const redisClient = createClient({
  url: redisUrl,
})

redisClient.on('error', (err) => console.error('Redis Client Error', err))

// 自動連線（lazy connect）
export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect()
  }
}

// 喺 app 啟動時呼叫（之後會加）
export const sessionConfig = {
  key: 'koa:sess', // cookie 名稱
  maxAge: 86400000, // 1 日（單位 ms）
  autoCommit: true,
  overwrite: true,
  httpOnly: true, // 防 JS 讀取 cookie
  signed: true, // 用 app.keys 簽名
  rolling: false, // 唔自動更新 maxAge
  renew: false,
  secure: process.env.NODE_ENV === 'production', // production 時強制 HTTPS
  sameSite: 'lax', // 防 CSRF
  store: new RedisStore({
    client: redisClient, // 用我哋嘅 redis client
    prefix: 'sess:', // Redis key 前綴
  }),
}
