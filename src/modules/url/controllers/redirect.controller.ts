import { Controller, Get, Res, Param } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { RedirectUrlFeature } from '../features';

@Controller()
export class RedirectController {
  constructor(private readonly redirectUrlFeature: RedirectUrlFeature) {}

  @Get('/:shortCode')
  public async redirect(
    @Res() response: FastifyReply,
    @Param('shortCode') shortCode: string,
  ) {
    const { status, response: featureResponse } =
      await this.redirectUrlFeature.handle(shortCode);
    return response.status(status).send(featureResponse);
  }
}
