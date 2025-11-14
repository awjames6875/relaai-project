/**
 * Edit Contact Screen
 *
 * Form for editing an existing contact.
 * Implements US-2.4 (Edit Contact).
 */
import React, { useState, useEffect } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ContactsStackParamList } from '@contracts/component-contracts/navigation-types';
import { RootState, AppDispatch } from '../../store';
import {
  fetchContact,
  updateContactThunk,
  selectSelectedContact,
} from '../../store/slices/contactSlice';
import { selectUser } from '../../store/slices/authSlice';
import { Input } from '../../components/atoms';
import { Button } from '../../components/atoms';
import {
  validateContact,
  hasValidationErrors,
  ContactValidationErrors,
} from '../../utils/validation/contactValidation';
import { UpdateContactDTO } from '@contracts/data-contracts/dto-definitions';
import { colors } from '../../theme';

type EditContactScreenNavigationProp = StackNavigationProp<ContactsStackParamList, 'EditContact'>;
type EditContactScreenRouteProp = RouteProp<ContactsStackParamList, 'EditContact'>;

interface Props {
  navigation: EditContactScreenNavigationProp;
  route: EditContactScreenRouteProp;
}

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${colors.background};
`;

const Content = styled(KeyboardAvoidingView)`
  flex: 1;
`;

const ScrollContent = styled(ScrollView)`
  flex: 1;
  padding: 16px;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin-bottom: 24px;
`;

const FormSection = styled.View`
  margin-bottom: 24px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin-bottom: 16px;
`;

const ButtonContainer = styled.View`
  margin-top: 16px;
  margin-bottom: 32px;
  flex-direction: row;
  gap: 12px;
`;

export const EditContactScreen: React.FC<Props> = ({ navigation, route }) => {
  const { contactId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const contact = useSelector(selectSelectedContact);
  const isLoading = useSelector((state: RootState) => state.contacts.isLoading);

  const [formData, setFormData] = useState<UpdateContactDTO>({});
  const [errors, setErrors] = useState<ContactValidationErrors>({});

  // Validate contactId exists
  useEffect(() => {
    if (!contactId) {
      Alert.alert(
        'Error',
        'Contact ID is missing. Please try again.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  }, [contactId, navigation]);

  // Fetch contact data on mount
  useEffect(() => {
    if (user?.id && contactId) {
      dispatch(fetchContact({ userId: user.id, contactId }));
    }
  }, [dispatch, user?.id, contactId]);

  // Populate form when contact data loads
  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name,
        phoneNumber: contact.phoneNumber || '',
        email: contact.email || '',
        birthday: contact.birthday || '',
        anniversary: contact.anniversary || '',
        relationshipType: contact.relationshipType || '',
        notes: contact.notes || '',
      });
    }
  }, [contact]);

  const handleFieldChange = (field: keyof UpdateContactDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user types
    if (errors[field as keyof ContactValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field as keyof ContactValidationErrors]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!user?.id || !contactId) {
      Alert.alert('Error', 'Missing required information.');
      return;
    }

    // Validate form
    const validationErrors = validateContact({
      name: formData.name || contact?.name || '',
      phone: formData.phoneNumber,
      email: formData.email,
      birthday: formData.birthday,
      anniversary: formData.anniversary,
    });

    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    // Prepare update data (remove empty strings, keep undefined for optional fields)
    const updateData: UpdateContactDTO = {
      name: formData.name?.trim(),
      phoneNumber: formData.phoneNumber?.trim() || undefined,
      email: formData.email?.trim() || undefined,
      birthday: formData.birthday || undefined,
      anniversary: formData.anniversary || undefined,
      relationshipType: formData.relationshipType?.trim() || undefined,
      notes: formData.notes?.trim() || undefined,
    };

    try {
      const result = await dispatch(
        updateContactThunk({
          userId: user.id,
          contactId,
          updates: updateData,
        })
      );

      if (updateContactThunk.fulfilled.match(result)) {
        Alert.alert('Success', 'Contact updated successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert('Error', result.payload as string || 'Failed to update contact.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update contact.');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  if (!contact && !isLoading) {
    return (
      <Container>
        <ScrollContent>
          <Title>Contact not found</Title>
          <Button onPress={handleCancel}>Go Back</Button>
        </ScrollContent>
      </Container>
    );
  }

  return (
    <Container>
      <Content behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollContent>
          <Title>Edit Contact</Title>

          <FormSection>
            <SectionTitle>Basic Information</SectionTitle>
            <Input
              label="Name *"
              value={formData.name || ''}
              onChangeText={(value) => handleFieldChange('name', value)}
              placeholder="Enter contact name"
              error={errors.name}
              autoCapitalize="words"
            />
            <Input
              label="Phone Number"
              value={formData.phoneNumber || ''}
              onChangeText={(value) => handleFieldChange('phoneNumber', value)}
              placeholder="+1234567890"
              keyboardType="phone-pad"
              error={errors.phone}
            />
            <Input
              label="Email"
              value={formData.email || ''}
              onChangeText={(value) => handleFieldChange('email', value)}
              placeholder="email@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
          </FormSection>

          <FormSection>
            <SectionTitle>Important Dates</SectionTitle>
            <Input
              label="Birthday"
              value={formData.birthday || ''}
              onChangeText={(value) => handleFieldChange('birthday', value)}
              placeholder="YYYY-MM-DD"
              error={errors.birthday}
            />
            <Input
              label="Anniversary"
              value={formData.anniversary || ''}
              onChangeText={(value) => handleFieldChange('anniversary', value)}
              placeholder="YYYY-MM-DD"
              error={errors.anniversary}
            />
          </FormSection>

          <FormSection>
            <SectionTitle>Additional Information</SectionTitle>
            <Input
              label="Relationship Type"
              value={formData.relationshipType || ''}
              onChangeText={(value) => handleFieldChange('relationshipType', value)}
              placeholder="e.g., Friend, Family, Colleague"
            />
            <Input
              label="Notes"
              value={formData.notes || ''}
              onChangeText={(value) => handleFieldChange('notes', value)}
              placeholder="Add any notes about this contact"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </FormSection>

          <ButtonContainer>
            <Button
              variant="outline"
              onPress={handleCancel}
              style={{ flex: 1 }}
            >
              Cancel
            </Button>
            <Button
              onPress={handleSubmit}
              isLoading={isLoading}
              style={{ flex: 1 }}
              disabled={!formData.name?.trim()}
            >
              Save Changes
            </Button>
          </ButtonContainer>
        </ScrollContent>
      </Content>
    </Container>
  );
};

export default EditContactScreen;

