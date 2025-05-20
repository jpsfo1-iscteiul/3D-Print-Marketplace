
import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'Designer' | 'Consumer' | 'Factory';

interface UserContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isMetaMaskConnected: boolean;
  connectMetaMask: () => Promise<void>;
  isAuthenticating: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Change default role to Consumer instead of Designer
  const [userRole, setUserRole] = useState<UserRole>('Consumer');
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const connectMetaMask = async () => {
    try {
      setIsAuthenticating(true);
      
      // Check if MetaMask is installed
      if (window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts.length > 0) {
          // Mock backend authentication request
          try {
            // This would be a real API call in production
            const response = await new Promise<{success: boolean}>((resolve) => {
              setTimeout(() => {
                resolve({ success: true });
              }, 1500); // Simulate network request
            });
            
            if (response.success) {
              setIsMetaMaskConnected(true);
              console.log('Connected to MetaMask and authenticated:', accounts[0]);
            }
          } catch (error) {
            console.error('Backend authentication failed:', error);
            alert('Backend authentication failed. Please try again.');
          }
        }
      } else {
        console.log('Please install MetaMask!');
        alert('Please install MetaMask to use this feature');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <UserContext.Provider value={{ 
      userRole, 
      setUserRole, 
      isMetaMaskConnected, 
      connectMetaMask,
      isAuthenticating 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
