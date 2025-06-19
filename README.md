# TinyURL - URL Shortener Service

Hey there! 👋 This is a simple URL shortener service built with NestJS and MongoDB. Think of it like bit.ly or tinyurl.com, but one you can run yourself.

This service is designed to be cloud-ready and can be easily deployed to AWS Elastic Beanstalk with DocumentDB (MongoDB-compatible) for a fully managed, scalable solution. Whether you want to run it locally with Docker or deploy it to production on AWS, I've got you covered!

## What does it do?

Ever had a really long URL that you wanted to share but it looked ugly? This service takes those long URLs and gives you a short, clean link instead. Perfect for social media, emails, or anywhere you want to keep things tidy.

**Example:**
- Long URL: `https://www.example.com/some/really/long/path/with/lots/of/parameters?param1=value1&param2=value2`
- Short URL: `http://localhost:3000/abc123`

## Features

- ✅ Shorten any URL instantly
- ✅ Custom short codes (want "mylink" instead of random letters? You got it!)
- ✅ Click tracking (see how many people clicked your link)
- ✅ URL expiration dates (links that automatically stop working after a certain date)
- ✅ Enable/disable links without deleting them
- ✅ Simple REST API that's easy to use

## Quick Start

### Using Docker (Recommended)

The easiest way to get started is with Docker. Just run:

```bash
docker-compose up
```

That's it! The service will be running at `http://localhost:3000`

### Manual Setup

If you prefer to run things manually:

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start MongoDB**
   Make sure you have MongoDB running locally on port 27017

3. **Start the app**
   ```bash
   npm run start:dev
   ```

## How to Use

### Create a Short URL

```bash
curl -X POST http://localhost:3000/api/url \
  -H "Content-Type: application/json" \
  -d '{"original_url": "https://www.example.com"}'
```

### Create a Custom Short URL

```bash
curl -X POST http://localhost:3000/api/url \
  -H "Content-Type: application/json" \
  -d '{"original_url": "https://www.example.com", "custom_short_code": "mylink"}'
```

### Use Your Short URL

Just visit `http://localhost:3000/abc123` (or whatever short code you got) and you'll be redirected to the original URL.

### Get All Your URLs

```bash
curl http://localhost:3000/api/url
```

### Check Click Stats

```bash
curl http://localhost:3000/api/url/YOUR_URL_ID/stats
```

## API Endpoints

| Method | Endpoint | What it does |
|--------|----------|--------------|
| `POST` | `/api/url` | Create a new short URL |
| `GET` | `/api/url` | Get all your URLs |
| `GET` | `/api/url/:id` | Get a specific URL |
| `PUT` | `/api/url/:id` | Update a URL |
| `DELETE` | `/api/url/:id` | Delete a URL |
| `GET` | `/api/url/:id/stats` | Get click statistics |
| `GET` | `/api/:shortCode` | Redirect to original URL |
| `GET` | `/api/health` | Check if the service is running |

## Development

Want to contribute or modify the code? Here's what you need to know:

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:cov

# Run end-to-end tests
npm run test:e2e
```

### Code Quality

```bash
# Check code style
npm run lint

# Format code
npm run format
```

### Project Structure

```
src/
├── modules/
│   ├── app/           # Main app module and health checks
│   └── url/           # URL shortening logic
│       ├── controllers/   # API endpoints
│       ├── features/      # Business logic
│       ├── services/      # Database operations
│       ├── schemas/       # MongoDB models
│       └── dtos/          # Data validation
```

## Deployment

### AWS Elastic Beanstalk + DocumentDB

This service is production-ready for AWS deployment:

1. **DocumentDB Setup**: Create an AWS DocumentDB cluster (MongoDB-compatible)
2. **Elastic Beanstalk**: Deploy the app using the included `Procfile`
3. **Environment Variables**: Configure the following in EB:
   - `MONGODB_URI` - Your DocumentDB connection string
   - `PORT` - Will be set automatically by EB
   - `HOST` - Set to `0.0.0.0` for container binding

The app automatically handles container deployment and scales with your traffic!

## Environment Variables

You can customize the app with these environment variables:

- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string (local) or DocumentDB connection string (AWS)
- `HOST` - Server host (default: 0.0.0.0 for Docker/containers)

## Tech Stack

- **NestJS** - The main framework (like Express but fancier)
- **MongoDB** - Database for storing URLs
- **Mongoose** - MongoDB object modeling
- **Jest** - Testing framework
- **Docker** - For easy deployment

## Why I Built This

URL shorteners are everywhere, but sometimes you want your own. Maybe for privacy, custom domains, or just because you can! This project shows how to build a production-ready service with proper testing, clean architecture, and all the features you'd expect.

