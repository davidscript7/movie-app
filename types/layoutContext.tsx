import React, { createContext, useContext } from 'react';

export interface LayoutContextType {
  isSmallDevice: boolean;
  isLargeScreen: boolean;
  isTablet: boolean;
  isLandscape: boolean;
  columns: number;
  horizontalPadding: number;
  verticalSpacing: number;
}

// Create the context with a default value
export const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

// Create a custom hook to use the layout context
export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);

  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutContext.Provider');
  }

  return context;
};