import { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Package, Search, AlertTriangle, Clock, Plus } from 'lucide-react';

export default function InventoryPage() {
  const { data } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = useMemo(() => Array.from(new Set(data.inventory.map(i => i.category))).sort(), [data.inventory]);

  const filtered = useMemo(() => {
    let result = [...data.inventory];
    if (searchQuery) { const q = searchQuery.toLowerCase(); result = result.filter(i => i.name.toLowerCase().includes(q)); }
    if (categoryFilter !== 'all') result = result.filter(i => i.category === categoryFilter);
    return result;
  }, [data.inventory, searchQuery, categoryFilter]);

  const statusColor: Record<string, string> = {
    'In Stock': 'bg-success-50 text-success-700', 'Low Stock': 'bg-warning-50 text-warning-700',
    'Out of Stock': 'bg-danger-50 text-danger-700', 'Expiring Soon': 'bg-warning-100 text-warning-800',
  };

  return (
    <div className="fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-surface-900">Inventory</h1><p className="text-[13px] text-surface-500">{data.inventory.length} items tracked</p></div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-[13px] font-medium hover:bg-brand-700"><Plus className="w-4 h-4" />Add Item</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="metric-card"><p className="text-2xl font-bold text-success-600">{data.inventory.filter(i => i.status === 'In Stock').length}</p><p className="text-[12px] text-surface-500">In Stock</p></div>
        <div className="metric-card border-warning-200"><p className="text-2xl font-bold text-warning-600">{data.inventory.filter(i => i.status === 'Low Stock').length}</p><p className="text-[12px] text-surface-500">Low Stock</p></div>
        <div className="metric-card border-danger-200"><p className="text-2xl font-bold text-danger-600">{data.inventory.filter(i => i.status === 'Out of Stock').length}</p><p className="text-[12px] text-surface-500">Out of Stock</p></div>
        <div className="metric-card"><p className="text-2xl font-bold text-warning-600">{data.inventory.filter(i => i.status === 'Expiring Soon').length}</p><p className="text-[12px] text-surface-500">Expiring Soon</p></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input type="text" placeholder="Search inventory..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-surface-0 border border-surface-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-2 bg-surface-0 border border-surface-200 rounded-lg text-[13px]">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="bg-surface-0 border border-surface-200 rounded-xl overflow-hidden">
        <table className="data-table">
          <thead><tr><th>Item</th><th>Category</th><th>Stock</th><th>Min Level</th><th>Batch</th><th>Expiry</th><th>Supplier</th><th>Price</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id} className={item.status === 'Out of Stock' ? 'bg-danger-50/30' : item.status === 'Low Stock' ? 'bg-warning-50/20' : ''}>
                <td className="text-[13px] font-medium">{item.name}</td>
                <td><span className="text-[11px] px-2 py-0.5 bg-surface-50 border border-surface-200 rounded">{item.category}</span></td>
                <td className={`text-[13px] font-semibold ${item.currentStock <= item.minStock ? 'text-danger-600' : 'text-surface-900'}`}>{item.currentStock} {item.unit}</td>
                <td className="text-[12px] text-surface-500">{item.minStock}</td>
                <td className="text-[12px] font-mono">{item.batchNumber}</td>
                <td className="text-[12px]">{item.expiryDate}</td>
                <td className="text-[12px]">{item.supplier}</td>
                <td className="text-[12px]">₹{item.lastPurchasePrice}</td>
                <td><span className={`status-badge ${statusColor[item.status]}`}>{item.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
