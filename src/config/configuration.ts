import * as dotenv from 'dotenv';

dotenv.config();
const env: NodeJS.ProcessEnv = process.env;

export default () => ({
  app: {
    app_name: env.APP_NAME ?? 'tinyurl',
    app_port: env.APP_PORT ?? 8080,
  },
  database: {
    mongodb: {
      uri: env.MONGODB_URI ?? 'mongodb://localhost:27017/tinyurl',
      is_local: env.MONGODB_IS_LOCAL ?? true,
    },
  },
  throttler: {
    ttl: env.THROTTLER_TTL ?? 60,
    limit: env.THROTTLER_LIMIT ?? 10,
  },
});
