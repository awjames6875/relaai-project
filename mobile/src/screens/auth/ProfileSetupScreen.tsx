/**
 * Profile Setup Screen - FULL IMPLEMENTATION
 *
 * Complete profile setup screen for US-1.3 Profile Setup
 * Implements all 5 acceptance criteria with full design system compliance
 *
 * Features:
 * - Profile form with full name, phone, timezone fields (AC#1)
 * - Profile picture upload with image picker (AC#2)
 * - Notification preferences toggles (AC#3)
 * - Skip option (AC#4)
 * - Save & validation with <2s completion (AC#5)
 */

import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import styled, { useTheme } from 'styled-components/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

// Components
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';

// Redux
import {
  updateProfile,
  uploadAvatar,
  selectProfileLoading,
  selectProfileError,
  clearError,
} from '../../store/slices/profileSlice';
import type { AppDispatch } from '../../store';

// Types
import { AuthStackParamList } from '@contracts/component-contracts/navigation-types';

// Validation
import {
  validateFullName,
  validatePhone,
  validateTimezone,
  validateAvatarFile,
  hasValidationErrors,
  type ProfileValidationErrors,
} from '../../utils/validation/profileValidation';

// Theme
import { applyShadow } from '../../theme/utils/shadows';
import { useIsTablet } from '../../theme/utils/responsive';

// ============================================================================
// Types
// ============================================================================

type ProfileSetupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ProfileSetup'>;
type ProfileSetupScreenRouteProp = RouteProp<AuthStackParamList, 'ProfileSetup'>;

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  reminderFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
}

interface ImageFile {
  uri: string;
  type: string;
  size: number;
  name?: string;
}

// ============================================================================
// IANA Timezone Data
// ============================================================================

const COMMON_TIMEZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
  { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
  { value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
  { value: 'America/Anchorage', label: 'Alaska' },
  { value: 'Pacific/Honolulu', label: 'Hawaii' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Paris', label: 'Paris' },
  { value: 'Europe/Berlin', label: 'Berlin' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
  { value: 'Asia/Shanghai', label: 'Shanghai' },
  { value: 'Asia/Dubai', label: 'Dubai' },
  { value: 'Australia/Sydney', label: 'Sydney' },
  { value: 'Pacific/Auckland', label: 'Auckland' },
];

// ============================================================================
// Styled Components
// ============================================================================

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.neutral[50]};
`;

const KeyboardView = styled(KeyboardAvoidingView)`
  flex: 1;
`;

const StyledScrollView = styled(ScrollView).attrs({
  contentContainerStyle: {
    flexGrow: 1,
  },
  keyboardShouldPersistTaps: 'handled',
})`
  flex: 1;
`;

const ContentContainer = styled.View<{ isTablet: boolean }>`
  padding: ${({ theme }) => theme.spacing[6]}px;
  max-width: ${({ isTablet }) => (isTablet ? '600px' : '100%')};
  align-self: center;
  width: 100%;
`;

const Header = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing[8]}px;
`;

const Title = styled.Text`
  ${({ theme }) => theme.typography.h1};
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`;

const Subtitle = styled.Text`
  ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.colors.neutral[600]};
`;

const Section = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing[6]}px;
`;

const SectionTitle = styled.Text`
  ${({ theme }) => theme.typography.h3};
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin-bottom: ${({ theme }) => theme.spacing[4]}px;
`;

const AvatarContainer = styled.View`
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]}px;
`;

const AvatarTouchable = styled.TouchableOpacity`
  align-items: center;
`;

const AvatarWrapper = styled.View`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: ${({ theme }) => theme.colors.neutral[200]};
  ${({ theme }) => applyShadow(theme.shadows.md)};
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const AvatarImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const AvatarPlaceholder = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary[100]};
`;

const AvatarPlaceholderText = styled.Text`
  ${({ theme }) => theme.typography.h1};
  color: ${({ theme }) => theme.colors.primary[500]};
