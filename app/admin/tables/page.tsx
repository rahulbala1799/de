'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import QRCode from 'qrcode.react';

interface Table {
  id: string;
  number: string;
  qrCode: string;
  isActive: boolean;
  createdAt: string;
}

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState<Table | null>(null);
  const [newTableNumber, setNewTableNumber] = useState('');

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setTables([
      {
        id: '1',
        number: '1',
        qrCode: 'https://example.com/menu/burger-palace/1',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        number: '2',
        qrCode: 'https://example.com/menu/burger-palace/2',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '3',
        number: '3',
        qrCode: 'https://example.com/menu/burger-palace/3',
        isActive: false,
        createdAt: '2024-01-01T00:00:00Z',
      },
    ]);
    setIsLoading(false);
  }, []);

  const addTable = async () => {
    if (!newTableNumber.trim()) {
      toast.error('Please enter a table number');
      return;
    }

    if (tables.some(table => table.number === newTableNumber)) {
      toast.error('Table number already exists');
      return;
    }

    try {
      const newTable: Table = {
        id: Date.now().toString(),
        number: newTableNumber,
        qrCode: `https://example.com/menu/burger-palace/${newTableNumber}`,
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      setTables(prev => [...prev, newTable]);
      setNewTableNumber('');
      toast.success('Table added successfully');
    } catch (error) {
      toast.error('Failed to add table');
    }
  };

  const toggleTableStatus = async (id: string) => {
    try {
      setTables(prev =>
        prev.map(table =>
          table.id === id ? { ...table, isActive: !table.isActive } : table
        )
      );
      toast.success('Table status updated');
    } catch (error) {
      toast.error('Failed to update table status');
    }
  };

  const deleteTable = async (id: string) => {
    if (!confirm('Are you sure you want to delete this table?')) {
      return;
    }

    try {
      setTables(prev => prev.filter(table => table.id !== id));
      toast.success('Table deleted successfully');
    } catch (error) {
      toast.error('Failed to delete table');
    }
  };

  const downloadQRCode = (table: Table) => {
    const canvas = document.getElementById(`qr-${table.id}`) as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `table-${table.number}-qr.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Table Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your restaurant tables and generate QR codes for each table.
            </p>
          </div>
        </div>
      </div>

      {/* Add New Table */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Table</h3>
        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700">
              Table Number
            </label>
            <input
              type="text"
              id="tableNumber"
              value={newTableNumber}
              onChange={(e) => setNewTableNumber(e.target.value)}
              className="mt-1 block w-32 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="e.g., 5"
            />
          </div>
          <button
            onClick={addTable}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 mt-6"
          >
            Add Table
          </button>
        </div>
      </div>

      {/* Tables List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            All Tables ({tables.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {tables.map((table) => (
            <div key={table.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">🪑</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">
                        Table {table.number}
                      </h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        table.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {table.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      QR Code: {table.qrCode}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created: {new Date(table.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowQRModal(table)}
                    className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                  >
                    View QR
                  </button>
                  
                  <button
                    onClick={() => downloadQRCode(table)}
                    className="text-green-600 hover:text-green-900 text-sm font-medium"
                  >
                    Download
                  </button>
                  
                  <button
                    onClick={() => toggleTableStatus(table.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      table.isActive
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {table.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  
                  <button
                    onClick={() => deleteTable(table.id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tables.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="text-4xl mb-4">🪑</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tables yet
            </h3>
            <p className="text-gray-500 mb-4">
              Add your first table to start generating QR codes.
            </p>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                QR Code for Table {showQRModal.number}
              </h3>
              
              <div className="flex justify-center mb-4">
                <div className="bg-white p-4 rounded-lg border">
                  <QRCode
                    id={`qr-${showQRModal.id}`}
                    value={showQRModal.qrCode}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Customers can scan this QR code to view your menu and place orders.
              </p>
              
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => downloadQRCode(showQRModal)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  Download QR Code
                </button>
                <button
                  onClick={() => setShowQRModal(null)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
