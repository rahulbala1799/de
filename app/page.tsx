import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            QR Menu Ordering System
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Transform your restaurant with digital menus and seamless ordering. 
            Perfect for burgers, pizza, and fried chicken restaurants.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admin"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Admin Dashboard
            </Link>
            <Link
              href="/demo"
              className="bg-secondary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary-700 transition-colors"
            >
              View Demo Menu
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-primary-600 text-4xl mb-4">🍔</div>
            <h3 className="text-xl font-semibold mb-2">Burger Varieties</h3>
            <p className="text-gray-600">
              Showcase your burger menu with high-quality images and detailed descriptions.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-primary-600 text-4xl mb-4">🍕</div>
            <h3 className="text-xl font-semibold mb-2">Pizza Selection</h3>
            <p className="text-gray-600">
              Display your pizza offerings with customizable options and pricing.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-primary-600 text-4xl mb-4">🍗</div>
            <h3 className="text-xl font-semibold mb-2">Fried Chicken</h3>
            <p className="text-gray-600">
              Feature your fried chicken varieties with sides and combo options.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
