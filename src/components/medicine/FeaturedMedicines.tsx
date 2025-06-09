import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Clock, Star, RefreshCw, AlertCircle, Database } from 'lucide-react';
import { fetchMedicines } from '../../lib/supabase';
import { useCartStore } from '../../store/cartStore';

// Types
interface Medicine {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  emergency: boolean;
  manufacturer: string | null;
  dosage_form: string | null;
  description: string;
  stock: number;
  category: string;
}

const MedicineCard: React.FC<{ medicine: Medicine }> = ({ medicine }) => {
  const addItem = useCartStore(state => state.addItem);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: medicine.id,
      name: medicine.name,
      price: medicine.price / 83, // Convert INR back to USD for cart consistency
      image_url: medicine.image_url,
      is_emergency: medicine.emergency,
      manufacturer: medicine.manufacturer || undefined,
      dosage_form: medicine.dosage_form || undefined
    });
  };

  return (
    <motion.div
      className="medicine-card relative flex flex-col h-full overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {medicine.emergency && (
        <div className="absolute top-3 right-3 bg-accent-500 text-white text-xs px-3 py-1.5 rounded-full z-10 flex items-center font-medium shadow-lg">
          <Clock className="h-3 w-3 mr-1" />
          Emergency
        </div>
      )}
      
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={medicine.image_url || 'https://images.pexels.com/photos/159211/headache-pain-pills-medication-159211.jpeg?auto=compress&cs=tinysrgb&w=800'} 
          alt={medicine.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <button className="absolute top-3 left-3 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all">
          <Heart className="h-4 w-4 text-gray-500 hover:text-accent-500" />
        </button>
        
        {/* Stock indicator */}
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
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex-grow">
          <div className="text-xs text-gray-500 mb-2 font-medium">
            {medicine.manufacturer || 'Generic'} • {medicine.dosage_form || 'Tablet'}
          </div>
          <Link to={`/medicines/${medicine.id}`} className="block">
            <h3 className="font-semibold text-gray-800 hover:text-primary-600 transition-colors text-lg mb-2 line-clamp-2">
              {medicine.name}
            </h3>
          </Link>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {medicine.description}
          </p>
          
          <div className="flex items-center mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-2">(127 reviews)</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="text-2xl font-bold text-gray-900">₹{Math.round(medicine.price)}</div>
          <button 
            onClick={handleAddToCart}
            disabled={medicine.stock === 0}
            className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-sm ${
              medicine.stock === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-primary-500 hover:bg-primary-600 text-white'
            }`}
          >
            <ShoppingBag className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturedMedicines: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMedicines = async () => {
    console.log('🏠 FeaturedMedicines: Starting to load medicines...');
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchMedicines();
      console.log('🏠 FeaturedMedicines: Received data:', data?.length || 0, 'medicines');
      
      if (data && data.length > 0) {
        setMedicines(data.slice(0, 8)); // Only show first 8 medicines
        console.log(`🏠 FeaturedMedicines: Successfully loaded ${data.length} medicines`);
      } else {
        console.log('🏠 FeaturedMedicines: No medicines received');
        setError('No medicines available');
        setMedicines([]);
      }
    } catch (error) {
      console.error('🏠 FeaturedMedicines: Error loading medicines:', error);
      setError(error instanceof Error ? error.message : 'Failed to load medicines');
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);
  
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Database className="h-12 w-12 text-red-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Unable to load medicines</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button 
          onClick={loadMedicines}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center mx-auto"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div 
            key={index}
            className="bg-gray-100 animate-pulse rounded-2xl h-80"
          ></div>
        ))}
      </div>
    );
  }

  if (medicines.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Database className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No medicines available</h3>
        <p className="text-gray-500 mb-4">There are no medicines in the database yet.</p>
        <Link 
          to="/medicines"
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center"
        >
          Browse All Medicines
        </Link>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {medicines.map((medicine) => (
        <MedicineCard 
          key={medicine.id} 
          medicine={medicine} 
        />
      ))}
    </div>
  );
};

export default FeaturedMedicines;