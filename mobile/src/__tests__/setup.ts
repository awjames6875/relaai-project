/**
 * Jest Test Setup
 *
 * Configure test environment and mocks.
 */

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock React Native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    dispatch: jest.fn(),
  }),
  useRoute: () => ({
    params: {
      userId: 'user-123',
      email: 'test@example.com',
    },
    name: 'ProfileSetup',
  }),
  useFocusEffect: jest.fn(),
  NavigationContainer: ({ children }: any) => children,
}));

// Mock React Navigation Stack
jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }: any) => children,
    Screen: ({ children }: any) => children,
  }),
}));

// Mock React Navigation Bottom Tabs
jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }: any) => children,
    Screen: ({ children }: any) => children,
  }),
}));

// Mock React Native Gesture Handler
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }: any) => children,
  PanGestureHandler: ({ children }: any) => children,
  TapGestureHandler: ({ children }: any) => children,
  Swipeable: ({ children }: any) => children,
}));

// Mock React Native Reanimated v4.x
jest.mock('react-native-reanimated', () => {
  const actual = jest.requireActual('react-native-reanimated');
  return {
    ...actual,
    useAnimatedStyle: () => ({}),
    useSharedValue: (initialValue: any) => ({
      value: initialValue,
    }),
    useAnimatedReaction: jest.fn(),
    useWorkletCallback: jest.fn((fn) => fn),
    withTiming: (value: any, config?: any) => value,
    withSpring: (value: any, config?: any) => value,
    withDecay: (value: any, config?: any) => value,
    Animated: {
      View: 'View',
      Text: 'Text',
      ScrollView: 'ScrollView',
    },
  };
});

// Silence console warnings in tests
const originalError = console.error;
const originalWarn = console.warn;

global.console = {
  ...console,
  error: jest.fn((...args: any[]) => {
    // Only suppress React Navigation warnings
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Couldn\'t find a route object')
    ) {
      return;
    }
    originalError(...args);
  }),
  warn: jest.fn((...args: any[]) => {
    // Suppress some expected warnings
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Non-serializable values') ||
        args[0].includes('ViewPropTypes will be removed'))
    ) {
      return;
    }
    originalWarn(...args);
  }),
};

