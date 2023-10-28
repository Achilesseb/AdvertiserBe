import crypto from 'crypto';

export const generateRegistrationCode = (email: string) => {
  if (!email) {
    throw new Error('Email is required.');
  }

  console.log('Generating registration code..');

  const sha256 = crypto.createHash('sha256');

  sha256.update(email);

  const hashHex = sha256.digest('hex');

  const registrationCode = hashHex.slice(0, 6);

  console.log('Registration code generated successfully..');
  return registrationCode;
};
