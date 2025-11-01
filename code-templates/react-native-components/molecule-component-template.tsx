/**
 * Molecule Component Template
 *
 * This template demonstrates how to create molecule-level components in the RelaAI project.
 * Molecules are combinations of atoms that form more complex UI elements
 * (SearchBar, Card, FormField, ContactListItem, MessageCard, etc.)
 *
 * Usage:
 * 1. Copy this template
 * 2. Replace placeholders with your component name
 * 3. Define the props interface in contracts/component-contracts/component-interfaces.ts
 * 4. Compose existing atoms to build your molecule
 * 5. Add local state management if needed
 * 6. Include comprehensive tests
 */

import React, { useState, useCallback } from 'react';
import { View, TextInput } from 'react-native';
import styled from 'styled-components/native';
// TODO: Import component props interface from contracts
import { SearchBarProps } from '../../contracts/component-contracts/component-interfaces';
// TODO: Import atom components
// import { Button, IconButton, Input } from '../atoms';

// ==================== STYLED COMPONENTS ====================

// TODO: Define your styled components here
// Molecules typically combine multiple atoms with custom layout

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #F2F2F7;
  border-radius: 10px;
  padding-horizontal: 12px;
  height: 44px;
`;

const SearchIcon = styled.View`
  margin-right: 8px;
  /* TODO: Replace with actual Icon component */
`;

const StyledTextInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: #000000;
  padding: 0;
`;

const ClearButton = styled.TouchableOpacity`
  padding: 4px;
  margin-left: 8px;
`;

const ClearIcon = styled.Text`
  font-size: 18px;
  color: #8E8E93;
`;

const CancelButton = styled.TouchableOpacity`
  margin-left: 12px;
  padding-vertical: 8px;
`;

const CancelText = styled.Text`
  font-size: 16px;
  color: #007AFF;
`;

// ==================== COMPONENT ====================

/**
 * SearchBar Component
 *
 * A molecule component that combines a text input with search icon and clear button.
 * Provides search functionality with optional cancel button.
 *
 * @example
 * ```tsx
 * <SearchBar
 *   value={searchQuery}
 *   onChangeText={setSearchQuery}
 *   placeholder="Search contacts..."
 *   onClear={() => setSearchQuery('')}
 *   showCancel={true}
 *   onCancel={() => handleCancelSearch()}
 *   testID="contact-search"
 * />
 * ```
 *
 * @param {SearchBarProps} props - Component props defined in contracts
 * @returns {JSX.Element} SearchBar component
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
  onFocus,
  onBlur,
  autoFocus = false,
  showCancel = false,
  onCancel,
  testID,
}) => {
  // TODO: Add local state for managing UI-only concerns
  const [isFocused, setIsFocused] = useState(false);

  // TODO: Create memoized event handlers to prevent unnecessary re-renders
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  const handleClear = useCallback(() => {
    onChangeText('');
    onClear?.();
  }, [onChangeText, onClear]);

  const handleCancel = useCallback(() => {
    onChangeText('');
    setIsFocused(false);
    onCancel?.();
  }, [onChangeText, onCancel]);

  // TODO: Compute derived state
  const showClearButton = value.length > 0;
  const showCancelButton = showCancel && isFocused;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <SearchContainer style={{ flex: showCancelButton ? 1 : undefined }}>
        {/* TODO: Replace with actual Icon component */}
        <SearchIcon>
          {/* <Icon name="search" size={20} color="#8E8E93" /> */}
          <View style={{ width: 20, height: 20, backgroundColor: '#8E8E93' }} />
        </SearchIcon>

        <StyledTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#8E8E93"
          autoFocus={autoFocus}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="search"
          clearButtonMode="never" // We handle this manually
          // Accessibility props
          accessible={true}
          accessibilityLabel="Search input"
          accessibilityRole="search"
          accessibilityState={{ disabled: false }}
          testID={testID}
        />

        {/* TODO: Show clear button when there's text */}
        {showClearButton && (
          <ClearButton
            onPress={handleClear}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            accessible={true}
            accessibilityLabel="Clear search"
            accessibilityRole="button"
            testID={`${testID}-clear`}
          >
            <ClearIcon>✕</ClearIcon>
          </ClearButton>
        )}
      </SearchContainer>

      {/* TODO: Show cancel button when focused */}
      {showCancelButton && (
        <CancelButton
          onPress={handleCancel}
          accessible={true}
          accessibilityLabel="Cancel search"
          accessibilityRole="button"
          testID={`${testID}-cancel`}
        >
          <CancelText>Cancel</CancelText>
        </CancelButton>
      )}
    </View>
  );
};

// ==================== DEFAULT EXPORT ====================

export default SearchBar;

// ==================== ALTERNATIVE EXAMPLES ====================

/**
 * EXAMPLE: Card Molecule Component
 *
 * Uncomment and customize for a Card component:
 */

