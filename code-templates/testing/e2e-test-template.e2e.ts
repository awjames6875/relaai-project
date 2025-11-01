/**
 * END-TO-END (E2E) TEST TEMPLATE
 *
 * TODO: Update the following:
 * 1. Replace [FeatureName] with the feature being tested
 * 2. Define complete user journeys
 * 3. Add device-specific interactions
 * 4. Test navigation flows
 * 5. Verify visual elements and animations
 *
 * Feature: [FeatureName]
 * Created: [DATE]
 * Author: [YOUR_NAME]
 *
 * Test Framework: Detox
 * Purpose: Test complete user workflows on real devices/simulators
 */

import { device, element, by, expect as detoxExpect, waitFor } from 'detox';

// ==================== TEST CONFIGURATION ====================

/**
 * Test configuration and setup
 */
const TEST_CONFIG = {
  // Timeout for async operations
  timeout: 10000,

  // Delay between actions (ms)
  actionDelay: 500,

  // Test user credentials
  testUser: {
    email: 'test@example.com',
    password: 'TestPassword123!',
  },
};

/**
 * Helper: Wait for element to be visible
 */
const waitForElement = async (elementMatcher: any, timeout = TEST_CONFIG.timeout) => {
  await waitFor(element(elementMatcher))
    .toBeVisible()
    .withTimeout(timeout);
};

/**
 * Helper: Tap element and wait
 */
