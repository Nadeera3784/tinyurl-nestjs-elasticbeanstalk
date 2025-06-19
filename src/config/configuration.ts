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
      uri:
        env.MONGODB_URI ??
        'mongodb://admin:password@mongodb:27017/tinyurl?authSource=admin',
      is_local:
        env.MONGODB_IS_LOCAL === 'true' ? true : env.NODE_ENV !== 'production',
    },
  },
  throttler: {
    ttl: env.THROTTLER_TTL ?? 60,
    limit: env.THROTTLER_LIMIT ?? 10,
  },
});
