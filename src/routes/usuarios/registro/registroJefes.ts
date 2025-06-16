import { clerkClient } from "@clerk/express";
import { Router } from "express";

const registrarUsuario = Router();

registrarUsuario.post("/jefescarrera", async (req, res) => {
    const { clave, nombre, apellidos, email, password, cargo, carrera } = req.body;

    if (!clave || !nombre || !apellidos || !email || !password || !cargo || !carrera) {
        res.status(400).json({
            success: false,
            message: "Faltan datos para completar el registro",
        });
    }

    try {
        if (await carreraVinculadaExiste(carrera)) {
            res.status(409).json({
                success: false,
                message: "La carrera ya está vinculada a otro usuario",
            });
        }

        if (await claveExiste(clave)) {
            res.status(409).json({
                success: false,
                message: "La clave ya está registrada con otro usuario",
            });
        }

        if (await emailExiste(email)) {
            res.status(409).json({
                success: false,
                message: "El correo ya está registrado",
            });
        }

        const user = await clerkClient.users.createUser({
            emailAddress: [email],
            password,
            firstName: nombre,
            lastName: apellidos,
            publicMetadata: {
                clave_empleado: clave,
                role: cargo,
                carrera,
            },
        });

        if (!user) {
            res.status(500).json({
                success: false,
                message: "Error interno del servidor",
            });
        }

        res.status(201).json({
            success: true,
            message: "Usuario registrado correctamente",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
        });
    }
});

export default registrarUsuario;

async function emailExiste(email: string): Promise<boolean> {
    const usuarios = await clerkClient.users.getUserList({
        emailAddress: [email],
    });
    return usuarios.data.length > 0;
}

async function claveExiste(clave: string): Promise<boolean> {
    const usuarios = await clerkClient.users.getUserList();
    return usuarios.data.some(u => u.publicMetadata?.clave_empleado === clave);
}

async function carreraVinculadaExiste(carrera: string): Promise<boolean> {
    const usuarios = await clerkClient.users.getUserList();
    return usuarios.data.some(u => u.publicMetadata?.carrera === carrera);
}
