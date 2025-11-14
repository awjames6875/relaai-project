/**
 * ContactCard Component (Molecule)
 *
 * Displays a contact in a card format for list views.
 * Shows name, relationship type, and optional contact info.
 */
import React from 'react';
import styled from 'styled-components/native';
import { Contact } from '@contracts/data-contracts/dto-definitions';
import { Card } from './Card';
import { colors } from '../../theme';

interface ContactCardProps {
  contact: Contact;
  onPress: () => void;
}

const CardContent = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Avatar = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${colors.primaryLight};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const AvatarText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.primary};
`;

const Content = styled.View`
  flex: 1;
`;

const Name = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin-bottom: 4px;
`;

const RelationshipType = styled.Text`
  font-size: 14px;
  color: ${colors.textSecondary};
  margin-bottom: 4px;
`;

const ContactInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

const InfoText = styled.Text`
  font-size: 13px;
  color: ${colors.textTertiary};
  margin-right: 12px;
`;

const Chevron = styled.Text`
  font-size: 16px;
  color: ${colors.textTertiary};
  margin-left: auto;
`;

/**
 * Get initials from contact name
 */
const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const ContactCard: React.FC<ContactCardProps> = ({ contact, onPress }) => {
  const initials = getInitials(contact.name);

  return (
    <Card onPress={onPress} testID="contact-card">
      <CardContent>
        <Avatar>
          <AvatarText>{initials}</AvatarText>
        </Avatar>
        <Content>
          <Name>{contact.name}</Name>
          {contact.relationshipType && (
            <RelationshipType>{contact.relationshipType}</RelationshipType>
          )}
          <ContactInfo>
            {contact.phoneNumber && <InfoText>📞 {contact.phoneNumber}</InfoText>}
            {contact.email && <InfoText>✉️ {contact.email}</InfoText>}
          </ContactInfo>
        </Content>
        <Chevron>›</Chevron>
      </CardContent>
    </Card>
  );
};

