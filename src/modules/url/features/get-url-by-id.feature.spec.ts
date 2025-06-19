import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { GetUrlByIdFeature } from './get-url-by-id.feature';
import { UrlService } from '../services';

describe('GetUrlByIdFeature', () => {
  let feature: GetUrlByIdFeature;
  let urlService: jest.Mocked<UrlService>;

  const mockUrl = {
    _id: '507f1f77bcf86cd799439011',
    original_url: 'https://example.com',
    short_code: 'abc123',
    clicks: 5,
    status: 'active',
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
    expires_at: null,
  } as any;

  beforeEach(async () => {
    const mockUrlService = {
      getById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUrlByIdFeature,
        {
          provide: UrlService,
          useValue: mockUrlService,
        },
      ],
    }).compile();

    feature = module.get<GetUrlByIdFeature>(GetUrlByIdFeature);
    urlService = module.get(UrlService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should return success response with URL when found', async () => {
      // Arrange
      const urlId = '507f1f77bcf86cd799439011';
      urlService.getById.mockResolvedValue(mockUrl);

      // Act
      const result = await feature.handle(urlId);

      // Assert
      expect(urlService.getById).toHaveBeenCalledWith(urlId);
      expect(urlService.getById).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: 'URL retrieved successfully',
          data: mockUrl,
        },
      });
    });

    it('should return error response when URL not found', async () => {
      // Arrange
      const urlId = '507f1f77bcf86cd799439999';
      const error = new Error('URL not found');
      urlService.getById.mockRejectedValue(error);

      // Act
      const result = await feature.handle(urlId);

      // Assert
      expect(urlService.getById).toHaveBeenCalledWith(urlId);
      expect(urlService.getById).toHaveBeenCalledTimes(1);
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
      const invalidId = 'invalid-id';
      const error = new Error('Invalid ObjectId format');
      urlService.getById.mockRejectedValue(error);

      // Act
      const result = await feature.handle(invalidId);

      // Assert
      expect(urlService.getById).toHaveBeenCalledWith(invalidId);
      expect(urlService.getById).toHaveBeenCalledTimes(1);
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
      const error = new Error('Database connection failed');
      urlService.getById.mockRejectedValue(error);

      // Act
      const result = await feature.handle(urlId);

      // Assert
      expect(urlService.getById).toHaveBeenCalledWith(urlId);
      expect(urlService.getById).toHaveBeenCalledTimes(1);
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
      const error = new Error('ID cannot be empty');
      urlService.getById.mockRejectedValue(error);

      // Act
      const result = await feature.handle(emptyId);

      // Assert
      expect(urlService.getById).toHaveBeenCalledWith(emptyId);
      expect(urlService.getById).toHaveBeenCalledTimes(1);
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
      urlService.getById.mockResolvedValue(null as any);

      // Act
      const result = await feature.handle(urlId);

      // Assert
      expect(urlService.getById).toHaveBeenCalledWith(urlId);
      expect(urlService.getById).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: 'URL retrieved successfully',
          data: null,
        },
      });
    });
  });
});
