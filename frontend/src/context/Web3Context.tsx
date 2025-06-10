import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers, BrowserProvider, JsonRpcSigner, Contract } from 'ethers';
import DesignRegistryABI from '../contracts/DesignRegistry.json';
import NFTMarketplaceABI from '../contracts/NFTMarketplace.json';
import { toast } from '@/components/ui/use-toast';

interface Web3ContextType {
  account: string | null;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  designRegistry: Contract | null;
  nftMarketplace: Contract | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isDesigner: boolean;
  setIsDesigner: (value: boolean) => void;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  provider: null,
  signer: null,
  designRegistry: null,
  nftMarketplace: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isDesigner: false,
  setIsDesigner: () => {},
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [designRegistry, setDesignRegistry] = useState<Contract | null>(null);
  const [nftMarketplace, setNFTMarketplace] = useState<Contract | null>(null);
  const [isDesigner, setIsDesigner] = useState(false);

  const EXPECTED_CHAIN_ID = 1337;
  const LOCAL_NETWORK = {
    chainId: `0x${EXPECTED_CHAIN_ID.toString(16)}`,
    chainName: 'Localhost 8545',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['http://127.0.0.1:8545'],
  };

  const checkAndSwitchNetwork = async () => {
    if (!window.ethereum) return false;
    
    try {
      // Check if we're on the right network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (parseInt(chainId, 16) !== EXPECTED_CHAIN_ID) {
        try {
          // Try to switch to the local network
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: LOCAL_NETWORK.chainId }],
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [LOCAL_NETWORK],
              });
            } catch (addError) {
              toast({
                title: "Network Error",
                description: "Failed to add the local network to MetaMask.",
                variant: "destructive"
              });
              return false;
            }
          } else {
            toast({
              title: "Network Error",
              description: "Please switch to the local Hardhat network in MetaMask.",
              variant: "destructive"
            });
            return false;
          }
        }
      }
      return true;
    } catch (error) {
      console.error('Error checking/switching network:', error);
      return false;
    }
  };

  const initializeEthers = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        setProvider(provider);

        // Initialize contracts
        const signer = await provider.getSigner();
        setSigner(signer);

        const designRegistry = new Contract(
          import.meta.env.VITE_DESIGN_REGISTRY_ADDRESS || '',
          DesignRegistryABI.abi,
          signer
        );
        setDesignRegistry(designRegistry);

        const nftMarketplace = new Contract(
          import.meta.env.VITE_NFT_MARKETPLACE_ADDRESS || '',
          NFTMarketplaceABI.abi,
          signer
        );
        setNFTMarketplace(nftMarketplace);
      } catch (error) {
        console.error('Error initializing ethers:', error);
        toast({
          title: "Error",
          description: "Failed to initialize blockchain connection. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // First check and switch to the correct network
        const networkSwitched = await checkAndSwitchNetwork();
        if (!networkSwitched) return;

        // Force MetaMask to show the account selection dialog
        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }]
        });

        // After permission granted, get the selected account
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });

        const selectedAccount = accounts[0];
        setAccount(selectedAccount);
        await initializeEthers();

        toast({
          title: "Connected!",
          description: `Connected with account ${selectedAccount.slice(0, 6)}...${selectedAccount.slice(-4)}`,
        });

        // Listen for account changes
        window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
          if (newAccounts.length === 0) {
            // User disconnected all accounts
            disconnectWallet();
          } else {
            // User switched accounts
            setAccount(newAccounts[0]);
            initializeEthers();
          }
        });

        // Listen for network changes
        window.ethereum.on('chainChanged', (newChainId: string) => {
          if (parseInt(newChainId, 16) !== EXPECTED_CHAIN_ID) {
            toast({
              title: "Wrong Network",
              description: "Please switch back to the local Hardhat network.",
              variant: "destructive"
            });
            disconnectWallet();
          }
        });

      } catch (error) {
        console.error('Error connecting wallet:', error);
        toast({
          title: "Error",
          description: "Failed to connect wallet. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to use this feature.",
        variant: "destructive"
      });
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
    setProvider(null);
    setDesignRegistry(null);
    setNFTMarketplace(null);
    setIsDesigner(false);
    
    toast({
      title: "Disconnected",
      description: "Wallet has been disconnected.",
    });
  };

  useEffect(() => {
    if (window.ethereum) {
      // Handle account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
          initializeEthers();
        }
      });

      // Handle chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

      // Handle disconnect
      window.ethereum.on('disconnect', () => {
        disconnectWallet();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
        window.ethereum.removeListener('disconnect', () => {});
      }
    };
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        signer,
        designRegistry,
        nftMarketplace,
        connectWallet,
        disconnectWallet,
        isDesigner,
        setIsDesigner,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}; 