/**
 * Add Contact Screen
 *
 * Form for creating a new contact.
 * Implements US-2.1 (Add Contact).
 */
import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ContactsStackParamList } from '@contracts/component-contracts/navigation-types';
import { RootState, AppDispatch } from '../../store';
import { createContactThunk } from '../../store/slices/contactSlice';
import { selectUser } from '../../store/slices/authSlice';
import { Input } from '../../components/atoms';
import { Button } from '../../components/atoms';
import {
  validateContact,
  hasValidationErrors,
  ContactValidationErrors,
} from '../../utils/validation/contactValidation';
import { CreateContactDTO } from '@contracts/data-contracts/dto-definitions';
import { colors } from '../../theme';

type AddContactScreenNavigationProp = StackNavigationProp<ContactsStackParamList, 'AddContact'>;
type AddContactScreenRouteProp = RouteProp<ContactsStackParamList, 'AddContact'>;

interface Props {
  navigation: AddContactScreenNavigationProp;
  route: AddContactScreenRouteProp;
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
`;

export const AddContactScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const isLoading = useSelector((state: RootState) => state.contacts.isLoading);

  const [formData, setFormData] = useState<CreateContactDTO>({
    name: '',
    phoneNumber: '',
    email: '',
    birthday: '',
    anniversary: '',
    relationshipType: '',
    notes: '',
  });

  const [errors, setErrors] = useState<ContactValidationErrors>({});

  const handleFieldChange = (field: keyof CreateContactDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user types
    if (errors[field as keyof ContactValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field as keyof ContactValidationErrors]: undefined }));
    }
  };

  const handleSubmit = async () => {
    // Validate form
    const validationErrors = validateContact({
      name: formData.name,
      phone: formData.phoneNumber,
      email: formData.email,
      birthday: formData.birthday,
      anniversary: formData.anniversary,
    });

    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to add contacts.');
      return;
    }

    // Prepare data (remove empty strings)
    const contactData: CreateContactDTO = {
      name: formData.name.trim(),
      phoneNumber: formData.phoneNumber?.trim() || undefined,
      email: formData.email?.trim() || undefined,
      birthday: formData.birthday || undefined,
      anniversary: formData.anniversary || undefined,
      relationshipType: formData.relationshipType?.trim() || undefined,
      notes: formData.notes?.trim() || undefined,
    };

    try {
      const result = await dispatch(
        createContactThunk({
          userId: user.id,
          contactData,
        })
      );

      if (createContactThunk.fulfilled.match(result)) {
        Alert.alert('Success', 'Contact added successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert('Error', result.payload as string || 'Failed to add contact.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add contact.');
    }
  };

  return (
    <Container>
      <Content behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollContent>
          <Title>Add Contact</Title>

          <FormSection>
            <SectionTitle>Basic Information</SectionTitle>
            <Input
              label="Name *"
              value={formData.name}
              onChangeText={(value) => handleFieldChange('name', value)}
              placeholder="Enter contact name"
              error={errors.name}
              autoCapitalize="words"
            />
            <Input
              label="Phone Number"
              value={formData.phoneNumber}
              onChangeText={(value) => handleFieldChange('phoneNumber', value)}
              placeholder="+1234567890"
              keyboardType="phone-pad"
              error={errors.phone}
            />
            <Input
              label="Email"
              value={formData.email}
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
              value={formData.birthday}
              onChangeText={(value) => handleFieldChange('birthday', value)}
              placeholder="YYYY-MM-DD"
              error={errors.birthday}
            />
            <Input
              label="Anniversary"
              value={formData.anniversary}
              onChangeText={(value) => handleFieldChange('anniversary', value)}
              placeholder="YYYY-MM-DD"
              error={errors.anniversary}
            />
          </FormSection>

          <FormSection>
            <SectionTitle>Additional Information</SectionTitle>
            <Input
              label="Relationship Type"
              value={formData.relationshipType}
              onChangeText={(value) => handleFieldChange('relationshipType', value)}
              placeholder="e.g., Friend, Family, Colleague"
            />
            <Input
              label="Notes"
              value={formData.notes}
              onChangeText={(value) => handleFieldChange('notes', value)}
              placeholder="Add any notes about this contact"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </FormSection>

          <ButtonContainer>
            <Button
              onPress={handleSubmit}
              isLoading={isLoading}
              fullWidth
              disabled={!formData.name.trim()}
            >
              Add Contact
            </Button>
          </ButtonContainer>
        </ScrollContent>
      </Content>
    </Container>
  );
};

export default AddContactScreen;

