import Contact from "../models/Contact.js";

export async function createContact(contactData) {
    try {
        return await Contact.create(contactData);
    } catch (error) {
        throw new Error("Error al crear contacto");
    }
}

export async function getAllContacts() {
    try {
        return await Contact.find();
    } catch (error) {
        throw new Error("Error al obtener los contactos");
    }
}

export async function getContactsByName(name) {
    try {
        return await Contact.findOne({ name });
    } catch (error) {
        throw new Error("Error al obtener el contacto por nombre");
    }
}

export async function updateContact(id, contactData) {
    try {
        return await Contact.findByIdAndUpdate(id, contactData, { new: true });
    } catch (error) {
        throw new Error("Error al actualizar contacto");
    }
}

export async function deleteContact(id) {
    try {
        return await Contact.findByIdAndDelete(id);
    } catch (error) {
        throw new Error("Error al eliminar contacto");
    }
}