import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ShoppingBag, Star, Clock, RefreshCw, AlertCircle, Database } from 'lucide-react';
import { fetchMedicines, searchMedicines } from '../lib/supabase';
import { useCartStore } from '../store/cartStore';
import { Link, useSearchParams } from 'react-router-dom';

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

const MedicinesPage: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    emergency: false,
    priceRange: [0, 500],
    categories: [] as string[],
    dosageForms: [] as string[]
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams] = useSearchParams();
  const addToCart = useCartStore(state => state.addItem);

  const loadMedicines = async () => {
    console.log('💊 MedicinesPage: Starting to load medicines...');
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchMedicines();
      console.log('💊 MedicinesPage: Received data:', data?.length || 0, 'medicines');
      
      if (data && data.length > 0) {
        setMedicines(data);
        setFilteredMedicines(data);
        console.log(`💊 MedicinesPage: Successfully loaded ${data.length} medicines`);
      } else {
        console.log('💊 MedicinesPage: No medicines received');
        setMedicines([]);
        setFilteredMedicines([]);
        setError('No medicines found in the database. Please add some medicines first.');
      }
    } catch (error) {
      console.error('💊 MedicinesPage: Error loading medicines:', error);
      setError(error instanceof Error ? error.message : 'Failed to load medicines from database');
      setMedicines([]);
      setFilteredMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setFilteredMedicines(medicines);
      return;
    }

    console.log('🔍 MedicinesPage: Performing search for:', query);
    setSearching(true);
    
    try {
      const results = await searchMedicines(query);
      console.log('🔍 MedicinesPage: Search results:', results?.length || 0);
      setFilteredMedicines(results);
    } catch (error) {
      console.error('🔍 MedicinesPage: Search error:', error);
      // Fallback to local filtering if search fails
      const localResults = medicines.filter(medicine =>
        medicine.name.toLowerCase().includes(query.toLowerCase()) ||
        medicine.description.toLowerCase().includes(query.toLowerCase()) ||
        (medicine.manufacturer && medicine.manufacturer.toLowerCase().includes(query.toLowerCase())) ||
        medicine.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMedicines(localResults);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  // Handle URL search params
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
      performSearch(searchParam);
    }
  }, [searchParams, medicines]);

  // Handle search query changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, medicines]);

  // Apply filters
  useEffect(() => {
    let result = searchQuery ? filteredMedicines : medicines;

    // Emergency filter
    if (filters.emergency) {
      result = result.filter(medicine => medicine.emergency);
    }

    // Price range filter
    result = result.filter(
      medicine => medicine.price >= filters.priceRange[0] && medicine.price <= filters.priceRange[1]
    );

    // Dosage form filters
    if (filters.dosageForms.length > 0) {
      result = result.filter(
        medicine => medicine.dosage_form && filters.dosageForms.includes(medicine.dosage_form)
      );
    }

    if (!searchQuery) {
      setFilteredMedicines(result);
    }
  }, [filters, medicines]);

  const handleAddToCart = (medicine: Medicine) => {
    addToCart({
      id: medicine.id,
      name: medicine.name,
      price: medicine.price / 83, // Convert back to USD for cart consistency
      image_url: medicine.image_url,
      is_emergency: medicine.emergency,
      manufacturer: medicine.manufacturer || undefined,
      dosage_form: medicine.dosage_form || undefined
    });
  };

  // Get unique dosage forms for filter options
  const dosageForms = [...new Set(medicines.map(m => m.dosage_form).filter(Boolean))];

  if (error) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Database className="h-12 w-12 text-red-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Database Connection Issue</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">{error}</p>
            <div className="space-y-4">
              <button 
                onClick={loadMedicines}
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl transition-colors font-medium flex items-center mx-auto"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Retry Connection
              </button>
              <div className="text-sm text-gray-500">
                <p>If this issue persists, please check:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Supabase URL and API key configuration</li>
                  <li>• Database table structure and data</li>
                  <li>• Network connectivity</li>
                  <li>• Row Level Security policies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Filter Sidebar - Desktop */}
          <aside className="w-full md:w-72 hidden md:block">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold text-xl mb-6 text-gray-800">Filters</h3>

              {/* Emergency Only */}
              <div className="mb-8">
                <label className="inline-flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-primary-500 rounded border-2 border-gray-300 focus:ring-primary-500"
                    checked={filters.emergency}
                    onChange={(e) =>
                      setFilters({ ...filters, emergency: e.target.checked })
                    }
                  />
                  <span className="ml-3 text-gray-700 group-hover:text-gray-900 font-medium">
                    Emergency Only
                  </span>
                </label>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-800 mb-4">Price Range (₹)</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>₹{filters.priceRange[0]}</span>
                    <span>₹{filters.priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="25"
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        priceRange: [filters.priceRange[0], parseInt(e.target.value)],
                      })
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* Dosage Form */}
              {dosageForms.length > 0 && (
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-800 mb-4">Dosage Form</h4>
                  <div className="space-y-3">
                    {dosageForms.map((form) => (
                      <label key={form} className="inline-flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-primary-500 rounded border-2 border-gray-300 focus:ring-primary-500"
                          checked={filters.dosageForms.includes(form)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({
                                ...filters,
                                dosageForms: [...filters.dosageForms, form],
                              });
                            } else {
                              setFilters({
                                ...filters,
                                dosageForms: filters.dosageForms.filter((f) => f !== form),
                              });
                            }
                          }}
                        />
                        <span className="ml-3 text-gray-700 group-hover:text-gray-900 text-sm">
                          {form}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Reset Filters */}
              <button
                onClick={() => {
                  setFilters({
                    emergency: false,
                    priceRange: [0, 500],
                    categories: [],
                    dosageForms: [],
                  });
                }}
                className="w-full px-4 py-3 text-sm text-primary-600 border-2 border-primary-200 rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 font-medium"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search medicines, symptoms, or brands..."
                  className="w-full py-4 pl-12 pr-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searching && (
                  <div className="absolute right-4 top-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowFilters(true)}
                className="md:hidden bg-white border border-gray-200 px-6 py-4 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </button>
            </div>

            {/* Results Info */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">All Medicines</h1>
                <p className="text-gray-600">
                  {searchQuery ? (
                    <>Showing {filteredMedicines.length} results for "{searchQuery}"</>
                  ) : (
                    <>Showing {filteredMedicines.length} of {medicines.length} products</>
                  )}
                </p>
              </div>
            </div>

            {/* Medicine Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(12)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white animate-pulse rounded-2xl h-80 shadow-sm"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMedicines.map((medicine) => (
                  <motion.div
                    key={medicine.id}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }}
                  >
                    <Link to={`/medicines/${medicine.id}`}>
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={medicine.image_url || 'https://images.pexels.com/photos/159211/headache-pain-pills-medication-159211.jpeg?auto=compress&cs=tinysrgb&w=800'}
                          alt={medicine.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {medicine.emergency && (
                          <div className="absolute top-3 right-3 bg-accent-500 text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center shadow-lg">
                            <Clock className="h-3 w-3 mr-1" />
                            Emergency
                          </div>
                        )}
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
                      <div className="text-xs text-gray-500 mb-2 font-medium">
                        {medicine.manufacturer || 'Generic'} • {medicine.dosage_form || 'Tablet'}
                      </div>
                      
                      <Link to={`/medicines/${medicine.id}`}>
                        <h2 className="font-semibold text-gray-800 hover:text-primary-600 transition-colors text-lg mb-2 line-clamp-1">
                          {medicine.name}
                        </h2>
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
                      
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-gray-900">
                          ₹{Math.round(medicine.price)}
                        </div>
                        <button 
                          onClick={() => handleAddToCart(medicine)}
                          disabled={medicine.stock === 0}
                          className={`px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center font-medium hover:scale-105 shadow-sm ${
                            medicine.stock === 0 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                              : 'bg-primary-500 hover:bg-primary-600 text-white'
                          }`}
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          {medicine.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredMedicines.length === 0 && medicines.length > 0 && (
              <div className="text-center py-16">
                <div className="bg-gray-100 h-32 w-32 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-16 w-16 text-gray-400" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">No medicines found</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {searchQuery 
                    ? `We couldn't find any medicines matching "${searchQuery}". Try adjusting your search terms or filters.`
                    : "We couldn't find any medicines matching your current filters. Try adjusting your filter criteria."
                  }
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({
                      emergency: false,
                      priceRange: [0, 500],
                      categories: [],
                      dosageForms: [],
                    });
                  }}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl transition-colors font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* No medicines in database */}
            {!loading && medicines.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-gray-100 h-32 w-32 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Database className="h-16 w-16 text-gray-400" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">No medicines available</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  There are no medicines in the database yet. Please add some medicines to get started.
                </p>
                <button
                  onClick={loadMedicines}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl transition-colors font-medium flex items-center mx-auto"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Refresh
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-semibold text-xl text-gray-800">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Mobile filter content - same as desktop */}
                <div className="space-y-8">
                  {/* Emergency Only */}
                  <div>
                    <label className="inline-flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-primary-500 rounded border-2 border-gray-300 focus:ring-primary-500"
                        checked={filters.emergency}
                        onChange={(e) =>
                          setFilters({ ...filters, emergency: e.target.checked })
                        }
                      />
                      <span className="ml-3 text-gray-700 group-hover:text-gray-900 font-medium">
                        Emergency Only
                      </span>
                    </label>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4">Price Range (₹)</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>₹{filters.priceRange[0]}</span>
                        <span>₹{filters.priceRange[1]}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="500"
                        step="25"
                        value={filters.priceRange[1]}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            priceRange: [filters.priceRange[0], parseInt(e.target.value)],
                          })
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Dosage Form */}
                  {dosageForms.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-4">Dosage Form</h4>
                      <div className="space-y-3">
                        {dosageForms.map((form) => (
                          <label key={form} className="inline-flex items-center cursor-pointer group">
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-primary-500 rounded border-2 border-gray-300 focus:ring-primary-500"
                              checked={filters.dosageForms.includes(form)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFilters({
                                    ...filters,
                                    dosageForms: [...filters.dosageForms, form],
                                  });
                                } else {
                                  setFilters({
                                    ...filters,
                                    dosageForms: filters.dosageForms.filter((f) => f !== form),
                                  });
                                }
                              }}
                            />
                            <span className="ml-3 text-gray-700 group-hover:text-gray-900 text-sm">
                              {form}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Apply and Reset Buttons */}
                <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setFilters({
                        emergency: false,
                        priceRange: [0, 500],
                        categories: [],
                        dosageForms: [],
                      });
                    }}
                    className="flex-1 px-4 py-3 text-sm text-primary-600 border-2 border-primary-200 rounded-xl hover:bg-primary-50 transition-colors font-medium"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="flex-1 px-4 py-3 text-sm text-white bg-primary-500 rounded-xl hover:bg-primary-600 transition-colors font-medium"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MedicinesPage;