import axios from "axios";
import crypto from "crypto";

export const generarCodigoVerificacion = (): string => {
    const longitud = 6;
    const numeros = "0123456789";
    let codigo = "";

    for (let i = 0; i < longitud; i++) {
        const indice = Math.floor(Math.random() * numeros.length);
        codigo += numeros[indice];
    }

    return codigo;
};



/**
 * Verifica si una contraseña está comprometida usando Have I Been Pwned.
 */
export async function isPasswordPwned(password: string): Promise<boolean> {
    const sha1 = crypto.createHash("sha1").update(password).digest("hex").toUpperCase();
    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);

    const url = `https://api.pwnedpasswords.com/range/${prefix}`;
    const response = await axios.get(url);

    const hashes: string[] = response.data.split("\r\n"); // asegura tipado

    const found = hashes.some((line) => {
        const [hashSuffix] = line.split(":");
        return hashSuffix === suffix;
    });

    return found;
}

