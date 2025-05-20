
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './SideBar';
import Header from './Header';

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="main-content flex-1 ml-64">
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
