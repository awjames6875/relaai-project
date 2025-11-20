import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Clipboard,
  Linking,
} from 'react-native';
import { Contact, deleteContact as deleteContactFromStorage } from '../services/storage';
import { generateAIMessage } from '../services/aiService';

export default function ContactDetailScreen({ route, navigation }: any) {
  const { contact } = route.params as { contact: Contact };
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [messageCopied, setMessageCopied] = useState(false);

  const handleGenerateMessage = async () => {
    setLoading(true);
    try {
      const message = await generateAIMessage({
        contactName: contact.name,
        phone: contact.phone,
        email: contact.email,
      });
      setGeneratedMessage(message);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to generate message');
      console.error('Generate message error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = async () => {
    if (!generatedMessage) return;
    try {
      await Clipboard.setString(generatedMessage);
      setMessageCopied(true);
      // Reset the "Copied" message after 2 seconds
      setTimeout(() => setMessageCopied(false), 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy message to clipboard');
      console.error('Copy error:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!generatedMessage) {
      Alert.alert('No Message', 'Please generate a message first');
      return;
    }

    try {
      // Open SMS app with the message pre-filled
      const smsUrl = `sms:${contact.phone}?body=${encodeURIComponent(generatedMessage)}`;
      const supported = await Linking.canOpenURL(smsUrl);

      if (supported) {
        await Linking.openURL(smsUrl);
      } else {
        Alert.alert('Error', 'SMS is not supported on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open messaging app');
      console.error('Send message error:', error);
    }
  };

  const handleDeleteContact = () => {
    Alert.alert(
      'Delete Contact',
      `Are you sure you want to delete ${contact.name}?`,
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteContactFromStorage(contact.id);
              Alert.alert('Success', `${contact.name} has been deleted`);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete contact');
              console.error('Delete error:', error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Contact Card */}
        <View style={styles.contactCard}>
          <View style={styles.initials}>
            <Text style={styles.initialsText}>
              {contact.name
                .split(' ')
                .map((n: string) => n[0])
                .join('')}
            </Text>
          </View>
          <Text style={styles.contactName}>{contact.name}</Text>
          <Text style={styles.contactPhone}>{contact.phone}</Text>
          <Text style={styles.contactEmail}>{contact.email}</Text>
        </View>

        {/* Generate Message Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Generate AI Message</Text>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerateMessage}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.generateButtonText}>Generate Message</Text>
            )}
          </TouchableOpacity>

          {generatedMessage && (
            <View style={styles.messageBox}>
              <Text style={styles.messageText}>{generatedMessage}</Text>
              <TouchableOpacity style={styles.copyButton} onPress={handleCopyMessage}>
                <Text style={styles.copyButtonText}>
                  {messageCopied ? '✓ Copied' : 'Copy Message'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSendMessage}
            disabled={!generatedMessage}
            opacity={!generatedMessage ? 0.5 : 1}
          >
            <Text style={styles.actionButtonText}>Send Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDeleteContact}
          >
            <Text style={styles.deleteButtonText}>Delete Contact</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  contactCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  initials: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  initialsText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  contactName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  contactEmail: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  generateButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  messageBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#000',
    marginBottom: 12,
  },
  copyButton: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  deleteButtonText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '600',
  },
});
