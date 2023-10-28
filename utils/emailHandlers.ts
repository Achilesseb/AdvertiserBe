import { SendEmailCommand } from '@aws-sdk/client-ses';
import logger from '../logger';
import { ses } from './aws';
// import sendEmail from './emailService';

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

export const sendEmail = async (emailArgs: {}) => {
  try {
    const params = {
      Destination: {
        ToAddresses: ['prisacariuvictor@gmail.com'],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: 'This message body contains HTML formatting. It can, for example, contain links like this one: <a class="ulink" href="http://docs.aws.amazon.com/ses/latest/DeveloperGuide" target="_blank">Amazon SES Developer Guide</a>.',
          },
          Text: {
            Charset: 'UTF-8',
            Data: 'This is the message body in text format.',
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Test email',
        },
      },
      Source: 'noreply@hello.gorilla-advertising.ro',
    };
    const sendEmailCommand = new SendEmailCommand(params);
    await ses.send(sendEmailCommand);
  } catch (error) {
    logger.error(error);
    return 400;
  }
};

// export const sendPasswordResetCodeEmail = async (
//   resetCodeEmailArgs: MailArgs,
// ) =>
//   sendMailTemplate(
//     'passwordReset.subject',
//     'passwordReset.body',
//     resetCodeEmailArgs,
//   );

// export const sendNewContractEmail = async (
//   sendNewContractEmailArgs: MailArgs,
// ) =>
//   sendMailTemplate(
//     'newContract.subject',
//     'newContract.body',
//     sendNewContractEmailArgs,
//   );

export const sendCreatedUserEmail = async (emailArgs: MailArgs) => {};
