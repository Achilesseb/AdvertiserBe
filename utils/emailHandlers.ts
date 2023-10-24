import logger from '../logger';
import nodemailer, { SentMessageInfo } from 'nodemailer';
type ResetCodeEmailVars = {
  token: string | number;
};

type NewContractEmailVars = {
  token: string;
  contract: string;
};

type MailArgs = {
  recipient: string;
  //   locale: string;
  emailVars?: ResetCodeEmailVars | NewContractEmailVars;
};

const sendMailTemplate = async (
  subject: string,
  body: string,
  emailArgs: MailArgs,
) => {
  try {
    const emailParams = {
      to: emailArgs.recipient,
      subject,
      body: `${body}: ${emailArgs.emailVars?.token}`,
    };

    const transporter = nodemailer.createTransport({
      host: 'email-smtp.eu-central-1.amazonaws.com',
      port: 587,
      auth: {
        user: 'AKIAWXKLYE5KMSXRZTIH',
        pass: 'BI4s6WPdJJ78eNA7ekGE6m6cHT12JYZw2bRRTV69Ov3f',
      },
    });

    transporter.sendMail(
      emailParams,
      (error: Error | null, info: SentMessageInfo) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      },
    );
  } catch (error) {
    logger.error(error);
    return 400;
  }
};

export const sendPasswordResetCodeEmail = async (
  resetCodeEmailArgs: MailArgs,
) =>
  sendMailTemplate(
    'passwordReset.subject',
    'passwordReset.body',
    resetCodeEmailArgs,
  );

export const sendNewContractEmail = async (
  sendNewContractEmailArgs: MailArgs,
) =>
  sendMailTemplate(
    'newContract.subject',
    'newContract.body',
    sendNewContractEmailArgs,
  );

export const sendCreatedUserEmail = async (emailArgs: MailArgs) => {
  sendMailTemplate(
    'New account',
    'You have been added in Advertiser marketing fleet. Here is your registration code: ',
    emailArgs,
  );
};
