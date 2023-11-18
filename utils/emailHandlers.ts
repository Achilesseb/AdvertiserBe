import nodemailer from 'nodemailer';
import { MailtrapMailOptions } from 'mailtrap/dist/types/transport';

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

// const mailjetTransport = Mailjet.apiConnect(
//   process.env.MAILJET_APIKEY_PUBLIC as unknown as string,
//   process.env.MAILJET_APIKEY_PRIVATE as unknown as string,
// );

// export const sendEmail = async (mailOptions: Record<string, unknown>) => {
//   console.log('Sending email..');
//   try {
//     await mailjetTransport.post('send').request(mailOptions);
//   } catch (err) {
//     console.log(err, 'Email failed..');
//   }
// };

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
// const mailOptions = {
//   from: 'noreply@gorilla-advertising.ro',
//   to: 'prisacariuvictor@gmail.com',
//   subject: 'Test Email',
//   html: 'Hello papa',
// };

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: 587,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

export const sendEmail = (mailOptions: MailtrapMailOptions) => {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
export const sendCreatedUserEmail = async (emailArgs: MailArgs) => {
  const mailOptions = {
    from: process.env.MAILJET_SENDER,
    subject: 'Bine ai venit!',
    text: `Stimate şofer, bine aţi venit în flota Gorilla Advertising! Codul dumneavoastra de autentificare este: ${emailArgs.emailVars?.token}`,
    html: `<h3>Stimate şofer, bine ati venit in flota Gorilla Advertising! <br> Codul dumneavoastra de autentificare este: ${emailArgs.emailVars?.token}`,
    to: emailArgs?.recipient,
  };
  sendEmail(mailOptions as unknown as MailtrapMailOptions);
};
