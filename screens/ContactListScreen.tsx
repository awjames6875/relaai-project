import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Button,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { loadContacts, addContact as addContactToStorage, Contact } from '../services/storage';

const DUMMY_CONTACTS: Contact[] = [
  { id: '1', name: 'Alice Johnson', phone: '555-1234', email: 'alice@example.com' },
  { id: '2', name: 'Bob Smith', phone: '555-5678', email: 'bob@example.com' },
  { id: '3', name: 'Carol Davis', phone: '555-9012', email: 'carol@example.com' },
  { id: '4', name: 'David Wilson', phone: '555-3456', email: 'david@example.com' },
];

export default function ContactListScreen({ navigation }: any) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load contacts when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadContactsFromStorage();
    }, [])
  );

  const loadContactsFromStorage = async () => {
    try {
      setIsLoading(true);
      const loadedContacts = await loadContacts();

      // If no contacts exist, initialize with dummy data
      if (loadedContacts.length === 0) {
        await Promise.all(DUMMY_CONTACTS.map(contact => addContactToStorage(contact)));
        setContacts(DUMMY_CONTACTS);
      } else {
        setContacts(loadedContacts);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load contacts');
      console.error('Error loading contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContact = () => {
    navigation.navigate('AddContact', {
      onSave: async (newContact: Contact) => {
        try {
          const updatedContacts = await addContactToStorage({
            ...newContact,
            id: Date.now().toString(), // Generate unique ID based on timestamp
          });
          setContacts(updatedContacts);
        } catch (error) {
          Alert.alert('Error', 'Failed to add contact');
          console.error('Error adding contact:', error);
        }
      },
    });
  };

  const handleContactPress = (contact: Contact) => {
    navigation.navigate('ContactDetail', { contact });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Contacts</Text>
        <Button title="Add Contact" onPress={handleAddContact} color="#007AFF" />
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.contactCard}
            onPress={() => handleContactPress(item)}
          >
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactDetail}>{item.phone}</Text>
              <Text style={styles.contactDetail}>{item.email}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  contactCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  contactInfo: {
    gap: 4,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  contactDetail: {
    fontSize: 14,
    color: '#666',
  },
});
