import { Router } from "express";
import * as clerk from "@clerk/clerk-sdk-node";
import { generarCodigoVerificacion } from "../../funciones/contraseña/funciones";
import nodemailer from "nodemailer";

const cambioContraseña = Router();

interface Respuesta {
    error?: string;
    message?: string;
    success?: boolean;
    codigo?: string;
}

cambioContraseña.post("/", async (req, res) => {
    const { email } = req.body;

    try {
        const users = await clerk.users.getUserList({ emailAddress: [email] });

        if (users.length === 0) {
            res.status(200).json({ success: false, message: "No se encontró el usuario con ese correo." } as Respuesta);
        }

        const codigo = generarCodigoVerificacion();

        // Configura tu transporte con Outlook
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // TLS
            auth: {
                user: 'luisenriquehernandezmarin0@gmail.com',
                pass: 'ykqtwzbimafxrkow'
            }
        });

        const mailOptions = {
            from: '"Institución Educativa" <luisenriquehernandezmarin0@gmail.com>',
            to: email,
            subject: 'Código para cambio de contraseña',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; ">
            <h2 style="color: #2c3e50; text-align: center;"> Solicitud de cambio de contraseña</h2>
            <p>Hola,</p>
            <p>Recibimos una solicitud para cambiar la contraseña de tu cuenta en nuestra plataforma educativa.</p>
            <p>Ingresa el siguiente código para continuar con el proceso:</p>
            <div style="text-align: center; margin: 20px 0;">
                <span style="font-size: 24px; font-weight: bold; background-color: #f0f0f0; padding: 10px 20px; border-radius: 8px; display: inline-block; letter-spacing: 2px;">
                    ${codigo}
                </span>
            </div>
            <p>Si tú no realizaste esta solicitud, puedes ignorar este mensaje.</p>
            <p style="color: #888;">Atentamente,<br>Equipo de Soporte de la Institución Educativa</p>
        </div>
    `
        };


        // Enviar correo
        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: codigo } as Respuesta);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al enviar el correo" } as Respuesta);
    }
});

export default cambioContraseña;
