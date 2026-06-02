#!/usr/bin/env bash
set -euo pipefail

SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPTS_DIR")"

cd "$PROJECT_DIR"

# Sync built site to S3
s3cmd -c $S3CMD_CONFIG sync --delete-removed -P "$PROJECT_DIR/build/"* $DEPLOY_ENDPOINT

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --profile production \
  --distribution-id $CLOUDFRONT_ID \
  --paths "/*"

echo "Deployment complete!"
