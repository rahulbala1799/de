'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function NewMenuItemPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'burger',
    isAvailable: true,
    isPopular: false,
    allergens: [] as string[],
    customizations: [] as any[],
  });

  const categories = [
    { value: 'burger', label: 'Burger', icon: '🍔' },
    { value: 'pizza', label: 'Pizza', icon: '🍕' },
    { value: 'fried_chicken', label: 'Fried Chicken', icon: '🍗' },
    { value: 'side', label: 'Side', icon: '🍟' },
    { value: 'beverage', label: 'Beverage', icon: '🥤' },
    { value: 'dessert', label: 'Dessert', icon: '🍰' },
  ];

  const commonAllergens = [
    'Gluten', 'Dairy', 'Nuts', 'Soy', 'Eggs', 'Fish', 'Shellfish', 'Sesame'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAllergenChange = (allergen: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      allergens: checked
        ? [...prev.allergens, allergen]
        : prev.allergens.filter(a => a !== allergen),
    }));
  };

  const addCustomization = () => {
    setFormData(prev => ({
      ...prev,
      customizations: [
        ...prev.customizations,
        {
          name: '',
          type: 'single',
          required: false,
          options: [{ name: '', price: 0 }],
        },
      ],
    }));
  };

  const updateCustomization = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      customizations: prev.customizations.map((customization, i) =>
        i === index ? { ...customization, [field]: value } : customization
      ),
    }));
  };

  const addCustomizationOption = (customizationIndex: number) => {
    setFormData(prev => ({
      ...prev,
      customizations: prev.customizations.map((customization, i) =>
        i === customizationIndex
          ? {
              ...customization,
              options: [...customization.options, { name: '', price: 0 }],
            }
          : customization
      ),
    }));
  };

  const removeCustomization = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customizations: prev.customizations.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, you'd make an API call here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast.success('Menu item created successfully');
      router.push('/admin/menu');
    } catch (error) {
      toast.error('Failed to create menu item');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Menu Item</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create a new menu item for your restaurant.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Item Name *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="e.g., Classic Burger"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="price"
                  id="price"
                  required
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="block w-full pl-7 pr-3 py-2 border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Describe your menu item..."
            />
          </div>

          <div className="mt-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              name="category"
              id="category"
              required
              value={formData.category}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.icon} {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              id="image"
              value={formData.image}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isAvailable"
                id="isAvailable"
                checked={formData.isAvailable}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900">
                Available for ordering
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isPopular"
                id="isPopular"
                checked={formData.isPopular}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isPopular" className="ml-2 block text-sm text-gray-900">
                Mark as popular item
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Allergens</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {commonAllergens.map((allergen) => (
              <div key={allergen} className="flex items-center">
                <input
                  type="checkbox"
                  id={`allergen-${allergen}`}
                  checked={formData.allergens.includes(allergen)}
                  onChange={(e) => handleAllergenChange(allergen, e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor={`allergen-${allergen}`} className="ml-2 block text-sm text-gray-900">
                  {allergen}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Customizations</h3>
            <button
              type="button"
              onClick={addCustomization}
              className="bg-primary-600 text-white px-3 py-1 rounded-md text-sm hover:bg-primary-700"
            >
              Add Customization
            </button>
          </div>

          {formData.customizations.map((customization, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-900">Customization {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeCustomization(index)}
                  className="text-red-600 hover:text-red-900 text-sm"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={customization.name}
                    onChange={(e) => updateCustomization(index, 'name', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="e.g., Cooking Level"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    value={customization.type}
                    onChange={(e) => updateCustomization(index, 'type', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="single">Single Choice</option>
                    <option value="multiple">Multiple Choice</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={customization.required}
                    onChange={(e) => updateCustomization(index, 'required', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Required
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Options
                  </label>
                  <button
                    type="button"
                    onClick={() => addCustomizationOption(index)}
                    className="text-primary-600 hover:text-primary-900 text-sm"
                  >
                    Add Option
                  </button>
                </div>

                {customization.options.map((option: any, optionIndex: number) => (
                  <div key={optionIndex} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={option.name}
                      onChange={(e) => {
                        const newOptions = [...customization.options];
                        newOptions[optionIndex].name = e.target.value;
                        updateCustomization(index, 'options', newOptions);
                      }}
                      className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Option name"
                    />
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        value={option.price}
                        onChange={(e) => {
                          const newOptions = [...customization.options];
                          newOptions[optionIndex].price = parseFloat(e.target.value) || 0;
                          updateCustomization(index, 'options', newOptions);
                        }}
                        className="w-20 pl-7 pr-3 py-2 border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {formData.customizations.length === 0 && (
            <p className="text-gray-500 text-sm">
              No customizations added. Click "Add Customization" to add options like cooking level, size, etc.
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Menu Item'}
          </button>
        </div>
      </form>
    </div>
  );
}
