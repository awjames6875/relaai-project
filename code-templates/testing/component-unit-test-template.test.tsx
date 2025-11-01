/**
 * COMPONENT UNIT TEST TEMPLATE
 *
 * TODO: Update the following:
 * 1. Replace [ComponentName] with your component name
 * 2. Add test cases for all component behaviors
 * 3. Test user interactions (press, input, etc.)
 * 4. Test accessibility
 * 5. Add edge cases and error scenarios
 *
 * Component: [ComponentName]
 * Created: [DATE]
 * Author: [YOUR_NAME]
 *
 * Test Framework: Jest + React Native Testing Library (RNTL)
 * Coverage Target: >80%
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';

// Import the component to test
// TODO: Update import path
import { [ComponentName] } from '@/components/[path]/[ComponentName]';

// Import any dependencies
// TODO: Add necessary imports
// import { someAction } from '@/store/slices/[sliceName]';
// import { [ServiceName] } from '@/services/[serviceName]';

// Import test utilities and factories
import { createMockStore } from '@/test-utils/mockStore';
import { createMock[Entity] } from '@/test-utils/factories/[entityFactory]';

// ==================== TEST SETUP ====================

/**
 * Test data factory
 * Creates realistic test data for the component
 */
const createTestProps = (overrides = {}) => ({
  // TODO: Add default props
  title: 'Test Title',
  onPress: jest.fn(),
  testID: 'test-component',
  ...overrides,
});

/**
 * Mock Redux store
 * Configure with necessary slices for testing
 */
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      // TODO: Add necessary reducers
      // [sliceName]: [sliceReducer],
    },
    preloadedState: {
      // TODO: Add initial state
      // [sliceName]: {
      //   items: [],
      //   loading: false,
      //   error: null,
      //   ...initialState,
      // },
    },
  });
};

/**
 * Render helper with providers
 * Wraps component with necessary providers (Redux, Navigation, etc.)
 */
const renderWithProviders = (
  component: React.ReactElement,
  {
    store = createTestStore(),
    navigationProps = {},
  } = {}
) => {
  return render(
    <Provider store={store}>
      <NavigationContainer {...navigationProps}>
        {component}
      </NavigationContainer>
    </Provider>
  );
};

// Alternative: Simpler render without navigation
const renderWithStore = (
  component: React.ReactElement,
  { store = createTestStore() } = {}
) => {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

// ==================== MOCKS ====================

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(() => jest.fn()), // Returns unsubscribe function
};

// Mock route
const mockRoute = {
  params: {
    // TODO: Add route params
    id: 'test-id-123',
  },
};

// Mock external services/APIs
// jest.mock('@/services/[serviceName]', () => ({
//   [ServiceName]: {
//     [methodName]: jest.fn(),
//   },
// }));

// Mock React Native modules if needed
// jest.mock('react-native/Libraries/Alert/Alert', () => ({
//   alert: jest.fn(),
// }));

// ==================== TEST SUITES ====================

