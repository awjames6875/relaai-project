import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Button } from './src/components/atoms/Button';
import { theme } from './src/theme';

export default function App() {
  const handlePress = () => {
    Alert.alert('Success!', 'RelaAI is running on Android Studio! 🎉');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to RelaAI</Text>
      <Text style={styles.subtitle}>AI-Powered Relationship Management</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Test Android Studio"
          onPress={handlePress}
          testID="test-button"
        />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: theme.spacing.lg,
    width: '100%',
  },
});
