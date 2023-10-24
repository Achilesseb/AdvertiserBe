import { S3Client } from '@aws-sdk/client-s3';

import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.AWS_KEY_ID as string,
  secretAccessKey: process.env.AWS_KEY as string,
  region: process.env.AWS_REGION,
});

export const awsSes = new AWS.SES();

export const awsS3 = new S3Client({
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_KEY as string,
  },
  region: process.env.NEXT_PUBLIC_AWS_REGION,
});

export const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
