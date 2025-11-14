# RelaAI Mobile App Setup Instructions

## Quick Start

The RelaAI React Native mobile app has been scaffolded and is ready for you to install dependencies and run.

### Prerequisites

- Node.js 20+ installed ✅ (you have v22.17.0)
- React Native development environment setup
- Supabase project created ✅

### Installation Steps

1. **Navigate to mobile directory:**
   ```bash
   cd mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```
   
   **Note:** We use `--legacy-peer-deps` to handle React/React Native version compatibility. This is safe and standard for React Native projects.

3. **Install iOS pods (macOS only):**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Start Metro bundler:**
   ```bash
   npm start
   ```

5. **Run on iOS:**
   ```bash
   npm run ios
   ```

6. **Run on Android:**
   ```bash
   npm run android
   ```

## What's Been Set Up

### ✅ Project Structure
- `package.json` - All dependencies configured
- `tsconfig.json` - TypeScript configuration
- `metro.config.js` - Metro bundler config
- `babel.config.js` - Babel with module resolver
- `jest.config.js` - Jest test configuration
- `.eslintrc.js` - ESLint rules
- `.prettierrc` - Prettier formatting
- `.gitignore` - Git ignore rules

### ✅ Core Services
- Supabase client (`src/services/supabase.ts`)
- Auth service (`src/services/auth.ts`)

### ✅ Redux Store
- Store configuration (`src/store/index.ts`)
- Auth slice with signup/login/logout (`src/store/slices/authSlice.ts`)

### ✅ Navigation
- Root navigator (`src/navigation/AppNavigator.tsx`)
- Auth navigator (`src/navigation/AuthNavigator.tsx`)

### ✅ Auth Screens (Epic 1)
- Login screen (`src/screens/auth/LoginScreen.tsx`)
- Signup screen (`src/screens/auth/SignupScreen.tsx`)

### ✅ Design System
- Theme system (`src/theme/`)
- Colors, shadows, spacing, typography
- Responsive utilities

### ✅ Reusable Components
- Button component (`src/components/atoms/Button.tsx`)
- Input component (`src/components/atoms/Input.tsx`)

### ✅ App Entry Point
- `App.tsx` - Main component with providers
- `index.js` - React Native entry point
- `app.json` - App configuration

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Available Scripts

- `npm start` - Start Metro bundler
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run typecheck` - Type check without building
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting errors
- `npm run format` - Format code with Prettier

## Next Steps

After installing dependencies and running the app:

1. **Test authentication flow** - Try signup/login
2. **Build main screens** - Home, Contacts, Messages, etc.
3. **Implement AI message generation** - Connect Claude API
4. **Add relationship health tracking**
5. **Build contact management**

## Troubleshooting

### "Cannot find module" errors
Make sure you've run `npm install` in the mobile directory.

### Metro bundler issues
Clear cache and restart:
```bash
npm start -- --reset-cache
```

### iOS build issues
Reinstall pods:
```bash
cd ios && pod install && cd ..
```

### Android build issues
Clean gradle:
```bash
cd android && ./gradlew clean && cd ..
```

## Support

See:
- `README.md` - Project overview
- `CLAUDE.md` - Architecture and development guidelines
- `docs/PRD.md` - Product requirements
- `docs/design-system.md` - Design system documentation

