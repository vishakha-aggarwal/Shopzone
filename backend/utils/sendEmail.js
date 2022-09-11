const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
    // console.log(options.email);
    // console.log(process.env.SMPT_MAIL);
    // console.log(process.env.SMPT_PASSWORD);
    const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;