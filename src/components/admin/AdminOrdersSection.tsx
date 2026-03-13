import React, { useState, useEffect } from 'react';
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail as MailIcon,
  RefreshCw,
  Download,
  CreditCard,
  IndianRupee,
} from 'lucide-react';

type Order = {
  id: number;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  name: string;
  phone: string;
  email: string;
  service_id: string;
  service_name: string;
  package_name: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
};

type Props = {
  token: string;
};

const STATUS_STYLES: Record<string, string> = {
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  created: 'bg-amber-50 text-amber-700 border-amber-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
};

export default function AdminOrdersSection({ token }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 20;

  const fetchOrders = async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?page=${p}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrders(data.orders);
      setTotal(data.total);
      setPage(p);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [token]);

  const exportCSV = () => {
    const headers = ['Name', 'Phone', 'Email', 'Service', 'Package', 'Amount', 'Status', 'Payment ID', 'Date'];
    const rows = orders.map((o) => [
      o.name,
      o.phone,
      o.email,
      o.service_name,
      o.package_name,
      `₹${(o.amount / 100).toLocaleString('en-IN')}`,
      o.status,
      o.razorpay_payment_id,
      o.created_at,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(total / limit);

  const paidTotal = orders
    .filter((o) => o.status === 'paid')
    .reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-gray-500">Total Orders</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{total}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-gray-500">Revenue (this page)</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ₹{(paidTotal / 100).toLocaleString('en-IN')}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-gray-500">Paid Orders</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {orders.filter((o) => o.status === 'paid').length}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => fetchOrders(page)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
        {orders.length > 0 && (
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        )}
        <span className="ml-auto text-sm text-gray-400">{total} total orders</span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <CreditCard className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No orders yet.</p>
          <p className="text-xs mt-1">Orders will appear here when customers complete payments.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Service / Package</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Payment ID</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{order.name}</div>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {order.phone}
                        </span>
                        {order.email && (
                          <span className="flex items-center gap-1">
                            <MailIcon className="w-3 h-3" /> {order.email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-900 text-[13px]">{order.service_name}</div>
                      <div className="text-xs text-gray-400">{order.package_name}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      ₹{(order.amount / 100).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold border ${STATUS_STYLES[order.status] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 font-mono max-w-[140px] truncate" title={order.razorpay_payment_id}>
                      {order.razorpay_payment_id || '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(order.created_at + 'Z').toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => fetchOrders(page - 1)}
                  disabled={page <= 1}
                  className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => fetchOrders(page + 1)}
                  disabled={page >= totalPages}
                  className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
