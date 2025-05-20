
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Upload, PieChart, Lock, Laptop, ListChecks, FileCheck } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Sidebar = () => {
  const { userRole, isMetaMaskConnected } = useUser();
  const location = useLocation();

  // Define menu items for each role
  const designerItems = [
    { 
      path: '/designs', 
      icon: FileText, 
      label: 'My Designs',
      enabled: true
    },
    { 
      path: '/submit-design', 
      icon: Upload, 
      label: 'Submit Design',
      enabled: true
    },
    { 
      path: '/reports', 
      icon: PieChart, 
      label: 'Sales Reports',
      enabled: true
    }
  ];

  const consumerItems = [
    { 
      path: '/explore-designs', 
      icon: Laptop, 
      label: 'Explore Designs',
      enabled: false,
      comingSoon: true
    },
    { 
      path: '/orders', 
      icon: ListChecks, 
      label: 'My Orders',
      enabled: false,
      comingSoon: true
    }
  ];

  const factoryItems = [
    { 
      path: '/printers', 
      icon: Laptop, 
      label: 'My Printers',
      enabled: false,
      comingSoon: true
    },
    { 
      path: '/production', 
      icon: ListChecks, 
      label: 'Production Queue',
      enabled: false,
      comingSoon: true
    },
    { 
      path: '/validate', 
      icon: FileCheck, 
      label: 'Validate Licenses',
      enabled: false,
      comingSoon: true
    },
    { 
      path: '/reports', 
      icon: PieChart, 
      label: 'Sales Reports',
      enabled: true 
    }
  ];

  // Get current role's menu items
  const getMenuItems = () => {
    switch (userRole) {
      case 'Consumer':
        return consumerItems;
      case 'Factory':
        return factoryItems;
      default:
        return designerItems;
    }
  };

  const menuItems = getMenuItems();

  // Render a menu item with proper state (locked, coming soon, etc.)
  const renderMenuItem = (item: any) => {
    const isActive = location.pathname === item.path;
    const isLocked = !isMetaMaskConnected && item.path !== '/designs';
    const isComingSoon = item.comingSoon;
    
    return (
      <li key={item.path}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link 
                to={isLocked || !item.enabled ? '#' : item.path} 
                className={`flex items-center gap-3 px-6 py-3 text-white hover:bg-white/10 transition-colors ${isActive ? 'bg-white/10' : ''} ${isLocked || !item.enabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={(e) => {
                  if (isLocked || !item.enabled) {
                    e.preventDefault();
                  }
                }}
              >
                {isLocked ? (
                  <Lock size={20} />
                ) : (
                  <item.icon size={20} />
                )}
                <span className="flex-grow">{item.label}</span>
                {isComingSoon && (
                  <Badge variant="outline" className="border-yellow-400 text-yellow-400 text-xs font-normal">
                    Coming Soon
                  </Badge>
                )}
              </Link>
            </TooltipTrigger>
            {isLocked && (
              <TooltipContent>
                <p>Connect MetaMask to unlock this feature</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </li>
    );
  };

  return (
    <div className="sidebar w-64 bg-blue-900 fixed h-full py-4 flex flex-col">
      <div className="px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
          <div className="w-6 h-6 bg-primary rounded-sm"></div>
        </div>
        <h1 className="text-xl font-bold text-white">3D Blockchain Platform</h1>
      </div>
      
      <nav className="mt-8 flex-1">
        <ul className="space-y-1">
          {menuItems.map(renderMenuItem)}
        </ul>
      </nav>
      
      <div className="px-6 py-2 text-xs text-white/70">
        © 2025 3D Blockchain Platform
      </div>
    </div>
  );
};

export default Sidebar;