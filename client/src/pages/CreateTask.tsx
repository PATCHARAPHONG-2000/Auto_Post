import { useEffect, useState } from 'react';
import { productsAPI, tasksAPI } from '../services/api';
import { Product } from '../types';
import { Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreateTask() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [platform, setPlatform] = useState<'TIKTOK' | 'FACEBOOK'>('TIKTOK');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    productsAPI.getAll().then(res => setProducts(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return alert('กรุณาเลือกสินค้า');
    setLoading(true);
    try {
      if (platform === 'TIKTOK') await tasksAPI.createTikTok(selectedProduct);
      else await tasksAPI.createFacebook(selectedProduct);
      alert('สร้างงานสำเร็จ! ระบบกำลังประมวลผล');
      navigate('/tasks');
    } catch (err) { alert('เกิดข้อผิดพลาด'); }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">สร้างคอนเทนต์ใหม่</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">เลือกแพลตฟอร์ม</label>
          <div className="flex space-x-4">
            {['TIKTOK', 'FACEBOOK'].map((p) => (
              <button key={p} type="button" onClick={() => setPlatform(p as any)} className={`flex-1 py-3 px-4 rounded-md border ${platform === p ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>{p}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">เลือกสินค้า</label>
          <select required value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-3">
            <option value="">-- เลือกสินค้า --</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <button disabled={loading} type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 font-bold flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? 'กำลังสร้าง...' : <><Send size={20}/> เริ่มสร้างวิดีโอ</>}
        </button>
      </form>
    </div>
  );
}
