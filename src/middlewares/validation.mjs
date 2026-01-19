import { BadRequestError } from '../utils/error.mjs'

export default (schema, location = 'body') =>
  async (ctx, next) => {
    let data
    if (location === 'body') {
      data = ctx.request.body || {}
    } else if (location === 'query') {
      data = ctx.request.query || {}
    } else if (location === 'params') {
      data = ctx.params || {}
    } else {
      data = {}
    }

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      allowUnknown: true,
    })

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(', ')
      throw new BadRequestError(`Validation error: ${messages}`)
    }

    ctx.validated = value

    await next()
  }
