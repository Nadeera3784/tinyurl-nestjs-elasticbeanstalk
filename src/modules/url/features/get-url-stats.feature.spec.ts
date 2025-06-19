import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { GetUrlStatsFeature } from './get-url-stats.feature';
import { UrlService } from '../services';

describe('GetUrlStatsFeature', () => {
  let feature: GetUrlStatsFeature;
  let urlService: jest.Mocked<UrlService>;

  const mockStats = {
    _id: '507f1f77bcf86cd799439011',
    original_url: 'https://example.com',
    short_code: 'abc123',
    clicks: 25,
    status: 'active',
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-15'),
    expires_at: null,
    total_clicks: 25,
    unique_clicks: 18,
    click_history: [
      { date: '2023-01-01', clicks: 5 },
      { date: '2023-01-02', clicks: 8 },
      { date: '2023-01-03', clicks: 12 },
    ],
  } as any;

  beforeEach(async () => {
    const mockUrlService = {
      getStats: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUrlStatsFeature,
        {
          provide: UrlService,
          useValue: mockUrlService,
        },
      ],
    }).compile();

    feature = module.get<GetUrlStatsFeature>(GetUrlStatsFeature);
    urlService = module.get(UrlService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should return success response with URL statistics when found', async () => {
      // Arrange
      const urlId = '507f1f77bcf86cd799439011';
      urlService.getStats.mockResolvedValue(mockStats);

      // Act
      const result = await feature.handle(urlId);

      // Assert
      expect(urlService.getStats).toHaveBeenCalledWith(urlId);
      expect(urlService.getStats).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: 'URL statistics retrieved successfully',
          data: mockStats,
        },
      });
    });

    it('should return success response with zero stats for new URL', async () => {
      // Arrange
      const urlId = '507f1f77bcf86cd799439011';
      const newUrlStats = {
        ...mockStats,
        clicks: 0,
        total_clicks: 0,
        unique_clicks: 0,
        click_history: [],
      };
      urlService.getStats.mockResolvedValue(newUrlStats);

      // Act
      const result = await feature.handle(urlId);

      // Assert
      expect(urlService.getStats).toHaveBeenCalledWith(urlId);
      expect(urlService.getStats).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: 'URL statistics retrieved successfully',
          data: newUrlStats,
        },
      });
    });

    it('should return error response when URL not found', async () => {
      // Arrange
      const urlId = '507f1f77bcf86cd799439999';
      const error = new Error('URL not found');
      urlService.getStats.mockRejectedValue(error);

      // Act
      const result = await feature.handle(urlId);

      // Assert
      expect(urlService.getStats).toHaveBeenCalledWith(urlId);
      expect(urlService.getStats).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.BAD_REQUEST,
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Something went wrong, Please try again later',
          data: error,
        },
      });
    });

    it('should return error response when invalid ID format is provided', async () => {
      // Arrange
      const invalidId = 'invalid-id-format';
      const error = new Error('Invalid ObjectId format');
      urlService.getStats.mockRejectedValue(error);

      // Act
      const result = await feature.handle(invalidId);

      // Assert
      expect(urlService.getStats).toHaveBeenCalledWith(invalidId);
      expect(urlService.getStats).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.BAD_REQUEST,
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Something went wrong, Please try again later',
          data: error,
        },
      });
    });

    it('should return error response when database connection fails', async () => {
      // Arrange
      const urlId = '507f1f77bcf86cd799439011';
      const error = new Error('Database connection timeout');
      urlService.getStats.mockRejectedValue(error);

      // Act
      const result = await feature.handle(urlId);

      // Assert
      expect(urlService.getStats).toHaveBeenCalledWith(urlId);
      expect(urlService.getStats).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.BAD_REQUEST,
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Something went wrong, Please try again later',
          data: error,
        },
      });
    });

    it('should handle empty string ID parameter', async () => {
      // Arrange
      const emptyId = '';
      const error = new Error('ID parameter is required');
      urlService.getStats.mockRejectedValue(error);

      // Act
      const result = await feature.handle(emptyId);

      // Assert
      expect(urlService.getStats).toHaveBeenCalledWith(emptyId);
      expect(urlService.getStats).toHaveBeenCalledTimes(1);
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
      const urlId = '507f1f77bcf86cd799439011';
      urlService.getStats.mockResolvedValue(null as any);

      // Act
      const result = await feature.handle(urlId);

      // Assert
      expect(urlService.getStats).toHaveBeenCalledWith(urlId);
      expect(urlService.getStats).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: 'URL statistics retrieved successfully',
          data: null,
        },
      });
    });
  });
});
