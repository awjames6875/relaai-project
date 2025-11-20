import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
}

const CONTACTS_KEY = 'relaai_contacts';

/**
 * Load all contacts from AsyncStorage
 */
export const loadContacts = async (): Promise<Contact[]> => {
  try {
    const data = await AsyncStorage.getItem(CONTACTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading contacts:', error);
    return [];
  }
};

/**
 * Save contacts to AsyncStorage
 */
export const saveContacts = async (contacts: Contact[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  } catch (error) {
    console.error('Error saving contacts:', error);
    throw error;
  }
};

/**
 * Add a new contact
 */
export const addContact = async (contact: Contact): Promise<Contact[]> => {
  try {
    const contacts = await loadContacts();
    const updatedContacts = [...contacts, contact];
    await saveContacts(updatedContacts);
    return updatedContacts;
  } catch (error) {
    console.error('Error adding contact:', error);
    throw error;
  }
};

/**
 * Delete a contact by ID
 */
export const deleteContact = async (id: string): Promise<Contact[]> => {
  try {
    const contacts = await loadContacts();
    const updatedContacts = contacts.filter(c => c.id !== id);
    await saveContacts(updatedContacts);
    return updatedContacts;
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
};

/**
 * Update a contact
 */
export const updateContact = async (id: string, updates: Partial<Contact>): Promise<Contact[]> => {
  try {
    const contacts = await loadContacts();
    const updatedContacts = contacts.map(c =>
      c.id === id ? { ...c, ...updates } : c
    );
    await saveContacts(updatedContacts);
    return updatedContacts;
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
};

/**
 * Clear all contacts (for testing/reset)
 */
export const clearAllContacts = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CONTACTS_KEY);
  } catch (error) {
    console.error('Error clearing contacts:', error);
    throw error;
  }
};
