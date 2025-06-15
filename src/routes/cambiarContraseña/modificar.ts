import { Router } from "express";
import * as clerk from "@clerk/clerk-sdk-node";
import { isPasswordPwned } from "../../funciones/contraseña/funciones";


const modificarContraseña = Router();

modificarContraseña.post("/", async (req, res) => {
    const { contrasenanueva, email } = req.body;

    if (!contrasenanueva || !email) {
        res.status(400).json({
            success: false,
            message: "Faltan datos para modificar la contraseña.",
        });
    }

    try {
        // Validar si la contraseña fue filtrada
        const filtrada = await isPasswordPwned(contrasenanueva);
        if (filtrada) {
            res.status(422).json({
                success: false,
                message: "La contraseña es insegura. Por favor, elige otra.",
            });
        }

        // Buscar usuario por email
        const users = await clerk.users.getUserList({ emailAddress: [email] });

        if (users.length === 0) {
            res.status(404).json({
                success: false,
                message: "Usuario no encontrado.",
            });
        }

        const userId = users[0].id;

        // Actualizar la contraseña
        await clerk.users.updateUser(userId, {
            password: contrasenanueva,
        });

        res.status(200).json({
            success: true,
            message: "Contraseña modificada correctamente.",
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error?.message || "Error interno del servidor.",
        });
    }
});

export default modificarContraseña;