const tapAndWait = async (elementMatcher: any, delay = TEST_CONFIG.actionDelay) => {
  await element(elementMatcher).tap();
  await new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Helper: Type text and wait
 */
const typeAndWait = async (elementMatcher: any, text: string, delay = TEST_CONFIG.actionDelay) => {
  await element(elementMatcher).typeText(text);
  await new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Helper: Scroll to element
 */
const scrollToElement = async (
  scrollViewMatcher: any,
  elementMatcher: any,
  direction: 'up' | 'down' = 'down'
) => {
  await waitFor(element(elementMatcher))
    .toBeVisible()
    .whileElement(scrollViewMatcher)
    .scroll(500, direction);
};

// ==================== GLOBAL SETUP ====================

beforeAll(async () => {
  // Launch the app before running tests
  await device.launchApp({
    // Start with clean state
    newInstance: true,

    // Permissions (if needed)
    // permissions: { notifications: 'YES', camera: 'YES' },

    // Launch arguments
    // launchArgs: { detoxPrintBusyIdleResources: 'YES' },
  });
});

beforeEach(async () => {
  // Reload app before each test for isolation
  await device.reloadReactNative();

  // Alternative: Just reset to initial screen
  // await device.launchApp({ newInstance: false });
});

afterAll(async () => {
  // Clean up after all tests
  // Could also keep app open for debugging: comment this out
  // await device.terminateApp();
});

// ==================== E2E TEST SUITES ====================

describe('[FeatureName] E2E Tests', () => {

  // ==================== AUTHENTICATION FLOW ====================

  describe('Authentication', () => {
    it('should allow user to log in successfully', async () => {
      // Arrange - Wait for login screen
      await waitForElement(by.id('login-screen'));

      // Act - Enter credentials
      await typeAndWait(
        by.id('email-input'),
        TEST_CONFIG.testUser.email
      );

      await typeAndWait(
        by.id('password-input'),
        TEST_CONFIG.testUser.password
      );

      // Act - Submit login
      await tapAndWait(by.id('login-button'));

      // Assert - Should navigate to home screen
      await waitForElement(by.id('home-screen'));

      // Verify welcome message or user info
      await detoxExpect(element(by.text('Welcome'))).toBeVisible();
    });

    it('should show error for invalid credentials', async () => {
      // Arrange
      await waitForElement(by.id('login-screen'));

      // Act - Enter invalid credentials
      await typeAndWait(by.id('email-input'), 'invalid@example.com');
      await typeAndWait(by.id('password-input'), 'wrongpassword');
      await tapAndWait(by.id('login-button'));

      // Assert - Should show error message
      await waitForElement(by.id('error-message'));
      await detoxExpect(element(by.text('Invalid credentials'))).toBeVisible();
    });

    it('should navigate to signup from login screen', async () => {
      // Arrange
      await waitForElement(by.id('login-screen'));

      // Act - Tap signup link
      await tapAndWait(by.id('signup-link'));

      // Assert - Should show signup screen
      await waitForElement(by.id('signup-screen'));
      await detoxExpect(element(by.text('Create Account'))).toBeVisible();
    });

    it('should log out successfully', async () => {
      // Arrange - First login
      await waitForElement(by.id('login-screen'));
      await typeAndWait(by.id('email-input'), TEST_CONFIG.testUser.email);
      await typeAndWait(by.id('password-input'), TEST_CONFIG.testUser.password);
      await tapAndWait(by.id('login-button'));
      await waitForElement(by.id('home-screen'));

      // Act - Navigate to settings and logout
      await tapAndWait(by.id('settings-tab'));
      await waitForElement(by.id('settings-screen'));
      await tapAndWait(by.id('logout-button'));

      // Handle confirmation dialog if exists
      // await tapAndWait(by.text('Confirm'));

      // Assert - Should return to login screen
      await waitForElement(by.id('login-screen'));
    });
  });

  // ==================== NAVIGATION FLOW ====================

  describe('Navigation', () => {
    beforeEach(async () => {
      // Login before navigation tests
      await waitForElement(by.id('login-screen'));
      await element(by.id('email-input')).typeText(TEST_CONFIG.testUser.email);
      await element(by.id('password-input')).typeText(TEST_CONFIG.testUser.password);
      await element(by.id('login-button')).tap();
      await waitForElement(by.id('home-screen'));
    });

    it('should navigate between tabs', async () => {
      // Act & Assert - Navigate to each tab
      await tapAndWait(by.id('contacts-tab'));
      await waitForElement(by.id('contacts-screen'));

      await tapAndWait(by.id('messages-tab'));
      await waitForElement(by.id('messages-screen'));

      await tapAndWait(by.id('settings-tab'));
      await waitForElement(by.id('settings-screen'));

      await tapAndWait(by.id('home-tab'));
      await waitForElement(by.id('home-screen'));
    });

    it('should navigate to detail screen and back', async () => {
      // Arrange - Go to list screen
      await tapAndWait(by.id('contacts-tab'));
      await waitForElement(by.id('contacts-screen'));

      // Act - Tap first item in list
      await tapAndWait(by.id('contact-item-0'));

      // Assert - Should show detail screen
      await waitForElement(by.id('contact-detail-screen'));

      // Act - Navigate back
      await tapAndWait(by.id('back-button'));

      // Assert - Should return to list
      await waitForElement(by.id('contacts-screen'));
    });

    it('should open and close modal', async () => {
      // Act - Open modal
      await tapAndWait(by.id('add-button'));

      // Assert - Modal visible
      await waitForElement(by.id('create-modal'));
      await detoxExpect(element(by.id('modal-overlay'))).toBeVisible();

      // Act - Close modal
      await tapAndWait(by.id('close-modal-button'));

      // Assert - Modal dismissed
      await detoxExpect(element(by.id('create-modal'))).not.toBeVisible();
    });
  });

  // ==================== CRUD OPERATIONS ====================

  describe('CRUD Operations', () => {
    beforeEach(async () => {
      // Login and navigate to feature screen
      await waitForElement(by.id('login-screen'));
      await element(by.id('email-input')).typeText(TEST_CONFIG.testUser.email);
      await element(by.id('password-input')).typeText(TEST_CONFIG.testUser.password);
      await element(by.id('login-button')).tap();
      await waitForElement(by.id('home-screen'));
      await element(by.id('contacts-tab')).tap();
      await waitForElement(by.id('contacts-screen'));
    });

    it('should create new item', async () => {
      // Act - Open create form
      await tapAndWait(by.id('add-contact-button'));
      await waitForElement(by.id('create-contact-form'));

      // Fill form
      await typeAndWait(by.id('name-input'), 'John Doe');
      await typeAndWait(by.id('email-input'), 'john@example.com');
      await typeAndWait(by.id('phone-input'), '+12025551234');

      // Submit
      await tapAndWait(by.id('save-button'));

      // Assert - Should show in list
      await waitForElement(by.id('contacts-screen'));
      await detoxExpect(element(by.text('John Doe'))).toBeVisible();
    });

    it('should update existing item', async () => {
      // Arrange - Assume item exists, tap to open
      await tapAndWait(by.id('contact-item-0'));
      await waitForElement(by.id('contact-detail-screen'));

      // Act - Edit item
      await tapAndWait(by.id('edit-button'));
      await waitForElement(by.id('edit-contact-form'));

      // Update field
      await element(by.id('name-input')).clearText();
      await typeAndWait(by.id('name-input'), 'Jane Doe Updated');

      // Save
      await tapAndWait(by.id('save-button'));

      // Assert - Updated name visible
      await waitForElement(by.id('contact-detail-screen'));
      await detoxExpect(element(by.text('Jane Doe Updated'))).toBeVisible();
    });

    it('should delete item', async () => {
      // Arrange - Open item
      await tapAndWait(by.id('contact-item-0'));
      await waitForElement(by.id('contact-detail-screen'));

      // Act - Delete
      await tapAndWait(by.id('delete-button'));

      // Confirm deletion (if confirmation dialog exists)
      await tapAndWait(by.text('Delete'));

      // Assert - Should return to list without item
      await waitForElement(by.id('contacts-screen'));
      await detoxExpect(element(by.id('contact-item-0'))).not.toBeVisible();
    });
  });

  // ==================== SCROLLING & LISTS ====================

  describe('Scrolling and Lists', () => {
    beforeEach(async () => {
      // Login and navigate
      await waitForElement(by.id('login-screen'));
      await element(by.id('email-input')).typeText(TEST_CONFIG.testUser.email);
      await element(by.id('password-input')).typeText(TEST_CONFIG.testUser.password);
      await element(by.id('login-button')).tap();
      await waitForElement(by.id('home-screen'));
      await element(by.id('contacts-tab')).tap();
    });

    it('should scroll through list', async () => {
      // Act - Scroll down
      await element(by.id('contacts-list')).scrollTo('bottom');

      // Assert - Last item visible
      // await detoxExpect(element(by.id('contact-item-last'))).toBeVisible();

      // Act - Scroll back up
      await element(by.id('contacts-list')).scrollTo('top');

      // Assert - First item visible
      await detoxExpect(element(by.id('contact-item-0'))).toBeVisible();
    });

    it('should load more items on scroll (infinite scroll)', async () => {
      // Arrange - Get initial item count
      // const initialCount = await element(by.id('contacts-list')).getAttributes();

      // Act - Scroll to bottom to trigger load
      await element(by.id('contacts-list')).scrollTo('bottom');

      // Wait for loading
      await waitFor(element(by.id('loading-more-indicator')))
        .not.toBeVisible()
        .withTimeout(5000);

      // Assert - More items loaded
      // Verify new items appear
      // const newCount = await element(by.id('contacts-list')).getAttributes();
      // expect(newCount).toBeGreaterThan(initialCount);
    });

    it('should pull to refresh', async () => {
      // Act - Swipe down to refresh
      await element(by.id('contacts-list')).swipe('down', 'slow', 0.8);

      // Assert - Loading indicator appears
      await waitForElement(by.id('refresh-indicator'));

      // Wait for refresh to complete
      await waitFor(element(by.id('refresh-indicator')))
        .not.toBeVisible()
        .withTimeout(5000);
    });

    it('should search/filter list', async () => {
      // Act - Type in search box
      await typeAndWait(by.id('search-input'), 'John');

      // Assert - Filtered results
      await detoxExpect(element(by.text('John Doe'))).toBeVisible();

      // Assert - Non-matching items hidden
      // await detoxExpect(element(by.text('Jane Smith'))).not.toBeVisible();
    });
  });

  // ==================== FORMS & INPUT ====================

  describe('Forms and Input', () => {
    it('should validate form fields', async () => {
      // Arrange
      await waitForElement(by.id('login-screen'));

      // Act - Submit without filling
      await tapAndWait(by.id('login-button'));

      // Assert - Validation errors shown
      await detoxExpect(element(by.text('Email is required'))).toBeVisible();
      await detoxExpect(element(by.text('Password is required'))).toBeVisible();
    });

    it('should show password on toggle', async () => {
      // Arrange
      await waitForElement(by.id('login-screen'));
      await typeAndWait(by.id('password-input'), 'SecretPassword');

      // Act - Toggle password visibility
      await tapAndWait(by.id('toggle-password-visibility'));

      // Assert - Password visible (check for text input instead of secure)
      // This depends on your implementation
      // const attrs = await element(by.id('password-input')).getAttributes();
      // expect(attrs.secureTextEntry).toBe(false);
    });

    it('should handle date picker', async () => {
      // Arrange - Navigate to form with date picker
      // await navigateToDateForm();

      // Act - Open date picker
      await tapAndWait(by.id('date-picker-button'));
      await waitForElement(by.id('date-picker-modal'));

      // Select date (platform-specific)
      if (device.getPlatform() === 'ios') {
        // iOS date picker
        await element(by.type('UIDatePicker')).setDatePickerDate('2025-12-31', 'yyyy-MM-dd');
      } else {
        // Android date picker
        // await element(by.type('DatePicker')).setDate(2025, 12, 31);
      }

      // Confirm
      await tapAndWait(by.text('Done'));

      // Assert - Date displayed
      await detoxExpect(element(by.text('12/31/2025'))).toBeVisible();
    });
  });

  // ==================== GESTURES & INTERACTIONS ====================

  describe('Gestures', () => {
    it('should handle swipe gestures', async () => {
      // Arrange
      await element(by.id('contacts-tab')).tap();
      await waitForElement(by.id('contact-item-0'));

      // Act - Swipe left to reveal actions
      await element(by.id('contact-item-0')).swipe('left', 'fast');

      // Assert - Actions visible
      await waitForElement(by.id('delete-action'));
      await detoxExpect(element(by.id('delete-action'))).toBeVisible();
    });

    it('should handle long press', async () => {
      // Arrange
      await waitForElement(by.id('contact-item-0'));

      // Act - Long press
      await element(by.id('contact-item-0')).longPress();

      // Assert - Context menu appears
      await waitForElement(by.id('context-menu'));
      await detoxExpect(element(by.text('Edit'))).toBeVisible();
      await detoxExpect(element(by.text('Delete'))).toBeVisible();
    });

    it('should handle pinch to zoom (if applicable)', async () => {
      // This is advanced and depends on your component
      // await element(by.id('zoomable-image')).pinchWithAngle('outward', 'slow', 0);
    });
  });

  // ==================== EDGE CASES ====================

  describe('Edge Cases', () => {
    it('should handle no internet connection', async () => {
      // Arrange - Disable network
      await device.disableSynchronization();
      // TODO: Mock network failure in your app

      // Act - Try to load data
      await element(by.id('refresh-button')).tap();

      // Assert - Error message shown
      await waitForElement(by.text('No internet connection'));

      // Cleanup
      await device.enableSynchronization();
    });

    it('should handle app backgrounding and foregrounding', async () => {
      // Arrange
      await waitForElement(by.id('home-screen'));

      // Act - Send app to background
      await device.sendToHome();
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Reopen app
      await device.launchApp({ newInstance: false });

      // Assert - App state preserved
      await waitForElement(by.id('home-screen'));
    });

    it('should handle device rotation', async () => {
      // Act - Rotate to landscape
      await device.setOrientation('landscape');

      // Assert - Layout adapts
      await waitForElement(by.id('home-screen'));
      // Verify landscape-specific elements

      // Act - Rotate back to portrait
      await device.setOrientation('portrait');

      // Assert - Layout adapts
      await waitForElement(by.id('home-screen'));
    });

    it('should handle deep linking', async () => {
      // Act - Open deep link
      await device.openURL({ url: 'myapp://contact/123' });

      // Assert - Navigates to correct screen
      await waitForElement(by.id('contact-detail-screen'));
      // await detoxExpect(element(by.id('contact-id-123'))).toBeVisible();
    });
  });

  // ==================== PERFORMANCE ====================

  describe('Performance', () => {
    it('should render large list without lag', async () => {
      // This is subjective but you can check rendering time
      const startTime = Date.now();

      await waitForElement(by.id('contacts-list'));

      const renderTime = Date.now() - startTime;

      // Assert - Renders in reasonable time
      expect(renderTime).toBeLessThan(2000); // 2 seconds
    });

    it('should scroll smoothly', async () => {
      // Act - Rapid scroll
      await element(by.id('contacts-list')).scroll(1000, 'down', NaN, 0.8);

      // This is hard to test programmatically
      // Mainly a manual/visual test, but you can check no crashes
      await detoxExpect(element(by.id('contacts-list'))).toBeVisible();
    });
  });
});

// ==================== NOTES ====================

/**
 * DETOX E2E TESTING BEST PRACTICES:
 *
 * 1. Use testID for element selection
 *    - More reliable than text or type
 *    - Add testID prop to all interactive elements
 *
 * 2. Test user journeys, not implementation
 *    - Focus on complete workflows
 *    - Test from user's perspective
 *
 * 3. Handle async properly
 *    - Use waitFor for element visibility
 *    - Don't use hard-coded delays
 *    - Let Detox synchronize with React Native
 *
 * 4. Keep tests isolated
 *    - Each test should be independent
 *    - Use beforeEach to reset state
 *    - Don't rely on test execution order
 *
 * 5. Test on multiple devices
 *    - Different screen sizes
 *    - iOS and Android
 *    - Different OS versions
 *
 * 6. Handle platform differences
 *    - Use device.getPlatform()
 *    - Platform-specific UI elements
 *    - Different gestures/interactions
 *
 * 7. Test offline scenarios
 *    - Network failures
 *    - App backgrounding
 *    - Deep linking
 *
 * 8. Be patient with timeouts
 *    - Network requests take time
 *    - Animations need to complete
 *    - Use appropriate timeout values
 *
 * 9. Debug failing tests
 *    - Take screenshots on failure
 *    - Check Detox artifacts
 *    - Use device.launchApp({ launchArgs: { detoxPrintBusyIdleResources: 'YES' }})
 *
 * 10. Run on CI/CD
 *     - Automate E2E tests
 *     - Test before releases
 *     - Record test videos
 */

/**
 * COMMON DETOX MATCHERS:
 *
 * Element selection:
 *   by.id('testID')
 *   by.text('text')
 *   by.label('accessibilityLabel')
 *   by.type('ComponentType')
 *
 * Assertions:
 *   .toBeVisible()
 *   .toExist()
 *   .toHaveText('text')
 *   .toHaveValue('value')
 *   .not.toBeVisible()
 *
 * Actions:
 *   .tap()
 *   .longPress()
 *   .multiTap(times)
 *   .typeText('text')
 *   .replaceText('text')
 *   .clearText()
 *   .scroll(pixels, direction)
 *   .scrollTo(edge)
 *   .swipe(direction, speed, percentage)
 *
 * Device:
 *   device.launchApp()
 *   device.reloadReactNative()
 *   device.sendToHome()
 *   device.terminateApp()
 *   device.setOrientation('portrait' | 'landscape')
 *   device.openURL({ url })
 */
