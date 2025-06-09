import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, MapPin, ArrowRight, Search, ShoppingBag, AlertTriangle, RefreshCw, Database } from 'lucide-react';
import { fetchEmergencyMedicines, searchMedicines } from '../lib/supabase';
import { useCartStore } from '../store/cartStore';
import EmergencyCategories from '../components/emergency/EmergencyCategories';

interface Medicine {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  description: string;
  dosage_form: string | null;
  emergency: boolean;
  stock: number;
  manufacturer: string | null;
}

const EmergencyPage: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();
  const addToCart = useCartStore(state => state.addItem);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const results = await searchMedicines(searchQuery);
      // Filter for emergency medicines only
      const emergencyResults = results.filter(medicine => medicine.emergency);
      
      if (emergencyResults.length > 0) {
        setMedicines(emergencyResults);
      } else {
        // If no emergency results, redirect to general search
        navigate(`/medicines?search=${encodeURIComponent(searchQuery)}`);
      }
    } catch (error) {
      console.error('Search error:', error);
      navigate(`/medicines?search=${encodeURIComponent(searchQuery)}`);
    } finally {
      setSearching(false);
    }
  };

  const handleAddToCart = (medicine: Medicine) => {
    addToCart({
      id: medicine.id,
      name: medicine.name,
      price: medicine.price / 83, // Convert INR to USD for cart consistency
      image_url: medicine.image_url,
      is_emergency: medicine.emergency,
      manufacturer: medicine.manufacturer || undefined,
      dosage_form: medicine.dosage_form || undefined
    });
  };

  const loadEmergencyMedicines = async () => {
    console.log('🚨 EmergencyPage: Loading emergency medicines...');
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchEmergencyMedicines();
      console.log('🚨 EmergencyPage: Received data:', data?.length || 0, 'emergency medicines');
      
      if (data && data.length > 0) {
        setMedicines(data);
        console.log(`🚨 EmergencyPage: Successfully loaded ${data.length} emergency medicines`);
      } else {
        console.log('🚨 EmergencyPage: No emergency medicines received');
        setMedicines([]);
        setError('No emergency medicines found in the database.');
      }
    } catch (error) {
      console.error('🚨 EmergencyPage: Error loading emergency medicines:', error);
      setError(error instanceof Error ? error.message : 'Failed to load emergency medicines');
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmergencyMedicines();
  }, []);

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="bg-gradient-to-br from-accent-500 to-accent-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Emergency Medicine Delivery
            </motion.h1>
            <motion.p
              className="text-accent-100 mb-8 text-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Critical medications delivered within 30 minutes in select areas. Our emergency service ensures you get the medicine you need when it matters most.
            </motion.p>
            
            {/* Location & Delivery Time */}
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center flex-1">
                  <MapPin className="h-6 w-6 mr-3 text-accent-200" />
                  <input
                    type="text"
                    placeholder="Enter your delivery address"
                    className="bg-transparent border-b-2 border-accent-300 text-white placeholder-accent-200 focus:outline-none focus:border-white w-full py-2 text-lg"
                    value={userLocation}
                    onChange={(e) => setUserLocation(e.target.value)}
                  />
                </div>
                <div className="flex items-center text-accent-100 bg-white/10 px-4 py-2 rounded-xl">
                  <Clock className="h-5 w-5 mr-2" />
                  <span className="font-medium">Delivery: <strong>25-30 min</strong></span>
                </div>
              </div>
            </motion.div>
            
            {/* Search Bar */}
            <motion.form
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-white rounded-2xl shadow-2xl p-2 flex items-center">
                <Search className="h-6 w-6 text-gray-400 ml-4 mr-3" />
                <input 
                  type="text" 
                  placeholder="Search for emergency medicines..." 
                  className="flex-grow py-4 px-2 focus:outline-none text-gray-700 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors flex items-center"
                  disabled={!searchQuery.trim() || searching}
                >
                  {searching ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
              <div className="text-accent-200 text-sm mt-4">
                Popular emergency searches: Asthma Inhaler, EpiPen, Insulin, Nitroglycerin
              </div>
            </motion.form>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        {/* Emergency Notice */}
        <div className="bg-emergency-50 border-2 border-emergency-200 rounded-2xl p-6 md:p-8 mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="bg-emergency-100 p-4 rounded-2xl mr-0 md:mr-6 mb-4 md:mb-0">
              <AlertTriangle className="h-8 w-8 text-emergency-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-emergency-700 mb-2">Medical Emergency?</h3>
              <p className="text-emergency-600 mb-4 text-lg">
                If you're experiencing a serious medical emergency such as chest pain, severe bleeding, or difficulty breathing, please call emergency services immediately.
              </p>
              <div className="text-emergency-700 font-bold text-2xl">
                Emergency Services: <a href="tel:102" className="underline hover:text-emergency-800">102</a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Emergency Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Emergency Categories</h2>
          <EmergencyCategories />
        </div>

        {/* Emergency Medicines */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Emergency Medicines
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Fast-tracked delivery with priority handling for critical situations
          </p>
          
          {error && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Database className="h-12 w-12 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Unable to load emergency medicines</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button 
                onClick={loadEmergencyMedicines}
                className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center mx-auto"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
            </div>
          )}
          
          {loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white animate-pulse rounded-2xl h-80 shadow-sm"
                ></div>
              ))}
            </div>
          )}

          {!loading && !error && medicines.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Database className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No emergency medicines available</h3>
              <p className="text-gray-500 mb-4">There are no emergency medicines in the database yet.</p>
              <Link 
                to="/medicines"
                className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center"
              >
                Browse All Medicines
              </Link>
            </div>
          )}

          {!loading && !error && medicines.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {medicines.map((medicine) => (
                <motion.div
                  key={medicine.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                >
                  <Link to={`/medicines/${medicine.id}`}>
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <img
                        src={medicine.image_url || 'https://images.pexels.com/photos/159211/headache-pain-pills-medication-159211.jpeg?auto=compress&cs=tinysrgb&w=800'}
                        alt={medicine.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-accent-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center font-medium shadow-lg emergency-pulse">
                        <Clock className="h-3 w-3 mr-1" />
                        Fast Delivery
                      </div>
                      {medicine.stock < 20 && medicine.stock > 0 && (
                        <div className="absolute bottom-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                          Low Stock: {medicine.stock}
                        </div>
                      )}
                      {medicine.stock === 0 && (
                        <div className="absolute bottom-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          Out of Stock
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-6">
                    <Link to={`/medicines/${medicine.id}`}>
                      <h3 className="font-semibold text-gray-800 hover:text-primary-600 transition-colors text-lg mb-2">
                        {medicine.name}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {medicine.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-xl">
                        ₹{Math.round(medicine.price)}
                      </span>
                      <button 
                        onClick={() => handleAddToCart(medicine)}
                        disabled={medicine.stock === 0}
                        className={`text-sm flex items-center py-2 px-4 rounded-xl transition-all duration-200 hover:scale-105 font-medium ${
                          medicine.stock === 0 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-accent-500 hover:bg-accent-600 text-white'
                        }`}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        {medicine.stock === 0 ? 'Out of Stock' : 'Add'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Emergency Kit Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                Emergency Medicine Kit
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Be prepared for any situation with our curated emergency medicine kit. Contains essential medications and first aid supplies for common emergencies.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-accent-500 mr-3 text-xl">•</span>
                  <span className="text-gray-700">Pain relievers and fever reducers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-500 mr-3 text-xl">•</span>
                  <span className="text-gray-700">Allergy medications and antihistamines</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-500 mr-3 text-xl">•</span>
                  <span className="text-gray-700">Bandages and wound care supplies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-500 mr-3 text-xl">•</span>
                  <span className="text-gray-700">First aid guide and emergency contacts card</span>
                </li>
              </ul>
              <button className="bg-accent-500 hover:bg-accent-600 text-white w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105">
                View Emergency Kits
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://images.pexels.com/photos/3978594/pexels-photo-3978594.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Emergency Medicine Kit" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div>
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">
            How Emergency Delivery Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="bg-primary-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-500">1</span>
              </div>
              <h3 className="font-semibold text-xl mb-4 text-gray-800">Order Emergency Medicine</h3>
              <p className="text-gray-600 leading-relaxed">
                Select the emergency medicine you need and place your order with your delivery address.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="bg-primary-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-500">2</span>
              </div>
              <h3 className="font-semibold text-xl mb-4 text-gray-800">Priority Processing</h3>
              <p className="text-gray-600 leading-relaxed">
                Your order is flagged as emergency and given priority by our closest pharmacy partner.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="bg-primary-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-500">3</span>
              </div>
              <h3 className="font-semibold text-xl mb-4 text-gray-800">Express Delivery</h3>
              <p className="text-gray-600 leading-relaxed">
                A dedicated delivery partner brings your medicine within 30 minutes. Track in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;