describe('[ComponentName]', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Clean up after tests
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ==================== RENDERING TESTS ====================

  describe('Rendering', () => {
    it('should render successfully', () => {
      // Arrange
      const props = createTestProps();

      // Act
      const { getByTestId } = renderWithStore(
        <[ComponentName] {...props} />
      );

      // Assert
      expect(getByTestId('test-component')).toBeTruthy();
    });

    it('should render with correct text content', () => {
      // Arrange
      const props = createTestProps({ title: 'Custom Title' });

      // Act
      renderWithStore(<[ComponentName] {...props} />);

      // Assert
      expect(screen.getByText('Custom Title')).toBeTruthy();
    });

    it('should render loading state', () => {
      // Arrange
      const props = createTestProps({ loading: true });

      // Act
      renderWithStore(<[ComponentName] {...props} />);

      // Assert
      expect(screen.getByTestId('loading-indicator')).toBeTruthy();
      // Alternative: Check for loading text
      // expect(screen.getByText('Loading...')).toBeTruthy();
    });

    it('should render error state', () => {
      // Arrange
      const errorMessage = 'Something went wrong';
      const props = createTestProps({ error: errorMessage });

      // Act
      renderWithStore(<[ComponentName] {...props} />);

      // Assert
      expect(screen.getByText(errorMessage)).toBeTruthy();
      expect(screen.getByTestId('error-message')).toBeTruthy();
    });

    it('should render empty state when no data', () => {
      // Arrange
      const props = createTestProps({ data: [] });

      // Act
      renderWithStore(<[ComponentName] {...props} />);

      // Assert
      expect(screen.getByText('No items found')).toBeTruthy();
      expect(screen.getByTestId('empty-state')).toBeTruthy();
    });

    it('should not render when hidden', () => {
      // Arrange
      const props = createTestProps({ visible: false });

      // Act
      const { queryByTestId } = renderWithStore(
        <[ComponentName] {...props} />
      );

      // Assert
      expect(queryByTestId('test-component')).toBeNull();
    });
  });

  // ==================== INTERACTION TESTS ====================

  describe('User Interactions', () => {
    it('should call onPress when button is pressed', () => {
      // Arrange
      const onPress = jest.fn();
      const props = createTestProps({ onPress });

      // Act
      renderWithStore(<[ComponentName] {...props} />);
      const button = screen.getByTestId('action-button');
      fireEvent.press(button);

      // Assert
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should call onPress with correct parameters', () => {
      // Arrange
      const onPress = jest.fn();
      const itemId = 'test-item-123';
      const props = createTestProps({ onPress, itemId });

      // Act
      renderWithStore(<[ComponentName] {...props} />);
      fireEvent.press(screen.getByTestId('action-button'));

      // Assert
      expect(onPress).toHaveBeenCalledWith(itemId);
    });

    it('should update text input value', () => {
      // Arrange
      const onChangeText = jest.fn();
      const props = createTestProps({ onChangeText });

      // Act
      renderWithStore(<[ComponentName] {...props} />);
      const input = screen.getByTestId('text-input');
      fireEvent.changeText(input, 'New text value');

      // Assert
      expect(onChangeText).toHaveBeenCalledWith('New text value');
    });

    it('should toggle checkbox state', () => {
      // Arrange
      const onToggle = jest.fn();
      const props = createTestProps({ onToggle, checked: false });

      // Act
      renderWithStore(<[ComponentName] {...props} />);
      const checkbox = screen.getByTestId('checkbox');
      fireEvent.press(checkbox);

      // Assert
      expect(onToggle).toHaveBeenCalledWith(true);
    });

    it('should handle long press', () => {
      // Arrange
      const onLongPress = jest.fn();
      const props = createTestProps({ onLongPress });

      // Act
      renderWithStore(<[ComponentName] {...props} />);
      const element = screen.getByTestId('long-press-element');
      fireEvent(element, 'onLongPress');

      // Assert
      expect(onLongPress).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled', () => {
      // Arrange
      const onPress = jest.fn();
      const props = createTestProps({ onPress, disabled: true });

      // Act
      renderWithStore(<[ComponentName] {...props} />);
      const button = screen.getByTestId('action-button');
      fireEvent.press(button);

      // Assert
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  // ==================== ASYNC BEHAVIOR TESTS ====================

  describe('Async Operations', () => {
    it('should handle async data loading', async () => {
      // Arrange
      const mockData = [
        createMock[Entity]({ id: '1', name: 'Item 1' }),
        createMock[Entity]({ id: '2', name: 'Item 2' }),
      ];
      const fetchData = jest.fn().mockResolvedValue(mockData);
      const props = createTestProps({ fetchData });

      // Act
      renderWithStore(<[ComponentName] {...props} />);

      // Assert - Loading state
      expect(screen.getByTestId('loading-indicator')).toBeTruthy();

      // Assert - Data loaded
      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeTruthy();
        expect(screen.getByText('Item 2')).toBeTruthy();
      });
      expect(screen.queryByTestId('loading-indicator')).toBeNull();
    });

    it('should handle async errors', async () => {
      // Arrange
      const errorMessage = 'Failed to load data';
      const fetchData = jest.fn().mockRejectedValue(new Error(errorMessage));
      const props = createTestProps({ fetchData });

      // Act
      renderWithStore(<[ComponentName] {...props} />);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeTruthy();
      });
    });

    it('should debounce user input', async () => {
      // Arrange
      jest.useFakeTimers();
      const onSearch = jest.fn();
      const props = createTestProps({ onSearch });

      // Act
      renderWithStore(<[ComponentName] {...props} />);
      const input = screen.getByTestId('search-input');

      fireEvent.changeText(input, 'a');
      fireEvent.changeText(input, 'ab');
      fireEvent.changeText(input, 'abc');

      // Fast-forward time
      jest.runAllTimers();

      // Assert - Should only call once with final value
      await waitFor(() => {
        expect(onSearch).toHaveBeenCalledTimes(1);
        expect(onSearch).toHaveBeenCalledWith('abc');
      });

      jest.useRealTimers();
    });
  });

  // ==================== ACCESSIBILITY TESTS ====================

  describe('Accessibility', () => {
    it('should have accessible labels', () => {
      // Arrange
      const props = createTestProps();

      // Act
      renderWithStore(<[ComponentName] {...props} />);

      // Assert
      const button = screen.getByTestId('action-button');
      expect(button.props.accessibilityLabel).toBe('Action button');
      expect(button.props.accessible).toBe(true);
    });

    it('should have correct accessibility role', () => {
      // Arrange
      const props = createTestProps();

      // Act
      renderWithStore(<[ComponentName] {...props} />);

      // Assert
      const button = screen.getByTestId('action-button');
      expect(button.props.accessibilityRole).toBe('button');
    });

    it('should have accessibility hint', () => {
      // Arrange
      const props = createTestProps();

      // Act
      renderWithStore(<[ComponentName] {...props} />);

      // Assert
      const button = screen.getByTestId('action-button');
      expect(button.props.accessibilityHint).toBe('Double tap to perform action');
    });

    it('should indicate disabled state to screen readers', () => {
      // Arrange
      const props = createTestProps({ disabled: true });

      // Act
      renderWithStore(<[ComponentName] {...props} />);

      // Assert
      const button = screen.getByTestId('action-button');
      expect(button.props.accessibilityState?.disabled).toBe(true);
    });

    it('should support accessibility actions', () => {
      // Arrange
      const onDelete = jest.fn();
      const props = createTestProps({ onDelete });

      // Act
      renderWithStore(<[ComponentName] {...props} />);

      // Assert
      const element = screen.getByTestId('list-item');
      expect(element.props.accessibilityActions).toContainEqual(
        expect.objectContaining({ name: 'delete' })
      );
    });
  });

  // ==================== REDUX INTEGRATION TESTS ====================

  describe('Redux Integration', () => {
    it('should dispatch action on button press', () => {
      // Arrange
      const store = createTestStore();
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const props = createTestProps();

      // Act
      renderWithStore(<[ComponentName] {...props} />, { store });
      fireEvent.press(screen.getByTestId('submit-button'));

      // Assert
      expect(dispatchSpy).toHaveBeenCalled();
      // expect(dispatchSpy).toHaveBeenCalledWith(someAction());
    });

    it('should render data from Redux store', () => {
      // Arrange
      const mockData = [
        createMock[Entity]({ id: '1', name: 'Store Item 1' }),
      ];
      const store = createTestStore({
        items: mockData,
      });
      const props = createTestProps();

      // Act
      renderWithStore(<[ComponentName] {...props} />, { store });

      // Assert
      expect(screen.getByText('Store Item 1')).toBeTruthy();
    });
  });

  // ==================== SNAPSHOT TESTS ====================

  describe('Snapshots', () => {
    it('should match snapshot in default state', () => {
      // Arrange
      const props = createTestProps();

      // Act
      const { toJSON } = renderWithStore(<[ComponentName] {...props} />);

      // Assert
      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot in loading state', () => {
      // Arrange
      const props = createTestProps({ loading: true });

      // Act
      const { toJSON } = renderWithStore(<[ComponentName] {...props} />);

      // Assert
      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot in error state', () => {
      // Arrange
      const props = createTestProps({ error: 'Error message' });

      // Act
      const { toJSON } = renderWithStore(<[ComponentName] {...props} />);

      // Assert
      expect(toJSON()).toMatchSnapshot();
    });
  });

  // ==================== EDGE CASES ====================

  describe('Edge Cases', () => {
    it('should handle null data gracefully', () => {
      // Arrange
      const props = createTestProps({ data: null });

      // Act
      const { toJSON } = renderWithStore(<[ComponentName] {...props} />);

      // Assert
      expect(toJSON()).toBeTruthy();
      expect(screen.queryByText('Error')).toBeNull();
    });

    it('should handle undefined props', () => {
      // Arrange
      const props = createTestProps({ optionalProp: undefined });

      // Act
      const { toJSON } = renderWithStore(<[ComponentName] {...props} />);

      // Assert
      expect(toJSON()).toBeTruthy();
    });

    it('should handle very long text', () => {
      // Arrange
      const longText = 'a'.repeat(1000);
      const props = createTestProps({ title: longText });

      // Act
      renderWithStore(<[ComponentName] {...props} />);

      // Assert
      expect(screen.getByText(longText)).toBeTruthy();
    });

    it('should handle empty string values', () => {
      // Arrange
      const props = createTestProps({ title: '' });

      // Act
      renderWithStore(<[ComponentName] {...props} />);

      // Assert
      // Component should still render
      expect(screen.getByTestId('test-component')).toBeTruthy();
    });

    it('should handle rapid successive clicks', () => {
      // Arrange
      const onPress = jest.fn();
      const props = createTestProps({ onPress });

      // Act
      renderWithStore(<[ComponentName] {...props} />);
      const button = screen.getByTestId('action-button');

      // Simulate rapid clicks
      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);

      // Assert - Should debounce or handle all clicks
      // Adjust based on expected behavior
      expect(onPress).toHaveBeenCalledTimes(3);
      // OR if debounced:
      // expect(onPress).toHaveBeenCalledTimes(1);
    });
  });
});

