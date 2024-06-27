import SMTPTransport from "nodemailer/lib/smtp-transport"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
} as SMTPTransport.Options)

transporter
  .verify()
  .then(() => console.log("Transporter is OK!"))
  .catch((error) => {
    if (error instanceof Error)
      console.error("Transporter is NOT READY!\n", error.message)
  })

export default transporter
