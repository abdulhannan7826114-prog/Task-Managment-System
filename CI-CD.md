# CI/CD Guide

Complete guide to the GitHub Actions Continuous Integration/Continuous Deployment pipeline.

## Overview

The CI/CD pipeline automates:
- Testing (backend and frontend)
- Linting and code quality
- Docker image building
- Security scanning
- Deployment to production

## Workflow File

Main workflow: `.github/workflows/deploy.yml`

Triggered on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

## Pipeline Stages

### 1. Test Backend

Runs Jest tests with MongoDB:

```yaml
test-backend:
  - Install dependencies
  - Run ESLint
  - Run Jest tests
  - Generate coverage report
  - Upload to Codecov
```

**Conditions:**
- Runs on: Ubuntu latest
- Services: MongoDB

**Coverage:**
- Minimum 50% for all metrics
- Reports uploaded to Codecov

### 2. Test Frontend

Runs Vitest tests:

```yaml
test-frontend:
  - Install dependencies
  - Run ESLint
  - Run Vitest tests
  - Build application
  - Upload build artifacts
```

**Artifacts:**
- Saved: `frontend/dist`
- Used for: Docker image building

### 3. Build Docker Images

Builds and pushes to container registry:

```yaml
build-docker:
  - Builds backend image
  - Builds frontend image
  - Pushes to GitHub Container Registry
  - Uses build cache for speed
```

**Conditions:**
- Only on: Push to main branch
- After: Both test jobs pass

**Registry:**
- Uses: GitHub Container Registry (ghcr.io)
- Images tagged with: version, branch, SHA

### 4. Deploy to Production

Deploys to cloud platforms:

```yaml
deploy:
  - Deploys backend to Render
  - Deploys frontend to Vercel
  - Uses deployment webhooks
```

**Conditions:**
- Only on: Push to main branch
- After: Docker build succeeds

**Requires:**
- `RENDER_DEPLOY_HOOK_BACKEND` secret
- `VERCEL_TOKEN` secret
- `VERCEL_ORG_ID` secret
- `VERCEL_PROJECT_ID` secret

### 5. Security Scanning

Automated security checks:

```yaml
security-scan:
  - Snyk vulnerability scanning
  - OWASP Dependency Check
  - Generate security reports
```

**Reports:**
- Saved in: GitHub Artifacts
- Severity: High and above

### 6. Notifications

Sends deployment status:

```yaml
notify:
  - Sends Slack notification
  - Shows pipeline status
  - Includes commit info
```

## Setting Up Secrets

GitHub Actions secrets for deployment:

### 1. Container Registry

```bash
# GitHub Container Registry (automatic)
# Uses GITHUB_TOKEN automatically
```

### 2. Render Deployment

```bash
# In GitHub repo: Settings > Secrets and variables > Actions
# New repository secret: RENDER_DEPLOY_HOOK_BACKEND
# Value: https://api.render.com/deploy/srv-xxxxx?key=xxxxx
```

### 3. Vercel Deployment

```bash
# Create token in Vercel: vercel.com/account/tokens
VERCEL_TOKEN=your_token_here
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

### 4. Code Quality

```bash
# Codecov (optional)
CODECOV_TOKEN=your_token

# Snyk (optional)
SNYK_TOKEN=your_token
```

### 5. Notifications

```bash
# Slack webhook (optional)
SLACK_WEBHOOK=https://hooks.slack.com/services/xxxxx
```

## Viewing Workflow Results

### GitHub Actions Tab

```
Repository > Actions > Workflow name
```

Shows:
- Job status (pass/fail)
- Duration
- Logs for each step
- Artifacts

### View Logs

```bash
# Click on workflow run
# Click on failed job
# View step details
```

### Download Artifacts

```
Repository > Actions > Workflow run > Artifacts
```

Artifacts available:
- Frontend build
- Coverage reports
- OWASP reports

## Environment-Specific Testing

### Test Environment

Backend tests use test database:

```
MONGODB_URI=mongodb://localhost:27017/task-management-test
JWT_SECRET=test-secret-key
NODE_ENV=test
```

### Production Environment

Deployment uses production secrets:

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=production-secret
NODE_ENV=production
```

