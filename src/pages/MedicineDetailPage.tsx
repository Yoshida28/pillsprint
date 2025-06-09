import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Heart, 
  Share2, 
  Info, 
  Clock, 
  ArrowLeft, 
  Plus, 
  Minus,
  Sparkles,
  AlertTriangle,
  DollarSign,
  Pill,
  BarChart3,
  Star
} from 'lucide-react';
import { fetchMedicineById } from '../lib/supabase';
import { useCartStore } from '../store/cartStore';
import { analyzeMedicineComposition, compareMedicineOptions } from '../lib/gemini';

interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  emergency: boolean;
  manufacturer: string | null;
  dosage_form: string | null;
  strength: string | null;
  package_size: string | null;
  requires_prescription: boolean;
  stock: number;
  category: string;
  created_at: string;
  updated_at: string;
}

interface CompositionAnalysis {
  ingredients: Array<{
    name: string;
    purpose: string;
  }>;
  benefits: string[];
  sideEffects: string[];
  warnings: string[];
}

interface PriceComparison {
  estimatedPriceRange: string;
  alternatives: Array<{
    name: string;
    composition: string;
    price: string;
    availability: string;
  }>;
}

const MedicineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [compositionAnalysis, setCompositionAnalysis] = useState<CompositionAnalysis | null>(null);
  const [priceComparison, setPriceComparison] = useState<PriceComparison | null>(null);
  const [analyzingComposition, setAnalyzingComposition] = useState(false);
  const [comparingPrices, setComparingPrices] = useState(false);
  const addToCart = useCartStore(state => state.addItem);

  useEffect(() => {
    const loadMedicineDetails = async () => {
      if (!id) return;
      
      try {
        const data = await fetchMedicineById(id);
        if (data) {
          setMedicine(data);
        }
      } catch (error) {
        console.error('Error loading medicine details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMedicineDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!medicine) return;
    
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: medicine.id,
        name: medicine.name,
        price: medicine.price / 83, // Convert INR back to USD for cart consistency
        image_url: medicine.image_url,
        is_emergency: medicine.emergency,
        manufacturer: medicine.manufacturer || undefined,
        dosage_form: medicine.dosage_form || undefined
      });
    }
  };

  const analyzeComposition = async () => {
    if (!medicine) return;
    
    setAnalyzingComposition(true);
    
    try {
      // Create a mock composition string for analysis
      const compositionString = `${medicine.name} - ${medicine.strength || 'Standard strength'} ${medicine.dosage_form || 'Tablet'}`;
      const analysis = await analyzeMedicineComposition(compositionString);
      setCompositionAnalysis(analysis);
      setActiveTab('composition');
    } catch (error) {
      console.error('Error analyzing composition:', error);
    } finally {
      setAnalyzingComposition(false);
    }
  };

  const comparePrice = async () => {
    if (!medicine) return;
    
    setComparingPrices(true);
    
    try {
      const comparison = await compareMedicineOptions(medicine.name, medicine.description);
      setPriceComparison(comparison);
      setActiveTab('comparison');
    } catch (error) {
      console.error('Error comparing prices:', error);
    } finally {
      setComparingPrices(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50">
        <div className="spinner h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen pt-24 text-center bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Medicine Not Found</h1>
          <p className="text-gray-600 mb-6">The medicine you're looking for doesn't exist or has been removed.</p>
          <Link to="/medicines" className="btn-primary">
            Browse All Medicines
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link to="/medicines" className="inline-flex items-center text-gray-600 hover:text-primary-500 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Medicines
          </Link>
        </div>

        {/* Product Overview */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="p-8">
              <div className="aspect-square relative rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src={medicine.image_url || 'https://images.pexels.com/photos/159211/headache-pain-pills-medication-159211.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={medicine.name}
                  className="w-full h-full object-cover"
                />
                {medicine.emergency && (
                  <div className="absolute top-4 right-4 bg-accent-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-lg">
                    <Clock className="h-4 w-4 mr-1" />
                    Emergency Medicine
                  </div>
                )}
                
                {/* Stock indicator */}
                {medicine.stock < 20 && (
                  <div className="absolute bottom-4 left-4 bg-orange-500 text-white px-3 py-2 rounded-full text-sm font-medium">
                    Low Stock: {medicine.stock} left
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-8">
              {medicine.manufacturer && (
                <div className="text-sm text-gray-500 mb-2 font-medium">{medicine.manufacturer}</div>
              )}
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{medicine.name}</h1>
              
              <div className="flex items-center mb-6">
                <div className="text-3xl font-bold text-gray-900">₹{Math.round(medicine.price)}</div>
                {medicine.package_size && (
                  <div className="ml-3 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {medicine.package_size}
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">(4.2) • 127 reviews</span>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {medicine.dosage_form && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-sm text-gray-500 mb-1">Form</div>
                    <div className="font-semibold text-gray-800">{medicine.dosage_form}</div>
                  </div>
                )}
                
                {medicine.strength && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-sm text-gray-500 mb-1">Strength</div>
                    <div className="font-semibold text-gray-800">{medicine.strength}</div>
                  </div>
                )}
                
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">Prescription</div>
                  <div className="font-semibold text-gray-800">
                    {medicine.requires_prescription ? 'Required' : 'Not Required'}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">Delivery</div>
                  <div className="font-semibold text-gray-800">
                    {medicine.emergency ? 'Express (30 min)' : 'Standard (2-3 hrs)'}
                  </div>
                </div>
              </div>
              
              {/* Add to Cart */}
              <div className="flex items-center mb-8">
                <div className="flex items-center border-2 border-gray-200 rounded-xl mr-4">
                  <button
                    className="px-4 py-3 text-gray-600 hover:text-primary-500 transition-colors"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    className="px-4 py-3 text-gray-600 hover:text-primary-500 transition-colors"
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="bg-primary-500 hover:bg-primary-600 text-white flex-1 flex items-center justify-center px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Add to Cart • ₹{Math.round(medicine.price * quantity)}
                </button>
              </div>
              
              {/* Emergency Notice */}
              {medicine.emergency && (
                <div className="bg-accent-50 border-2 border-accent-200 rounded-xl p-6 mb-6">
                  <div className="flex">
                    <Clock className="h-6 w-6 text-accent-500 flex-shrink-0 mt-0.5" />
                    <div className="ml-4">
                      <h3 className="font-semibold text-accent-700 text-lg">Emergency Delivery Available</h3>
                      <p className="text-sm text-accent-600 mt-1">
                        This medicine qualifies for 30-minute express delivery. Order within the next 15 minutes to receive it by 3:30 PM.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex space-x-4 border-t border-gray-200 pt-6">
                <button className="flex items-center text-gray-600 hover:text-primary-500 transition-colors font-medium">
                  <Heart className="h-5 w-5 mr-2" />
                  Save for Later
                </button>
                <button className="flex items-center text-gray-600 hover:text-primary-500 transition-colors font-medium">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </button>
                <button
                  onClick={comparePrice}
                  disabled={comparingPrices}
                  className="flex items-center text-gray-600 hover:text-primary-500 transition-colors ml-auto font-medium"
                >
                  {comparingPrices ? 'Comparing...' : 'Compare Prices'}
                  <DollarSign className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Details Tabs */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                className={`px-8 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === 'description'
                    ? 'text-primary-500 border-b-2 border-primary-500 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button
                className={`px-8 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === 'composition'
                    ? 'text-primary-500 border-b-2 border-primary-500 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => {
                  setActiveTab('composition');
                  if (!compositionAnalysis && !analyzingComposition) {
                    analyzeComposition();
                  }
                }}
              >
                Composition & Analysis
              </button>
              <button
                className={`px-8 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === 'directions'
                    ? 'text-primary-500 border-b-2 border-primary-500 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('directions')}
              >
                Directions & Dosage
              </button>
              <button
                className={`px-8 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === 'comparison'
                    ? 'text-primary-500 border-b-2 border-primary-500 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => {
                  setActiveTab('comparison');
                  if (!priceComparison && !comparingPrices) {
                    comparePrice();
                  }
                }}
              >
                Price Comparison
              </button>
            </div>
          </div>

          <div className="p-8">
            {activeTab === 'description' && (
              <div>
                <h3 className="font-semibold text-2xl mb-6 text-gray-800">About {medicine.name}</h3>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">{medicine.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <Info className="h-5 w-5 mr-2" />
                      Category
                    </h4>
                    <p className="text-blue-700">{medicine.category}</p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Stock Status
                    </h4>
                    <p className="text-green-700">
                      {medicine.stock > 50 ? 'In Stock' : medicine.stock > 0 ? `Low Stock (${medicine.stock} left)` : 'Out of Stock'}
                    </p>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex">
                    <Info className="h-6 w-6 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="ml-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Important Information</h4>
                      <p className="text-sm text-blue-700">
                        Always read the package insert and follow the directions carefully. Consult with your healthcare provider before starting any new medication, especially if you have existing health conditions or are taking other medications.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'composition' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-2xl text-gray-800">Composition Analysis</h3>
                  {!analyzingComposition && !compositionAnalysis && (
                    <button
                      onClick={analyzeComposition}
                      className="text-sm text-primary-500 flex items-center hover:text-primary-600 transition-colors font-medium"
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      Analyze with AI
                    </button>
                  )}
                </div>
                
                {/* Basic composition info */}
                <div className="mb-8">
                  <div className="bg-gray-50 rounded-xl overflow-hidden">
                    <table className="min-w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                            Component
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 text-sm font-medium text-gray-800">
                            Active Ingredient
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {medicine.name} {medicine.strength}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-sm font-medium text-gray-800">
                            Dosage Form
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {medicine.dosage_form}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-sm font-medium text-gray-800">
                            Package Size
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {medicine.package_size}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* AI Analysis */}
                {analyzingComposition && (
                  <div className="bg-gray-50 p-8 rounded-xl animate-pulse">
                    <div className="flex items-center mb-4">
                      <Sparkles className="h-5 w-5 text-primary-500 mr-2" />
                      <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                  </div>
                )}
                
                {compositionAnalysis && (
                  <div className="bg-primary-50 p-8 rounded-xl border border-primary-100">
                    <div className="flex items-center mb-6">
                      <Sparkles className="h-6 w-6 text-primary-500 mr-3" />
                      <h3 className="font-semibold text-primary-700 text-xl">AI Composition Analysis</h3>
                    </div>
                    
                    {compositionAnalysis.ingredients && (
                      <div className="mb-6">
                        <h4 className="font-medium text-primary-800 mb-3 text-lg">Active Ingredients</h4>
                        <ul className="space-y-3">
                          {compositionAnalysis.ingredients.map((ingredient, index) => (
                            <li key={index} className="text-sm text-gray-700 flex">
                              <Pill className="h-5 w-5 text-primary-500 mt-0.5 mr-3 flex-shrink-0" />
                              <div>
                                <span className="font-medium text-gray-800">{ingredient.name}</span>: {ingredient.purpose}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {compositionAnalysis.benefits && (
                      <div className="mb-6">
                        <h4 className="font-medium text-primary-800 mb-3 text-lg">Potential Benefits</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          {compositionAnalysis.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-primary-500 mr-3 text-lg">•</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {compositionAnalysis.sideEffects && (
                      <div className="mb-6">
                        <h4 className="font-medium text-primary-800 mb-3 text-lg">Possible Side Effects</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          {compositionAnalysis.sideEffects.map((effect, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-accent-500 mr-3 text-lg">•</span>
                              {effect}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {compositionAnalysis.warnings && (
                      <div>
                        <h4 className="font-medium text-primary-800 mb-3 text-lg">Warnings & Precautions</h4>
                        <div className="bg-accent-50 p-4 rounded-lg border border-accent-100">
                          <div className="flex">
                            <AlertTriangle className="h-6 w-6 text-accent-500 flex-shrink-0" />
                            <ul className="space-y-2 text-sm text-gray-700 ml-4">
                              {compositionAnalysis.warnings.map((warning, index) => (
                                <li key={index}>{warning}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-6 text-xs text-gray-500">
                      Analysis generated by AI based on common medical information. Always refer to the official product information and consult healthcare professionals.
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'directions' && (
              <div>
                <h3 className="font-semibold text-2xl mb-6 text-gray-800">Directions for Use</h3>
                <div className="space-y-6 text-gray-700">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h4 className="font-semibold text-blue-800 mb-3">Adult Dosage</h4>
                    <p>For adults and children 12 years and over, take as directed by your healthcare provider or as indicated on the package. Do not exceed the recommended dosage.</p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <h4 className="font-semibold text-green-800 mb-3">Administration</h4>
                    <p>Take with water. May be taken with or without food. If stomach upset occurs, take with food.</p>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <div className="flex">
                      <AlertTriangle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div className="ml-4">
                        <h4 className="font-semibold text-yellow-800 mb-2">Warning</h4>
                        <p className="text-sm text-yellow-700">
                          Do not use if you have a history of allergic reaction to this product or any of its ingredients. If symptoms persist for more than 3 days or worsen, consult a doctor immediately.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'comparison' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-2xl text-gray-800">Price Comparison</h3>
                  {!comparingPrices && !priceComparison && (
                    <button
                      onClick={comparePrice}
                      className="text-sm text-primary-500 flex items-center hover:text-primary-600 transition-colors font-medium"
                    >
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Compare Prices
                    </button>
                  )}
                </div>
                
                {comparingPrices && (
                  <div className="bg-gray-50 p-8 rounded-xl animate-pulse">
                    <div className="flex items-center mb-4">
                      <DollarSign className="h-5 w-5 text-primary-500 mr-2" />
                      <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                  </div>
                )}
                
                {priceComparison && (
                  <div className="bg-primary-50 p-8 rounded-xl border border-primary-100">
                    <div className="flex items-center mb-6">
                      <DollarSign className="h-6 w-6 text-primary-500 mr-3" />
                      <h3 className="font-semibold text-primary-700 text-xl">Price Analysis & Alternatives</h3>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-medium text-primary-800 mb-3 text-lg">Price Range</h4>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-gray-700 mb-2">
                          <strong>Market Price Range:</strong> {priceComparison.estimatedPriceRange}
                        </p>
                        <p className="text-gray-700">
                          <strong>PillSprint Price:</strong> ₹{Math.round(medicine.price)}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-primary-800 mb-3 text-lg">Alternative Options</h4>
                      <div className="space-y-4">
                        {priceComparison.alternatives.map((alt, index) => (
                          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-gray-800">{alt.name}</h5>
                              <span className="text-gray-700 font-semibold">{alt.price}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{alt.composition}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">{alt.availability}</span>
                              <button className="text-xs text-primary-500 font-medium hover:text-primary-600 transition-colors">
                                View Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6 text-xs text-gray-500">
                      Price information is estimated based on market data and may vary. Always check with individual pharmacies for current pricing.
                    </div>
                  </div>
                )}
                
                {!comparingPrices && !priceComparison && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BarChart3 className="h-12 w-12 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">
                      Click "Compare Prices" to see price comparisons and alternatives for this medicine.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* AI Analysis CTA */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center">
            <div className="md:w-3/4 mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-white mb-3">
                Get AI Analysis of This Medicine
              </h3>
              <p className="text-primary-100 text-lg">
                Our AI can analyze this medicine's composition, suggest alternatives, check for interactions with other medications, and provide personalized insights.
              </p>
            </div>
            <div className="md:w-1/4 flex justify-center md:justify-end">
              <button 
                className="bg-white text-primary-600 hover:bg-primary-50 px-8 py-4 rounded-xl shadow-lg font-semibold flex items-center transition-all duration-200 hover:scale-105"
                onClick={() => analyzeComposition()}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Analyze Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetailPage;