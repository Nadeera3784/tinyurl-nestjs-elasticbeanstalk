import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/modules/app/app.module';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Url } from '../src/modules/url/schemas';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const mockConnection = {
      readyState: 1,
      host: 'localhost',
      name: 'test-db',
      close: jest.fn().mockResolvedValue(undefined),
    };

    const mockUrlModel = {
      find: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      create: jest.fn(),
      deleteOne: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getConnectionToken())
      .useValue(mockConnection)
      .overrideProvider(getModelToken(Url.name))
      .useValue(mockUrlModel)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        const body = res.body as {
          status: string;
          database: {
            connected: boolean;
            state: string;
            host: string;
            name: string;
          };
          timestamp: string;
          environment: string;
        };
        expect(body).toHaveProperty('status', 'ok');
        expect(body).toHaveProperty('database');
        expect(body.database).toHaveProperty('connected', true);
      });
  });
});
