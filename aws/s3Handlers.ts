import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { awsS3, bucketName } from './awsClients';

export const uploadVideoToS3 = async (objectKey: string, file: File) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    Body: file,
  });

  try {
    await awsS3.send(command);
  } catch (err) {
    console.error(err);
  }
};

export const getVideoUrlAws = async (objectKey: string) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });
  const url = await getSignedUrl(awsS3, command, { expiresIn: 3600 });

  return url;
};

export const deleteVideoFromAws = async (objectKey: string) => {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });
  try {
    await awsS3.send(command);
  } catch (err) {
    console.error(err);
  }
};
