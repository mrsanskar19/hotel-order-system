"use client"
import { useState, useEffect } from 'react';
import {
  Menu as MenuIcon,
  X as XIcon,
} from 'lucide-react';

export function Sidebar({ navLinks, title,children }) {
  const [pathname, setPathname] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setPathname(window.location.pathname);
  }, []);

 

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden mt-10 md:flex fixed top-0 left-0 h-full bg-gray-800 text-white p-4 flex-col z-50 transition-width duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
        aria-label="Sidebar Navigation"
      >
       
       <nav className="fixed md:top-0 md:left-0 md:flex md:items-center mb-6 w-full bg-white px-4 py-1 shadow-sm z-60">

  <button
    onClick={() => setCollapsed(!collapsed)}
    className="p-2 rounded bg-white hover:bg-gray-100 border border-gray-300"
    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
  >
    {collapsed ? <MenuIcon className="w-6 h-6 text-black" /> : <XIcon className="w-6 h-6 text-black" />}
  </button>
    <h1 className="text-black ml-4 text-lg font-semibold select-none">
    {title}
    </h1>
</nav>


<nav className="flex flex-col space-y-4 flex-1">
  {navLinks.map(({ href, label, icon: IconComp }) => {
    const isActive = pathname === href;

    return (
      <a
        key={href}
        href={href}
        className={`flex items-center gap-3 p-3 rounded hover:bg-gray-700 transition-colors ${
          isActive ? 'bg-gray-900' : ''
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        <IconComp className="w-6 h-6" aria-hidden="true" />
        {!collapsed && <span>{label}</span>}
      </a>
    );
  })}
</nav>

      </aside>

      {/* Mobile Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white flex justify-around p-2 md:hidden z-50 rounded-t-xl shadow-lg"
        aria-label="Bottom Navigation"
      >
        {navLinks.map(({ href, label, icon: IconComp }) => {
    const isActive = pathname === href;
          return (
            <a
              key={href}
              href={href}
              className={`flex flex-col items-center text-xs ${
                isActive ? 'text-blue-400' : 'text-gray-300'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <IconComp className="w-6 h-6" aria-hidden="true" />
              <span>{label}</span>
            </a>
          );
        })}
      </nav>

      {/* Spacer to prevent content overlap */}
      <div className={`mb-16 md:ml-${collapsed ? '20' : '64'}`}>{children}</div>
    </>
  );
}
