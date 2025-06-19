import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { FastifyReply } from 'fastify';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
}
