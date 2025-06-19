import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { DeleteUrlFeature } from './delete-url.feature';
import { UrlService } from '../services';

describe('DeleteUrlFeature', () => {
  let feature: DeleteUrlFeature;
  let urlService: jest.Mocked<UrlService>;

  const mockDeleteResult = {
    acknowledged: true,
    deletedCount: 1,
  };

  beforeEach(async () => {
    const mockUrlService = {
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUrlFeature,
        {
          provide: UrlService,
          useValue: mockUrlService,
        },
      ],
    }).compile();

    feature = module.get<DeleteUrlFeature>(DeleteUrlFeature);
    urlService = module.get(UrlService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should return success response when URL is deleted successfully', async () => {
      // Arrange
      const urlId = '507f1f77bcf86cd799439011';
      urlService.delete.mockResolvedValue(mockDeleteResult);

      // Act
      const result = await feature.handle(urlId);

      // Assert
      expect(urlService.delete).toHaveBeenCalledWith(urlId);
      expect(urlService.delete).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: 'URL has been deleted',
          data: mockDeleteResult,
        },
      });
    });

    it('should return success response when no document is deleted', async () => {
      // Arrange
      const urlId = '507f1f77bcf86cd799439011';
      const noDeleteResult = {
        acknowledged: true,
        deletedCount: 0,
      };
      urlService.delete.mockResolvedValue(noDeleteResult);

      // Act
      const result = await feature.handle(urlId);

      // Assert
      expect(urlService.delete).toHaveBeenCalledWith(urlId);
      expect(urlService.delete).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: 'URL has been deleted',
          data: noDeleteResult,
        },
      });
    });

    it('should return error response when URL not found', async () => {
      // Arrange
      const urlId = '507f1f77bcf86cd799439999';
      const error = new Error('URL not found');
      urlService.delete.mockRejectedValue(error);

      // Act
      const result = await feature.handle(urlId);

      // Assert
      expect(urlService.delete).toHaveBeenCalledWith(urlId);
      expect(urlService.delete).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.BAD_REQUEST,
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Something went wrong. please try again later',
          data: error,
        },
      });
    });

    it('should return error response when invalid ID format is provided', async () => {
      // Arrange
      const invalidId = 'invalid-id-format';
      const error = new Error('Invalid ObjectId format');
      urlService.delete.mockRejectedValue(error);

      // Act
      const result = await feature.handle(invalidId);

      // Assert
      expect(urlService.delete).toHaveBeenCalledWith(invalidId);
      expect(urlService.delete).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.BAD_REQUEST,
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Something went wrong. please try again later',
          data: error,
        },
      });
    });

    it('should return error response when database connection fails', async () => {
      // Arrange
      const urlId = '507f1f77bcf86cd799439011';
      const error = new Error('Database connection timeout');
      urlService.delete.mockRejectedValue(error);

      // Act
      const result = await feature.handle(urlId);

      // Assert
      expect(urlService.delete).toHaveBeenCalledWith(urlId);
      expect(urlService.delete).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.BAD_REQUEST,
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Something went wrong. please try again later',
          data: error,
        },
      });
    });

    it('should return error response when URL is already deleted', async () => {
      // Arrange
      const urlId = '507f1f77bcf86cd799439011';
      const error = new Error('URL has already been deleted');
      urlService.delete.mockRejectedValue(error);

      // Act
      const result = await feature.handle(urlId);

      // Assert
      expect(urlService.delete).toHaveBeenCalledWith(urlId);
      expect(urlService.delete).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.BAD_REQUEST,
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Something went wrong. please try again later',
          data: error,
        },
      });
    });

    it('should handle empty string ID parameter', async () => {
      // Arrange
      const emptyId = '';
      const error = new Error('ID parameter is required');
      urlService.delete.mockRejectedValue(error);

      // Act
      const result = await feature.handle(emptyId);

      // Assert
      expect(urlService.delete).toHaveBeenCalledWith(emptyId);
      expect(urlService.delete).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.BAD_REQUEST,
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Something went wrong. please try again later',
          data: error,
        },
      });
    });

    it('should return error response when deletion operation fails due to constraints', async () => {
      // Arrange
      const urlId = '507f1f77bcf86cd799439011';
      const error = new Error('Cannot delete URL with active redirects');
      urlService.delete.mockRejectedValue(error);

      // Act
      const result = await feature.handle(urlId);

      // Assert
      expect(urlService.delete).toHaveBeenCalledWith(urlId);
      expect(urlService.delete).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.BAD_REQUEST,
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Something went wrong. please try again later',
          data: error,
        },
      });
    });

    it('should handle generic string error', async () => {
      // Arrange
      const urlId = '507f1f77bcf86cd799439011';
      const error = 'Network timeout occurred';
      urlService.delete.mockRejectedValue(error);

      // Act
      const result = await feature.handle(urlId);

      // Assert
      expect(urlService.delete).toHaveBeenCalledWith(urlId);
      expect(urlService.delete).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: HttpStatus.BAD_REQUEST,
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Something went wrong. please try again later',
          data: error,
        },
      });
    });
  });
});
