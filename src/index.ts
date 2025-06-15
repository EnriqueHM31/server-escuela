import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import { clerkMiddleware } from "@clerk/express";
import cambioContraseña from "./routes/cambiarContraseña/correo";
import modificarContraseña from "./routes/cambiarContraseña/modificar";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true // si usas cookies o tokens con credenciales
}));


app.use(express.json());
app.use(clerkMiddleware());
console.log("CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY); // DEBUG

app.use("/cambiarcontrasena", cambioContraseña);
app.use("/modificarcontrasena", modificarContraseña);

app.listen(3000, () => {
    console.log("Servidor corriendo en el puerto 3000");
});
