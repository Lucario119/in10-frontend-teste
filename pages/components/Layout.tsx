import React, { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="is-preload">
      <div id="page-wrapper">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-xl">Tableau Dashboard React</h1>
        </header>
        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>
        <footer id="footer" className="bg-blue-600 text-white p-4 text-center">
          <div className="inner">
            <ul className="copyright">
              <li>&copy; 2024 Dashboard Viz. All rights reserved.</li>
        
            </ul>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