`;

const UploadText = styled.Text`
  ${({ theme }) => theme.typography.caption};
  color: ${({ theme }) => theme.colors.primary[500]};
  margin-top: ${({ theme }) => theme.spacing[2]}px;
`;

const PickerContainer = styled.TouchableOpacity<{ hasError: boolean }>`
  height: 50px;
  border-width: 2px;
  border-color: ${({ hasError, theme }) =>
    hasError ? theme.colors.semantic.error.light : theme.colors.neutral[300]};
  border-radius: 12px;
  padding-horizontal: ${({ theme }) => theme.spacing[4]}px;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  margin-bottom: ${({ theme }) => theme.spacing[4]}px;
`;

const PickerLabel = styled.Text<{ hasValue: boolean }>`
  ${({ theme }) => theme.typography.body};
  color: ${({ hasValue, theme }) =>
    hasValue ? theme.colors.neutral[900] : theme.colors.neutral[500]};
`;

const ErrorText = styled.Text`
  ${({ theme }) => theme.typography.caption};
  color: ${({ theme }) => theme.colors.semantic.error.light};
  margin-top: ${({ theme }) => theme.spacing[1]}px;
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`;

const ToggleRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: ${({ theme }) => theme.spacing[3]}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.neutral[200]};
`;

const ToggleLabel = styled.Text`
  ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.colors.neutral[900]};
  flex: 1;
`;

const ToggleButton = styled.TouchableOpacity<{ isActive: boolean }>`
  width: 50px;
  height: 30px;
  border-radius: 15px;
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary[500] : theme.colors.neutral[300]};
  justify-content: center;
  padding-horizontal: 3px;
`;

const ToggleThumb = styled.View<{ isActive: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  ${({ theme }) => applyShadow(theme.shadows.sm)};
  align-self: ${({ isActive }) => (isActive ? 'flex-end' : 'flex-start')};
`;

const FrequencyContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing[4]}px;
`;

const FrequencyOptions = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]}px;
`;

const FrequencyButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  padding-horizontal: ${({ theme }) => theme.spacing[4]}px;
  padding-vertical: ${({ theme }) => theme.spacing[2]}px;
  border-radius: 20px;
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.primary[500] : theme.colors.neutral[200]};
  ${({ theme }) => applyShadow(theme.shadows.sm)};
`;

const FrequencyButtonText = styled.Text<{ isSelected: boolean }>`
  ${({ theme }) => theme.typography.body};
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.neutral[100] : theme.colors.neutral[700]};
`;

const ButtonContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing[6]}px;
  gap: ${({ theme }) => theme.spacing[3]}px;
`;

const SuccessMessage = styled.View`
  background-color: ${({ theme }) => theme.colors.semantic.success.light};
  padding: ${({ theme }) => theme.spacing[4]}px;
  border-radius: 12px;
  margin-bottom: ${({ theme }) => theme.spacing[4]}px;
  ${({ theme }) => applyShadow(theme.shadows.sm)};
`;

const SuccessText = styled.Text`
  ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.colors.neutral[100]};
  text-align: center;
