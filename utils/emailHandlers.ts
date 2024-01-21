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
    from: process.env.EMAIL_SENDER,
    subject: 'Bine ai venit!',
    text: `Stimate şofer, bine aţi venit în flota Gorilla Advertising! Codul dumneavoastra de autentificare este: ${emailArgs.emailVars?.token}`,
    html: `<h3>Stimate şofer, bine ati venit in flota Gorilla Advertising! <br> Codul dumneavoastra de autentificare este: ${emailArgs.emailVars?.token}`,
    to: emailArgs?.recipient,
  };
  sendEmail(mailOptions as unknown as MailtrapMailOptions);
};
