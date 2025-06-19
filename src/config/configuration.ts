import * as dotenv from 'dotenv';
import { AppEnvironmentEnum } from '../modules/app/enums';

dotenv.config();
const env: NodeJS.ProcessEnv = process.env;

export default () => ({
  app: {
    app_name: env.APP_NAME ?? 'tinyurl',
    app_env: env.NODE_ENV ?? AppEnvironmentEnum.DEVELOPMENT,
  },
  database: {
    mongodb: {
      uri:
        env.MONGODB_URI ??
        'mongodb://admin:password@mongodb:27017/tinyurl?authSource=admin',
    },
  },
  throttler: {
    ttl: env.THROTTLER_TTL ?? 60,
    limit: env.THROTTLER_LIMIT ?? 10,
  },
});
