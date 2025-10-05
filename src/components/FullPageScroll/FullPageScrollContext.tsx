import { createContext, useContext, ReactNode } from 'react';

interface FullPageScrollContextType {
  currentSection: number;
  totalSections: number;
  goToSection: (index: number, immediate?: boolean) => void;
  nextSection: () => void;
  previousSection: () => void;
  isAnimating: boolean;
}

const FullPageScrollContext = createContext<FullPageScrollContextType | null>(null);

export const useFullPageScrollContext = () => {
  const context = useContext(FullPageScrollContext);
  if (!context) {
    throw new Error('useFullPageScrollContext must be used within FullPageScrollProvider');
  }
  return context;
};

interface FullPageScrollProviderProps {
  children: ReactNode;
  value: FullPageScrollContextType;
}

export const FullPageScrollProvider = ({ children, value }: FullPageScrollProviderProps) => {
  return (
    <FullPageScrollContext.Provider value={value}>
      {children}
    </FullPageScrollContext.Provider>
  );
};
