const nodemailer = require("nodemailer");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT || 587, // Приведение порта к числу, 587 по умолчанию
      secure: false, // Если порт 465, замените на true
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Проверка подключения к SMTP при инициализации
    this.transporter.verify((error, success) => {
      if (error) {
        console.error("SMTP connection error:", error);
      } else {
        console.log("SMTP server is ready to send emails.");
      }
    });
  }

  async sendOtp(to) {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000); // Генерация 6-значного OTP
      console.log("Generated OTP:", otp);

      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: `OTP for verification ${new Date().toLocaleString()}`,
        html: `<h1>Your OTP is ${otp}</h1>`,
      });

      return otp; // Возвращаем OTP для дальнейшей обработки
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send OTP. Please try again.");
    }
  }

  async verifyOtp(inputOtp, savedOtp) {
    if (inputOtp === savedOtp) {
      return true; // OTP совпал
    }
    return false; // OTP неверен
  }
}

module.exports = new MailService();
