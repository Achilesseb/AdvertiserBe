import nodemailer from 'nodemailer';
import Mailjet from 'node-mailjet';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
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

const mailjetTransport = Mailjet.apiConnect(
  process.env.MAILJET_APIKEY_PUBLIC as unknown as string,
  process.env.MAILJET_APIKEY_PRIVATE as unknown as string,
);

export const sendEmail = async (mailOptions: Record<string, unknown>) => {
  console.log('Sending email..');
  try {
    await mailjetTransport.post('send').request(mailOptions);
  } catch (err) {
    console.log(err, 'Email failed..');
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

// export const sendNewDriverEmail = async (
//   sendNewContractEmailArgs: MailArgs,
// ) =>
//   sendMailTemplate(
//     'newContract.subject',
//     'newContract.body',
//     sendNewContractEmailArgs,
//   );

export const sendCreatedUserEmail = async (emailArgs: MailArgs) => {
  const mailOptions = {
    FromEmail: process.env.MAILJET_SENDER,
    Subject: 'Welcome to our fleet!',
    'Text-part': `Stimate şofer, bine aţi venit în flota Gorilla Advertising! Codul dumneavoastra de autentificare este: ${emailArgs.emailVars?.token}`,
    'Html-part': `<h3>Stimate şofer, bine ati venit in flota Gorilla Advertising! <br> Codul dumneavoastra de autentificare este: ${emailArgs.emailVars?.token}`,
    To: emailArgs?.recipient,
  };
  await sendEmail(mailOptions);
};