/*
import { CardProps } from '../../contracts/component-contracts/component-interfaces';

const CardContainer = styled.TouchableOpacity<{ elevation: number }>`
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;

  // TODO: Add elevation/shadow based on prop
  ${({ elevation }) => {
    if (elevation > 0) {
      return `
        shadow-color: #000000;
        shadow-offset: 0px ${elevation}px;
        shadow-opacity: ${0.1 * elevation};
        shadow-radius: ${elevation * 2}px;
        elevation: ${elevation};
      `;
    }
    return '';
  }}
`;

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  elevation = 2,
  padding,
  borderRadius,
  testID,
}) => {
  return (
    <CardContainer
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
      elevation={elevation}
      style={{
        ...(padding !== undefined && { padding }),
        ...(borderRadius !== undefined && { borderRadius }),
      }}
      accessible={true}
      accessibilityRole={onPress ? 'button' : 'none'}
      testID={testID}
    >
      {children}
    </CardContainer>
  );
};
*/

/**
 * EXAMPLE: ContactListItem Molecule Component
 *
 * Uncomment and customize for a ContactListItem component:
 */

/*
import { ContactListItemProps } from '../../contracts/component-contracts/component-interfaces';
import { Contact } from '../../contracts/data-contracts/dto-definitions';
// import { Avatar, Text, HealthScore } from '../atoms';

const ListItemContainer = styled.TouchableOpacity<{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  background-color: ${({ selected }) => selected ? '#F2F2F7' : '#FFFFFF'};
  border-bottom-width: 1px;
  border-bottom-color: #E5E5EA;
`;

const AvatarContainer = styled.View`
  margin-right: 12px;
`;

const ContentContainer = styled.View`
  flex: 1;
  justify-content: center;
`;

const TopRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const BottomRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ContactName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
`;

const RelationshipType = styled.Text`
  font-size: 12px;
  color: #8E8E93;
  background-color: #F2F2F7;
  padding-horizontal: 8px;
  padding-vertical: 2px;
  border-radius: 4px;
  margin-right: 8px;
`;

const LastContactDate = styled.Text`
  font-size: 14px;
  color: #8E8E93;
`;

const HealthScoreContainer = styled.View`
  margin-left: auto;
`;

export const ContactListItem: React.FC<ContactListItemProps> = ({
  contact,
  onPress,
  onLongPress,
  showHealthScore = false,
  showLastContact = true,
  showBirthday = false,
  selected = false,
  testID,
}) => {
  // TODO: Format last contact date
  const formatLastContact = (date: string | undefined): string => {
    if (!date) return 'Never';

    const now = new Date();
    const lastContact = new Date(date);
    const diffDays = Math.floor((now.getTime() - lastContact.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // TODO: Format birthday for display
  const formatBirthday = (birthday: string | undefined): string | null => {
    if (!birthday) return null;

    const date = new Date(birthday);
    const today = new Date();

    // Check if birthday is coming up
    const thisYearBirthday = new Date(today.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.floor((thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '🎂 Today!';
    if (diffDays > 0 && diffDays <= 7) return `🎂 In ${diffDays} days`;
    return null;
  };

  const lastContactText = formatLastContact(contact.updatedAt);
  const birthdayText = showBirthday ? formatBirthday(contact.birthday) : null;

  return (
    <ListItemContainer
      onPress={() => onPress()}
      onLongPress={onLongPress}
      selected={selected}
      accessible={true}
      accessibilityLabel={`${contact.name}, ${contact.relationshipType || 'contact'}`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      testID={testID}
    >
      <AvatarContainer>
        {// TODO: Replace with actual Avatar component
        // <Avatar name={contact.name} size="medium" />
        }
      </AvatarContainer>

      <ContentContainer>
        <TopRow>
          <ContactName>{contact.name}</ContactName>
          {contact.relationshipType && (
            <RelationshipType>{contact.relationshipType}</RelationshipType>
          )}
        </TopRow>

        <BottomRow>
          {showLastContact && (
            <LastContactDate>Last contact: {lastContactText}</LastContactDate>
          )}
          {birthdayText && (
            <LastContactDate style={{ marginLeft: 8 }}>{birthdayText}</LastContactDate>
          )}
        </BottomRow>
      </ContentContainer>

      {showHealthScore && (
        <HealthScoreContainer>
          {// TODO: Replace with actual HealthScore component
          // <HealthScore score={contact.healthScore || 0} size="small" />
          }
        </HealthScoreContainer>
      )}
    </ListItemContainer>
  );
};
*/

/**
 * EXAMPLE: MessageCard Molecule Component
 *
 * Uncomment and customize for a MessageCard component:
 */

