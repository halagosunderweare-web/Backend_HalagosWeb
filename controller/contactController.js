// contactController.js
import * as contactService from "../services/contactServices.js";
import Contact from "../models/Contact.js";
import nodemailer from 'nodemailer';

// Configuración del transporter para nodemailer 
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Controlador para crear contacto y enviar correo
const createContactController = async (req, res) => {
  try {
    const { name, email, message, products } = req.body;

    // Guardo en la base de datos
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Verifico las variables de entorno estén configuradas
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Error: Variables de entorno para email no configuradas');
      return res.status(500).json({ 
        error: 'Error de configuración del servidor' 
      });
    }

    // Configuro y envio el correo
    const transporter = createTransporter();
    
    // Verifico la conexión del transporter
    try {
      await transporter.verify();
      console.log('Servidor de correo configurado correctamente');
    } catch (verifyError) {
      console.error('Error al verificar el transporter:', verifyError);
      return res.status(500).json({ 
        error: 'Error de configuración del servidor de correo' 
      });
    }
     
    //Lo que estara escrito en mi correo electronico
    const mailOptions = {
  from: process.env.EMAIL_USER,
  to: "halagosunderweare@gmail.com",
  subject: `Nuevo mensaje de contacto de ${name}`,

  html: `
    <h2>Nuevo mensaje recibido desde la página de contacto</h2>

    <p><strong>Nombre:</strong> ${name}</p>
    <p><strong>Correo:</strong> ${email}</p>
    <p><strong>Mensaje:</strong><br/> ${message}</p>

    <hr />

    ${
      products && products.length > 0
        ? `
      <h3>Productos consultados:</h3>
      <ul>
        ${products
          .map(
            (p) => `
          <li>
            <strong>${p.name}</strong><br/>
            ID: ${p.id}<br/>
            <img src="${p.image}" alt="${p.name}" width="120" />
          </li>
        `
          )
          .join("")}
      </ul>
    `
        : "<p>No seleccionó productos desde Mi Consulta.</p>"
    }
  `,
};


    await transporter.sendMail(mailOptions);
    //console.log('Correo enviado correctamente a halagosunderweare@gmail.com');
    
    res.status(200).json({ message: 'Mensaje enviado correctamente' });
  } catch (error) {
    console.error('Error completo al procesar el contacto:', error);
    
    // Enviar respuesta diferente si solo falló el correo pero se guardó en BD
    if (error.code === 'EAUTH' || error.command === 'API') {
      res.status(200).json({ 
        message: 'Mensaje recibido. Nos pondremos en contacto pronto.' 
      });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

const getAllContactsController = async(req, res) => {
    try {
        const contacts = await contactService.getAllContacts();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener todos los contactos" });
    }
};

const getContactsByNameController = async (req, res) => {
    try {
        const contact = await contactService.getContactsByName(req.params.name);
        if (contact) {
            res.json(contact);
        } else {
            res.status(404).json({ message: "Contacto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al obtener contacto" });
    }

};

const updateContactController = async (req, res) => {
    try {
        const updatedContact = await contactService.updateContact(req.params.id, req.body);
        if (updatedContact) {
            res.json(updatedContact);
        } else {
            res.status(404).json({ message: "Contacto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar contacto" });
    }
};

const deleteContactController = async (req, res) => {
    try {
        const deleted = await contactService.deleteContact(req.params.id);
        if (deleted) {
            res.json({ message: "Contacto eliminado" });
        } else {
            res.status(404).json({ message: "Contacto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar contacto" });
    }
};

export {
    createContactController, 
    getAllContactsController,
    getContactsByNameController, 
    updateContactController,
    deleteContactController
};


//<p><strong>ID en base de datos:</strong> ${newContact._id}</p>