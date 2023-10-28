import { SESClient } from '@aws-sdk/client-ses'; // ES Modules import

export const ses = new SESClient({
  credentials: {
    accessKeyId: process.env.AWS_KEY_ID as string,
    secretAccessKey: process.env.AWS_KEY as string,
  },
  region: process.env.AWS_REGION,
});
