const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const enviarCorreo = async (req, res) => {
    try {
        const { to, subject, text } = req.body;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        };

        const info = await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: 'Correo enviado exitosamente',
            info
        });
    } catch (error) {
        console.error('Error al enviar correo:', error);
        res.status(500).json({
            message: 'Error al enviar correo',
            error: error.message
        });
    }
};

module.exports = {
    enviarCorreo
};
