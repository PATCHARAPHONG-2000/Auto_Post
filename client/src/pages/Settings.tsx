import { useState } from 'react';
import { platformsAPI } from '../services/api';
import { Save } from 'lucide-react';

export default function Settings() {
  const [form, setForm] = useState({ platform: 'TIKTOK', apiKey: '', token: '' });
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await platformsAPI.updateConfig(form.platform, { apiKey: form.apiKey, token: form.token });
      setMsg('บันทึกสำเร็จ!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) { setMsg('เกิดข้อผิดพลาด'); }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">ตั้งค่าระบบ</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">แพลตฟอร์ม</label>
          <select value={form.platform} onChange={e => setForm({...form, platform: e.target.value})} className="block w-full rounded-md border-gray-300 shadow-sm border p-3">
            <option value="TIKTOK">TikTok</option>
            <option value="FACEBOOK">Facebook</option>
            <option value="YOUTUBE">YouTube</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
          <input type="password" value={form.apiKey} onChange={e => setForm({...form, apiKey: e.target.value})} className="block w-full rounded-md border-gray-300 shadow-sm border p-3" placeholder="ใส่ API Key" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Access Token</label>
          <input type="password" value={form.token} onChange={e => setForm({...form, token: e.target.value})} className="block w-full rounded-md border-gray-300 shadow-sm border p-3" placeholder="ใส่ Access Token" />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 font-bold flex items-center justify-center gap-2"><Save size={20}/> บันทึกการตั้งค่า</button>
        {msg && <div className="text-center text-green-600 font-medium">{msg}</div>}
      </form>
    </div>
  );
}
