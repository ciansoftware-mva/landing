import type { APIRoute } from "astro";
import { agregarFila } from "../../integrations/google-sheets";

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    console.log("📨 Datos recibidos:", data);

    const { nombre, correo, empresa, mensaje } = data;

    await agregarFila({ nombre, correo, empresa, mensaje });

    return new Response(
      JSON.stringify({ mensaje: "Nos pondremos en contacto contigo" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("❌ Error en el API:", error);
    return new Response(
      JSON.stringify({ mensaje: "Hubo un error en el servidor" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
