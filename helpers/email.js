import nodemailer from 'nodemailer';

export const emailRegistro   = async (datos) => { //417 contenido en 418
  const {nombre, email, token} = datos;

  //TODO: mover hacia variables de entorno
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

  //Informacion del email 418
  const info = await transport.sendMail({
      from: '"UpTask - Project Manager" <accounts@uptask.com>',
      to: email,
      subject: "UpTask - Verify your account",
      text: "Verify your account on UpTask",
      html: `<p>Hello: ${nombre}, please Verify your account on UpTask</p>
      <p>Your account is almost ready, you must check the following link: <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Verify account</a> </p>

      <p>If you did not create this account, you can ignore this message</p>
      `,

  });
};

export const emailOlvidePassword= async (datos) => { //421 
  const {nombre, email, token} = datos;

  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

  //Informacion del email 418
  const info = await transport.sendMail({
      from: '"UpTask - Project Manager" <accounts@uptask.com>',
      to: email,
      subject: "UpTask - Reset your password",
      text: "Reset your password",
      html: `<p>Hello: ${nombre}, you have requested to reset your password</p>
      <p>Follow the link to generate a new Password:
      
      <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reset Password</a> </p>

      <p>If you did not request this Email, you can ignore this message</p>
      `,

  });
};