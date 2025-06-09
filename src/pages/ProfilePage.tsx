import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Package, 
  MapPin, 
  CreditCard, 
  Bell, 
  Lock, 
  LogOut, 
  Clock,
  FileText,
  Heart,
  ArrowRight,
  Camera
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone_number?: string;
  address?: string;
  avatar_url?: string;
}

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          // In a real app, you would fetch the user's profile from the database
          setUserProfile({
            id: user.id,
            email: user.email || '',
            full_name: 'Alex Johnson',
            phone_number: '+1 (555) 123-4567',
            address: '123 Main St, Apt 4B, New York, NY 10001',
            avatar_url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=800'
          });
        } else {
          // Mock user for demonstration
          setUserProfile({
            id: 'mock-id',
            email: 'alex@example.com',
            full_name: 'Alex Johnson',
            phone_number: '+1 (555) 123-4567',
            address: '123 Main St, Apt 4B, New York, NY 10001',
            avatar_url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=800'
          });
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        // Mock user for demonstration
        setUserProfile({
          id: 'mock-id',
          email: 'alex@example.com',
          full_name: 'Alex Johnson',
          phone_number: '+1 (555) 123-4567',
          address: '123 Main St, Apt 4B, New York, NY 10001',
          avatar_url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=800'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadUserProfile();
  }, []);

  // Mock order data
  const recentOrders = [
    {
      id: 'ORD-12345',
      date: '2023-06-15T14:30:00',
      status: 'Delivered',
      total: 38.97,
      items: 3,
      is_emergency: true
    },
    {
      id: 'ORD-12344',
      date: '2023-06-10T09:45:00',
      status: 'Delivered',
      total: 24.99,
      items: 2,
      is_emergency: false
    },
    {
      id: 'ORD-12343',
      date: '2023-05-28T16:20:00',
      status: 'Delivered',
      total: 15.98,
      items: 1,
      is_emergency: false
    }
  ];
  
  // Mock saved prescriptions
  const savedPrescriptions = [
    {
      id: 'PRES-001',
      name: 'Asthma Medication',
      doctor: 'Dr. Sarah Miller',
      date: '2023-05-15',
      expires: '2023-11-15',
      image: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 'PRES-002',
      name: 'Blood Pressure Medication',
      doctor: 'Dr. John Davis',
      date: '2023-04-10',
      expires: '2023-10-10',
      image: 'https://images.pexels.com/photos/593451/pexels-photo-593451.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];
  
  // Mock saved medicines
  const savedMedicines = [
    {
      id: '1',
      name: 'Asthma Relief Inhaler',
      price: 24.99,
      image: 'https://images.pexels.com/photos/159211/headache-pain-pills-medication-159211.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '4',
      name: 'Allergy Emergency Shots',
      price: 49.99,
      image: 'https://images.pexels.com/photos/593451/pexels-photo-593451.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '7',
      name: 'Heart Rescue Nitroglycerin',
      price: 29.99,
      image: 'https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50">
        <div className="spinner h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <motion.div 
              className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* User Profile Summary */}
              <div className="p-6 bg-primary-500 text-white">
                <div className="flex items-center">
                  <div className="relative">
                    <img 
                      src={userProfile?.avatar_url || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=800'} 
                      alt={userProfile?.full_name || 'User'} 
                      className="h-14 w-14 rounded-full object-cover border-2 border-white"
                    />
                    <button className="absolute -bottom-1 -right-1 bg-white text-primary-500 rounded-full p-1 shadow-md">
                      <Camera className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="ml-3">
                    <h2 className="font-semibold text-lg">{userProfile?.full_name || 'User'}</h2>
                    <p className="text-primary-100 text-sm">{userProfile?.email}</p>
                  </div>
                </div>
              </div>
              
              {/* Navigation Tabs */}
              <nav className="p-2">
                <button
                  className={`w-full flex items-center p-3 rounded-lg mb-1 ${
                    activeTab === 'overview'
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  <User className={`h-5 w-5 mr-3 ${activeTab === 'overview' ? 'text-primary-500' : 'text-gray-400'}`} />
                  Overview
                </button>
                <button
                  className={`w-full flex items-center p-3 rounded-lg mb-1 ${
                    activeTab === 'orders'
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('orders')}
                >
                  <Package className={`h-5 w-5 mr-3 ${activeTab === 'orders' ? 'text-primary-500' : 'text-gray-400'}`} />
                  Orders
                </button>
                <button
                  className={`w-full flex items-center p-3 rounded-lg mb-1 ${
                    activeTab === 'prescriptions'
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('prescriptions')}
                >
                  <FileText className={`h-5 w-5 mr-3 ${activeTab === 'prescriptions' ? 'text-primary-500' : 'text-gray-400'}`} />
                  Prescriptions
                </button>
                <button
                  className={`w-full flex items-center p-3 rounded-lg mb-1 ${
                    activeTab === 'saved'
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('saved')}
                >
                  <Heart className={`h-5 w-5 mr-3 ${activeTab === 'saved' ? 'text-primary-500' : 'text-gray-400'}`} />
                  Saved Items
                </button>
                <button
                  className={`w-full flex items-center p-3 rounded-lg mb-1 ${
                    activeTab === 'addresses'
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('addresses')}
                >
                  <MapPin className={`h-5 w-5 mr-3 ${activeTab === 'addresses' ? 'text-primary-500' : 'text-gray-400'}`} />
                  Addresses
                </button>
                <button
                  className={`w-full flex items-center p-3 rounded-lg mb-1 ${
                    activeTab === 'payment'
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('payment')}
                >
                  <CreditCard className={`h-5 w-5 mr-3 ${activeTab === 'payment' ? 'text-primary-500' : 'text-gray-400'}`} />
                  Payment Methods
                </button>
                <button
                  className={`w-full flex items-center p-3 rounded-lg mb-1 ${
                    activeTab === 'notifications'
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <Bell className={`h-5 w-5 mr-3 ${activeTab === 'notifications' ? 'text-primary-500' : 'text-gray-400'}`} />
                  Notifications
                </button>
                <button
                  className={`w-full flex items-center p-3 rounded-lg mb-1 ${
                    activeTab === 'security'
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('security')}
                >
                  <Lock className={`h-5 w-5 mr-3 ${activeTab === 'security' ? 'text-primary-500' : 'text-gray-400'}`} />
                  Security
                </button>
              </nav>
              
              <div className="p-4">
                <button className="w-full flex items-center justify-center text-gray-600 hover:text-accent-500 transition-colors p-2 rounded-lg border border-gray-200 hover:border-accent-200">
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </aside>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Profile Info Card */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="input"
                          value={userProfile?.full_name || ''}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="input"
                          value={userProfile?.email || ''}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          className="input"
                          value={userProfile?.phone_number || ''}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          className="input"
                          value={userProfile?.address || ''}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="mt-4 text-right">
                      <button className="btn-primary">
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">Recent Orders</h2>
                      <button 
                        className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center"
                        onClick={() => setActiveTab('orders')}
                      >
                        View All
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="divide-y divide-gray-200">
                      {recentOrders.slice(0, 2).map((order) => (
                        <div key={order.id} className="py-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              order.is_emergency ? 'bg-accent-100' : 'bg-gray-100'
                            }`}>
                              {order.is_emergency ? (
                                <Clock className="h-5 w-5 text-accent-500" />
                              ) : (
                                <Package className="h-5 w-5 text-gray-500" />
                              )}
                            </div>
                            <div className="ml-3">
                              <div className="font-medium text-gray-800">
                                {order.id}
                                {order.is_emergency && (
                                  <span className="ml-2 text-xs bg-accent-100 text-accent-600 px-2 py-0.5 rounded-full">
                                    Emergency
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(order.date).toLocaleDateString()} • {order.items} items
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-800">
                              ${order.total.toFixed(2)}
                            </div>
                            <div className="text-sm text-green-600">
                              {order.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Saved Medications */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">Saved Medications</h2>
                      <button 
                        className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center"
                        onClick={() => setActiveTab('saved')}
                      >
                        View All
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {savedMedicines.map((medicine) => (
                        <Link 
                          key={medicine.id}
                          to={`/medicines/${medicine.id}`}
                          className="block bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="h-24 bg-gray-100">
                            <img 
                              src={medicine.image} 
                              alt={medicine.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium text-gray-800 text-sm mb-1">
                              {medicine.name}
                            </h3>
                            <div className="text-primary-500 font-medium text-sm">
                              ${medicine.price.toFixed(2)}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Health Profile */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Health Profile</h2>
                    <p className="text-gray-600 mb-4">
                      Set up your health profile to get personalized medicine recommendations and emergency alerts.
                    </p>
                    <button className="btn-primary">
                      Set Up Health Profile
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <motion.div
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-6">Your Orders</h2>
                  
                  <div className="divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="py-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              order.is_emergency ? 'bg-accent-100' : 'bg-gray-100'
                            }`}>
                              {order.is_emergency ? (
                                <Clock className="h-5 w-5 text-accent-500" />
                              ) : (
                                <Package className="h-5 w-5 text-gray-500" />
                              )}
                            </div>
                            <div className="ml-3">
                              <div className="font-medium text-gray-800">
                                {order.id}
                                {order.is_emergency && (
                                  <span className="ml-2 text-xs bg-accent-100 text-accent-600 px-2 py-0.5 rounded-full">
                                    Emergency
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-800">
                              ${order.total.toFixed(2)}
                            </div>
                            <div className="text-sm text-green-600">
                              {order.status}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-3">
                          <div className="text-sm text-gray-500">
                            {order.items} {order.items === 1 ? 'item' : 'items'}
                          </div>
                          <button className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                            View Order Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Prescriptions Tab */}
            {activeTab === 'prescriptions' && (
              <motion.div
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Your Prescriptions</h2>
                    <button className="btn-primary text-sm">
                      Upload New Prescription
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedPrescriptions.map((prescription) => (
                      <div key={prescription.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="h-40 bg-gray-100">
                          <img
                            src={prescription.image}
                            alt={prescription.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-800 mb-1">
                            {prescription.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            Prescribed by: {prescription.doctor}
                          </p>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Date: {prescription.date}
                            </span>
                            <span className="text-gray-600">
                              Expires: {prescription.expires}
                            </span>
                          </div>
                          <div className="mt-3 flex justify-between">
                            <button className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                              View Details
                            </button>
                            <button className="btn-primary text-sm py-1">
                              Order Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 bg-primary-50 rounded-lg p-4 border border-primary-100">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FileText className="h-6 w-6 text-primary-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium text-primary-700">
                          Need to refill a prescription?
                        </h3>
                        <p className="text-sm text-primary-600 mt-1">
                          Upload your prescription or send it directly from your doctor for faster processing.
                        </p>
                        <button className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center">
                          Learn more about prescription delivery
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Placeholder for other tabs */}
            {(activeTab === 'saved' || 
              activeTab === 'addresses' || 
              activeTab === 'payment' || 
              activeTab === 'notifications' || 
              activeTab === 'security') && (
              <motion.div
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">
                    {activeTab === 'saved' && 'Saved Items'}
                    {activeTab === 'addresses' && 'Your Addresses'}
                    {activeTab === 'payment' && 'Payment Methods'}
                    {activeTab === 'notifications' && 'Notification Settings'}
                    {activeTab === 'security' && 'Security Settings'}
                  </h2>
                  
                  <p className="text-gray-600">
                    This section is under construction. Please check back soon for updates.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;