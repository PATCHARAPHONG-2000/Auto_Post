import { useEffect, useState } from 'react';
import { productsAPI } from '../services/api';
import { Product } from '../types';
import { Plus, Trash2 } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: '', description: '', shopeeLink: '' });

  const fetchProducts = async () => {
    const res = await productsAPI.getAll();
    setProducts(res.data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await productsAPI.create({ ...form, images: [] });
    setForm({ name: '', description: '', shopeeLink: '' });
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if(confirm('ยืนยันการลบ?')) { await productsAPI.delete(id); fetchProducts(); }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">จัดการสินค้า</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div><label className="block text-sm font-medium text-gray-700">ชื่อสินค้า</label><input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
        <div><label className="block text-sm font-medium text-gray-700">รายละเอียด</label><input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
        <div><label className="block text-sm font-medium text-gray-700">Shopee Link</label><input type="url" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2" value={form.shopeeLink} onChange={e => setForm({...form, shopeeLink: e.target.value})} /></div>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2"><Plus size={18}/> เพิ่มสินค้า</button>
      </form>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อสินค้า</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รายละเอียด</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shopee Link</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th></tr></thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(p => (
              <tr key={p.id}><td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{p.name}</td><td className="px-6 py-4 text-gray-500">{p.description}</td><td className="px-6 py-4 text-blue-600 hover:underline"><a href={p.shopeeLink} target="_blank" rel="noreferrer">{p.shopeeLink || '-'}</a></td><td className="px-6 py-4 text-right"><button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18}/></button></td></tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <div className="p-6 text-center text-gray-500">ยังไม่มีสินค้า</div>}
      </div>
    </div>
  );
}
