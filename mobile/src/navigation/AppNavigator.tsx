/**
 * App Navigator
 *
 * Root navigation that switches between Auth and Main navigators based on auth state.
 */
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { loadSession } from '../store/slices/authSlice';
import { RootStackParamList } from '@contracts/component-contracts/navigation-types';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Load existing session on app start
    // Add timeout to prevent infinite loading if auth fails
    const timeoutId = setTimeout(() => {
      console.warn('Auth session loading took too long, proceeding to login');
    }, 5000);

    dispatch(loadSession()).finally(() => clearTimeout(timeoutId));
  }, [dispatch]);

  // Show loading screen while checking session
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

