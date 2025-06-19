import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app: NestFastifyApplication = await NestFactory.create(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableCors({ origin: true, credentials: true, maxAge: 3600 });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.enableShutdownHooks();
  const port = process.env.PORT || 3000;
  await app.listen(port);
  return port;
}

bootstrap()
  .then((port) => console.log(`App successfully started on port ${port} !`))
  .catch((error) => {
    console.error('Failed to start the application:', error);
    process.exit(1);
  });
