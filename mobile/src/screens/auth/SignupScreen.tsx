/**
 * Signup Screen
 *
 * User registration screen for new users.
 * Based on US-1.1: User Registration from Epic 1.
 */
import React, { useState } from 'react';
import { View, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Button, Input } from '../../components/atoms';
import { useDispatch, useSelector } from 'react-redux';
import { signUpUser } from '../../store/slices/authSlice';
import { AppDispatch, RootState } from '../../store';
import type { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@contracts/component-contracts/navigation-types';

type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

interface Props {
  navigation: SignupScreenNavigationProp;
}

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #f2f2f7;
`;

const Content = styled.View`
  flex: 1;
  padding: 24px;
  justify-content: center;
`;

const LogoContainer = styled.View`
  align-items: center;
  margin-bottom: 48px;
`;

const LogoText = styled.Text`
  font-size: 36px;
  font-weight: bold;
  color: #007AFF;
`;

const Subtitle = styled.Text`
  font-size: 18px;
  color: #8E8E93;
  margin-top: 8px;
  text-align: center;
`;

const FormContainer = styled.View`
  margin-bottom: 24px;
`;

const PasswordRequirements = styled.View`
  margin-top: 8px;
  margin-bottom: 16px;
`;

const RequirementText = styled.Text`
  font-size: 12px;
  color: #8E8E93;
`;

const LoginContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 24px;
`;

const LoginText = styled.Text`
  font-size: 14px;
  color: #8E8E93;
`;

const LoginLink = styled.Text`
  font-size: 14px;
  color: #007AFF;
  font-weight: 600;
  margin-left: 4px;
`;

export const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    // Password requirements: 8+ chars, 1 uppercase, 1 number
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasMinLength && hasUppercase && hasNumber;
  };

  const validateForm = (): boolean => {
    let isValid = true;

    if (!fullName || fullName.length < 2) {
      setFullNameError('Full name must be at least 2 characters');
      isValid = false;
    } else {
      setFullNameError('');
    }

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (!validatePassword(password)) {
      setPasswordError('Password must be 8+ chars with 1 uppercase & 1 number');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    return isValid;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(
        signUpUser({
          email,
          password,
          fullName,
        })
      );

      if (signUpUser.fulfilled.match(result)) {
        // Navigate to ProfileSetupScreen after successful registration
        // Pass user email for context (optional)
        navigation.navigate('ProfileSetup', {
          email: email,
        });
      } else {
        const errorMessage = result.payload as string;
        Alert.alert('Signup Failed', errorMessage);
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <Content>
            <LogoContainer>
              <LogoText>RelaAI</LogoText>
              <Subtitle>Create your account</Subtitle>
            </LogoContainer>

            <FormContainer>
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  setFullNameError('');
                }}
                error={fullNameError}
                autoCapitalize="words"
                textContentType="name"
              />

              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError('');
                }}
                error={emailError}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
              />

              <Input
                label="Password"
                placeholder="Create a password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError('');
                }}
                error={passwordError}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
                textContentType="newPassword"
              />

              <PasswordRequirements>
                <RequirementText>• 8+ characters</RequirementText>
                <RequirementText>• At least 1 uppercase letter</RequirementText>
                <RequirementText>• At least 1 number</RequirementText>
              </PasswordRequirements>

              <Input
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setConfirmPasswordError('');
                }}
                error={confirmPasswordError}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
                textContentType="newPassword"
              />
            </FormContainer>

            <Button
              variant="primary"
              size="large"
              isLoading={isLoading}
              onPress={handleSignup}
              fullWidth
            >
              Create Account
            </Button>

            <LoginContainer>
              <LoginText>Already have an account?</LoginText>
              <LoginLink onPress={handleLogin}>Log In</LoginLink>
            </LoginContainer>
          </Content>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default SignupScreen;

