import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import {
  GetAllUrlsFeature,
  CreateUrlFeature,
  GetUrlStatsFeature,
  GetUrlByIdFeature,
  UpdateUrlFeature,
  DeleteUrlFeature,
} from '../features';
import { CreateUrlDto, UpdateUrlDto } from '../dtos';
import { UrlStatusEnum } from '../enums';

describe('UrlController', () => {
  let controller: UrlController;
  let getAllUrlsFeature: jest.Mocked<GetAllUrlsFeature>;
  let createUrlFeature: jest.Mocked<CreateUrlFeature>;
  let getUrlStatsFeature: jest.Mocked<GetUrlStatsFeature>;
  let getUrlByIdFeature: jest.Mocked<GetUrlByIdFeature>;
  let updateUrlFeature: jest.Mocked<UpdateUrlFeature>;
  let deleteUrlFeature: jest.Mocked<DeleteUrlFeature>;

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
    const mockGetAllUrlsFeature = {
      handle: jest.fn(),
    };

    const mockCreateUrlFeature = {
      handle: jest.fn(),
    };

    const mockGetUrlStatsFeature = {
      handle: jest.fn(),
    };

    const mockGetUrlByIdFeature = {
      handle: jest.fn(),
    };

    const mockUpdateUrlFeature = {
      handle: jest.fn(),
    };

    const mockDeleteUrlFeature = {
      handle: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: GetAllUrlsFeature,
          useValue: mockGetAllUrlsFeature,
        },
        {
          provide: CreateUrlFeature,
          useValue: mockCreateUrlFeature,
        },
        {
          provide: GetUrlStatsFeature,
          useValue: mockGetUrlStatsFeature,
        },
        {
          provide: GetUrlByIdFeature,
          useValue: mockGetUrlByIdFeature,
        },
        {
          provide: UpdateUrlFeature,
          useValue: mockUpdateUrlFeature,
        },
        {
          provide: DeleteUrlFeature,
          useValue: mockDeleteUrlFeature,
        },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
    getAllUrlsFeature = module.get(GetAllUrlsFeature);
    createUrlFeature = module.get(CreateUrlFeature);
    getUrlStatsFeature = module.get(GetUrlStatsFeature);
    getUrlByIdFeature = module.get(GetUrlByIdFeature);
    updateUrlFeature = module.get(UpdateUrlFeature);
    deleteUrlFeature = module.get(DeleteUrlFeature);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUrls', () => {
    it('should get all URLs successfully', async () => {
      const mockFeatureResponse = {
        statusCode: 200,
        message: 'URLs retrieved successfully',
        data: [mockUrl],
      };

      getAllUrlsFeature.handle.mockResolvedValue({
        status: 200,
        response: mockFeatureResponse,
      });

      await controller.getAllUrls(mockResponse as any);

      expect(getAllUrlsFeature.handle).toHaveBeenCalledWith();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(mockFeatureResponse);
    });

    it('should handle errors when getting all URLs', async () => {
      const mockErrorResponse = {
        statusCode: 500,
        message: 'Internal server error',
        data: null,
      };

      getAllUrlsFeature.handle.mockResolvedValue({
        status: 500,
        response: mockErrorResponse,
      });

      await controller.getAllUrls(mockResponse as any);

      expect(getAllUrlsFeature.handle).toHaveBeenCalledWith();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith(mockErrorResponse);
    });
  });

  describe('createUrl', () => {
    const createUrlDto: CreateUrlDto = {
      original_url: 'https://example.com',
      custom_short_code: 'custom123',
      status: UrlStatusEnum.ACTIVE,
    };

    it('should create URL successfully', async () => {
      const mockFeatureResponse = {
        statusCode: 201,
        message: 'Short URL created successfully',
        data: {
          id: mockUrl._id,
          original_url: mockUrl.original_url,
          short_code: mockUrl.short_code,
          short_url: `http://localhost:3000/${mockUrl.short_code}`,
          status: mockUrl.status,
          expires_at: mockUrl.expires_at,
          created_at: mockUrl.created_at,
        },
      };

      createUrlFeature.handle.mockResolvedValue({
        status: 201,
        response: mockFeatureResponse,
      });

      await controller.createUrl(mockResponse as any, createUrlDto);

      expect(createUrlFeature.handle).toHaveBeenCalledWith(createUrlDto);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalledWith(mockFeatureResponse);
    });

    it('should handle validation errors when creating URL', async () => {
      const mockErrorResponse = {
        statusCode: 400,
        message: 'Something went wrong. please try again later',
        data: new Error('Validation failed'),
      };

      createUrlFeature.handle.mockResolvedValue({
        status: 400,
        response: mockErrorResponse,
      });

      await controller.createUrl(mockResponse as any, createUrlDto);

      expect(createUrlFeature.handle).toHaveBeenCalledWith(createUrlDto);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith(mockErrorResponse);
    });

    it('should handle duplicate short code errors', async () => {
      const mockErrorResponse = {
        statusCode: 400,
        message: 'Something went wrong. please try again later',
        data: new Error('Custom short code already exists'),
      };

      createUrlFeature.handle.mockResolvedValue({
        status: 400,
        response: mockErrorResponse,
      });

      await controller.createUrl(mockResponse as any, createUrlDto);

      expect(createUrlFeature.handle).toHaveBeenCalledWith(createUrlDto);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith(mockErrorResponse);
    });
  });

  describe('getUrlById', () => {
    const urlId = '648d123456789abcdef12345';

    it('should get URL by ID successfully', async () => {
      const mockFeatureResponse = {
        statusCode: 200,
        message: 'URL retrieved successfully',
        data: mockUrl,
      };

      getUrlByIdFeature.handle.mockResolvedValue({
        status: 200,
        response: mockFeatureResponse,
      });

      await controller.getUrlById(mockResponse as any, urlId);

      expect(getUrlByIdFeature.handle).toHaveBeenCalledWith(urlId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(mockFeatureResponse);
    });

    it('should handle URL not found', async () => {
      const mockErrorResponse = {
        statusCode: 404,
        message: 'URL not found',
        data: null,
      };

      getUrlByIdFeature.handle.mockResolvedValue({
        status: 404,
        response: mockErrorResponse,
      });

      await controller.getUrlById(mockResponse as any, 'nonexistent-id');

      expect(getUrlByIdFeature.handle).toHaveBeenCalledWith('nonexistent-id');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith(mockErrorResponse);
    });

    it('should handle invalid ID format', async () => {
      const mockErrorResponse = {
        statusCode: 400,
        message: 'Invalid ID format',
        data: null,
      };

      getUrlByIdFeature.handle.mockResolvedValue({
        status: 400,
        response: mockErrorResponse,
      });

      await controller.getUrlById(mockResponse as any, 'invalid-id');

      expect(getUrlByIdFeature.handle).toHaveBeenCalledWith('invalid-id');
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith(mockErrorResponse);
    });
  });

  describe('updateUrl', () => {
    const urlId = '648d123456789abcdef12345';
    const updateUrlDto: UpdateUrlDto = {
      original_url: 'https://updated-example.com',
      status: UrlStatusEnum.INACTIVE,
    };

    it('should update URL successfully', async () => {
      const updatedUrl = { ...mockUrl, ...updateUrlDto };
      const mockFeatureResponse = {
        statusCode: 200,
        message: 'URL updated successfully',
        data: updatedUrl,
      };

      updateUrlFeature.handle.mockResolvedValue({
        status: 200,
        response: mockFeatureResponse,
      });

      await controller.updateUrl(mockResponse as any, urlId, updateUrlDto);

      expect(updateUrlFeature.handle).toHaveBeenCalledWith(urlId, updateUrlDto);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(mockFeatureResponse);
    });

    it('should handle URL not found during update', async () => {
      const mockErrorResponse = {
        statusCode: 404,
        message: 'URL not found',
        data: null,
      };

      updateUrlFeature.handle.mockResolvedValue({
        status: 404,
        response: mockErrorResponse,
      });

      await controller.updateUrl(
        mockResponse as any,
        'nonexistent-id',
        updateUrlDto,
      );

      expect(updateUrlFeature.handle).toHaveBeenCalledWith(
        'nonexistent-id',
        updateUrlDto,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith(mockErrorResponse);
    });

    it('should handle validation errors during update', async () => {
      const mockErrorResponse = {
        statusCode: 400,
        message: 'Validation failed',
        data: null,
      };

      updateUrlFeature.handle.mockResolvedValue({
        status: 400,
        response: mockErrorResponse,
      });

      const invalidDto = { original_url: 'invalid-url' };
      await controller.updateUrl(
        mockResponse as any,
        urlId,
        invalidDto as UpdateUrlDto,
      );

      expect(updateUrlFeature.handle).toHaveBeenCalledWith(urlId, invalidDto);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith(mockErrorResponse);
    });
  });

  describe('deleteUrl', () => {
    const urlId = '648d123456789abcdef12345';

    it('should delete URL successfully', async () => {
      const mockFeatureResponse = {
        statusCode: 200,
        message: 'URL deleted successfully',
        data: null,
      };

      deleteUrlFeature.handle.mockResolvedValue({
        status: 200,
        response: mockFeatureResponse,
      });

      await controller.deleteUrl(mockResponse as any, urlId);

      expect(deleteUrlFeature.handle).toHaveBeenCalledWith(urlId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(mockFeatureResponse);
    });

    it('should handle URL not found during deletion', async () => {
      const mockErrorResponse = {
        statusCode: 404,
        message: 'URL not found',
        data: null,
      };

      deleteUrlFeature.handle.mockResolvedValue({
        status: 404,
        response: mockErrorResponse,
      });

      await controller.deleteUrl(mockResponse as any, 'nonexistent-id');

      expect(deleteUrlFeature.handle).toHaveBeenCalledWith('nonexistent-id');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith(mockErrorResponse);
    });

    it('should handle deletion errors', async () => {
      const mockErrorResponse = {
        statusCode: 500,
        message: 'Failed to delete URL',
        data: null,
      };

      deleteUrlFeature.handle.mockResolvedValue({
        status: 500,
        response: mockErrorResponse,
      });

      await controller.deleteUrl(mockResponse as any, urlId);

      expect(deleteUrlFeature.handle).toHaveBeenCalledWith(urlId);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith(mockErrorResponse);
    });
  });

  describe('getUrlStats', () => {
    const urlId = '648d123456789abcdef12345';

    it('should get URL stats successfully', async () => {
      const mockStatsData = {
        id: mockUrl._id,
        original_url: mockUrl.original_url,
        short_code: mockUrl.short_code,
        click_count: mockUrl.click_count,
        status: mockUrl.status,
        created_at: mockUrl.created_at,
        updated_at: mockUrl.updated_at,
      };

      const mockFeatureResponse = {
        statusCode: 200,
        message: 'URL stats retrieved successfully',
        data: mockStatsData,
      };

      getUrlStatsFeature.handle.mockResolvedValue({
        status: 200,
        response: mockFeatureResponse,
      });

      await controller.getUrlStats(mockResponse as any, urlId);

      expect(getUrlStatsFeature.handle).toHaveBeenCalledWith(urlId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(mockFeatureResponse);
    });

    it('should handle URL not found for stats', async () => {
      const mockErrorResponse = {
        statusCode: 404,
        message: 'URL not found',
        data: null,
      };

      getUrlStatsFeature.handle.mockResolvedValue({
        status: 404,
        response: mockErrorResponse,
      });

      await controller.getUrlStats(mockResponse as any, 'nonexistent-id');

      expect(getUrlStatsFeature.handle).toHaveBeenCalledWith('nonexistent-id');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith(mockErrorResponse);
    });

    it('should handle stats retrieval errors', async () => {
      const mockErrorResponse = {
        statusCode: 500,
        message: 'Failed to retrieve stats',
        data: null,
      };

      getUrlStatsFeature.handle.mockResolvedValue({
        status: 500,
        response: mockErrorResponse,
      });

      await controller.getUrlStats(mockResponse as any, urlId);

      expect(getUrlStatsFeature.handle).toHaveBeenCalledWith(urlId);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith(mockErrorResponse);
    });
  });

  describe('Controller Integration', () => {
    it('should handle all features being called in sequence', async () => {
      const createDto: CreateUrlDto = {
        original_url: 'https://example.com',
      };

      const updateDto: UpdateUrlDto = {
        status: UrlStatusEnum.INACTIVE,
      };

      createUrlFeature.handle.mockResolvedValue({
        status: 201,
        response: { statusCode: 201, message: 'Created', data: mockUrl },
      });

      getUrlByIdFeature.handle.mockResolvedValue({
        status: 200,
        response: { statusCode: 200, message: 'Found', data: mockUrl },
      });

      updateUrlFeature.handle.mockResolvedValue({
        status: 200,
        response: { statusCode: 200, message: 'Updated', data: mockUrl },
      });

      getUrlStatsFeature.handle.mockResolvedValue({
        status: 200,
        response: { statusCode: 200, message: 'Stats', data: mockUrl },
      });

      deleteUrlFeature.handle.mockResolvedValue({
        status: 200,
        response: { statusCode: 200, message: 'Deleted', data: null },
      });

      await controller.createUrl(mockResponse as any, createDto);
      await controller.getUrlById(mockResponse as any, mockUrl._id);
      await controller.updateUrl(mockResponse as any, mockUrl._id, updateDto);
      await controller.getUrlStats(mockResponse as any, mockUrl._id);
      await controller.deleteUrl(mockResponse as any, mockUrl._id);

      expect(createUrlFeature.handle).toHaveBeenCalledWith(createDto);
      expect(getUrlByIdFeature.handle).toHaveBeenCalledWith(mockUrl._id);
      expect(updateUrlFeature.handle).toHaveBeenCalledWith(
        mockUrl._id,
        updateDto,
      );
      expect(getUrlStatsFeature.handle).toHaveBeenCalledWith(mockUrl._id);
      expect(deleteUrlFeature.handle).toHaveBeenCalledWith(mockUrl._id);

      expect(mockResponse.status).toHaveBeenCalledTimes(5);
      expect(mockResponse.send).toHaveBeenCalledTimes(5);
    });
  });
});
