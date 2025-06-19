import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { HealthService } from './services';
import { FastifyReply } from 'fastify';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly healthService: HealthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/status')
  getStatus(@Res() response: FastifyReply) {
    return response.status(HttpStatus.OK).send({
      status: 'ok',
    });
  }

  @Get('health')
  getHealth() {
    return this.healthService.getHealthStatus();
  }
}
