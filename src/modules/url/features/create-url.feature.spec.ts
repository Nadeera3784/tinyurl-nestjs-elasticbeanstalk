import { Test, TestingModule } from '@nestjs/testing';
import { CreateUrlFeature } from './create-url.feature';
import { UrlService } from '../services';
import { CreateUrlDto } from '../dtos';
import { UrlStatusEnum } from '../enums';

describe('CreateUrlFeature', () => {
  let feature: CreateUrlFeature;
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
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUrlFeature,
        {
          provide: UrlService,
          useValue: mockUrlService,
        },
      ],
    }).compile();

    feature = module.get<CreateUrlFeature>(CreateUrlFeature);
    urlService = module.get<UrlService>(UrlService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(feature).toBeDefined();
  });

  describe('handle', () => {
    const createUrlDto: CreateUrlDto = {
      original_url: 'https://example.com',
      custom_short_code: 'custom123',
      status: UrlStatusEnum.ACTIVE,
    };

    it('should successfully create a URL', async () => {
      mockUrlService.create.mockResolvedValue(mockUrl);

      const result = await feature.handle(createUrlDto);

      expect(result.status).toBe(201);
      expect(result.response.statusCode).toBe(201);
      expect(result.response.message).toBe('Short URL created successfully');
      expect(result.response.data).toEqual({
        id: mockUrl._id,
        original_url: mockUrl.original_url,
        short_code: mockUrl.short_code,
        short_url: `${process.env.BASE_URL || 'http://localhost:3000'}/${mockUrl.short_code}`,
        status: mockUrl.status,
        expires_at: mockUrl.expires_at,
        created_at: mockUrl.created_at,
      });
      expect(urlService.create).toHaveBeenCalledWith(createUrlDto);
    });

    it('should handle creation errors', async () => {
      const errorMessage = 'Custom short code already exists';
      mockUrlService.create.mockRejectedValue(new Error(errorMessage));

      const result = await feature.handle(createUrlDto);

      expect(result.status).toBe(400);
      expect(result.response.statusCode).toBe(400);
      expect(result.response.message).toBe(
        'Something went wrong. please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle validation errors', async () => {
      const invalidDto = {} as CreateUrlDto;
      mockUrlService.create.mockRejectedValue(new Error('Validation failed'));

      const result = await feature.handle(invalidDto);

      expect(result.status).toBe(400);
      expect(result.response.statusCode).toBe(400);
      expect(result.response.message).toBe(
        'Something went wrong. please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });
  });
});
