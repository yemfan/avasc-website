import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION ?? "us-east-1";

export function getS3Client() {
  return new S3Client({
    region,
    credentials:
      process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          }
        : undefined,
  });
}

export async function presignEvidencePut(params: {
  key: string;
  contentType: string;
  contentLength: number;
}): Promise<string> {
  const bucket = process.env.S3_BUCKET_AVASC;
  if (!bucket) throw new Error("S3_BUCKET_AVASC is not set");

  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: params.key,
    ContentType: params.contentType,
    ContentLength: params.contentLength,
  });
  return getSignedUrl(client, command, { expiresIn: 60 * 15 });
}

export async function presignEvidenceGet(key: string): Promise<string> {
  const bucket = process.env.S3_BUCKET_AVASC;
  if (!bucket) throw new Error("S3_BUCKET_AVASC is not set");

  const client = getS3Client();
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return getSignedUrl(client, command, { expiresIn: 60 * 10 });
}
