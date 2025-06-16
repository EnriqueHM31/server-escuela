import { Router } from "express";
import { clerkClient } from "@clerk/express";

const registrarUsuario = Router();

registrarUsuario.post("/", async (req, res) => {
    const { clave, nombre, apellidos, email, password, cargo, carrera } = req.body;

    if (!clave || !nombre || !apellidos || !email || !password || !cargo || !carrera) {
        res.status(200).json({
            success: false,
            message: "Faltan datos para completar el registro",
        });
    }

    try {
        const user = await clerkClient.users.createUser({
            emailAddress: [email], // <-- CORREGIDO: array
            password: password,
            firstName: nombre,
            lastName: apellidos,
            publicMetadata: {
                clave_empleado: clave,
                role: cargo,
                carrera: carrera,
            },
        });

        if (!user) {
            res.status(500).json({
                success: false,
                message: "Error al registrar el usuario" + user
            });
        }
        res.status(200).json({
            success: true,
            message: "Usuario registrado correctamente",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }


})

export default registrarUsuario;