`;

// ============================================================================
// Component
// ============================================================================

export const ProfileSetupScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<ProfileSetupScreenNavigationProp>();
  const route = useRoute<ProfileSetupScreenRouteProp>();
  const dispatch = useDispatch<AppDispatch>();
  const isTablet = useIsTablet();

  // Redux state
  const isLoading = useSelector(selectProfileLoading);
  const profileError = useSelector(selectProfileError);

  // Get user ID from route params or auth state
  const userId = route.params?.userId;
  const userEmail = route.params?.email;

  // Form state
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [showTimezonePicker, setShowTimezonePicker] = useState(false);
  const [avatarFile, setAvatarFile] = useState<ImageFile | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Notification preferences state
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    email: true,
    push: true,
    sms: false,
    reminderFrequency: 'weekly',
  });

  // Validation state
  const [errors, setErrors] = useState<ProfileValidationErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Clear errors when profile error changes
  useEffect(() => {
    if (profileError) {
      Alert.alert('Error', profileError, [
        { text: 'OK', onPress: () => dispatch(clearError()) },
      ]);
    }
  }, [profileError, dispatch]);

  // ============================================================================
  // Handlers
  // ============================================================================

  /**
   * Handle image picker
   * Launches the image library to select a profile picture
   */
  const handleImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 1000,
        maxHeight: 1000,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
          // User cancelled picker
          return;
        }

        if (response.errorCode) {
          Alert.alert('Error', 'Failed to pick image. Please try again.');
          return;
        }

        if (response.assets?.[0]) {
          const asset = response.assets[0];
          const file = {
            uri: asset.uri!,
            type: asset.type!,
            size: asset.fileSize!,
            name: asset.fileName,
          };

          // Validate the selected file
          const validation = validateAvatarFile(file);
          if (!validation.isValid) {
            setErrors({ ...errors, avatarFile: validation.error });
            Alert.alert('Invalid Image', validation.error || 'Please select a valid JPG or PNG image under 5MB.');
          } else {
            setAvatarFile(file);
            setAvatarPreview(asset.uri!);
            setErrors({ ...errors, avatarFile: undefined });
          }
        }
      }
    );
  };

  /**
   * Handle timezone picker
   */
  const handleTimezoneSelect = (value: string) => {
    setTimezone(value);
    setShowTimezonePicker(false);

    // Validate timezone
    const validation = validateTimezone(value);
    if (!validation.isValid) {
      setErrors({ ...errors, timezone: validation.error });
    } else {
      setErrors({ ...errors, timezone: undefined });
    }
  };

  /**
   * Toggle notification preference
   */
  const togglePreference = (key: keyof NotificationPreferences) => {
    if (key === 'reminderFrequency') return; // Handled separately

    setNotificationPrefs({
      ...notificationPrefs,
      [key]: !notificationPrefs[key],
    });
  };

  /**
   * Set reminder frequency
   */
  const setReminderFrequency = (
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  ) => {
    setNotificationPrefs({
      ...notificationPrefs,
      reminderFrequency: frequency,
    });
  };

  /**
   * Validate all form fields
   */
  const validateForm = (): boolean => {
    const newErrors: ProfileValidationErrors = {};

    // Validate full name
    const nameValidation = validateFullName(fullName);
    if (!nameValidation.isValid) {
      newErrors.fullName = nameValidation.error;
    }

    // Validate phone (optional)
    const phoneValidation = validatePhone(phoneNumber);
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.error;
    }

    // Validate timezone
    const timezoneValidation = validateTimezone(timezone);
    if (!timezoneValidation.isValid) {
      newErrors.timezone = timezoneValidation.error;
    }

    // Validate avatar file (optional)
    if (avatarFile) {
      const avatarValidation = validateAvatarFile(avatarFile);
      if (!avatarValidation.isValid) {
        newErrors.avatarFile = avatarValidation.error;
      }
    }

    setErrors(newErrors);
    return !hasValidationErrors(newErrors);
  };

  /**
   * Handle skip action
   * Navigate to next screen without saving profile
   */
  const handleSkip = () => {
    // Check if OnboardingTutorial exists in navigation
    // For now, navigate directly to Main screen
    navigation.navigate('Main' as any);
  };

  /**
   * Handle save action
   * Validate form, upload avatar (if present), update profile, show success, navigate
   */
  const handleSave = async () => {
    // Validate form
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before saving.');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return;
    }

    try {
      // Upload avatar if present
      let avatarUrl: string | undefined;
      if (avatarFile) {
        const uploadResult = await dispatch(
          uploadAvatar({
            userId,
            file: avatarFile,
          })
        ).unwrap();
        avatarUrl = uploadResult;
      }

      // Update profile
      await dispatch(
        updateProfile({
          userId,
          updates: {
            fullName: fullName.trim(),
            phoneNumber: phoneNumber.trim() || undefined,
            timezone,
            profilePictureUrl: avatarUrl,
          },
          notificationPreferences: notificationPrefs,
        })
      ).unwrap();

      // Show success message
      setShowSuccess(true);

      // Navigate after short delay
      setTimeout(() => {
        navigation.navigate('Main' as any);
      }, 1500);
    } catch (error: any) {
      // Error handled by Redux error state and useEffect alert
      console.error('Profile save error:', error);
    }
  };

  /**
   * Get initials from full name for avatar placeholder
   */
  const getInitials = (name: string): string => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <Container testID="profile-setup-screen">
      <KeyboardView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <StyledScrollView>
          <ContentContainer isTablet={isTablet}>
            {/* Header */}
            <Header>
              <Title>Complete Your Profile</Title>
              <Subtitle>
                Help us personalize your experience and connect with your contacts better
              </Subtitle>
            </Header>

            {/* Success Message */}
            {showSuccess && (
              <SuccessMessage>
                <SuccessText>Profile saved successfully!</SuccessText>
              </SuccessMessage>
            )}

            {/* Profile Picture Section */}
            <Section>
              <AvatarContainer>
                <AvatarTouchable
                  onPress={handleImagePicker}
                  accessibilityLabel="Upload profile picture"
                  accessibilityRole="button"
                  testID="upload-avatar-button"
                >
                  <AvatarWrapper>
                    {avatarPreview ? (
                      <AvatarImage source={{ uri: avatarPreview }} />
                    ) : (
                      <AvatarPlaceholder>
                        <AvatarPlaceholderText>
                          {getInitials(fullName)}
                        </AvatarPlaceholderText>
                      </AvatarPlaceholder>
                    )}
                  </AvatarWrapper>
                  <UploadText>
                    {avatarPreview ? 'Change Photo' : 'Add Photo (Optional)'}
                  </UploadText>
                </AvatarTouchable>
                {errors.avatarFile && <ErrorText>{errors.avatarFile}</ErrorText>}
              </AvatarContainer>
            </Section>

            {/* Basic Information Section */}
            <Section>
              <SectionTitle>Basic Information</SectionTitle>

              <Input
                label="Full Name *"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  // Clear error on change
                  if (errors.fullName) {
                    setErrors({ ...errors, fullName: undefined });
                  }
                }}
                placeholder="Enter your full name"
                error={errors.fullName}
                accessibilityLabel="Full name input"
                testID="full-name-input"
                autoCapitalize="words"
                autoComplete="name"
              />

              <Input
                label="Phone Number (Optional)"
                value={phoneNumber}
                onChangeText={(text) => {
                  setPhoneNumber(text);
                  // Clear error on change
                  if (errors.phone) {
                    setErrors({ ...errors, phone: undefined });
                  }
                }}
                placeholder="+1234567890"
                error={errors.phone}
                accessibilityLabel="Phone number input"
                testID="phone-input"
                keyboardType="phone-pad"
                autoComplete="tel"
              />

              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: theme.colors.neutral[900],
                    marginBottom: theme.spacing[2],
                  }}
                >
                  Timezone *
                </Text>
                <PickerContainer
                  onPress={() => setShowTimezonePicker(!showTimezonePicker)}
                  hasError={!!errors.timezone}
                  accessibilityLabel="Timezone picker"
                  accessibilityRole="button"
                  testID="timezone-picker"
                >
                  <PickerLabel hasValue={!!timezone}>
                    {COMMON_TIMEZONES.find((tz) => tz.value === timezone)?.label ||
                      timezone}
                  </PickerLabel>
                </PickerContainer>
                {errors.timezone && <ErrorText>{errors.timezone}</ErrorText>}

                {/* Timezone Picker Options */}
                {showTimezonePicker && (
                  <View
                    style={{
                      backgroundColor: theme.colors.neutral[100],
                      borderRadius: 12,
                      padding: theme.spacing[2],
                      marginBottom: theme.spacing[4],
                      maxHeight: 200,
                    }}
                  >
                    <ScrollView>
                      {COMMON_TIMEZONES.map((tz) => (
                        <TouchableOpacity
                          key={tz.value}
                          onPress={() => handleTimezoneSelect(tz.value)}
                          style={{
                            padding: theme.spacing[3],
                            borderBottomWidth: 1,
                            borderBottomColor: theme.colors.neutral[200],
                          }}
                        >
                          <Text
                            style={{
                              color:
                                timezone === tz.value
                                  ? theme.colors.primary[500]
                                  : theme.colors.neutral[900],
                              fontWeight: timezone === tz.value ? '600' : '400',
                            }}
                          >
                            {tz.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </Section>

            {/* Notification Preferences Section */}
            <Section>
              <SectionTitle>Notification Preferences</SectionTitle>

              <ToggleRow>
                <ToggleLabel>Push Notifications</ToggleLabel>
                <ToggleButton
                  isActive={notificationPrefs.push}
                  onPress={() => togglePreference('push')}
                  accessibilityLabel="Push notifications toggle"
                  accessibilityRole="switch"
                  accessibilityState={{ checked: notificationPrefs.push }}
                  testID="push-notifications-toggle"
                >
                  <ToggleThumb isActive={notificationPrefs.push} />
                </ToggleButton>
              </ToggleRow>

              <ToggleRow>
                <ToggleLabel>Email Notifications</ToggleLabel>
                <ToggleButton
                  isActive={notificationPrefs.email}
                  onPress={() => togglePreference('email')}
                  accessibilityLabel="Email notifications toggle"
                  accessibilityRole="switch"
                  accessibilityState={{ checked: notificationPrefs.email }}
                  testID="email-notifications-toggle"
                >
                  <ToggleThumb isActive={notificationPrefs.email} />
                </ToggleButton>
              </ToggleRow>

              <ToggleRow>
                <ToggleLabel>SMS Notifications</ToggleLabel>
                <ToggleButton
                  isActive={notificationPrefs.sms}
                  onPress={() => togglePreference('sms')}
                  accessibilityLabel="SMS notifications toggle"
                  accessibilityRole="switch"
                  accessibilityState={{ checked: notificationPrefs.sms }}
                  testID="sms-notifications-toggle"
                >
                  <ToggleThumb isActive={notificationPrefs.sms} />
                </ToggleButton>
              </ToggleRow>

              <FrequencyContainer testID="reminder-frequency-picker">
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: theme.colors.neutral[900],
                    marginBottom: theme.spacing[3],
                  }}
                >
                  Reminder Frequency
                </Text>
                <FrequencyOptions>
                  {(['daily', 'weekly', 'biweekly', 'monthly'] as const).map(
                    (freq) => (
                      <FrequencyButton
                        key={freq}
                        isSelected={notificationPrefs.reminderFrequency === freq}
                        onPress={() => setReminderFrequency(freq)}
                        accessibilityLabel={`${freq} reminder frequency`}
                        accessibilityRole="button"
                        testID={`frequency${freq}`}
                      >
                        <FrequencyButtonText
                          isSelected={notificationPrefs.reminderFrequency === freq}
                        >
                          {freq.charAt(0).toUpperCase() + freq.slice(1)}
                        </FrequencyButtonText>
                      </FrequencyButton>
                    )
                  )}
                </FrequencyOptions>
              </FrequencyContainer>
            </Section>

            {/* Action Buttons */}
            <ButtonContainer>
              <Button
                variant="primary"
                size="large"
                onPress={handleSave}
                fullWidth
                isLoading={isLoading}
                disabled={isLoading || showSuccess}
                testID="save-profile-button"
              >
                Save Profile
              </Button>

              <Button
                variant="outline"
                size="large"
                onPress={handleSkip}
                fullWidth
                disabled={isLoading || showSuccess}
                testID="skip-button"
              >
                Skip for now
              </Button>
            </ButtonContainer>
          </ContentContainer>
        </StyledScrollView>
      </KeyboardView>
    </Container>
  );
};

export default ProfileSetupScreen;
