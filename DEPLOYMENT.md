# Deployment Setup

## GitHub Actions Secrets

You need to configure the following secrets in your GitHub repository settings:

### Required Secrets:

1. **AWS_ACCESS_KEY_ID**: Your AWS access key ID
2. **AWS_SECRET_ACCESS_KEY**: Your AWS secret access key  
3. **AWS_ACCOUNT_ID**: Your AWS account ID (12-digit number)

### Setting up GitHub Secrets:

1. Go to your GitHub repository
2. Click on Settings → Secrets and variables → Actions
3. Click "New repository secret" and add each secret

## AWS Setup

### Elastic Beanstalk Configuration:
- **Application Name**: `tinyurl`
- **Environment Name**: `tinyurl-development-environment`
- **Region**: `us-east-1`


## Pipeline Flow

1. **Test Stage**: Runs linting, unit tests, and e2e tests
2. **Build Stage**: Builds the application and creates deployment package
3. **Deploy Stage**: Deploys to AWS Elastic Beanstalk (only on main/master branch)

## Deployment Package

The deployment package includes:
- Built application (`dist/` folder)
- `package.json` and `package-lock.json`
- `Procfile` for process management
- `.ebextensions/` configuration files

## Environment Variables

The following environment variables are set in Elastic Beanstalk:
- `NODE_ENV=production`
- `PORT=8080`
