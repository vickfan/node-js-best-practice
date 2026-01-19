import winston from 'winston'
import { ElasticsearchTransport } from 'winston-elasticsearch'

const isProduction = process.env.NODE_ENV === 'production'

const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.metadata({ fileExcept: ['message', 'level', 'timestamp'] }),
    ...(isProduction
      ? [winston.format.json()]
      : [
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            const metaStr = Object.keys(meta).length
              ? ` ${JSON.stringify(meta)}`
              : ''
            return `${timestamp} [${level.toUpperCase()}] ${message}${metaStr}`
          }),
        ])
  ),
  transports: [
    new winston.transports.Console({
      format: isProduction
        ? winston.format.json()
        : winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
    }),

    // Production 時額外寫 error file（可選，如果你想有本地備份）
    ...(isProduction
      ? [
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            format: winston.format.json(),
          }),
          new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880,
            maxFiles: 5,
            format: winston.format.json(),
          }),
        ]
      : []),
  ],
  defaultMeta: {
    service: 'koa-api',
    environment: process.env.NODE_ENV || 'development',
  },
})

logger.addContext = (key, value) => {
  logger.defaultMeta = { ...logger.defaultMeta, [key]: value }
}

logger.stream = {
  write: (message) => {
    logger.info(message.trim())
  },
}

console.log('isProduction', isProduction)
if (isProduction) {
  console.log(
    'Adding Elasticsearch transport with node: http://elasticsearch:9200'
  )
  const esTransport = new ElasticsearchTransport({
    level: 'debug', // 暫時設低，睇多啲 log
    indexPrefix: 'koa-logs', // 用 prefix，自動加日期
    clientOpts: {
      node: 'http://elasticsearch:9200',
      maxRetries: 5, // 加重試
      requestTimeout: 30000, // 30 秒 timeout
    },
    ensureIndexTemplate: true,
    flushInterval: 500, // 每 0.5 秒 flush，方便即時睇
  })

  // 加 error handler 睇連線問題
  esTransport.on('error', (err) => {
    console.error('Elasticsearch transport ERROR:', err.message, err.stack)
  })

  logger.add(esTransport)

  console.log('Elasticsearch transport added successfully')
}

export default logger
