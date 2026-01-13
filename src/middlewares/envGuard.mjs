// src/middlewares/envGuard.mjs
export default async (ctx, next) => {
  if (process.env.NODE_ENV === 'production') {
    // 例如：隱藏某些 debug endpoint
    if (ctx.path.startsWith('/debug')) {
      ctx.throw(404, 'Not available in production')
    }
  }
  await next()
}
