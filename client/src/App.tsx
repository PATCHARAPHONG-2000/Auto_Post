import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, Package, Video, PlusCircle, Settings as SettingsIcon } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import CreateTask from './pages/CreateTask';
import TaskList from './pages/TaskList';
import Settings from './pages/Settings';

function NavItem({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <Link to={to} className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors">
      <Icon size={20} /> <span className="font-medium">{label}</span>
    </Link>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100">
        <aside className="w-64 bg-white shadow-lg flex flex-col">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-indigo-600">AutoPost AI</h1>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/products" icon={Package} label="สินค้า" />
            <NavItem to="/create" icon={PlusCircle} label="สร้างงาน" />
            <NavItem to="/tasks" icon={Video} label="รายการงาน" />
            <NavItem to="/settings" icon={SettingsIcon} label="ตั้งค่า" />
          </nav>
        </aside>
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/create" element={<CreateTask />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
