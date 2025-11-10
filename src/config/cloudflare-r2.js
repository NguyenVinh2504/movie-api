import { S3Client } from '@aws-sdk/client-s3'
import { env } from './environment.js'

/**
 * Cấu hình Cloudflare R2 Client
 * R2 tương thích với S3 API nên sử dụng AWS SDK
 */
export const r2Client = new S3Client({
  region: 'auto', // R2 sử dụng 'auto' cho region
  endpoint: env.R2_ENDPOINT, // Format: https://<account-id>.r2.cloudflarestorage.com
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY
  }
})

// Tên bucket R2 cho subtitle
export const R2_SUBTITLE_BUCKET = env.R2_SUBTITLE_BUCKET || 'subtitles'

