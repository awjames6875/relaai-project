/**
 * Messages List Screen
 *
 * View all messages organized by status tabs (All, Drafts, Scheduled, Sent).
 * Supports filtering, search, delete, and edit actions.
 *
 * Implements Epic 3: AI Message Generation
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import { RootState, AppDispatch } from '../../store';
import { selectUser } from '../../store/slices/authSlice';
import {
  fetchMessagesThunk,
  selectMessages,
  selectMessagesLoading,
  selectMessagesError,
} from '../../store/slices/messageSlice';
import { Card, EmptyState } from '../../components/molecules';
import { Button } from '../../components/atoms';
import { colors, spacing } from '../../theme';

// Navigation types
interface MessagesStackParamList {
  MessagesList: { status?: 'draft' | 'scheduled' | 'sent' | 'failed' };
}

type MessagesListScreenNavigationProp = StackNavigationProp<
  MessagesStackParamList,
  'MessagesList'
>;
type MessagesListScreenRouteProp = RouteProp<MessagesStackParamList, 'MessagesList'>;

interface Props {
  navigation: MessagesListScreenNavigationProp;
  route: MessagesListScreenRouteProp;
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

const TabContainer = styled.View`
  flex-direction: row;
  background-color: ${colors.white};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.grayLight};
`;

const Tab = styled.TouchableOpacity<{ isActive: boolean }>`
  flex: 1;
  padding: ${spacing[3]}px;
  border-bottom-width: 3px;
  border-bottom-color: ${(props) =>
    props.isActive ? colors.primary : 'transparent'};
  align-items: center;
`;

const TabText = styled.Text<{ isActive: boolean }>`
  font-size: 14px;
  font-weight: ${(props) => (props.isActive ? '600' : '400')};
  color: ${(props) =>
    props.isActive ? colors.primary : colors.textSecondary};
`;

const Content = styled.FlatList`
  flex: 1;
  padding: ${spacing[2]}px;
`;

const MessageCardWrapper = styled.View`
  margin-bottom: ${spacing[3]}px;
`;

const MessageContent = styled.View`
  margin-bottom: ${spacing[2]}px;
`;

const MessagePreview = styled.Text`
  font-size: 14px;
  color: ${colors.textPrimary};
  line-height: 20px;
`;

const MessageMeta = styled.View`
  flex-direction: row;
  gap: ${spacing[2]}px;
  margin-top: ${spacing[2]}px;
`;

const Badge = styled.View<{ type: 'occasion' | 'status' }>`
  background-color: ${(props) =>
    props.type === 'occasion'
      ? colors.primaryLight
      : colors.secondary};
  border-radius: 6px;
  padding: ${spacing[1]}px ${spacing[2]}px;
`;

const BadgeText = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => (props.color ? props.color : colors.white)};
`;

const Timestamp = styled.Text`
  font-size: 12px;
  color: ${colors.textSecondary};
  margin-top: ${spacing[1]}px;
`;

const FAB = styled.TouchableOpacity`
  position: absolute;
  bottom: ${spacing[4]}px;
  right: ${spacing[4]}px;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${colors.primary};
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const FABText = styled.Text`
  font-size: 28px;
  color: ${colors.white};
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

// ==================== COMPONENT ====================

export const MessagesListScreen = ({
  navigation,
  route,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const messages = useSelector(selectMessages);
  const isLoading = useSelector(selectMessagesLoading);
  const error = useSelector(selectMessagesError);

  const [activeTab, setActiveTab] = useState<
    'all' | 'draft' | 'scheduled' | 'sent'
  >('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'draft', label: 'Drafts' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'sent', label: 'Sent' },
  ] as const;

  // Fetch messages on mount and when tab changes
  useEffect(() => {
    if (!user?.id) return;

    const status =
      activeTab === 'all' ? undefined : (activeTab as any);

    dispatch(
      fetchMessagesThunk({
        userId: user.id,
        params: {
          status,
          page: 1,
          pageSize: 20,
        },
      })
    );
  }, [dispatch, user?.id, activeTab]);

  // Filter messages by active tab
  const filteredMessages =
    activeTab === 'all'
      ? messages
      : messages.filter(
          (msg) =>
            msg.status ===
            (activeTab === 'draft'
              ? 'draft'
              : activeTab === 'scheduled'
              ? 'scheduled'
              : 'sent')
        );

  const handleRefresh = async () => {
    if (!user?.id) return;
    setIsRefreshing(true);

    const status =
      activeTab === 'all' ? undefined : (activeTab as any);

    await dispatch(
      fetchMessagesThunk({
        userId: user.id,
        params: {
          status,
          page: 1,
          pageSize: 20,
        },
      })
    );

    setIsRefreshing(false);
  };

  const handleGenerateMessage = () => {
    navigation.navigate('GenerateMessage' as any);
  };

  const renderMessageCard = ({ item }: any) => (
    <MessageCardWrapper>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('EditMessage' as any, { messageId: item.id });
        }}
      >
        <Card>
          <View>
            <MessageContent>
              <MessagePreview numberOfLines={2}>
                {item.content}
              </MessagePreview>
            </MessageContent>

            <MessageMeta>
              {item.occasion && (
                <Badge type="occasion">
                  <BadgeText color={colors.primary}>
                    {item.occasion.charAt(0).toUpperCase() +
                      item.occasion.slice(1)}
                  </BadgeText>
                </Badge>
              )}
              <Badge type="status">
                <BadgeText>
                  {item.status.charAt(0).toUpperCase() +
                    item.status.slice(1)}
                </BadgeText>
              </Badge>
            </MessageMeta>

            <Timestamp>
              {item.scheduled_at
                ? new Date(item.scheduled_at).toLocaleDateString()
                : item.created_at
                ? new Date(item.created_at).toLocaleDateString()
                : ''}
            </Timestamp>
          </View>
        </Card>
      </TouchableOpacity>
    </MessageCardWrapper>
  );

  const renderEmptyState = () => (
    <EmptyState
      title={
        activeTab === 'all'
          ? 'No Messages Yet'
          : activeTab === 'draft'
          ? 'No Drafts'
          : activeTab === 'scheduled'
          ? 'No Scheduled Messages'
          : 'No Sent Messages'
      }
      message="Generate your first message to get started"
      actionLabel="Generate Message"
      onAction={handleGenerateMessage}
    />
  );

  if (isLoading && messages.length === 0) {
    return (
      <Container>
        <Header>
          <Title>Messages</Title>
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
        <Title>Messages</Title>
      </Header>

      <TabContainer>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            isActive={activeTab === tab.id}
            onPress={() => setActiveTab(tab.id as any)}
          >
            <TabText isActive={activeTab === tab.id}>
              {tab.label}
            </TabText>
          </Tab>
        ))}
      </TabContainer>

      {filteredMessages.length === 0 ? (
        renderEmptyState()
      ) : (
        <Content
          data={filteredMessages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageCard}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}

      <FAB onPress={handleGenerateMessage}>
        <FABText>+</FABText>
      </FAB>
    </Container>
  );
};

export default MessagesListScreen;
