# TinyURL API Documentation

This document describes the REST API endpoints for the TinyURL service.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, no authentication is required. All endpoints are publicly accessible.

## Endpoints

### URL Management

#### 1. Create Short URL

**POST** `/url`

Creates a new shortened URL.

**Request Body:**
```json
{
  "original_url": "https://example.com/very/long/url",
  "custom_short_code": "my-custom-code", // Optional
  "expires_at": "2024-12-31T23:59:59Z", // Optional
  "status": "active" // Optional, defaults to "active"
}
```

**Response (201 Created):**
```json
{
  "statusCode": 201,
  "message": "Short URL created successfully",
  "data": {
    "id": "64f123abc456789012345678",
    "original_url": "https://example.com/very/long/url",
    "short_code": "abc123XY",
    "short_url": "http://localhost:3000/abc123XY",
    "status": "active",
    "expires_at": "2024-12-31T23:59:59.000Z",
    "created_at": "2023-12-01T10:30:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": "Custom short code already exists",
  "data": null
}
```

#### 2. Get All URLs

**GET** `/url?status=active`

Retrieves all shortened URLs. Optionally filter by status.

**Query Parameters:**
- `status` (optional): Filter by status (`active` or `inactive`)

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "Urls fetched successfully",
  "data": [
    {
      "id": "64f123abc456789012345678",
      "original_url": "https://example.com/very/long/url",
      "short_code": "abc123XY",
      "status": "active",
      "click_count": 25,
      "expires_at": null,
      "created_at": "2023-12-01T10:30:00.000Z",
      "updated_at": "2023-12-01T10:30:00.000Z"
    }
  ]
}
```

#### 3. Get URL by ID

**GET** `/url/{id}`

Retrieves a specific URL by its database ID.

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "URL retrieved successfully",
  "data": {
    "id": "64f123abc456789012345678",
    "original_url": "https://example.com/very/long/url",
    "short_code": "abc123XY",
    "status": "active",
    "click_count": 25,
    "expires_at": null,
    "created_at": "2023-12-01T10:30:00.000Z",
    "updated_at": "2023-12-01T10:30:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "URL not found"
}
```

#### 4. Update URL

**PUT** `/url/{id}`

Updates an existing URL.

**Request Body:**
```json
{
  "original_url": "https://updated-example.com",
  "status": "inactive",
  "expires_at": "2024-06-30T23:59:59Z"
}
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "URL updated successfully",
  "data": {
    "id": "64f123abc456789012345678",
    "original_url": "https://updated-example.com",
    "short_code": "abc123XY",
    "status": "inactive",
    "click_count": 25,
    "expires_at": "2024-06-30T23:59:59.000Z",
    "created_at": "2023-12-01T10:30:00.000Z",
    "updated_at": "2023-12-01T15:45:00.000Z"
  }
}
```

#### 5. Delete URL

**DELETE** `/url/{id}`

Deletes a URL permanently.

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "URL deleted successfully"
}
```

#### 6. Get URL Statistics

**GET** `/url/{id}/stats`

Retrieves detailed statistics for a URL.

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "URL statistics retrieved successfully",
  "data": {
    "id": "64f123abc456789012345678",
    "original_url": "https://example.com/very/long/url",
    "short_code": "abc123XY",
    "click_count": 25,
    "status": "active",
    "created_at": "2023-12-01T10:30:00.000Z",
    "expires_at": null
  }
}
```

### URL Redirection

#### 7. Redirect Short URL

**GET** `/{shortCode}`

Redirects to the original URL and increments click count.

**Response (302 Found):**
- Redirects to the original URL
- Location header contains the original URL

**Error Response (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Short URL not found or inactive"
}
```

## Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `302 Found` - Redirect to original URL
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists

## Data Models

### URL Schema

```json
{
  "id": "string", // MongoDB ObjectId
  "original_url": "string", // Valid URL
  "short_code": "string", // Unique identifier (4-20 characters)
  "status": "active|inactive",
  "click_count": "number", // Number of times accessed
  "expires_at": "string|null", // ISO date string or null
  "created_at": "string", // ISO date string
  "updated_at": "string" // ISO date string
}
```

### Status Enum

- `active` - URL is active and accessible
- `inactive` - URL is disabled and not accessible

## Rate Limiting

The API is protected by rate limiting:
- **TTL**: 60 seconds
- **Limit**: 10 requests per TTL window per IP

When rate limit is exceeded, the API returns:
```json
{
  "statusCode": 429,
  "message": "Too Many Requests"
}
```

## Health Check

**GET** `/status`

Returns the health status of the application.

**Response (200 OK):**
```json
{
  "status": "ok"
}
```

## Error Handling

All errors follow the same format:

```json
{
  "statusCode": "number",
  "message": "string",
  "data": "any|null"
}
```

## Examples

### Create a Simple Short URL

```bash
curl -X POST http://localhost:3000/api/url \
  -H "Content-Type: application/json" \
  -d '{
    "original_url": "https://github.com/nestjs/nest"
  }'
```

### Create with Custom Short Code

```bash
curl -X POST http://localhost:3000/api/url \
  -H "Content-Type: application/json" \
  -d '{
    "original_url": "https://docs.nestjs.com",
    "custom_short_code": "nestjs-docs"
  }'
```

### Access Short URL

```bash
curl -L http://localhost:3000/nestjs-docs
```

### Get Statistics

```bash
curl http://localhost:3000/api/url/64f123abc456789012345678/stats
```

## Environment Variables

The following environment variables affect API behavior:

- `BASE_URL` - Base URL for generated short URLs (default: http://localhost:3000)
- `MONGODB_URI` - MongoDB connection string
- `THROTTLER_TTL` - Rate limiting time window in seconds
- `THROTTLER_LIMIT` - Rate limiting request count per window

## Development

For local development with Docker:

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Access MongoDB
docker-compose exec mongodb mongosh -u admin -p password --authenticationDatabase admin tinyurl
``` 