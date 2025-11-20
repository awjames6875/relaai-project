import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Button,
} from 'react-native';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
}

const DUMMY_CONTACTS: Contact[] = [
  { id: '1', name: 'Alice Johnson', phone: '555-1234', email: 'alice@example.com' },
  { id: '2', name: 'Bob Smith', phone: '555-5678', email: 'bob@example.com' },
  { id: '3', name: 'Carol Davis', phone: '555-9012', email: 'carol@example.com' },
  { id: '4', name: 'David Wilson', phone: '555-3456', email: 'david@example.com' },
];

export default function ContactListScreen({ navigation }: any) {
  const [contacts, setContacts] = useState<Contact[]>(DUMMY_CONTACTS);

  const handleAddContact = () => {
    navigation.navigate('AddContact', {
      onSave: (newContact: Contact) => {
        setContacts([...contacts, { ...newContact, id: String(contacts.length + 1) }]);
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
