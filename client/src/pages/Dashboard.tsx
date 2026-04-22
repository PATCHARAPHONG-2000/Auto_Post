import { useEffect, useState } from 'react';
import { productsAPI, tasksAPI } from '../services/api';
import { Package, Video, Activity } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, tasks: 0, pending: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, taskRes] = await Promise.all([productsAPI.getAll(), tasksAPI.getAll()]);
        const tasks = taskRes.data;
        setStats({
          products: prodRes.data.length,
          tasks: tasks.length,
          pending: tasks.filter((t: any) => t.status === 'PENDING' || t.status === 'PROCESSING').length,
        });
      } catch (error) { console.error("Failed to fetch stats", error); }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-full"><Package className="w-8 h-8 text-blue-600" /></div>
          <div><p className="text-gray-500">สินค้าทั้งหมด</p><p className="text-2xl font-bold">{stats.products}</p></div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-full"><Video className="w-8 h-8 text-green-600" /></div>
          <div><p className="text-gray-500">งานวิดีโอ</p><p className="text-2xl font-bold">{stats.tasks}</p></div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <div className="p-3 bg-yellow-100 rounded-full"><Activity className="w-8 h-8 text-yellow-600" /></div>
          <div><p className="text-gray-500">กำลังประมวลผล</p><p className="text-2xl font-bold">{stats.pending}</p></div>
        </div>
      </div>
    </div>
  );
}
