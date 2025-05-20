import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FileText, Upload, PieChart, Lock, Laptop, ListChecks, FileCheck } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from "../context/LanguageContext";

const Sidebar = () => {
  const { userRole, isMetaMaskConnected } = useUser();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Sidebar menu items organized by role for scalability
  const sidebarMenu = {
    Designer: [
      { path: '/designs', icon: FileText, label: t.sidebar.myDesigns, enabled: true },
      { path: '/submit-design', icon: Upload, label: t.sidebar.submitDesign, enabled: true },
      { path: '/reports', icon: PieChart, label: t.sidebar.salesReports, enabled: true },
    ],
    Consumer: [
      { path: '/explore-designs', icon: Laptop, label: t.sidebar.exploreDesigns, enabled: true },
      { path: '/orders', icon: ListChecks, label: t.sidebar.myOrders, enabled: false, comingSoon: true },
    ],
    Factory: [
      { path: '/printers', icon: Laptop, label: t.sidebar.myPrinters, enabled: false, comingSoon: true },
      { path: '/production', icon: ListChecks, label: t.sidebar.productionQueue, enabled: false, comingSoon: true },
      { path: '/validate', icon: FileCheck, label: t.sidebar.validateLicenses, enabled: false, comingSoon: true },
      { path: '/reports', icon: PieChart, label: t.sidebar.salesReports, enabled: false, comingSoon: true },
    ],
  };

  // Get current role's menu items
  const getMenuItems = () => {
    if (userRole === 'Consumer') return sidebarMenu.Consumer;
    if (userRole === 'Factory') return sidebarMenu.Factory;
    return sidebarMenu.Designer;
  };

  const menuItems = getMenuItems();

  // Redireciona para a primeira tab disponível quando o perfil muda, mas só se a tab não for a atual
  useEffect(() => {
    const firstEnabled = menuItems.find(item => item.enabled);
    if (firstEnabled) {
      if (location.pathname !== firstEnabled.path) {
        navigate(firstEnabled.path, { replace: true });
      }
    } else {
      // Se não houver nenhuma tab disponível, volta para o perfil Consumer
      if (userRole !== 'Consumer') {
        // Supondo que existe um método setUserRole no contexto
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('userRole', 'Consumer');
        }
        window.location.reload(); // Força reload para garantir contexto atualizado
      } else {
        // Se nem Consumer tem páginas, vai para o 404
        navigate('/404', { replace: true });
      }
    }
    // eslint-disable-next-line
  }, [userRole]);

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
                    {t.sidebar.comingSoon}
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
      
      <div className="flex justify-center gap-4 mb-4">
        <button onClick={() => setLanguage('pt')} aria-label="Português" className={`rounded-full p-1 border-2 ${language === 'pt' ? 'border-blue-500' : 'border-transparent'}`}
          title="Português">
          <span role="img" aria-label="Português" style={{fontSize: 24}}>🇵🇹</span>
        </button>
        <button onClick={() => setLanguage('en')} aria-label="English" className={`rounded-full p-1 border-2 ${language === 'en' ? 'border-blue-500' : 'border-transparent'}`}
          title="English">
          <span role="img" aria-label="English" style={{fontSize: 24}}>🇬🇧</span>
        </button>
      </div>
      <div className="px-6 py-2 text-xs text-white/70">
        {t.sidebar.copyright}
      </div>
    </div>
  );
};

export default Sidebar;