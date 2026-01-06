import { AppError, NotFoundError } from '../utils/error.mjs'
import logger from '../utils/logger.mjs'

const errorHandler = async (ctx, next) => {
  try {
    await next()

    if (ctx.status === 404 && !ctx.body) {
      throw new NotFoundError('Not Found')
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

    const logData = {
      message: error.message,
      status: error.status,
      path: ctx.path,
      method: ctx.method,
      ip: ctx.ip,
      ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
    }
    console.log({ logData })
    if (!error.isOperational) {
      // log programmer error
      logger.error('Critical programmer error occurred', logData)
    } else {
      //  log operational error
      logger.warn('Operational error occurred', logData)
    }

    ctx.status = error.status
    ctx.body = {
      success: false,
      error: {
        code: error.status,
        message: error.message,
        ...(process.env.NODE_ENV !== 'production' && {
          details: error.details
        }),
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      }
    }
    console.log({ body: ctx.body })
    ctx.type = 'application/json'
  }
}

export default errorHandler
