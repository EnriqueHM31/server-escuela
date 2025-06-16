// routes/usuarios.ts
import { Router } from "express";
import { clerkClient } from "@clerk/express";

const router = Router();

router.get("/todos", async (_, res) => {


    try {
        const usuarios = await clerkClient.users.getUserList();
        res.status(200).json({ success: true, message: usuarios.data });

    } catch (err) {
        console.error("Error al obtener usuarios:", err);
        res.status(500).json({ error: "No se pudieron obtener los usuarios" });
    }
});

export default router;
