import logger from '../logger';
import sendEmail from './emailService';

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
      recipient: emailArgs.recipient,
      subject,
      body: `${body}: ${emailArgs.emailVars?.token}`,
    };

    return await sendEmail(emailParams);
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
