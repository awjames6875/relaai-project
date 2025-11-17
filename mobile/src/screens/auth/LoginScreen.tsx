/**
 * Login Screen
 *
 * User authentication screen for existing users.
 * Based on US-1.2: User Login from Epic 1.
 */
import React, { useState } from 'react';
import { View, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Button, Input } from '../../components/atoms';
import { useDispatch, useSelector } from 'react-redux';
import { signInUser } from '../../store/slices/authSlice';
import { AppDispatch, RootState } from '../../store';
import type { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@contracts/component-contracts/navigation-types';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
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
`;

const FormContainer = styled.View`
  margin-bottom: 24px;
`;

const ForgotPasswordContainer = styled.View`
  align-items: flex-end;
  margin-bottom: 24px;
`;

const ForgotPasswordText = styled.Text`
  font-size: 14px;
  color: #007AFF;
  font-weight: 500;
`;

const SignupContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 24px;
`;

const SignupText = styled.Text`
  font-size: 14px;
  color: #8E8E93;
`;

const SignupLink = styled.Text`
  font-size: 14px;
  color: #007AFF;
  font-weight: 600;
  margin-left: 4px;
`;

export const LoginScreen = ({ navigation }: Props): React.ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    let isValid = true;

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
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(signInUser({ email, password }));
      if (signInUser.fulfilled.match(result)) {
        // Navigation will be handled by App.tsx based on auth state
      } else {
        Alert.alert('Login Failed', result.payload as string);
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleSignup = () => {
    navigation.navigate('Signup');
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
              <Subtitle>Relationship Manager</Subtitle>
            </LogoContainer>

            <FormContainer>
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
                placeholder="Enter your password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError('');
                }}
                error={passwordError}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                textContentType="password"
              />
            </FormContainer>

            <ForgotPasswordContainer>
              <ForgotPasswordText onPress={handleForgotPassword}>
                Forgot Password?
              </ForgotPasswordText>
            </ForgotPasswordContainer>

            <Button
              variant="primary"
              size="large"
              isLoading={isLoading}
              onPress={handleLogin}
              fullWidth
            >
              Log In
            </Button>

            <SignupContainer>
              <SignupText>Don't have an account?</SignupText>
              <SignupLink onPress={handleSignup}>Sign Up</SignupLink>
            </SignupContainer>
          </Content>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default LoginScreen;

