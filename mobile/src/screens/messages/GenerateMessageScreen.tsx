/**
 * Generate Message Screen
 *
 * Main screen for AI message generation.
 * User selects a contact, occasion, tone, and optional context,
 * then receives 3 AI-generated message alternatives to choose from.
 *
 * Implements Epic 3: AI Message Generation
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { RootState, AppDispatch } from '../../store';
import { selectUser } from '../../store/slices/authSlice';
import { createMessageThunk } from '../../store/slices/messageSlice';
import { generateAIMessage } from '../../services/message';
import { Contact } from '@contracts/data-contracts/dto-definitions';
import { Button } from '../../components/atoms';
import { Card, ContactCard } from '../../components/molecules';
import { colors, spacing, applyShadow } from '../../theme';

// Navigation types
interface MessagesStackParamList {
  GenerateMessage: { contactId?: string };
}

type GenerateMessageScreenNavigationProp = StackNavigationProp<
  MessagesStackParamList,
  'GenerateMessage'
>;
type GenerateMessageScreenRouteProp = RouteProp<
  MessagesStackParamList,
  'GenerateMessage'
>;

interface Props {
  navigation: GenerateMessageScreenNavigationProp;
  route: GenerateMessageScreenRouteProp;
}

// ==================== TYPES ====================

type Occasion = 'birthday' | 'anniversary' | 'casual' | 'apology' | 'thankyou' | 'congratulations';
type Tone = 'casual' | 'formal';

interface GenerationState {
  step: 'contact' | 'occasion' | 'tone' | 'context' | 'alternatives';
  selectedContact: Contact | null;
  selectedOccasion: Occasion | null;
  selectedTone: Tone;
  context: string;
  isGenerating: boolean;
  alternatives: string[];
  selectedAlternativeIndex: number;
  error: string | null;
}

// ==================== STYLED COMPONENTS ====================

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${colors.background};
`;

const Header = styled.View`
  padding: ${spacing[4]}px ${spacing[4]}px;
  background-color: ${colors.white};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.grayLight};
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${colors.textPrimary};
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: ${colors.textSecondary};
  margin-top: ${spacing[2]}px;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: ${spacing[4]}px;
`;

const StepContainer = styled.View`
  margin-bottom: ${spacing[6]}px;
`;

const StepLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin-bottom: ${spacing[3]}px;
`;

const OccasionGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${spacing[2]}px;
`;

const OccasionButton = styled(TouchableOpacity)<{ isSelected: boolean }>`
  flex-basis: 48%;
  padding: ${spacing[3]}px;
  background-color: ${(props) =>
    props.isSelected ? colors.primary : colors.grayLight};
  border-radius: 8px;
  border-width: 2px;
  border-color: ${(props) =>
    props.isSelected ? colors.primary : 'transparent'};
  align-items: center;
`;

const OccasionText = styled.Text<{ isSelected: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) =>
    props.isSelected ? colors.white : colors.textPrimary};
`;

const ToneContainer = styled.View`
  flex-direction: row;
  gap: ${spacing[3]}px;
`;

const ToneButton = styled(TouchableOpacity)<{ isSelected: boolean }>`
  flex: 1;
  padding: ${spacing[3]}px;
  background-color: ${(props) =>
    props.isSelected ? colors.primary : colors.grayLight};
  border-radius: 8px;
  border-width: 2px;
  border-color: ${(props) =>
    props.isSelected ? colors.primary : 'transparent'};
  align-items: center;
`;

const ToneText = styled.Text<{ isSelected: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) =>
    props.isSelected ? colors.white : colors.textPrimary};
`;

const ContextInput = styled.TextInput`
  background-color: ${colors.white};
  border-color: ${colors.grayLight};
  border-width: 1px;
  border-radius: 8px;
  padding: ${spacing[3]}px;
  font-size: 14px;
  min-height: 100px;
  color: ${colors.textPrimary};
`;

const CharCount = styled.Text`
  font-size: 12px;
  color: ${colors.textSecondary};
  margin-top: ${spacing[2]}px;
  text-align: right;
`;

const MessageCardTouchable = styled.TouchableOpacity<{ isSelected: boolean }>`
  margin-bottom: ${spacing[3]}px;
  background-color: ${(props) =>
    props.isSelected ? colors.primaryLight : colors.white};
  border-width: 2px;
  border-radius: 8px;
  border-color: ${(props) =>
    props.isSelected ? colors.primary : colors.grayLight};
  padding: ${spacing[3]}px;
`;

const MessageText = styled.Text`
  font-size: 14px;
  color: ${colors.textPrimary};
  line-height: 20px;
`;

const SelectBadge = styled.View`
  background-color: ${colors.primary};
  border-radius: 12px;
  padding: ${spacing[1]}px ${spacing[2]}px;
  margin-top: ${spacing[2]}px;
`;

const SelectBadgeText = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: ${colors.white};
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LoadingText = styled.Text`
  font-size: 14px;
  color: ${colors.textSecondary};
  margin-top: ${spacing[3]}px;
`;

const ErrorContainer = styled.View`
  background-color: #ffebee;
  border-radius: 8px;
  padding: ${spacing[3]}px;
  margin-bottom: ${spacing[3]}px;
  border-left-width: 4px;
  border-left-color: #f44336;
`;

const ErrorText = styled.Text`
  font-size: 14px;
  color: #c62828;
`;

const Footer = styled.View`
  flex-direction: row;
  padding: ${spacing[4]}px;
  gap: ${spacing[3]}px;
  background-color: ${colors.white};
  border-top-width: 1px;
  border-top-color: ${colors.grayLight};
`;

// ==================== COMPONENT ====================

export const GenerateMessageScreen = ({
  navigation,
  route,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const [state, setState] = useState<GenerationState>({
    step: 'occasion',
    selectedContact: null,
    selectedOccasion: null,
    selectedTone: 'casual',
    context: '',
    isGenerating: false,
    alternatives: [],
    selectedAlternativeIndex: 0,
    error: null,
  });

  const occasions: Occasion[] = [
    'birthday',
    'anniversary',
    'casual',
    'apology',
    'thankyou',
    'congratulations',
  ];

  // Generate message with Claude
  const handleGenerateMessage = useCallback(async () => {
    if (!user?.id || !state.selectedOccasion) {
      Alert.alert('Error', 'Missing required information');
      return;
    }

    setState((prev) => ({
      ...prev,
      isGenerating: true,
      error: null,
    }));

    try {
      // For now, use route params contactId if available
      const contactId = route.params?.contactId;
      if (!contactId) {
        throw new Error('No contact selected');
      }

      const result = await generateAIMessage(user.id, {
        contactId,
        occasion: state.selectedOccasion,
        tone: state.selectedTone,
        context: state.context || undefined,
      });

      if (result.error) {
        setState((prev) => ({
          ...prev,
          isGenerating: false,
          error: result.error?.message || 'Failed to generate message',
        }));
        return;
      }

      if (result.data) {
        setState((prev) => ({
          ...prev,
          step: 'alternatives',
          isGenerating: false,
          alternatives: result.data?.alternatives || [result.data.content],
          selectedAlternativeIndex: 0,
        }));
      }
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        error: error.message || 'An unexpected error occurred',
      }));
    }
  }, [user?.id, state.selectedOccasion, state.selectedTone, state.context, route.params?.contactId]);

  // Save selected message as draft
  const handleSaveAsDraft = useCallback(() => {
    if (!user?.id) return;

    const selectedMessage = state.alternatives[state.selectedAlternativeIndex];
    const contactId = route.params?.contactId;

    if (!contactId || !selectedMessage) {
      Alert.alert('Error', 'Missing information');
      return;
    }

    // Dispatch action to save message
    dispatch(
      createMessageThunk({
        userId: user.id,
        messageData: {
          contactId,
          content: selectedMessage,
          occasion: state.selectedOccasion,
          tone: state.selectedTone,
        },
      })
    )
      .unwrap()
      .then(() => {
        Alert.alert(
          'Success',
          'Message saved as draft',
          [
            {
              text: 'Edit',
              onPress: () => {
                // Navigate to edit screen
              },
            },
            {
              text: 'Done',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      })
      .catch((error) => {
        Alert.alert('Error', error.message || 'Failed to save message');
      });
  }, [user?.id, dispatch, state.alternatives, state.selectedAlternativeIndex, state.selectedOccasion, state.selectedTone, route.params?.contactId, navigation]);

  const handleRegenerate = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: 'occasion',
      alternatives: [],
      selectedAlternativeIndex: 0,
      isGenerating: false,
    }));
  }, []);

  // Render based on current step
  if (state.isGenerating) {
    return (
      <Container>
        <Header>
          <Title>Generating Message</Title>
        </Header>
        <LoadingContainer>
          <ActivityIndicator size="large" color={colors.primary} />
          <LoadingText>Creating personalized alternatives...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  if (state.step === 'alternatives' && state.alternatives.length > 0) {
    return (
      <Container>
        <Header>
          <Title>Choose Your Message</Title>
          <Subtitle>
            Select the message you like, or regenerate for more options
          </Subtitle>
        </Header>

        <Content>
          {state.error && (
            <ErrorContainer>
              <ErrorText>{state.error}</ErrorText>
            </ErrorContainer>
          )}

          {state.alternatives.map((message, index) => (
            <MessageCardTouchable
              key={index}
              isSelected={state.selectedAlternativeIndex === index}
              onPress={() =>
                setState((prev) => ({
                  ...prev,
                  selectedAlternativeIndex: index,
                }))
              }
            >
              <MessageText>{message}</MessageText>
              {state.selectedAlternativeIndex === index && (
                <SelectBadge>
                  <SelectBadgeText>✓ Selected</SelectBadgeText>
                </SelectBadge>
              )}
            </MessageCardTouchable>
          ))}

          <Button
            variant="secondary"
            size="medium"
            fullWidth
            onPress={handleRegenerate}
            style={{ marginTop: spacing[4] }}
          >Regenerate Options</Button>
        </Content>

        <Footer>
          <Button
            variant="outline"
            size="medium"
            fullWidth
            onPress={() => navigation.goBack()}
          >Cancel</Button>
          <Button
            variant="primary"
            size="medium"
            fullWidth
            onPress={handleSaveAsDraft}
          >Save Draft</Button>
        </Footer>
      </Container>
    );
  }

  // Default: Selection screens
  return (
    <Container>
      <Header>
        <Title>Generate Message</Title>
        <Subtitle>Create a personalized message for your contact</Subtitle>
      </Header>

      <Content>
        {state.error && (
          <ErrorContainer>
            <ErrorText>{state.error}</ErrorText>
          </ErrorContainer>
        )}

        {/* Occasion Selection */}
        <StepContainer>
          <StepLabel>What's the occasion?</StepLabel>
          <OccasionGrid>
            {occasions.map((occ) => (
              <OccasionButton
                key={occ}
                isSelected={state.selectedOccasion === occ}
                onPress={() =>
                  setState((prev) => ({
                    ...prev,
                    selectedOccasion: occ,
                  }))
                }
              >
                <OccasionText isSelected={state.selectedOccasion === occ}>
                  {occ.charAt(0).toUpperCase() + occ.slice(1)}
                </OccasionText>
              </OccasionButton>
            ))}
          </OccasionGrid>
        </StepContainer>

        {/* Tone Selection */}
        {state.selectedOccasion && (
          <StepContainer>
            <StepLabel>What tone do you prefer?</StepLabel>
            <ToneContainer>
              {(['casual', 'formal'] as Tone[]).map((tone) => (
                <ToneButton
                  key={tone}
                  isSelected={state.selectedTone === tone}
                  onPress={() =>
                    setState((prev) => ({
                      ...prev,
                      selectedTone: tone,
                    }))
                  }
                >
                  <ToneText isSelected={state.selectedTone === tone}>
                    {tone.charAt(0).toUpperCase() + tone.slice(1)}
                  </ToneText>
                </ToneButton>
              ))}
            </ToneContainer>
          </StepContainer>
        )}

        {/* Optional Context */}
        {state.selectedOccasion && (
          <StepContainer>
            <StepLabel>Add context (optional)</StepLabel>
            <ContextInput
              placeholder="Describe your relationship or what you want to convey..."
              multiline
              value={state.context}
              onChangeText={(text) =>
                setState((prev) => ({
                  ...prev,
                  context: text.slice(0, 500),
                }))
              }
              placeholderTextColor={colors.textSecondary}
            />
            <CharCount>{state.context.length}/500</CharCount>
          </StepContainer>
        )}
      </Content>

      {state.selectedOccasion && (
        <Footer>
          <Button
            variant="outline"
            size="medium"
            fullWidth
            onPress={() => navigation.goBack()}
          >Cancel</Button>
          <Button
            variant="primary"
            size="medium"
            fullWidth
            onPress={handleGenerateMessage}
            disabled={!state.selectedOccasion}
          >Generate</Button>
        </Footer>
      )}
    </Container>
  );
};

export default GenerateMessageScreen;
