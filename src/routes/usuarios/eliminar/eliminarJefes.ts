import { Router } from "express";
import { clerkClient } from "@clerk/express";
import type { User } from "@clerk/backend";

const eliminarUsuariosHefe = Router();

eliminarUsuariosHefe.post("/jefescarrera", async (req, res) => {
    const { email } = req.body;

    try {
        const usuarios = await clerkClient.users.getUserList({
            emailAddress: [email],
        }) as { data: User[] };


        if (usuarios.data.length === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await clerkClient.users.deleteUser(usuarios.data[0].id);
        res.status(200).json({ message: 'Usuario eliminado correctamente' });

    } catch (error) {
        console.error("Error eliminando usuario:", error);
        res.status(500).json({ error: "Error interno al eliminar el usuario" });
    }
});

export default eliminarUsuariosHefe;
