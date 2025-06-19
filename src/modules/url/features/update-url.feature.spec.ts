import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { UpdateUrlFeature } from './update-url.feature';
import { UrlService } from '../services';
import { UpdateUrlDto } from '../dtos';
import { UrlStatusEnum } from '../enums';

describe('UpdateUrlFeature', () => {
  let feature: UpdateUrlFeature;
  let urlService: jest.Mocked<UrlService>;

  const mockOriginalUrl = {
    _id: '507f1f77bcf86cd799439011',
    original_url: 'https://example.com',
    short_code: 'abc123',
    clicks: 5,
    status: UrlStatusEnum.ACTIVE,
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
    expires_at: null,
  } as any;

  const mockUpdatedUrl = {
    ...mockOriginalUrl,
    original_url: 'https://updated-example.com',
    updated_at: new Date('2023-01-15'),
    expires_at: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    const mockUrlService = {
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUrlFeature,
        {
          provide: UrlService,
          useValue: mockUrlService,
        },
      ],
    }).compile();

    feature = module.get<UpdateUrlFeature>(UpdateUrlFeature);
    urlService = module.get(UrlService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should return success response when URL is updated with all fields', async () => {
      // Arrange
      const urlId = '507f1f77bcf86cd799439011';
      const updateDto: UpdateUrlDto = {
        original_url: 'https://updated-example.com',
        status: UrlStatusEnum.ACTIVE,
        expires_at: new Date('2024-01-01'),
      };
      urlService.update.mockResolvedValue(mockUpdatedUrl);

      // Act
      const result = await feature.handle(urlId, updateDto);

      // Assert
      expect(urlService.update).toHaveBeenCalledWith(urlId, updateDto);
      expect(urlService.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: 'URL updated successfully',
          data: mockUpdatedUrl,
        },
      });
    });

    it('should return success response when URL is updated with only original_url', async () => {
      // Arrange
      const urlId = '507f1f77bcf86cd799439011';
      const updateDto: UpdateUrlDto = {
        original_url: 'https://new-destination.com',
      };
      const partiallyUpdatedUrl = {
        ...mockOriginalUrl,
        original_url: 'https://new-destination.com',
        updated_at: new Date('2023-01-15'),
      };
      urlService.update.mockResolvedValue(partiallyUpdatedUrl);

      // Act
      const result = await feature.handle(urlId, updateDto);

      // Assert
      expect(urlService.update).toHaveBeenCalledWith(urlId, updateDto);
      expect(urlService.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: 'URL updated successfully',
          data: partiallyUpdatedUrl,
        },
      });
    });

    it('should return success response when URL status is updated to inactive', async () => {
      // Arrange
      const urlId = '507f1f77bcf86cd799439011';
      const updateDto: UpdateUrlDto = {
        status: UrlStatusEnum.INACTIVE,
      };
      const statusUpdatedUrl = {
        ...mockOriginalUrl,
        status: UrlStatusEnum.INACTIVE,
        updated_at: new Date('2023-01-15'),
      };
      urlService.update.mockResolvedValue(statusUpdatedUrl);

      // Act
      const result = await feature.handle(urlId, updateDto);

      // Assert
      expect(urlService.update).toHaveBeenCalledWith(urlId, updateDto);
      expect(urlService.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: 'URL updated successfully',
          data: statusUpdatedUrl,
        },
      });
    });

    it('should return success response when expires_at is updated', async () => {
      // Arrange
      const urlId = '507f1f77bcf86cd799439011';
      const expiryDate = new Date('2024-12-31');
      const updateDto: UpdateUrlDto = {
        expires_at: expiryDate,
      };
      const expiryUpdatedUrl = {
        ...mockOriginalUrl,
        expires_at: expiryDate,
        updated_at: new Date('2023-01-15'),
      };
      urlService.update.mockResolvedValue(expiryUpdatedUrl);

      // Act
      const result = await feature.handle(urlId, updateDto);

      // Assert
      expect(urlService.update).toHaveBeenCalledWith(urlId, updateDto);
      expect(urlService.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: 'URL updated successfully',
          data: expiryUpdatedUrl,
        },
      });
    });

    it('should return error response when URL not found', async () => {
      // Arrange
      const urlId = '507f1f77bcf86cd799439999';
      const updateDto: UpdateUrlDto = {
        original_url: 'https://updated-example.com',
      };
      const error = new Error('URL not found');
      urlService.update.mockRejectedValue(error);

      // Act
      const result = await feature.handle(urlId, updateDto);

      // Assert
      expect(urlService.update).toHaveBeenCalledWith(urlId, updateDto);
      expect(urlService.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.BAD_REQUEST,
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Something went wrong, Please try again later',
          data: error,
        },
      });
    });

    it('should return error response when invalid URL format is provided', async () => {
      // Arrange
      const urlId = '507f1f77bcf86cd799439011';
      const updateDto: UpdateUrlDto = {
        original_url: 'not-a-valid-url',
      };
      const error = new Error('Invalid URL format');
      urlService.update.mockRejectedValue(error);

      // Act
      const result = await feature.handle(urlId, updateDto);

      // Assert
      expect(urlService.update).toHaveBeenCalledWith(urlId, updateDto);
      expect(urlService.update).toHaveBeenCalledTimes(1);
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
      const updateDto: UpdateUrlDto = {
        original_url: 'https://example.com',
      };
      const error = new Error('Invalid ObjectId format');
      urlService.update.mockRejectedValue(error);

      // Act
      const result = await feature.handle(invalidId, updateDto);

      // Assert
      expect(urlService.update).toHaveBeenCalledWith(invalidId, updateDto);
      expect(urlService.update).toHaveBeenCalledTimes(1);
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
      const updateDto: UpdateUrlDto = {
        original_url: 'https://example.com',
      };
      const error = new Error('Database connection failed');
      urlService.update.mockRejectedValue(error);

      // Act
      const result = await feature.handle(urlId, updateDto);

      // Assert
      expect(urlService.update).toHaveBeenCalledWith(urlId, updateDto);
      expect(urlService.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.BAD_REQUEST,
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Something went wrong, Please try again later',
          data: error,
        },
      });
    });

    it('should handle empty update DTO', async () => {
      // Arrange
      const urlId = '507f1f77bcf86cd799439011';
      const updateDto: UpdateUrlDto = {};
      urlService.update.mockResolvedValue(mockOriginalUrl);

      // Act
      const result = await feature.handle(urlId, updateDto);

      // Assert
      expect(urlService.update).toHaveBeenCalledWith(urlId, updateDto);
      expect(urlService.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: 'URL updated successfully',
          data: mockOriginalUrl,
        },
      });
    });

    it('should handle null response from service', async () => {
      // Arrange
      const urlId = '507f1f77bcf86cd799439011';
      const updateDto: UpdateUrlDto = {
        original_url: 'https://example.com',
      };
      urlService.update.mockResolvedValue(null as any);

      // Act
      const result = await feature.handle(urlId, updateDto);

      // Assert
      expect(urlService.update).toHaveBeenCalledWith(urlId, updateDto);
      expect(urlService.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: 'URL updated successfully',
          data: null,
        },
      });
    });
  });
});
