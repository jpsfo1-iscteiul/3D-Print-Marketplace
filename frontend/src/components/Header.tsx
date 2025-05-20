
import React from 'react';
import { LogOut, User, Loader2 } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const Header = () => {
  const { userRole, setUserRole, isMetaMaskConnected, connectMetaMask, isAuthenticating } = useUser();

  const handleRoleChange = (value: string) => {
    if (!isMetaMaskConnected) {
      toast({
        title: "MetaMask not connected",
        description: "Please connect your MetaMask wallet to change roles",
        variant: "destructive"
      });
      return;
    }
    
    setUserRole(value as any);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
      <div className="flex items-center">
        <div className="px-4 py-1 bg-primary/10 text-primary rounded-md mr-2 flex items-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
            <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Blockchain</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">Login as:</span>
          <Select 
            value={userRole} 
            onValueChange={handleRoleChange}
            disabled={!isMetaMaskConnected}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Designer">Designer</SelectItem>
              <SelectItem value="Consumer">Consumer</SelectItem>
              <SelectItem value="Factory">Factory</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          variant={isMetaMaskConnected ? "outline" : "default"} 
          size="sm"
          onClick={connectMetaMask}
          disabled={isAuthenticating}
          className="flex items-center gap-2"
        >
          {isAuthenticating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Connecting...</span>
            </>
          ) : isMetaMaskConnected ? (
            <>
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span>Connected</span>
            </>
          ) : (
            <>Connect MetaMask</>
          )}
        </Button>
        
        {/* Only show profile and logout buttons when connected to MetaMask */}
        {isMetaMaskConnected && (
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <User size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <LogOut size={20} />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;