import Mail from "nodemailer/lib/mailer"
import transporter from "../config/nodemailer"

const EMAIL_HOST = process.env.SMTP_USER

export const sendRecoverPasswordLink = async (
  url: string,
  email: string,
  token: string
) => {
  const options: Mail.Options = {
    from: `MB Peluquería <${EMAIL_HOST}>`,
    to: email,
    subject: "Recuperación de contraseña - MB Peluquería",
    html: `
            <div style="display: block; padding: 8px">
                <p>Recuperá tu contraseña ingresando al siguiente link: ${url}auth/recover?token=${token}.</p>
            </div>
        `,
  }
  await transporter.verify()
  return await transporter.sendMail(options)
}
