import type { APIRoute } from "astro";
import { agregarFila } from "../../integrations/google-sheets";
import { sendMail } from "../../integrations/mailer";

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    const { nombre, correo, empresa, mensaje } = data;

    await agregarFila({ nombre, correo, empresa, mensaje });

    // Enviar correo al cliente
    await sendMail({
      to: correo,
      subject: "Gracias por contactarnos",
      text: `Hola ${nombre}, hemos recibido tu mensaje: ${mensaje}. Nos pondremos en contacto contigo pronto.`,
      html: `<p>Hola <b>${nombre}</b>,</p>
             <p>Hemos recibido tu mensaje:</p>
             <blockquote>${mensaje}</blockquote>
             <p>Nos pondremos en contacto contigo pronto.<br><br>Saludos.<br>Equipo CIAN</p>`,
    });

    // Enviar correo a la empresa
    await sendMail({
      to: import.meta.env.SMTP_USER,
      subject: "Nuevo contacto desde landing page",
      text: `Nuevo contacto:\nNombre: ${nombre}\nCorreo: ${correo}\nEmpresa: ${empresa}\nMensaje: ${mensaje}`,
      html: `<h2>Nuevo contacto recibido</h2>
             <ul>
               <li><b>Nombre:</b> ${nombre}</li>
               <li><b>Correo:</b> ${correo}</li>
               <li><b>Empresa:</b> ${empresa}</li>
               <li><b>Mensaje:</b> ${mensaje}</li>
             </ul>`,
    });

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
