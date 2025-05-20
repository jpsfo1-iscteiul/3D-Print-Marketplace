
import React from 'react';
import { useUser } from '../context/UserContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

// Mock data for designs
const designs = [
  {
    id: 1,
    title: 'Design A',
    status: 'Active',
    sales: 45,
    licenses: 120
  },
  {
    id: 2,
    title: 'Design B',
    status: 'In Review',
    sales: 0,
    licenses: 0
  }
];

const Designs = () => {
  const { isMetaMaskConnected, connectMetaMask } = useUser();

  const handleManage = () => {
    if (!isMetaMaskConnected) {
      toast({
        title: "MetaMask not connected",
        description: "Please connect your wallet to manage designs",
        variant: "destructive"
      });
      return;
    }
    
    // Handle manage design
    console.log('Managing design');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Designs</h1>
      
      {!isMetaMaskConnected ? (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg mb-6">
          <h2 className="text-lg font-medium text-amber-800 mb-2">Connect MetaMask to Access All Features</h2>
          <p className="text-amber-700 mb-4">You need to connect your MetaMask wallet to fully access the platform.</p>
          <Button onClick={connectMetaMask}>Connect MetaMask</Button>
        </div>
      ) : null}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {designs.map((design) => (
          <Card key={design.id} className="shadow-sm">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold text-center mb-4">{design.title}</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant={design.status === 'Active' ? "success" : "secondary"}>
                    {design.status}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Sales:</span>
                  <span className="font-medium">{design.sales}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Licenses:</span>
                  <span className="font-medium">{design.licenses}</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-2 pb-4">
              <Button 
                className="w-full" 
                variant="default"
                onClick={handleManage}
                disabled={!isMetaMaskConnected}
              >
                {isMetaMaskConnected ? 'Manage' : 'Connect to Manage'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Designs;