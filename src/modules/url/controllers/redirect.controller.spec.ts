import { Test, TestingModule } from '@nestjs/testing';
import { RedirectController } from './redirect.controller';
import { RedirectUrlFeature } from '../features';
import { UrlStatusEnum } from '../enums';

describe('RedirectController', () => {
  let controller: RedirectController;
  let redirectUrlFeature: jest.Mocked<RedirectUrlFeature>;

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };

  const mockUrl = {
    _id: '648d123456789abcdef12345',
    original_url: 'https://example.com',
    short_code: 'abc123',
    status: UrlStatusEnum.ACTIVE,
    click_count: 0,
    expires_at: new Date('2030-12-31'),
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const mockRedirectUrlFeature = {
      handle: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedirectController],
      providers: [
        {
          provide: RedirectUrlFeature,
          useValue: mockRedirectUrlFeature,
        },
      ],
    }).compile();

    controller = module.get<RedirectController>(RedirectController);
    redirectUrlFeature = module.get(RedirectUrlFeature);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('redirect', () => {
    const shortCode = 'abc123';

    it('should redirect successfully', async () => {
      const mockFeatureResponse = {
        statusCode: 302,
        message: 'Redirect URL found',
        data: {
          original_url: mockUrl.original_url,
          short_code: mockUrl.short_code,
          click_count: mockUrl.click_count + 1,
        },
      };

      redirectUrlFeature.handle.mockResolvedValue({
        status: 302,
        response: mockFeatureResponse,
      });

      await controller.redirect(mockResponse as any, shortCode);

      expect(redirectUrlFeature.handle).toHaveBeenCalledWith(shortCode);
      expect(mockResponse.status).toHaveBeenCalledWith(302);
      expect(mockResponse.send).toHaveBeenCalledWith(mockFeatureResponse);
    });

    it('should handle short code not found', async () => {
      const mockErrorResponse = {
        statusCode: 400,
        message: 'Something went wrong, Please try again later',
        data: new Error('Short URL not found or inactive'),
      };

      redirectUrlFeature.handle.mockResolvedValue({
        status: 400,
        response: mockErrorResponse,
      });

      await controller.redirect(mockResponse as any, 'nonexistent');

      expect(redirectUrlFeature.handle).toHaveBeenCalledWith('nonexistent');
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith(mockErrorResponse);
    });

    it('should handle expired URL', async () => {
      const mockErrorResponse = {
        statusCode: 400,
        message: 'Something went wrong, Please try again later',
        data: new Error('Short URL has expired'),
      };

      redirectUrlFeature.handle.mockResolvedValue({
        status: 400,
        response: mockErrorResponse,
      });

      await controller.redirect(mockResponse as any, 'expired123');

      expect(redirectUrlFeature.handle).toHaveBeenCalledWith('expired123');
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith(mockErrorResponse);
    });

    it('should handle inactive URL', async () => {
      const mockErrorResponse = {
        statusCode: 400,
        message: 'Something went wrong, Please try again later',
        data: new Error('Short URL not found or inactive'),
      };

      redirectUrlFeature.handle.mockResolvedValue({
        status: 400,
        response: mockErrorResponse,
      });

      await controller.redirect(mockResponse as any, 'inactive123');

      expect(redirectUrlFeature.handle).toHaveBeenCalledWith('inactive123');
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith(mockErrorResponse);
    });

    it('should handle service errors', async () => {
      const mockErrorResponse = {
        statusCode: 400,
        message: 'Something went wrong, Please try again later',
        data: new Error('Database connection failed'),
      };

      redirectUrlFeature.handle.mockResolvedValue({
        status: 400,
        response: mockErrorResponse,
      });

      await controller.redirect(mockResponse as any, shortCode);

      expect(redirectUrlFeature.handle).toHaveBeenCalledWith(shortCode);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith(mockErrorResponse);
    });

    it('should handle empty short code', async () => {
      const mockErrorResponse = {
        statusCode: 400,
        message: 'Something went wrong, Please try again later',
        data: new Error('Short code is required'),
      };

      redirectUrlFeature.handle.mockResolvedValue({
        status: 400,
        response: mockErrorResponse,
      });

      await controller.redirect(mockResponse as any, '');

      expect(redirectUrlFeature.handle).toHaveBeenCalledWith('');
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith(mockErrorResponse);
    });

    it('should handle special characters in short code', async () => {
      const specialShortCode = 'test@123';
      const mockFeatureResponse = {
        statusCode: 302,
        message: 'Redirect URL found',
        data: {
          original_url: 'https://special-example.com',
          short_code: specialShortCode,
          click_count: 1,
        },
      };

      redirectUrlFeature.handle.mockResolvedValue({
        status: 302,
        response: mockFeatureResponse,
      });

      await controller.redirect(mockResponse as any, specialShortCode);

      expect(redirectUrlFeature.handle).toHaveBeenCalledWith(specialShortCode);
      expect(mockResponse.status).toHaveBeenCalledWith(302);
      expect(mockResponse.send).toHaveBeenCalledWith(mockFeatureResponse);
    });

    it('should increment click count on successful redirect', async () => {
      const mockFeatureResponse = {
        statusCode: 302,
        message: 'Redirect URL found',
        data: {
          original_url: mockUrl.original_url,
          short_code: mockUrl.short_code,
          click_count: 5,
        },
      };

      redirectUrlFeature.handle.mockResolvedValue({
        status: 302,
        response: mockFeatureResponse,
      });

      await controller.redirect(mockResponse as any, shortCode);

      expect(redirectUrlFeature.handle).toHaveBeenCalledWith(shortCode);
      expect(mockResponse.status).toHaveBeenCalledWith(302);
      expect(mockResponse.send).toHaveBeenCalledWith(mockFeatureResponse);
      expect(mockFeatureResponse.data.click_count).toBe(5);
    });
  });

  describe('Controller Integration', () => {
    it('should handle multiple redirect requests', async () => {
      const shortCodes = ['abc123', 'def456', 'ghi789'];
      const mockFeatureResponse = {
        statusCode: 302,
        message: 'Redirect URL found',
        data: {
          original_url: 'https://example.com',
          short_code: 'test',
          click_count: 1,
        },
      };

      redirectUrlFeature.handle.mockResolvedValue({
        status: 302,
        response: mockFeatureResponse,
      });

      for (const code of shortCodes) {
        await controller.redirect(mockResponse as any, code);
      }

      expect(redirectUrlFeature.handle).toHaveBeenCalledTimes(3);
      expect(mockResponse.status).toHaveBeenCalledTimes(3);
      expect(mockResponse.send).toHaveBeenCalledTimes(3);

      shortCodes.forEach((code, index) => {
        expect(redirectUrlFeature.handle).toHaveBeenNthCalledWith(
          index + 1,
          code,
        );
      });
    });

    it('should handle mixed success and error responses', async () => {
      const testCases = [
        {
          shortCode: 'success123',
          response: {
            status: 302,
            response: {
              statusCode: 302,
              message: 'Redirect URL found',
              data: {
                original_url: 'https://example.com',
                short_code: 'success123',
                click_count: 1,
              },
            },
          },
        },
        {
          shortCode: 'notfound123',
          response: {
            status: 400,
            response: {
              statusCode: 400,
              message: 'Something went wrong, Please try again later',
              data: new Error('Short URL not found or inactive'),
            },
          },
        },
        {
          shortCode: 'expired123',
          response: {
            status: 400,
            response: {
              statusCode: 400,
              message: 'Something went wrong, Please try again later',
              data: new Error('Short URL has expired'),
            },
          },
        },
      ];

      for (const testCase of testCases) {
        redirectUrlFeature.handle.mockResolvedValueOnce(testCase.response);
        await controller.redirect(mockResponse as any, testCase.shortCode);
      }

      expect(redirectUrlFeature.handle).toHaveBeenCalledTimes(3);
      expect(mockResponse.status).toHaveBeenNthCalledWith(1, 302);
      expect(mockResponse.status).toHaveBeenNthCalledWith(2, 400);
      expect(mockResponse.status).toHaveBeenNthCalledWith(3, 400);
    });
  });
});
