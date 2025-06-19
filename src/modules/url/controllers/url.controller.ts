import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Res,
  Body,
  Param,
  Header,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import {
  GetAllUrlsFeature,
  CreateUrlFeature,
  GetUrlStatsFeature,
  GetUrlByIdFeature,
  UpdateUrlFeature,
  DeleteUrlFeature,
} from '../features';
import { CreateUrlDto, UpdateUrlDto } from '../dtos';

@Controller('url')
export class UrlController {
  constructor(
    private readonly getAllUrlsFeature: GetAllUrlsFeature,
    private readonly createUrlFeature: CreateUrlFeature,
    private readonly getUrlStatsFeature: GetUrlStatsFeature,
    private readonly getUrlByIdFeature: GetUrlByIdFeature,
    private readonly updateUrlFeature: UpdateUrlFeature,
    private readonly deleteUrlFeature: DeleteUrlFeature,
  ) {}

  @Get()
  @Header('Content-Type', 'application/json')
  public async getAllUrls(@Res() response: FastifyReply) {
    const { status: statusCode, response: featureResponse } =
      await this.getAllUrlsFeature.handle();
    return response.status(statusCode).send(featureResponse);
  }

  @Post()
  @Header('Content-Type', 'application/json')
  public async createUrl(
    @Res() response: FastifyReply,
    @Body() createUrlDto: CreateUrlDto,
  ) {
    const { status, response: featureResponse } =
      await this.createUrlFeature.handle(createUrlDto);
    return response.status(status).send(featureResponse);
  }

  @Get('/:id')
  @Header('Content-Type', 'application/json')
  public async getUrlById(
    @Res() response: FastifyReply,
    @Param('id') id: string,
  ) {
    const { status, response: featureResponse } =
      await this.getUrlByIdFeature.handle(id);
    return response.status(status).send(featureResponse);
  }

  @Put('/:id')
  @Header('Content-Type', 'application/json')
  public async updateUrl(
    @Res() response: FastifyReply,
    @Param('id') id: string,
    @Body() updateUrlDto: UpdateUrlDto,
  ) {
    const { status, response: featureResponse } =
      await this.updateUrlFeature.handle(id, updateUrlDto);
    return response.status(status).send(featureResponse);
  }

  @Delete('/:id')
  @Header('Content-Type', 'application/json')
  public async deleteUrl(
    @Res() response: FastifyReply,
    @Param('id') id: string,
  ) {
    const { status, response: featureResponse } =
      await this.deleteUrlFeature.handle(id);
    return response.status(status).send(featureResponse);
  }

  @Get('/:id/stats')
  @Header('Content-Type', 'application/json')
  public async getUrlStats(
    @Res() response: FastifyReply,
    @Param('id') id: string,
  ) {
    const { status, response: featureResponse } =
      await this.getUrlStatsFeature.handle(id);
    return response.status(status).send(featureResponse);
  }
}
