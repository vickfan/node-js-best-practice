module.exports = {
  apps: [
    {
      name: 'koa-api',
      script: './index.mjs',
      instances: 'max', // 用晒所有 CPU core
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        FORCE_HTTPS: 'false', // Allow HTTP for local development
      },
      // zero-downtime reload
      watch: false,
      autorestart: true,
    },
  ],
}
