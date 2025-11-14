/**
 * Contact Detail Screen
 *
 * Displays detailed information about a single contact.
 * Implements US-2.6 (View Contact Details).
 */
import React, { useEffect } from 'react';
import { ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ContactsStackParamList } from '@contracts/component-contracts/navigation-types';
import { RootState, AppDispatch } from '../../store';
import {
  fetchContact,
  deleteContactThunk,
  selectSelectedContact,
  selectContactsLoading,
} from '../../store/slices/contactSlice';
import { selectUser } from '../../store/slices/authSlice';
import { Button } from '../../components/atoms';
import { Card } from '../../components/molecules';
import { colors } from '../../theme';

type ContactDetailScreenNavigationProp = StackNavigationProp<ContactsStackParamList, 'ContactDetail'>;
type ContactDetailScreenRouteProp = RouteProp<ContactsStackParamList, 'ContactDetail'>;

interface Props {
  navigation: ContactDetailScreenNavigationProp;
  route: ContactDetailScreenRouteProp;
}

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${colors.background};
`;

const Content = styled(ScrollView)`
  flex: 1;
  padding: 16px;
`;

const Header = styled.View`
  margin-bottom: 24px;
`;

const Name = styled.Text`
  font-size: 32px;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin-bottom: 8px;
`;

const RelationshipType = styled.Text`
  font-size: 16px;
  color: ${colors.textSecondary};
`;

const Section = styled.View`
  margin-bottom: 24px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin-bottom: 12px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.grayLight};
`;

const InfoLabel = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.textSecondary};
  width: 120px;
`;

const InfoValue = styled.Text`
  font-size: 14px;
  color: ${colors.textPrimary};
  flex: 1;
`;

const ButtonContainer = styled.View`
  margin-top: 16px;
  flex-direction: row;
  gap: 12px;
`;

const EmptyState = styled.Text`
  text-align: center;
  color: ${colors.textSecondary};
  padding: 32px;
  font-size: 16px;
`;

/**
 * Format date from YYYY-MM-DD to readable format
 */
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Not set';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateString;
  }
};

export const ContactDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { contactId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const contact = useSelector(selectSelectedContact);
  const isLoading = useSelector(selectContactsLoading);

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

  useEffect(() => {
    if (user?.id && contactId) {
      dispatch(fetchContact({ userId: user.id, contactId }));
    }
  }, [dispatch, user?.id, contactId]);

  const handleEdit = () => {
    if (contactId) {
      navigation.navigate('EditContact', { contactId });
    }
  };

  const handleDelete = () => {
    if (!user?.id || !contactId) return;

    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact? This action can be undone within 30 days.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await dispatch(
              deleteContactThunk({ userId: user.id, contactId })
            );

            if (deleteContactThunk.fulfilled.match(result)) {
              Alert.alert('Success', 'Contact deleted successfully.', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } else {
              Alert.alert('Error', result.payload as string || 'Failed to delete contact.');
            }
          },
        },
      ]
    );
  };

  if (isLoading && !contact) {
    return (
      <Container>
        <Content>
          <EmptyState>Loading contact...</EmptyState>
        </Content>
      </Container>
    );
  }

  if (!contact) {
    return (
      <Container>
        <Content>
          <EmptyState>Contact not found</EmptyState>
          <Button onPress={() => navigation.goBack()}>Go Back</Button>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        <Header>
          <Name>{contact.name}</Name>
          {contact.relationshipType && (
            <RelationshipType>{contact.relationshipType}</RelationshipType>
          )}
        </Header>

        <Card>
          <Section>
            <SectionTitle>Contact Information</SectionTitle>
            {contact.phoneNumber && (
              <InfoRow>
                <InfoLabel>Phone</InfoLabel>
                <InfoValue>{contact.phoneNumber}</InfoValue>
              </InfoRow>
            )}
            {contact.email && (
              <InfoRow>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>{contact.email}</InfoValue>
              </InfoRow>
            )}
          </Section>

          <Section>
            <SectionTitle>Important Dates</SectionTitle>
            <InfoRow>
              <InfoLabel>Birthday</InfoLabel>
              <InfoValue>{formatDate(contact.birthday)}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Anniversary</InfoLabel>
              <InfoValue>{formatDate(contact.anniversary)}</InfoValue>
            </InfoRow>
          </Section>

          {contact.notes && (
            <Section>
              <SectionTitle>Notes</SectionTitle>
              <InfoValue style={{ paddingTop: 12, paddingBottom: 12 }}>
                {contact.notes}
              </InfoValue>
            </Section>
          )}
        </Card>

        <ButtonContainer>
          <Button variant="outline" onPress={handleEdit} style={{ flex: 1 }}>
            Edit
          </Button>
          <Button variant="danger" onPress={handleDelete} style={{ flex: 1 }}>
            Delete
          </Button>
        </ButtonContainer>
      </Content>
    </Container>
  );
};

export default ContactDetailScreen;

