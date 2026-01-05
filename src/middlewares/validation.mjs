import Joi from 'joi'
import { BadRequestError } from '../utils/error.mjs'

export default (schema, location = 'body') =>
  async (ctx, next) => {
    const data =
      {
        body: ctx.request.body,
        query: ctx.request.query,
        params: ctx.params
      }[location] || {}

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      allowUnknown: true
    })

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(', ')
      throw new BadRequestError(`Validation error: ${messages}`)
    }

    ctx.validated = value

    await next()
  }