// ==================== NOTES ====================

/**
 * TESTING BEST PRACTICES:
 *
 * 1. AAA Pattern (Arrange-Act-Assert):
 *    - Arrange: Set up test data and mocks
 *    - Act: Execute the code being tested
 *    - Assert: Verify the outcome
 *
 * 2. Test behavior, not implementation
 *    - Focus on what the component does, not how
 *    - Test from user's perspective
 *
 * 3. Use descriptive test names
 *    - Name should describe what's being tested
 *    - Should be readable as documentation
 *
 * 4. One assertion per test (when possible)
 *    - Makes failures easier to diagnose
 *    - Each test should test one thing
 *
 * 5. Test accessibility
 *    - All interactive elements should have labels
 *    - Support screen readers
 *
 * 6. Mock external dependencies
 *    - API calls, navigation, services
 *    - Keep tests isolated and fast
 *
 * 7. Test edge cases
 *    - Null, undefined, empty values
 *    - Error conditions
 *    - Boundary values
 *
 * 8. Coverage targets
 *    - Aim for >80% overall
 *    - 100% for critical components
 *
 * 9. Keep tests maintainable
 *    - Use factories for test data
 *    - Share setup code
 *    - Don't duplicate logic
 *
 * 10. Run tests frequently
 *     - Before committing
 *     - In CI/CD pipeline
 *     - Watch mode during development
 */

/**
 * COMMON TESTING LIBRARY QUERIES:
 *
 * - getByTestId: Find by testID prop (recommended for RN)
 * - getByText: Find by text content
 * - getByRole: Find by accessibility role
 * - queryBy*: Returns null if not found (no error)
 * - findBy*: Async, waits for element
 * - getAllBy*: Returns array of matches
 *
 * FIRE EVENTS:
 *
 * - fireEvent.press: Simulate press/tap
 * - fireEvent.changeText: Update text input
 * - fireEvent(element, 'eventName'): Custom events
 *
 * ASYNC UTILITIES:
 *
 * - waitFor: Wait for assertion to pass
 * - waitForElementToBeRemoved: Wait for element to disappear
 */
