class AppError extends Error {
  constructor(message, status = 500, isOperational = true) {
    super(message)
    this.name = this.constructor.name
    this.status = status
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, true)
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400, true)
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, true)
  }
}

class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, 500, true)
  }
}

export {
  AppError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  InternalServerError
}
