# Deployment Setup

## GitHub Actions Secrets

You need to configure the following secrets in your GitHub repository settings:

### Required Secrets:

#### AWS Configuration:
1. **AWS_ACCESS_KEY_ID**: Your AWS access key ID
2. **AWS_SECRET_ACCESS_KEY**: Your AWS secret access key  
3. **AWS_ACCOUNT_ID**: Your AWS account ID (12-digit number)
4. **AWS_REGION**: AWS region (e.g., us-east-1)

#### Production Environment:
5. **PROD_ELASTIC_BEANSTALK_NAME**: Production application name (e.g., tinyurl)
6. **PROD_ELASTIC_BEANSTALK_ENV_NAME**: Production environment name (e.g., tinyurl-production-environment)

#### Development Environment:
7. **DEV_ELASTIC_BEANSTALK_NAME**: Development application name (e.g., tinyurl-dev)
8. **DEV_ELASTIC_BEANSTALK_ENV_NAME**: Development environment name (e.g., tinyurl-development-environment)

### Setting up GitHub Secrets:

1. Go to your GitHub repository
2. Click on Settings → Secrets and variables → Actions
3. Click "New repository secret" and add each secret

## AWS Setup

### Elastic Beanstalk Configuration:
- **Application Name**: `tinyurl`
- **Environment Name**: `tinyurl-development-environment`
- **Region**: `us-east-1`


## Elastic Beanstalk Environment Variables

Set follwiongs Environment properties in  Elastic Beanstalk:

- `NODE_ENV=production`
- `PORT=8080`


## Pipeline Overview

You now have **two separate pipelines**:

### 1. Production Pipeline (`production-deploy.yml`)
- **Triggers**: Push/PR to `main` or `master` branches
- **Deploys to**: Production Elastic Beanstalk environment
- **Uses secrets**: `PROD_ELASTIC_BEANSTALK_NAME`, `PROD_ELASTIC_BEANSTALK_ENV_NAME`
- **S3 Path**: `artifacts/tinyurl/`

### 2. Development Pipeline (`development-deploy.yml`)
- **Triggers**: Push/PR to `dev` branch  
- **Deploys to**: Development Elastic Beanstalk environment
- **Uses secrets**: `DEV_ELASTIC_BEANSTALK_NAME`, `DEV_ELASTIC_BEANSTALK_ENV_NAME`
- **S3 Path**: `artifacts/tinyurl-dev/`

## Pipeline Flow (Both Pipelines)

1. **Test Stage**: Runs linting, unit tests, and e2e tests
2. **Build Stage**: Builds the application and creates deployment package
3. **Deploy Stage**: Deploys to respective AWS Elastic Beanstalk environment

## Deployment Package

The deployment package includes:
- Built application (`dist/` folder)
- `package.json` and `package-lock.json`
- `Procfile` for process management
