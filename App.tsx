
import React from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import SuppliersPage from './pages/SuppliersPage';
import CustomersPage from './pages/CustomersPage';
import SalesPage from './pages/SalesPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '🏠' },
  { path: '/products', label: 'Produtos', icon: '📦' },
  { path: '/suppliers', label: 'Fornecedores', icon: '🚚' },
  { path: '/customers', label: 'Clientes', icon: '👥' },
  { path: '/sales', label: 'Vendas', icon: '🛒' },
  { path: '/reports', label: 'Relatórios', icon: '📊' },
  { path: '/settings', label: 'Configurações', icon: '⚙️' },
];

const Sidebar: React.FC = () => {
    const location = useLocation();
    return (
        <aside className="w-64 bg-white dark:bg-slate-800 shadow-md flex flex-col">
            <div className="p-6 text-2xl font-bold border-b border-slate-200 dark:border-slate-700">
                <h1>Painel DB</h1>
            </div>
            <nav className="flex-grow p-4">
                <ul>
                    {navItems.map(item => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 my-1 rounded-lg transition-colors duration-200 ${
                                    location.pathname === item.path
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};


const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex h-screen font-sans">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;