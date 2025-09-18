'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  const { data: session } = useSession();

  const stats = [
    { name: 'Total Orders', value: '24', change: '+12%', changeType: 'positive' },
    { name: 'Active Tables', value: '8', change: '+2', changeType: 'positive' },
    { name: 'Menu Items', value: '45', change: '+3', changeType: 'positive' },
    { name: 'Revenue Today', value: '$1,234', change: '+8%', changeType: 'positive' },
  ];

  const quickActions = [
    {
      name: 'Add Menu Item',
      description: 'Add a new item to your menu',
      href: '/admin/menu/new',
      icon: '🍽️',
    },
    {
      name: 'Manage Tables',
      description: 'Generate QR codes for tables',
      href: '/admin/tables',
      icon: '🪑',
    },
    {
      name: 'View Orders',
      description: 'Check current and past orders',
      href: '/admin/orders',
      icon: '📋',
    },
    {
      name: 'Restaurant Settings',
      description: 'Update restaurant information',
      href: '/admin/restaurant',
      icon: '⚙️',
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {session?.user?.name}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your restaurant today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      <span className={`text-sm ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-primary-50 text-primary-700 ring-4 ring-white text-2xl">
                  {action.icon}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {action.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {action.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Orders
          </h3>
          <div className="text-sm text-gray-500">
            <p>No recent orders to display.</p>
            <p className="mt-2">
              <Link href="/admin/orders" className="text-primary-600 hover:text-primary-500">
                View all orders →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
