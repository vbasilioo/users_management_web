'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';import { createMongoAbility } from '@casl/ability';import defineAbilitiesFor from './ability';
import { useAppSelector } from '../redux/hooks';

const AbilityContext = createContext(createMongoAbility());

export function AbilityProvider({ children }: { children: ReactNode }) {
  const { user } = useAppSelector(state => state.auth);
  
  const ability = useMemo(() => {
    return defineAbilitiesFor(user);
  }, [user]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}

export function useAbility() {
  return useContext(AbilityContext);
}

export function Can({   do: action,   on: subject,   children,  fallback = null }: {   do: string,   on: string,   children: ReactNode,  fallback?: ReactNode}) {
  const ability = useAbility();
  
  return ability.can(action, subject) ? <>{children}</> : <>{fallback}</>;
} 