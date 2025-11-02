/**
 * Styled Components Theme Type Definitions
 *
 * Extends styled-components DefaultTheme with our custom theme
 * Provides TypeScript autocomplete for theme properties
 */

import 'styled-components/native';
import { Theme } from './theme/types';

declare module 'styled-components/native' {
  export interface DefaultTheme extends Theme {}
}
