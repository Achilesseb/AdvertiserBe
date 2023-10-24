import { SES } from 'aws-sdk';
import { awsSes } from './awsClients';
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
export const sendEmailViaAws = (params: SES.SendEmailRequest) => {
  awsSes.sendEmail(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });
};

export const sendMailTemplateViaAws = async (
  subject: string,
  body: string,
  emailArgs: MailArgs,
) => {
  try {
    const emailParams = {
      Destination: {
        ToAddresses: [emailArgs.recipient],
      },
      Message: {
        Body: {
          Text: {
            Data: `${body}: ${emailArgs.emailVars?.token}`,
          },
        },
        Subject: {
          Data: subject,
        },
      },
      Source: 'prisacariuvictor@gmail.com',
    };

    return sendEmailViaAws(emailParams);
  } catch (error) {
    console.log(error);
    return 400;
  }
};

export const sendPasswordResetCodeEmailViaAws = async (
  resetCodeEmailArgs: MailArgs,
) =>
  sendMailTemplateViaAws(
    'passwordReset.subject',
    'passwordReset.body',
    resetCodeEmailArgs,
  );

export const sendNewContractEmailViaAws = async (
  sendNewContractEmailArgs: MailArgs,
) =>
  sendMailTemplateViaAws(
    'newContract.subject',
    'newContract.body',
    sendNewContractEmailArgs,
  );

export const sendCreatedUserEmailViaAws = async (emailArgs: MailArgs) => {
  sendMailTemplateViaAws(
    'New account',
    'You have been added in Advertiser marketing fleet. Here is your registration code: ',
    emailArgs,
  );
};
