import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: [
    'dist',
    'node_modules',
    'coverage',
    'src/game',
    'src/scenes',
    'src/hooks/useAuction.ts',
    'src/pages/AdminPage.tsx',
    'src/services/gameService.ts',
    'src/services/tokenService.ts',
    'src/store/useGameStore.ts',
    'src/utils/formatters.ts',
    'src/components/MultiplayerLobby.tsx',
    'src/components/Notifications.tsx',
    'src/components/RoomCustomizer.tsx',
    'src/components/ThreeDScene.tsx',
  ] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  }
);

