import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  base: {
    service: 'taxflow-api',
    release: process.env.RELEASE_ID ?? 'development',
  },
  redact: ['req.headers.authorization', 'req.headers.cookie', "res.headers['set-cookie']"],
  ...(isProduction
    ? {}
    : {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true },
        },
      }),
});