## Pull Request Checks

PR workflows:
1. Run all tests
2. Check code coverage
3. Run linting
4. Security scanning
5. Report status

### Check Required Status Checks

In repo settings, make these required:
- `test-backend` ✓
- `test-frontend` ✓
- `build-docker` ✓

Branch protection prevents merge without passing checks.

## Customizing the Workflow

### Modify Test Thresholds

Edit `.github/workflows/deploy.yml`:

```yaml
test-backend:
  - name: Run tests
    run: npm test -- --coverage=40  # Change threshold
```

### Add New Job

```yaml
jobs:
  new-job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run custom script
        run: ./scripts/custom.sh
```

### Schedule Workflow

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM daily
```

### Filter by Path

```yaml
on:
  push:
    paths:
      - 'backend/**'
      - '.github/workflows/**'
```

## Troubleshooting

### Workflow Failed

1. Click workflow run
2. Click failed job
3. Scroll to failed step
4. Read error message
5. Check logs

### Common Failures

**Tests failing:**
- Check test output in logs
- Verify MongoDB connection
- Review recent code changes

**Build failing:**
- Check Docker build logs
- Verify Dockerfile syntax
- Check missing dependencies

**Deploy failing:**
- Verify secrets are set
- Check webhook URLs
- Verify credentials

**Coverage report missing:**
- Ensure tests generate coverage
- Check jest.config.js settings
- Verify Codecov token

### Rerun Workflow

```
Click "Re-run job" or "Re-run all jobs"
```

## Performance Optimization

### Caching Dependencies

```yaml
- uses: actions/setup-node@v3
  with:
    cache: 'npm'
    cache-dependency-path: backend/package-lock.json
```

### Parallel Jobs

Existing jobs run in parallel:
- `test-backend` and `test-frontend` run simultaneously
- `build-docker` and `deploy` run after tests pass

### Skip Workflow

To skip pipeline for a commit:

```bash
git commit -m "Fix typo [skip ci]"
```

## Monitoring & Analytics

### View Workflow Statistics

```
Repository > Insights > Actions
```

Shows:
- Most time-consuming jobs
- Success/failure rate
- Execution time trends

### Cost Estimation

GitHub Actions free tier: 2000 minutes/month
- Small app: ~50 minutes/month
- Larger app: 100-200 minutes/month

## Security Best Practices

### 1. Secret Management

✓ Store secrets in GitHub Settings
✗ Don't commit `.env` files
✗ Don't log sensitive data

### 2. Token Scope

Use minimal required permissions:

```yaml
permissions:
  contents: read
  packages: write
```

### 3. Update Actions

Keep actions updated:

```yaml
uses: actions/checkout@v3  # Specific version
```

### 4. Review Logs

Be careful with logs - they may contain:
- API responses
- Error messages
- User data

Mark sensitive steps as:

```yaml
- name: Deploy
  run: ./deploy.sh
  env:
    API_KEY: ${{ secrets.API_KEY }}
```

## Advanced Configuration

### Matrix Strategy

Run tests across versions:

```yaml
strategy:
  matrix:
    node-version: [16, 18, 20]
steps:
  - uses: actions/setup-node@v3
    with:
      node-version: ${{ matrix.node-version }}
```

### Conditional Steps

```yaml
- name: Deploy
  if: github.ref == 'refs/heads/main'
  run: npm run deploy
```

### Artifacts Retention

```yaml
- uses: actions/upload-artifact@v3
  with:
    name: test-results
    retention-days: 30
```

## Integration with Other Tools

### Slack Integration

Send notifications via Slack:

```yaml
- name: Slack Notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Email Notifications

Use GitHub's native email:

Settings > Notifications > Workflow runs

### Linear/Jira Integration

Link deployments to issues:

```yaml
- name: Create Jira Issue
  uses: plexdata/jira-action@v0
```

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Security Hardening](https://docs.github.com/en/actions/security-guides)
- [Actions Marketplace](https://github.com/marketplace?type=actions)

---

For questions about CI/CD, check GitHub Actions documentation or open an issue.
