import { Test, TestingModule } from '@nestjs/testing';
import { RedirectUrlFeature } from './redirect-url.feature';
import { UrlService } from '../services';
import { UrlStatusEnum } from '../enums';

describe('RedirectUrlFeature', () => {
  let feature: RedirectUrlFeature;
  let urlService: UrlService;

  const mockUrl = {
    _id: '648d123456789abcdef12345',
    original_url: 'https://example.com',
    short_code: 'abc123',
    status: UrlStatusEnum.ACTIVE,
    click_count: 0,
    expires_at: new Date('2024-12-31'),
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockUrlService = {
    getByShortCode: jest.fn(),
    incrementClickCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedirectUrlFeature,
        {
          provide: UrlService,
          useValue: mockUrlService,
        },
      ],
    }).compile();

    feature = module.get<RedirectUrlFeature>(RedirectUrlFeature);
    urlService = module.get<UrlService>(UrlService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(feature).toBeDefined();
  });

  describe('handle', () => {
    it('should successfully redirect to URL', async () => {
      mockUrlService.getByShortCode.mockResolvedValue(mockUrl);
      mockUrlService.incrementClickCount.mockResolvedValue({
        ...mockUrl,
        click_count: 1,
      });

      const result = await feature.handle(mockUrl.short_code);

      expect(result.status).toBe(302);
      expect(result.response.statusCode).toBe(302);
      expect(result.response.message).toBe('Redirect URL found');
      expect(result.response.data).toEqual({
        original_url: mockUrl.original_url,
        short_code: mockUrl.short_code,
        click_count: mockUrl.click_count + 1,
      });
      expect(urlService.getByShortCode).toHaveBeenCalledWith(
        mockUrl.short_code,
      );
    });

    it('should handle URL not found', async () => {
      mockUrlService.getByShortCode.mockRejectedValue(
        new Error('Short URL not found or inactive'),
      );

      const result = await feature.handle('nonexistent');

      expect(result.status).toBe(400);
      expect(result.response.statusCode).toBe(400);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
      expect(urlService.incrementClickCount).not.toHaveBeenCalled();
    });

    it('should handle expired URL', async () => {
      mockUrlService.getByShortCode.mockRejectedValue(
        new Error('Short URL has expired'),
      );

      const result = await feature.handle(mockUrl.short_code);

      expect(result.status).toBe(400);
      expect(result.response.statusCode).toBe(400);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
      expect(urlService.incrementClickCount).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      mockUrlService.getByShortCode.mockRejectedValue(
        new Error('Database error'),
      );

      const result = await feature.handle(mockUrl.short_code);

      expect(result.status).toBe(400);
      expect(result.response.statusCode).toBe(400);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });
  });
});
