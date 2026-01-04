import { AppError } from '../utils/error.mjs'

const errorHandler = async (ctx, next) => {
  try {
    await next()

    if (ctx.status === 404 && !ctx.body) {
      ctx.throw(404, 'Not Found')
    }
  } catch (err) {
    const error =
      err instanceof AppError
        ? err
        : new AppError(
            err.message || 'unexpected error',
            err.status || 500,
            err.isOperational || false
          )

    if (!error.isOperational) {
      // log programmer error
    } else {
      //  log operational error
    }

    ctx.status = error.status
    ctx.body = {
      success: false,
      error: {
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      }
    }
    ctx.type = 'application/json'
  }
}

export default errorHandler
