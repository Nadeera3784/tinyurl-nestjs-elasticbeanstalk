import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UrlService } from './url.service';
import { Url } from '../schemas';
import { UrlStatusEnum } from '../enums';
import { CreateUrlDto, UpdateUrlDto } from '../dtos';

describe('UrlService', () => {
  let service: UrlService;

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

  const mockUrlModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
    deleteOne: jest.fn(),
    countDocuments: jest.fn(),
    new: jest.fn(),
    constructor: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: getModelToken(Url.name),
          useValue: mockUrlModel,
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of URLs', async () => {
      const mockUrls = [mockUrl];
      mockUrlModel.find.mockReturnValue({
        select: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockUrls),
        }),
      });

      const result = await service.getAll();
      expect(result).toEqual(mockUrls);
      expect(mockUrlModel.find).toHaveBeenCalled();
    });

    it('should return URLs filtered by status', async () => {
      const mockUrls = [mockUrl];
      mockUrlModel.find.mockReturnValue({
        select: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockUrls),
        }),
      });

      const result = await service.getAll(UrlStatusEnum.ACTIVE);
      expect(result).toEqual(mockUrls);
      expect(mockUrlModel.find).toHaveBeenCalledWith({
        status: UrlStatusEnum.ACTIVE,
      });
    });
  });

  describe('getById', () => {
    it('should return a URL by ID', async () => {
      mockUrlModel.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUrl),
      });

      const result = await service.getById(mockUrl._id);
      expect(result).toEqual(mockUrl);
      expect(mockUrlModel.findById).toHaveBeenCalledWith(mockUrl._id);
    });

    it('should throw NotFoundException when URL not found', async () => {
      mockUrlModel.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getById('nonexistent-id')).rejects.toThrow(
        'URL not found',
      );
    });
  });

  describe('getByShortCode', () => {
    it('should return a URL by short code', async () => {
      const futureDate = new Date('2030-12-31');
      const validUrl = { ...mockUrl, expires_at: futureDate };
      mockUrlModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(validUrl),
      });

      const result = await service.getByShortCode(mockUrl.short_code);
      expect(result).toEqual(validUrl);
      expect(mockUrlModel.findOne).toHaveBeenCalledWith({
        short_code: mockUrl.short_code,
        status: UrlStatusEnum.ACTIVE,
      });
    });

    it('should throw NotFoundException when short code not found', async () => {
      mockUrlModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getByShortCode('nonexistent')).rejects.toThrow(
        'Short URL not found or inactive',
      );
    });

    it('should throw NotFoundException when URL is expired', async () => {
      const expiredUrl = { ...mockUrl, expires_at: new Date('2020-01-01') };
      mockUrlModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(expiredUrl),
      });

      await expect(service.getByShortCode(mockUrl.short_code)).rejects.toThrow(
        'Short URL has expired',
      );
    });
  });

  describe('create', () => {
    const createUrlDto: CreateUrlDto = {
      original_url: 'https://example.com',
      custom_short_code: 'custom123',
      status: UrlStatusEnum.ACTIVE,
    };

    it('should create a new URL with custom short code', async () => {
      const createdUrl = {
        ...mockUrl,
        short_code: 'custom123',
        toObject: () => ({ ...mockUrl, short_code: 'custom123' }),
      };
      mockUrlModel.create.mockResolvedValue(createdUrl);
      mockUrlModel.findOne.mockResolvedValue(null);

      const result = await service.create(createUrlDto);
      expect(result).toEqual({ ...mockUrl, short_code: 'custom123' } as any);
      expect(mockUrlModel.create).toHaveBeenCalled();
    });

    it('should create a new URL with generated short code', async () => {
      const createUrlDtoWithoutCustomCode = {
        original_url: 'https://example.com',
      };
      const mockCreatedUrl = {
        ...mockUrl,
        toObject: () => mockUrl,
      };
      mockUrlModel.create.mockResolvedValue(mockCreatedUrl);
      mockUrlModel.findOne.mockResolvedValue(null);

      const result = await service.create(createUrlDtoWithoutCustomCode);
      expect(result).toEqual(mockUrl);
      expect(mockUrlModel.create).toHaveBeenCalled();
    });

    it('should throw error if custom short code already exists', async () => {
      mockUrlModel.findOne.mockResolvedValue(mockUrl);

      await expect(service.create(createUrlDto)).rejects.toThrow(
        'Custom short code already exists',
      );
    });
  });

  describe('update', () => {
    const updateUrlDto: UpdateUrlDto = {
      original_url: 'https://updated-example.com',
      status: UrlStatusEnum.INACTIVE,
    };

    it('should update an existing URL', async () => {
      const updatedUrl = { ...mockUrl, ...updateUrlDto };
      mockUrlModel.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue(updatedUrl),
      });

      const result = await service.update(mockUrl._id, updateUrlDto);
      expect(result).toEqual(updatedUrl);
      expect(mockUrlModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockUrl._id,
        { ...updateUrlDto, updated_at: expect.any(Date) },
        { new: true, runValidators: true },
      );
    });

    it('should throw NotFoundException when URL to update not found', async () => {
      mockUrlModel.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.update('nonexistent-id', updateUrlDto),
      ).rejects.toThrow('URL not found');
    });
  });

  describe('delete', () => {
    it('should delete a URL', async () => {
      mockUrlModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const result = await service.delete(mockUrl._id);
      expect(result).toEqual({ deletedCount: 1 });
      expect(mockUrlModel.deleteOne).toHaveBeenCalledWith({ _id: mockUrl._id });
    });
  });

  describe('incrementClickCount', () => {
    it('should increment click count for a URL', async () => {
      const updatedUrl = { ...mockUrl, click_count: 1 };
      mockUrlModel.findOneAndUpdate.mockResolvedValue(updatedUrl);

      const result = await service.incrementClickCount(mockUrl.short_code);
      expect(result).toEqual(updatedUrl);
      expect(mockUrlModel.findOneAndUpdate).toHaveBeenCalledWith(
        { short_code: mockUrl.short_code },
        { $inc: { click_count: 1 } },
        { new: true },
      );
    });

    it('should return null when URL not found', async () => {
      mockUrlModel.findOneAndUpdate.mockResolvedValue(null);

      const result = await service.incrementClickCount('nonexistent');
      expect(result).toBeNull();
    });
  });
});
