/**
 * Edit Message Screen
 *
 * Edit and refine a message before sending or scheduling.
 * Allows changes to content, occasion, tone, and sending preferences.
 *
 * Implements Epic 3: AI Message Generation
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { RootState, AppDispatch } from '../../store';
import { selectUser } from '../../store/slices/authSlice';
import {
  fetchMessageByIdThunk,
  updateMessageThunk,
  deleteMessageThunk,
  selectSelectedMessage,
  selectMessagesLoading,
} from '../../store/slices/messageSlice';
import { Button } from '../../components/atoms';
import { Card } from '../../components/molecules';
import { colors, spacing } from '../../theme';

// Navigation types
interface MessagesStackParamList {
  EditMessage: { messageId: string };
}

type EditMessageScreenNavigationProp = StackNavigationProp<
  MessagesStackParamList,
  'EditMessage'
>;
type EditMessageScreenRouteProp = RouteProp<
  MessagesStackParamList,
  'EditMessage'
>;

interface Props {
  navigation: EditMessageScreenNavigationProp;
  route: EditMessageScreenRouteProp;
}

// ==================== STYLED COMPONENTS ====================

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${colors.background};
`;

const Header = styled.View`
  padding: ${spacing[4]}px;
  background-color: ${colors.white};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.grayLight};
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${colors.textPrimary};
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: ${spacing[4]}px;
`;

const Section = styled.View`
  margin-bottom: ${spacing[5]}px;
`;

const SectionLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin-bottom: ${spacing[2]}px;
`;

const MessageInput = styled.TextInput`
  background-color: ${colors.white};
  border-color: ${colors.grayLight};
  border-width: 1px;
  border-radius: 8px;
  padding: ${spacing[3]}px;
  font-size: 14px;
  min-height: 120px;
  color: ${colors.textPrimary};
`;

const CharCount = styled.Text`
  font-size: 12px;
  color: ${colors.textSecondary};
  margin-top: ${spacing[2]}px;
  text-align: right;
`;

const MetaContainer = styled.View`
  flex-direction: row;
  gap: ${spacing[2]}px;
  flex-wrap: wrap;
`;

const Badge = styled(Card)`
  flex: 0.48;
  align-items: center;
  padding: ${spacing[3]}px;
`;

const BadgeLabel = styled.Text`
  font-size: 12px;
  color: ${colors.textSecondary};
  margin-bottom: ${spacing[1]}px;
`;

const BadgeValue = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.textPrimary};
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Footer = styled.View`
  flex-direction: row;
  padding: ${spacing[4]}px;
  gap: ${spacing[2]}px;
  background-color: ${colors.white};
  border-top-width: 1px;
  border-top-color: ${colors.grayLight};
`;

// ==================== COMPONENT ====================

export const EditMessageScreen = ({
  navigation,
  route,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const message = useSelector(selectSelectedMessage);
  const isLoading = useSelector(selectMessagesLoading);

  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch message on mount
  useEffect(() => {
    if (!user?.id) return;

    dispatch(
      fetchMessageByIdThunk({
        userId: user.id,
        messageId: route.params.messageId,
      })
    );
  }, [dispatch, user?.id, route.params.messageId]);

  // Update content when message loads
  useEffect(() => {
    if (message?.content) {
      setContent(message.content);
    }
  }, [message]);

  const handleSaveDraft = async () => {
    if (!user?.id || !message?.id || !content.trim()) {
      Alert.alert('Error', 'Please enter message content');
      return;
    }

    setIsSaving(true);

    try {
      await dispatch(
        updateMessageThunk({
          userId: user.id,
          messageId: message.id,
          updates: {
            content: content.trim(),
          },
        })
      )
        .unwrap();

      Alert.alert('Success', 'Draft saved', [
        {
          text: 'Close',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSchedule = () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter message content');
      return;
    }

    navigation.navigate('ScheduleMessage' as any, {
      messageId: message?.id,
      content,
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            if (!user?.id || !message?.id) return;

            try {
              await dispatch(
                deleteMessageThunk({
                  userId: user.id,
                  messageId: message.id,
                })
              )
                .unwrap();

              Alert.alert('Success', 'Message deleted', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.message || 'Failed to delete message'
              );
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (isLoading || !message) {
    return (
      <Container>
        <Header>
          <Title>Edit Message</Title>
        </Header>
        <LoadingContainer>
          <ActivityIndicator size="large" color={colors.primary} />
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Edit Message</Title>
      </Header>

      <Content>
        {/* Message Content */}
        <Section>
          <SectionLabel>Message</SectionLabel>
          <MessageInput
            multiline
            value={content}
            onChangeText={setContent}
            placeholder="Enter your message..."
            placeholderTextColor={colors.textSecondary}
          />
          <CharCount>{content.length}/5000</CharCount>
        </Section>

        {/* Message Metadata */}
        <Section>
          <SectionLabel>Details</SectionLabel>
          <MetaContainer>
            {message.occasion && (
              <Badge>
                <BadgeLabel>Occasion</BadgeLabel>
                <BadgeValue>
                  {message.occasion.charAt(0).toUpperCase() +
                    message.occasion.slice(1)}
                </BadgeValue>
              </Badge>
            )}
            {message.tone && (
              <Badge>
                <BadgeLabel>Tone</BadgeLabel>
                <BadgeValue>
                  {message.tone.charAt(0).toUpperCase() +
                    message.tone.slice(1)}
                </BadgeValue>
              </Badge>
            )}
            <Badge>
              <BadgeLabel>Status</BadgeLabel>
              <BadgeValue>
                {message.status.charAt(0).toUpperCase() +
                  message.status.slice(1)}
              </BadgeValue>
            </Badge>
          </MetaContainer>
        </Section>

        {/* AI Info */}
        {message.aiGenerated && (
          <Section>
            <SectionLabel>Generated by AI</SectionLabel>
            {message.confidenceScore && (
              <Card>
                <BadgeLabel>Confidence</BadgeLabel>
                <BadgeValue>
                  {(message.confidenceScore * 100).toFixed(0)}%
                </BadgeValue>
              </Card>
            )}
          </Section>
        )}
      </Content>

      <Footer>
        <Button
          variant="outline"
          size="medium"
          fullWidth
          onPress={handleDelete}
        >Delete</Button>
        <Button
          variant="primary"
          size="medium"
          fullWidth
          onPress={handleSaveDraft}
          disabled={isSaving || !content.trim()}
          isLoading={isSaving}
        >Save</Button>
        <Button
          variant="primary"
          size="medium"
          fullWidth
          onPress={handleSchedule}
          disabled={!content.trim()}
        >Schedule</Button>
      </Footer>
    </Container>
  );
};

export default EditMessageScreen;
