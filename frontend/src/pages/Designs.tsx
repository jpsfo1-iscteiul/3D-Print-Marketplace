import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useWeb3 } from '../context/Web3Context';
import { useDesign } from '../hooks/useDesign';

interface Design {
  id: string;
  tokenURI: string;
  creatorName: string;
  description: string;
  price: string;
  owner: string;
  isListed: boolean;
}

const Designs = () => {
  const { t } = useLanguage();
  const { isMetaMaskConnected, connectMetaMask } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { account, designRegistry } = useWeb3();
  const { getDesign } = useDesign();
  const [designs, setDesigns] = useState<Design[]>([]);

  // Function to load user's designs from blockchain
  const loadUserDesigns = async () => {
    if (!isMetaMaskConnected || !account || !designRegistry) {
      console.log('Missing requirements:', {
        isMetaMaskConnected,
        account,
        hasDesignRegistry: !!designRegistry
      });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      console.log('Loading user designs...');
      
      // Get the total supply of tokens
      const totalSupply = await designRegistry.nextTokenId();
      console.log('Total supply:', totalSupply.toString());
      
      const userDesigns = [];
      
      // Check each token ID
      for (let i = 0; i < totalSupply; i++) {
        try {
          const owner = await designRegistry.ownerOf(i);
          if (owner.toLowerCase() === account.toLowerCase()) {
            const design = await getDesign(i.toString());
            if (design) {
              userDesigns.push(design);
            }
          }
        } catch (err) {
          // Skip tokens that don't exist
          continue;
        }
      }
      
      console.log('User designs:', userDesigns);
      setDesigns(userDesigns);
    } catch (err) {
      console.error('Error loading designs:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Load designs when MetaMask connection changes
  useEffect(() => {
    if (isMetaMaskConnected) {
      loadUserDesigns();
    }
  }, [isMetaMaskConnected, account]);

  const handleManage = (design: Design) => {
    if (!isMetaMaskConnected) {
      toast({
        title: t.header.metamaskNotConnected,
        description: t.myDesigns.connectWalletDesc,
        variant: "destructive"
      });
      return;
    }
    
    // TODO: Implement design management logic
    console.log('Managing design:', design);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">{t.myDesigns.loading}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <svg
          className="w-32 h-32 text-red-300 mb-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {t.myDesigns.errorLoading}
        </h3>
        <p className="text-gray-500 mb-6 max-w-md">
          {error}
        </p>
        <Button onClick={loadUserDesigns}>
          {t.myDesigns.tryAgain}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t.myDesigns.title}</h1>
      
      {!isMetaMaskConnected ? (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg mb-6">
          <h2 className="text-lg font-medium text-amber-800 mb-2">{t.myDesigns.connectWallet}</h2>
          <p className="text-amber-700 mb-4">{t.myDesigns.connectWalletDesc}</p>
          <Button onClick={connectMetaMask}>Connect MetaMask</Button>
        </div>
      ) : designs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <svg
            className="w-32 h-32 text-gray-300 mb-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {t.myDesigns.noDesigns}
          </h3>
          <p className="text-gray-500 mb-6 max-w-md">
            {t.myDesigns.noDesignsDesc}
          </p>
          <Button onClick={() => navigate('/submit-design')}>
            {t.myDesigns.submitFirst}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design) => (
            <Card key={design.id} className="shadow-sm">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">{design.creatorName}</h2>
                <p className="text-gray-600 mb-4">{design.description}</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <Badge variant={design.isListed ? "success" : "secondary"}>
                      {design.isListed ? "Listed" : "Not Listed"}
                    </Badge>
                  </div>
                  
                  {design.isListed && (
                  <div className="flex justify-between">
                      <span className="text-gray-600">Price</span>
                      <span className="font-medium">{(Number(design.price) / 1e18).toString()} ETH</span>
                  </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="pt-2 pb-4">
                <Button 
                  className="w-full" 
                  variant="default"
                  onClick={() => handleManage(design)}
                  disabled={!isMetaMaskConnected}
                >
                  {isMetaMaskConnected ? "Manage" : "Connect to Manage"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Designs;