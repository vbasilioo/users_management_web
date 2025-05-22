'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { AbilityProvider } from '../casl/AbilityContext';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AbilityProvider>
        {children}
      </AbilityProvider>
    </Provider>
  );
} 