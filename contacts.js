const fs = require('fs').promises
const path = require('path')
const contactsPath = path.join(__dirname, './db/contacts.json')
const { v4: uuidv4 } = require('uuid')
require('colors')

async function parsedContacts() {
  try {
    const data = await fs.readFile(contactsPath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return console.error(error.message)
  }
}

async function listContacts() {
  try {
    const contacts = await parsedContacts()
    console.table(contacts)
    return contacts
  } catch (error) {
    return console.error(error.message)
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await parsedContacts()
    const contact = contacts.find(({ id }) => id === contactId)
    if (!contact) {
      return console.error(`Contact Id ${contactId} is not found`.bold.red)
    }

    console.log(`Contact Id ${contactId}`.bold.green)
    console.table(contact)
    return contact
  } catch (error) {
    return console.error(error.message)
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await parsedContacts()
    const updatedContacts = contacts.filter(({ id }) => id !== contactId)

    if (contacts.length === updatedContacts.length) {
      return console.error(`Contact Id ${contactId} is not found`.bold.red)
    }
    await fs.writeFile(
      contactsPath,
      JSON.stringify(updatedContacts, null, 2),
      'utf8',
    )
    console.log('Contact deleted!'.bold.green)
    console.table(updatedContacts)

    return updatedContacts
  } catch (error) {
    return console.error(error.message)
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await parsedContacts()
    if (
      contacts.find(
        contact => contact.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      return console.warn('This name is already exists!'.bold.yellow)
    }

    if (contacts.find(contact => contact.email === email)) {
      return console.warn('This email is already exists!'.bold.yellow)
    }
    if (contacts.find(contact => contact.phone === phone)) {
      return console.warn('This phone is already exists!'.bold.yellow)
    }

    const newContact = { id: uuidv4(), name, email, phone }
    const newContacts = [...contacts, newContact]

    await fs.writeFile(
      contactsPath,
      JSON.stringify(newContacts, null, 2),
      'utf-8',
    )
    console.log('Added contact'.bold.green, newContact)
    console.table(newContacts)

    return newContacts
  } catch (error) {
    return console.error(error.message)
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
}
