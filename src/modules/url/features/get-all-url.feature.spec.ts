import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { GetAllUrlsFeature } from './get-all-url.feature';
import { UrlService } from '../services';

describe('GetAllUrlsFeature', () => {
  let feature: GetAllUrlsFeature;
  let urlService: jest.Mocked<UrlService>;

  const mockUrls = [
    {
      _id: '507f1f77bcf86cd799439011',
      original_url: 'https://example.com',
      short_code: 'abc123',
      clicks: 5,
      status: 'active',
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-01'),
      expires_at: null,
    },
    {
      _id: '507f1f77bcf86cd799439012',
      original_url: 'https://google.com',
      short_code: 'def456',
      clicks: 10,
      status: 'active',
      created_at: new Date('2023-01-02'),
      updated_at: new Date('2023-01-02'),
      expires_at: new Date('2024-01-01'),
    },
  ] as any;

  beforeEach(async () => {
    const mockUrlService = {
      getAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllUrlsFeature,
        {
          provide: UrlService,
          useValue: mockUrlService,
        },
      ],
    }).compile();

    feature = module.get<GetAllUrlsFeature>(GetAllUrlsFeature);
    urlService = module.get(UrlService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should return success response with all URLs when service call succeeds', async () => {
      // Arrange
      urlService.getAll.mockResolvedValue(mockUrls);

      // Act
      const result = await feature.handle();

      // Assert
      expect(urlService.getAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: 'Urls fetched successfully',
          data: mockUrls,
        },
      });
    });

    it('should return success response with empty array when no URLs exist', async () => {
      // Arrange
      urlService.getAll.mockResolvedValue([]);

      // Act
      const result = await feature.handle();

      // Assert
      expect(urlService.getAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: 'Urls fetched successfully',
          data: [],
        },
      });
    });

    it('should return error response when service throws an error', async () => {
      // Arrange
      const error = new Error('Database connection failed');
      urlService.getAll.mockRejectedValue(error);

      // Act
      const result = await feature.handle();

      // Assert
      expect(urlService.getAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.BAD_REQUEST,
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Something went wrong, Please try again later',
          data: error,
        },
      });
    });

    it('should return error response when service throws a generic error', async () => {
      // Arrange
      const error = 'Network timeout';
      urlService.getAll.mockRejectedValue(error);

      // Act
      const result = await feature.handle();

      // Assert
      expect(urlService.getAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.BAD_REQUEST,
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Something went wrong, Please try again later',
          data: error,
        },
      });
    });

    it('should handle null response from service', async () => {
      // Arrange
      urlService.getAll.mockResolvedValue(null as any);

      // Act
      const result = await feature.handle();

      // Assert
      expect(urlService.getAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: 'Urls fetched successfully',
          data: null,
        },
      });
    });
  });
});