/*
import { MessageCardProps } from '../../contracts/component-contracts/component-interfaces';
import { Message } from '../../contracts/data-contracts/dto-definitions';
// import { Button, Text, Chip } from '../atoms';

const MessageCardContainer = styled.View`
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  shadow-color: #000000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

const MessageHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const StatusBadge = styled.View<{ status: string }>`
  padding-horizontal: 8px;
  padding-vertical: 4px;
  border-radius: 4px;
  background-color: ${({ status }) => {
    switch (status) {
      case 'draft':
        return '#8E8E93';
      case 'scheduled':
        return '#007AFF';
      case 'sent':
        return '#34C759';
      case 'failed':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  }};
`;

const StatusText = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: #FFFFFF;
  text-transform: uppercase;
`;

const MessageContent = styled.Text`
  font-size: 16px;
  line-height: 24px;
  color: #000000;
  margin-bottom: 12px;
`;

const MessageFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const MetadataRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const MetadataText = styled.Text`
  font-size: 12px;
  color: #8E8E93;
  margin-right: 12px;
`;

const ActionsRow = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-top: 12px;
`;

const AlternativesContainer = styled.View`
  margin-top: 12px;
  padding-top: 12px;
  border-top-width: 1px;
  border-top-color: #E5E5EA;
`;

const AlternativesTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 8px;
`;

const AlternativeText = styled.Text`
  font-size: 14px;
  color: #3C3C43;
  padding: 8px;
  background-color: #F2F2F7;
  border-radius: 8px;
  margin-bottom: 8px;
`;

export const MessageCard: React.FC<MessageCardProps> = ({
  message,
  onEdit,
  onDelete,
  onSchedule,
  onSend,
  onSelectAlternative,
  showActions = true,
  showAlternatives = false,
  testID,
}) => {
  // TODO: Format dates for display
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `In ${diffMins} minutes`;
    if (diffHours < 24) return `In ${diffHours} hours`;
    if (diffDays < 7) return `In ${diffDays} days`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  // TODO: Determine available actions based on message status
  const canEdit = message.status === 'draft' || message.status === 'scheduled';
  const canDelete = message.status !== 'sent';
  const canSchedule = message.status === 'draft';
  const canSend = message.status === 'draft' || message.status === 'scheduled';

  return (
    <MessageCardContainer
      accessible={true}
      accessibilityLabel={`Message: ${message.content.substring(0, 50)}...`}
      testID={testID}
    >
      {// Message Header
      }
      <MessageHeader>
        <StatusBadge status={message.status}>
          <StatusText>{message.status}</StatusText>
        </StatusBadge>

        {message.aiGenerated && (
          <MetadataText>✨ AI Generated</MetadataText>
        )}
      </MessageHeader>

      {// Message Content
      }
      <MessageContent>{message.content}</MessageContent>

      {// Message Footer with metadata
      }
      <MessageFooter>
        <MetadataRow>
          {message.occasion && (
            <MetadataText>📅 {message.occasion}</MetadataText>
          )}
          {message.tone && (
            <MetadataText>🎵 {message.tone}</MetadataText>
          )}
          {message.scheduledAt && (
            <MetadataText>⏰ {formatDate(message.scheduledAt)}</MetadataText>
          )}
        </MetadataRow>

        {message.confidenceScore !== undefined && (
          <MetadataText>
            Confidence: {Math.round(message.confidenceScore * 100)}%
          </MetadataText>
        )}
      </MessageFooter>

      {// Action Buttons
      }
      {showActions && (
        <ActionsRow>
          {canEdit && onEdit && (
            // TODO: Replace with actual Button component
            <TouchableOpacity onPress={onEdit}>
              <Text>Edit</Text>
            </TouchableOpacity>
          )}
          {canSchedule && onSchedule && (
            <TouchableOpacity onPress={onSchedule}>
              <Text>Schedule</Text>
            </TouchableOpacity>
          )}
          {canSend && onSend && (
            <TouchableOpacity onPress={onSend}>
              <Text>Send</Text>
            </TouchableOpacity>
          )}
          {canDelete && onDelete && (
            <TouchableOpacity onPress={onDelete}>
              <Text>Delete</Text>
            </TouchableOpacity>
          )}
        </ActionsRow>
      )}

      {// Alternative Messages
      }
      {showAlternatives && message.alternatives.length > 0 && (
        <AlternativesContainer>
          <AlternativesTitle>
            Alternative Messages ({message.alternatives.length})
          </AlternativesTitle>
          {message.alternatives.map((alt, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onSelectAlternative?.(alt)}
            >
              <AlternativeText>{alt}</AlternativeText>
            </TouchableOpacity>
          ))}
        </AlternativesContainer>
      )}
    </MessageCardContainer>
  );
};
*/

// ==================== COMPOSITION BEST PRACTICES ====================

/**
 * MOLECULE COMPOSITION TIPS:
 *
 * 1. Reuse atoms - Don't recreate basic components
 * 2. Keep molecules focused - One clear responsibility
 * 3. Use local state for UI concerns only
 * 4. Lift data state to parent components/Redux
 * 5. Make components controllable - Accept props for all important state
 * 6. Provide sensible defaults for optional props
 * 7. Use composition over configuration
 * 8. Keep event handlers simple - delegate to parent
 */

// ==================== STATE MANAGEMENT GUIDELINES ====================

/**
 * WHEN TO USE LOCAL STATE:
 *
 * ✓ UI-only state (focused, hovered, expanded)
 * ✓ Temporary form state before submission
 * ✓ Animation state
 * ✓ Component-specific toggles
 *
 * WHEN TO USE REDUX:
 *
 * ✓ Shared data across multiple components
 * ✓ Data fetched from API
 * ✓ User authentication state
 * ✓ Complex business logic
 */
