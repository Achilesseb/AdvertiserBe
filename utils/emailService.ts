import Mailjet, { type Client } from 'node-mailjet';

import { INVALID_EMAIL_CONFIG } from '../constants/queryErrorMessages';

type EmailData = {
  recipient: string;
  subject: string;
  body: string;
};

// type CustomMailjet = typeof Mailjet & {
//   new (params: unknown): Client;
// };

// const mailjet = new (Mailjet as CustomMailjet)({
//   apiKey: process.env.MAILJET_APIKEY_PUBLIC,
//   apiSecret: process.env.MAILJET_APIKEY_PRIVATE,
// });

// const sendEmail = async (emailData: EmailData) => {
//   if (!process.env.MAILJET_SENDER) {
//     throw new Error(INVALID_EMAIL_CONFIG);
//   }

//   const { recipient, subject, body } = emailData;
//   const data = {
//     Messages: [
//       {
//         From: {
//           Email: process.env.MAILJET_SENDER,
//         },
//         To: [
//           {
//             Email: recipient,
//           },
//         ],
//         Subject: subject,
//         HTMLPart: body,
//       },
//     ],
//   };
//   const result = await mailjet.post('send', { version: 'v3.1' }).request(data);

//   return result.response.status;
// };

// export default sendEmail;
