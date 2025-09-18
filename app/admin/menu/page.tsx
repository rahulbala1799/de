'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  isAvailable: boolean;
  isPopular: boolean;
  sortOrder: number;
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setMenuItems([
      {
        id: '1',
        name: 'Classic Burger',
        description: 'Beef patty with lettuce, tomato, onion, and our special sauce',
        price: '12.99',
        image: '',
        category: 'burger',
        isAvailable: true,
        isPopular: true,
        sortOrder: 1,
      },
      {
        id: '2',
        name: 'Margherita Pizza',
        description: 'Fresh mozzarella, tomato sauce, and basil',
        price: '16.99',
        image: '',
        category: 'pizza',
        isAvailable: true,
        isPopular: false,
        sortOrder: 2,
      },
      {
        id: '3',
        name: 'Crispy Fried Chicken',
        description: 'Southern-style fried chicken with secret spices',
        price: '14.99',
        image: '',
        category: 'fried_chicken',
        isAvailable: true,
        isPopular: true,
        sortOrder: 3,
      },
      {
        id: '4',
        name: 'BBQ Bacon Burger',
        description: 'Beef patty with BBQ sauce, bacon, and cheddar cheese',
        price: '15.99',
        image: '',
        category: 'burger',
        isAvailable: false,
        isPopular: false,
        sortOrder: 4,
      },
    ]);
    setIsLoading(false);
  }, []);

  const toggleAvailability = async (id: string) => {
    try {
      setMenuItems(items =>
        items.map(item =>
          item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
        )
      );
      toast.success('Availability updated');
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      setMenuItems(items => items.filter(item => item.id !== id));
      toast.success('Menu item deleted');
    } catch (error) {
      toast.error('Failed to delete menu item');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'burger': return '🍔';
      case 'pizza': return '🍕';
      case 'fried_chicken': return '🍗';
      case 'side': return '🍟';
      case 'beverage': return '🥤';
      case 'dessert': return '🍰';
      default: return '🍽️';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'burger': return 'Burger';
      case 'pizza': return 'Pizza';
      case 'fried_chicken': return 'Fried Chicken';
      case 'side': return 'Side';
      case 'beverage': return 'Beverage';
      case 'dessert': return 'Dessert';
      default: return 'Other';
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
            <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your restaurant's menu items and pricing.
            </p>
          </div>
          <Link
            href="/admin/menu/new"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            Add Menu Item
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              All Menu Items ({menuItems.length})
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Available: {menuItems.filter(item => item.isAvailable).length}
              </span>
              <span className="text-sm text-gray-500">
                Popular: {menuItems.filter(item => item.isPopular).length}
              </span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {menuItems.map((item) => (
            <div key={item.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">
                        {item.name}
                      </h4>
                      {item.isPopular && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Popular
                        </span>
                      )}
                      {!item.isAvailable && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Unavailable
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm font-medium text-primary-600">
                        ${item.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        {getCategoryName(item.category)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleAvailability(item.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.isAvailable
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </button>
                  
                  <Link
                    href={`/admin/menu/${item.id}/edit`}
                    className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                  >
                    Edit
                  </Link>
                  
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {menuItems.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="text-4xl mb-4">🍽️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No menu items yet
            </h3>
            <p className="text-gray-500 mb-4">
              Get started by adding your first menu item.
            </p>
            <Link
              href="/admin/menu/new"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              Add Menu Item
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
