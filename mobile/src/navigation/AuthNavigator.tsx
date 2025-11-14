/**
 * Authentication Navigator
 *
 * Stack navigator for auth-related screens (Login, Signup, Forgot Password, ProfileSetup).
 */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen, SignupScreen, ProfileSetupScreen } from '../screens/auth';
import { AuthStackParamList } from '@contracts/component-contracts/navigation-types';

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      {/* TODO: Add ForgotPassword screen */}
    </Stack.Navigator>
  );
};

