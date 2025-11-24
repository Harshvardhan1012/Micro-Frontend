import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [value, setValue] = useState('default value');
  const context = { value, setValue };
  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
