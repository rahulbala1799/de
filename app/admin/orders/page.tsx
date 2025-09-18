'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface OrderItem {
  id: string;
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  unitPrice: string;
  customizations: any[];
  notes: string;
}

interface Order {
  id: string;
  orderNumber: string;
  tableNumber: string;
  customerName: string;
  customerPhone: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  totalAmount: string;
  notes: string;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setOrders([
      {
        id: '1',
        orderNumber: 'ORD-ABC123',
        tableNumber: '1',
        customerName: 'John Doe',
        customerPhone: '(555) 123-4567',
        status: 'pending',
        totalAmount: '28.97',
        notes: 'Extra ketchup on the side',
        orderItems: [
          {
            id: '1',
            menuItemId: '1',
            menuItemName: 'Classic Burger',
            quantity: 1,
            unitPrice: '12.99',
            customizations: [{ name: 'Cooking Level', options: ['Medium'] }],
            notes: '',
          },
          {
            id: '2',
            menuItemId: '2',
            menuItemName: 'Margherita Pizza',
            quantity: 1,
            unitPrice: '16.99',
            customizations: [],
            notes: '',
          },
        ],
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
      {
        id: '2',
        orderNumber: 'ORD-DEF456',
        tableNumber: '3',
        customerName: 'Jane Smith',
        customerPhone: '(555) 987-6543',
        status: 'preparing',
        totalAmount: '14.99',
        notes: '',
        orderItems: [
          {
            id: '3',
            menuItemId: '3',
            menuItemName: 'Crispy Fried Chicken',
            quantity: 1,
            unitPrice: '14.99',
            customizations: [],
            notes: '',
          },
        ],
        createdAt: '2024-01-15T11:15:00Z',
        updatedAt: '2024-01-15T11:20:00Z',
      },
    ]);
    setIsLoading(false);
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
            : order
        )
      );
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusOptions = (currentStatus: Order['status']) => {
    const allStatuses: { value: Order['status']; label: string }[] = [
      { value: 'pending', label: 'Pending' },
      { value: 'confirmed', label: 'Confirmed' },
      { value: 'preparing', label: 'Preparing' },
      { value: 'ready', label: 'Ready' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' },
    ];

    return allStatuses.filter(status => status.value !== currentStatus);
  };

  const filteredOrders = selectedStatus === 'all'
    ? orders
    : orders.filter(order => order.status === selectedStatus);

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage customer orders from your QR menu system.
        </p>
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedStatus === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {order.orderNumber}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Table {order.tableNumber} • {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    ${order.totalAmount}
                  </p>
                  <div className="mt-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                      className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value={order.status}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </option>
                      {getStatusOptions(order.status).map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Name:</strong> {order.customerName || 'Not provided'}</p>
                    <p><strong>Phone:</strong> {order.customerPhone || 'Not provided'}</p>
                    {order.notes && (
                      <p><strong>Notes:</strong> {order.notes}</p>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                  <div className="space-y-2">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-start text-sm">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {item.menuItemName} × {item.quantity}
                          </p>
                          {item.customizations.length > 0 && (
                            <div className="text-gray-600 mt-1">
                              {item.customizations.map((customization, idx) => (
                                <p key={idx} className="text-xs">
                                  {customization.name}: {customization.options.join(', ')}
                                </p>
                              ))}
                            </div>
                          )}
                          {item.notes && (
                            <p className="text-xs text-gray-500 mt-1">
                              Note: {item.notes}
                            </p>
                          )}
                        </div>
                        <p className="font-medium text-gray-900 ml-2">
                          ${(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No orders found
          </h3>
          <p className="text-gray-500">
            {selectedStatus === 'all'
              ? 'No orders have been placed yet.'
              : `No orders with status "${selectedStatus}" found.`}
          </p>
        </div>
      )}
    </div>
  );
}
