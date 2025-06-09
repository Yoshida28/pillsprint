import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, Clock, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useCartStore } from '../../store/cartStore';
import { searchMedicines } from '../../lib/supabase';
import Logo from '../shared/Logo';

interface SearchResult {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  manufacturer: string | null;
  dosage_form: string | null;
  description: string;
  emergency?: boolean;
}

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const totalItems = useCartStore(state => state.getTotalItems());

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Search functionality with debouncing
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setIsSearching(true);
        try {
          console.log('🔍 Header: Searching for:', searchQuery);
          const results = await searchMedicines(searchQuery);
          console.log('🔍 Header: Search results:', results?.length || 0);
          setSearchResults(results.slice(0, 8)); // Limit to 8 results
        } catch (error) {
          console.error('🔍 Header: Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/medicines?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleSearchResultClick = (medicineId: string) => {
    navigate(`/medicines/${medicineId}`);
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handlePopularSearchClick = (searchTerm: string) => {
    navigate(`/medicines?search=${encodeURIComponent(searchTerm)}`);
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const popularSearches = [
    'Paracetamol', 'Ibuprofen', 'Cough syrup', 'Fever medicine', 
    'Headache relief', 'Allergy tablets', 'Asthma inhaler', 'Antacid'
  ];

  return (
    <header className={cn(
      'fixed w-full z-50 transition-all duration-300 py-3',
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
        : 'bg-white/90 backdrop-blur-sm'
    )}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <Logo />
          <span className={cn(
            'ml-2 text-xl font-bold transition-all duration-300 group-hover:text-primary-600',
            isScrolled ? 'text-primary-600' : 'text-primary-500'
          )}>
            PillSprint
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/medicines" 
            className="text-gray-700 hover:text-primary-500 transition-colors font-medium relative group"
          >
            Medicines
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>
          </Link>
          <Link 
            to="/emergency" 
            className="text-accent-500 font-semibold hover:text-accent-600 transition-colors relative group"
          >
            Emergency
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-500 transition-all group-hover:w-full"></span>
          </Link>
          <Link 
            to="/ai-assistant" 
            className="text-gray-700 hover:text-primary-500 transition-colors font-medium relative group"
          >
            AI Assistant
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Search Button */}
          <button 
            onClick={() => setSearchOpen(true)} 
            className="p-2.5 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105"
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-gray-600" />
          </button>

          {/* Cart Link */}
          <Link 
            to="/cart" 
            className="p-2.5 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105 relative group"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5 text-gray-600 group-hover:text-primary-500" />
            {totalItems > 0 && (
              <motion.span
                className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {totalItems}
              </motion.span>
            )}
          </Link>

          {/* User Profile Link */}
          <Link 
            to="/profile" 
            className="p-2.5 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105"
            aria-label="Profile"
          >
            <User className="h-5 w-5 text-gray-600" />
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2.5 hover:bg-gray-100 rounded-full transition-all duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="fixed inset-0 bg-white z-50 md:hidden pt-16"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            >
              <nav className="flex flex-col items-center justify-center h-full space-y-8">
                <Link 
                  to="/medicines" 
                  className="text-2xl font-medium text-gray-700 hover:text-primary-500 transition-colors"
                >
                  Medicines
                </Link>
                <Link 
                  to="/emergency" 
                  className="text-2xl font-medium text-accent-500 hover:text-accent-600 transition-colors"
                >
                  Emergency
                </Link>
                <Link 
                  to="/ai-assistant" 
                  className="text-2xl font-medium text-gray-700 hover:text-primary-500 transition-colors"
                >
                  AI Assistant
                </Link>
                <Link 
                  to="/profile" 
                  className="text-2xl font-medium text-gray-700 hover:text-primary-500 transition-colors"
                >
                  Profile
                </Link>
                <Link 
                  to="/cart" 
                  className="text-2xl font-medium text-gray-700 hover:text-primary-500 transition-colors"
                >
                  Cart ({totalItems})
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSearchOpen(false)}
            >
              <motion.div 
                className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
                initial={{ y: -20, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -20, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Search Medicines</h3>
                    <button 
                      onClick={() => setSearchOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSearch} className="relative mb-6">
                    <div className="relative">
                      <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search for medicines, symptoms, or conditions..."
                        className="w-full py-4 pl-14 pr-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg bg-gray-50 focus:bg-white transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                      {isSearching && (
                        <div className="absolute right-4 top-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                        </div>
                      )}
                    </div>
                  </form>

                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-medium mr-3">
                          {searchResults.length} Results
                        </span>
                        Search Results
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                        {searchResults.map((result, index) => (
                          <motion.button
                            key={result.id}
                            onClick={() => handleSearchResultClick(result.id)}
                            className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-primary-50 hover:to-primary-100 rounded-xl p-4 transition-all duration-300 text-left group hover:shadow-lg border border-gray-200 hover:border-primary-200"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            whileHover={{ y: -3, scale: 1.02 }}
                          >
                            <div className="flex items-start space-x-4">
                              <div className="w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-gray-200">
                                <img 
                                  src={result.image_url || 'https://images.pexels.com/photos/159211/headache-pain-pills-medication-159211.jpeg?auto=compress&cs=tinysrgb&w=800'} 
                                  alt={result.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <h5 className="font-bold text-gray-800 group-hover:text-primary-700 transition-colors text-lg leading-tight">
                                    {result.name}
                                  </h5>
                                  {result.emergency && (
                                    <span className="bg-accent-500 text-white text-xs px-2 py-1 rounded-full ml-2 flex items-center font-medium shadow-sm">
                                      <Clock className="h-3 w-3 mr-1" />
                                      Emergency
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2 font-medium">
                                  {result.manufacturer || 'Generic'} • {result.dosage_form || 'Tablet'}
                                </p>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                                  {result.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="text-2xl font-bold text-primary-600">
                                    ₹{Math.round(result.price)}
                                  </div>
                                  <div className="flex items-center bg-white rounded-lg px-2 py-1 shadow-sm">
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <Star 
                                          key={i} 
                                          className={`h-3 w-3 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                                        />
                                      ))}
                                    </div>
                                    <span className="text-xs text-gray-500 ml-1 font-medium">(4.2)</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                      
                      {searchQuery.trim() && (
                        <div className="mt-6 text-center">
                          <button
                            onClick={handleSearch}
                            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center mx-auto hover:scale-105 shadow-lg"
                          >
                            View all results for "{searchQuery}"
                            <Search className="h-5 w-5 ml-2" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Loading State */}
                  {isSearching && searchQuery.length > 2 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-700 mb-4">Searching...</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(4)].map((_, index) => (
                          <div key={index} className="bg-gray-100 rounded-xl p-4 animate-pulse">
                            <div className="flex items-start space-x-4">
                              <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                              <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded mb-3 w-1/2"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Results Message */}
                  {searchQuery.length > 2 && !isSearching && searchResults.length === 0 && (
                    <div className="mb-6 text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="h-12 w-12 text-gray-400" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-700 mb-2">No medicines found</h4>
                      <p className="text-gray-500 text-lg mb-4">
                        We couldn't find any medicines matching "{searchQuery}"
                      </p>
                      <p className="text-sm text-gray-400 mb-6">
                        Try searching with different keywords or check spelling
                      </p>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                      >
                        Clear Search
                      </button>
                    </div>
                  )}

                  {/* Popular Searches */}
                  {(!searchQuery || searchQuery.length <= 2) && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-4">Popular Searches</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {popularSearches.map((search) => (
                          <button 
                            key={search}
                            onClick={() => handlePopularSearchClick(search)}
                            className="px-4 py-3 bg-gradient-to-r from-primary-50 to-primary-100 hover:from-primary-100 hover:to-primary-200 rounded-xl text-sm transition-all duration-200 font-medium text-primary-700 hover:text-primary-800 border border-primary-200 hover:border-primary-300 hover:scale-105"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;