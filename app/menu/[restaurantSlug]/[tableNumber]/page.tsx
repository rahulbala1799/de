'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/db';
import { restaurants, menuItems, categories } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { formatPrice } from '@/lib/utils';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: string;
  image: string | null;
  category: string;
  isAvailable: boolean;
  customizations: any;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
}

export default function MenuPage() {
  const params = useParams();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<Array<{ item: MenuItem; quantity: number; customizations: any }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, you'd fetch this data from your API
        // For now, we'll use mock data
        setRestaurant({
          id: '1',
          name: 'Burger Palace',
          description: 'The best burgers in town',
          theme: {
            primaryColor: '#ef4444',
            secondaryColor: '#0ea5e9',
          }
        });

        setCategories([
          { id: '1', name: 'Burgers', description: 'Juicy burgers made fresh' },
          { id: '2', name: 'Pizza', description: 'Wood-fired pizzas' },
          { id: '3', name: 'Fried Chicken', description: 'Crispy fried chicken' },
          { id: '4', name: 'Sides', description: 'Perfect sides' },
          { id: '5', name: 'Beverages', description: 'Refreshing drinks' },
        ]);

        setMenuItems([
          {
            id: '1',
            name: 'Classic Burger',
            description: 'Beef patty with lettuce, tomato, onion, and our special sauce',
            price: '12.99',
            image: null,
            category: 'burger',
            isAvailable: true,
            customizations: [
              {
                name: 'Cooking Level',
                type: 'single',
                required: true,
                options: [
                  { name: 'Medium Rare', price: 0 },
                  { name: 'Medium', price: 0 },
                  { name: 'Well Done', price: 0 },
                ]
              }
            ]
          },
          {
            id: '2',
            name: 'Margherita Pizza',
            description: 'Fresh mozzarella, tomato sauce, and basil',
            price: '16.99',
            image: null,
            category: 'pizza',
            isAvailable: true,
            customizations: []
          },
          {
            id: '3',
            name: 'Crispy Fried Chicken',
            description: 'Southern-style fried chicken with secret spices',
            price: '14.99',
            image: null,
            category: 'fried_chicken',
            isAvailable: true,
            customizations: []
          }
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.item.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.item.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { item, quantity: 1, customizations: {} }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(cartItem => cartItem.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(cartItem =>
        cartItem.item.id === itemId
          ? { ...cartItem, quantity }
          : cartItem
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, cartItem) => {
      return total + (parseFloat(cartItem.item.price) * cartItem.quantity);
    }, 0);
  };

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">{restaurant?.name}</h1>
          <p className="text-gray-600 mt-1">{restaurant?.description}</p>
          <p className="text-sm text-gray-500 mt-2">Table {params.tableNumber}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu */}
          <div className="lg:col-span-2">
            {/* Category Filter */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedCategory === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All Items
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name.toLowerCase().replace(' ', '_'))}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      selectedCategory === category.name.toLowerCase().replace(' ', '_')
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 mt-1">{item.description}</p>
                      <p className="text-lg font-bold text-primary-600 mt-2">
                        {formatPrice(parseFloat(item.price))}
                      </p>
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.isAvailable}
                      className="ml-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Order</h2>
              
              {cart.length === 0 ? (
                <p className="text-gray-500">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {cart.map((cartItem) => (
                      <div key={cartItem.item.id} className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{cartItem.item.name}</p>
                          <p className="text-sm text-gray-600">
                            {formatPrice(parseFloat(cartItem.item.price))} × {cartItem.quantity}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{cartItem.quantity}</span>
                          <button
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-lg font-bold text-primary-600">
                        {formatPrice(getTotalPrice())}
                      </span>
                    </div>
                    
                    <button className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700">
                      Place Order
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
