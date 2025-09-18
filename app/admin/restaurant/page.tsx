'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  isActive: boolean;
}

export default function RestaurantPage() {
  const { data: session } = useSession();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    logo: '',
    primaryColor: '#ef4444',
    secondaryColor: '#0ea5e9',
    fontFamily: 'Inter',
  });

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setRestaurant({
      id: '1',
      name: 'Burger Palace',
      slug: 'burger-palace',
      description: 'The best burgers in town',
      address: '123 Main St, City, State 12345',
      phone: '(555) 123-4567',
      email: 'info@burgerpalace.com',
      logo: '',
      theme: {
        primaryColor: '#ef4444',
        secondaryColor: '#0ea5e9',
        fontFamily: 'Inter',
      },
      isActive: true,
    });

    setFormData({
      name: 'Burger Palace',
      slug: 'burger-palace',
      description: 'The best burgers in town',
      address: '123 Main St, City, State 12345',
      phone: '(555) 123-4567',
      email: 'info@burgerpalace.com',
      logo: '',
      primaryColor: '#ef4444',
      secondaryColor: '#0ea5e9',
      fontFamily: 'Inter',
    });

    setIsLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, you'd make an API call here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setRestaurant({
        ...restaurant!,
        ...formData,
        theme: {
          primaryColor: formData.primaryColor,
          secondaryColor: formData.secondaryColor,
          fontFamily: formData.fontFamily,
        },
      });
      
      setIsEditing(false);
      toast.success('Restaurant information updated successfully');
    } catch (error) {
      toast.error('Failed to update restaurant information');
    } finally {
      setIsLoading(false);
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
            <h1 className="text-2xl font-bold text-gray-900">Restaurant Settings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your restaurant information and branding.
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Restaurant Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                URL Slug
              </label>
              <input
                type="text"
                name="slug"
                id="slug"
                value={formData.slug}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50"
              />
              <p className="mt-1 text-xs text-gray-500">
                This will be used in your menu URL: /menu/{formData.slug}/table-number
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
              Logo URL
            </label>
            <input
              type="url"
              name="logo"
              id="logo"
              value={formData.logo}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50"
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Theme Colors</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
                  Primary Color
                </label>
                <div className="mt-1 flex items-center space-x-3">
                  <input
                    type="color"
                    name="primaryColor"
                    id="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="h-10 w-16 border border-gray-300 rounded-md disabled:opacity-50"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700">
                  Secondary Color
                </label>
                <div className="mt-1 flex items-center space-x-3">
                  <input
                    type="color"
                    name="secondaryColor"
                    id="secondaryColor"
                    value={formData.secondaryColor}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="h-10 w-16 border border-gray-300 rounded-md disabled:opacity-50"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
