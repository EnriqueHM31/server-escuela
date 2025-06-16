import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import { clerkMiddleware } from "@clerk/express";
import cambioContraseña from "./routes/cambiarContraseña/correo";
import modificarContraseña from "./routes/cambiarContraseña/modificar";
import registrarUsuario from "./routes/usuarios/registro/registroJefes";
import eliminarUsuario from "./routes/usuarios/eliminar/eliminarJefes";
import busquedaUsuariosAll from "./routes/usuarios/busqueda/busquedaAll";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


app.use(express.json());
app.use(clerkMiddleware());
console.log("CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY); // DEBUG

app.use("/cambiarcontrasena", cambioContraseña);
app.use("/modificarcontrasena", modificarContraseña);
app.use("/registro", registrarUsuario);
app.use("/eliminar", eliminarUsuario);
app.use("/busqueda", busquedaUsuariosAll);

app.listen(3000, () => {
    console.log("Servidor corriendo en el puerto 3000");
});
