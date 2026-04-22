import { useEffect, useState } from 'react';
import { tasksAPI } from '../services/api';
import { ContentTask } from '../types';
import { RefreshCw, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function TaskList() {
  const [tasks, setTasks] = useState<ContentTask[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await tasksAPI.getAll();
      setTasks(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); const interval = setInterval(fetchTasks, 5000); return () => clearInterval(interval); }, []);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'COMPLETED': return <CheckCircle className="text-green-500" />;
      case 'PROCESSING': return <RefreshCw className="text-blue-500 animate-spin" />;
      case 'FAILED': return <AlertCircle className="text-red-500" />;
      default: return <Clock className="text-gray-400" />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">รายการงาน</h1>
        <button onClick={fetchTasks} className="text-gray-500 hover:text-indigo-600"><RefreshCw /></button>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? <div className="p-6 text-center">กำลังโหลด...</div> : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">แพลตฟอร์ม</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สร้างเมื่อ</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ผลลัพธ์</th></tr></thead>
            <tbody className="divide-y divide-gray-200">
              {tasks.map(t => (
                <tr key={t.id}>
                  <td className="px-6 py-4 font-medium">{t.platform}</td>
                  <td className="px-6 py-4 flex items-center gap-2">{getStatusIcon(t.status)} <span className="capitalize">{t.status.toLowerCase()}</span></td>
                  <td className="px-6 py-4 text-gray-500">{new Date(t.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4">{t.videoUrl ? <a href={t.videoUrl} target="_blank" className="text-blue-600 underline">ดูวิดีโอ</a> : '-'}</td>
                </tr>
              ))}
              {tasks.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-gray-500">ยังไม่มีงาน</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
