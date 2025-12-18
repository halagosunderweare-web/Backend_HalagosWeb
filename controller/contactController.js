// contactController.js
import Contact from "../models/Contact.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const createContactController = async (req, res) => {
  try {
    const { name, email, message, products = [] } = req.body;

    // Guardar en BD
    await Contact.create({ name, email, message });

    // Construir HTML del correo
    const html = `
      <h2>Nuevo mensaje de contacto - Halagos</h2>

      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Correo del cliente:</strong> ${email}</p>
      <p><strong>Mensaje:</strong><br/>${message}</p>

      <hr />

      ${
        products.length
          ? `
            <h3>Productos consultados:</h3>
            <ul>
              ${products
                .map(
                  (p) => `
                    <li>
                      <strong>${p.name}</strong><br/>
                      ID: ${p.id}<br/>
                      <img src="${p.image}" width="120" />
                    </li>
                  `
                )
                .join("")}
            </ul>
          `
          : "<p>No seleccionó productos.</p>"
      }
    `;

    // Enviar correo A TU GMAIL
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO, // correo
      reply_to: email,          // CLAVE
      subject: `📩 Nuevo contacto: ${name}`,
      html,
    });

    // Respuesta al frontend
    res.status(200).json({
      message: "Mensaje enviado correctamente",
    });

  } catch (error) {
    console.error("Error contacto:", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};

export { createContactController };
