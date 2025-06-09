import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Clock, Zap, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import FeaturedMedicines from '../components/medicine/FeaturedMedicines';
import EmergencyCategories from '../components/emergency/EmergencyCategories';
import AiPromptSection from '../components/ai/AiPromptSection';
import TestimonialSection from '../components/sections/TestimonialSection';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('🏠 HomePage: Navigating to search:', searchQuery);
      navigate(`/medicines?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handlePopularSearchClick = (searchTerm: string) => {
    console.log('🏠 HomePage: Popular search clicked:', searchTerm);
    navigate(`/medicines?search=${encodeURIComponent(searchTerm)}`);
  };

  const popularSearches = [
    'Paracetamol', 'Cough syrup', 'Fever medicine', 'Headache relief'
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-100 pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div 
              className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="h-4 w-4 mr-2" />
                30-Minute Emergency Delivery
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Emergency Medicine <span className="text-primary-500">When You Need It Most</span>
              </h1>
              
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Rapid delivery of critical medications with AI-powered recommendations. Get the right medicine, right away, delivered to your doorstep.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link 
                  to="/emergency" 
                  className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center hover:scale-105 shadow-lg"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Emergency Medicine
                </Link>
                <Link 
                  to="/ai-assistant" 
                  className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center hover:scale-105 shadow-lg"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  AI Consultation
                </Link>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative">
                <div className="bg-white rounded-2xl shadow-xl p-2 flex items-center border border-gray-100">
                  <Search className="h-6 w-6 text-gray-400 ml-4 mr-3" />
                  <input 
                    type="text" 
                    placeholder="Search for medicines, symptoms, or conditions..." 
                    className="flex-grow py-4 px-2 focus:outline-none text-gray-700 text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors"
                    disabled={!searchQuery.trim()}
                  >
                    Search
                  </button>
                </div>
                
                {/* Popular Searches */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-sm text-gray-500 mr-2">Popular:</span>
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      type="button"
                      onClick={() => handlePopularSearchClick(search)}
                      className="text-sm text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1 rounded-full transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </form>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="PillSprint Emergency Medicine Delivery" 
                  className="rounded-3xl shadow-2xl w-full object-cover h-[500px]"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                      <Clock className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Fast Delivery</div>
                      <div className="text-sm text-gray-600">Within 30 minutes</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-primary-500">PillSprint</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of medicine delivery with our cutting-edge technology and commitment to your health.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-3xl text-center group hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-primary-500 rounded-2xl h-16 w-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">30-Minute Delivery</h3>
              <p className="text-gray-600 leading-relaxed">
                Emergency medicines delivered to your doorstep within 30 minutes in selected areas. No more waiting when every minute counts.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-8 rounded-3xl text-center group hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-secondary-500 rounded-2xl h-16 w-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">AI-Powered Assistance</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI assistant helps identify the right medicine based on your symptoms and medical history with personalized recommendations.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-accent-50 to-accent-100 p-8 rounded-3xl text-center group hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-accent-500 rounded-2xl h-16 w-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ShieldAlert className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Verified Medications</h3>
              <p className="text-gray-600 leading-relaxed">
                All medicines are sourced from authorized distributors and verified for authenticity. Your safety is our top priority.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Emergency Categories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Emergency Medicine Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quick access to essential medications for common emergency situations. Get the help you need, when you need it most.
            </p>
          </div>
          
          <EmergencyCategories />
          
          <div className="text-center mt-12">
            <Link 
              to="/emergency" 
              className="inline-flex items-center bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              View All Emergency Medicines
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Medicines */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Medicines
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Frequently purchased medications with detailed information and competitive prices in Indian Rupees.
            </p>
          </div>
          
          <FeaturedMedicines />
          
          <div className="text-center mt-12">
            <Link 
              to="/medicines" 
              className="inline-flex items-center bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Browse All Medicines
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <AiPromptSection />

      {/* Testimonials */}
      <TestimonialSection />
      
      {/* Download App CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12">
              <h2 className="text-4xl font-bold mb-6">
                Download the PillSprint App
              </h2>
              <p className="text-primary-100 mb-8 text-xl leading-relaxed">
                Get faster access to emergency medicines, AI consultations, and real-time order tracking. Available for iOS and Android with exclusive app-only features.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#" className="bg-black hover:bg-gray-900 text-white px-6 py-4 rounded-xl flex items-center transition-all duration-200 hover:scale-105">
                  <div className="mr-4">
                    <svg className="h-10 w-10" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5M13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.09 6.7 11.95 6.61C11.81 5.46 12.39 4.26 13 3.5Z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs">Download on the</div>
                    <div className="text-lg font-semibold">App Store</div>
                  </div>
                </a>
                <a href="#" className="bg-black hover:bg-gray-900 text-white px-6 py-4 rounded-xl flex items-center transition-all duration-200 hover:scale-105">
                  <div className="mr-4">
                    <svg className="h-10 w-10" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs">GET IT ON</div>
                    <div className="text-lg font-semibold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img 
                src="https://images.pexels.com/photos/3912976/pexels-photo-3912976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="PillSprint Mobile App" 
                className="rounded-3xl shadow-2xl max-w-full md:max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;