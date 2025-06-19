import React from 'react';
import Header from './Header';
import SideMenu from './SideMenu';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SideMenu />
      
      <main className="container cf-py-4">
        {children}
      </main>
    </div>
  );
}

export default Layout;

