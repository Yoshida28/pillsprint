import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Clock, 
  ChevronRight,
  MapPin, 
  CreditCard,
  Check 
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const CartPage: React.FC = () => {
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice } = useCartStore();
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  
  const handlePromoCode = () => {
    if (promoCode.toLowerCase() === 'first10') {
      setPromoApplied(true);
    }
  };
  
  // Calculate cart totals
  const subtotal = getTotalPrice() * 83; // Convert to INR
  const hasEmergencyItems = items.some(item => item.is_emergency);
  const deliveryFee = deliveryOption === 'express' ? 99 : (deliveryOption === 'emergency' ? 199 : 49);
  const discount = promoApplied ? subtotal * 0.1 : 0; // 10% discount
  const total = subtotal + deliveryFee - discount;
  
  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Cart</h1>
        
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Looks like you haven't added any medicines to your cart yet.
            </p>
            <Link to="/medicines" className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105">
              Browse Medicines
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items - Left Column */}
            <div className="lg:col-span-2">
              <motion.div 
                className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-8">
                  <h2 className="text-xl font-semibold mb-6 text-gray-800">Cart Items ({getTotalItems()})</h2>
                  
                  <div className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <div key={item.id} className="py-6 flex items-center">
                        {/* Item Image */}
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <img 
                            src={item.image_url || 'https://images.pexels.com/photos/159211/headache-pain-pills-medication-159211.jpeg?auto=compress&cs=tinysrgb&w=800'} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Item Details */}
                        <div className="ml-6 flex-grow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                              {item.is_emergency && (
                                <span className="inline-flex items-center text-xs text-accent-500 mt-1 font-medium">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Emergency Medicine
                                </span>
                              )}
                              <p className="text-sm text-gray-500 mt-1">
                                {item.manufacturer} • {item.dosage_form}
                              </p>
                            </div>
                            <span className="font-bold text-gray-900 text-xl">
                              ₹{Math.round((item.price * 83) * item.quantity)}
                            </span>
                          </div>
                          
                          {/* Quantity Control */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border-2 border-gray-200 rounded-xl">
                              <button
                                className="px-4 py-2 text-gray-600 hover:text-primary-500 transition-colors"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-12 text-center font-semibold">{item.quantity}</span>
                              <button
                                className="px-4 py-2 text-gray-600 hover:text-primary-500 transition-colors"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <button
                              className="text-gray-500 hover:text-accent-500 transition-colors p-2 rounded-lg hover:bg-gray-100"
                              onClick={() => removeItem(item.id)}
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <Link to="/medicines" className="text-primary-500 hover:text-primary-600 transition-colors font-medium flex items-center">
                      &larr; Continue Shopping
                    </Link>
                  </div>
                </div>
              </motion.div>
              
              {/* Delivery Options */}
              <motion.div
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="p-8">
                  <h2 className="text-xl font-semibold mb-6 text-gray-800">Delivery Options</h2>
                  
                  <div className="space-y-4">
                    <label className="block">
                      <div className="flex items-start p-4 border-2 rounded-xl border-gray-200 hover:border-primary-300 cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name="delivery"
                          value="standard"
                          checked={deliveryOption === 'standard'}
                          onChange={() => setDeliveryOption('standard')}
                          className="mt-1 mr-4"
                        />
                        <div>
                          <div className="font-semibold text-gray-800">Standard Delivery</div>
                          <div className="text-sm text-gray-500">Delivered within 2-3 hours</div>
                          <div className="text-sm font-semibold text-gray-800 mt-1">₹49</div>
                        </div>
                      </div>
                    </label>
                    
                    <label className="block">
                      <div className="flex items-start p-4 border-2 rounded-xl border-gray-200 hover:border-primary-300 cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name="delivery"
                          value="express"
                          checked={deliveryOption === 'express'}
                          onChange={() => setDeliveryOption('express')}
                          className="mt-1 mr-4"
                        />
                        <div>
                          <div className="font-semibold text-gray-800">Express Delivery</div>
                          <div className="text-sm text-gray-500">Delivered within 1 hour</div>
                          <div className="text-sm font-semibold text-gray-800 mt-1">₹99</div>
                        </div>
                      </div>
                    </label>
                    
                    {hasEmergencyItems && (
                      <label className="block">
                        <div className="flex items-start p-4 border-2 rounded-xl border-accent-200 hover:border-accent-300 bg-accent-50 cursor-pointer transition-colors">
                          <input
                            type="radio"
                            name="delivery"
                            value="emergency"
                            checked={deliveryOption === 'emergency'}
                            onChange={() => setDeliveryOption('emergency')}
                            className="mt-1 mr-4"
                          />
                          <div>
                            <div className="flex items-center">
                              <span className="font-semibold text-accent-700">Emergency Delivery</span>
                              <span className="ml-2 bg-accent-500 text-white text-xs px-2 py-0.5 rounded-full">Recommended</span>
                            </div>
                            <div className="text-sm text-accent-600">Delivered within 30 minutes</div>
                            <div className="text-sm font-semibold text-accent-700 mt-1">₹199</div>
                          </div>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Order Summary - Right Column */}
            <div>
              <motion.div
                className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-24"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="p-8">
                  <h2 className="text-xl font-semibold mb-6 text-gray-800">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold text-gray-800">₹{Math.round(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-semibold text-gray-800">₹{deliveryFee}</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount (10%)</span>
                        <span>-₹{Math.round(discount)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between font-bold text-xl text-gray-900">
                        <span>Total</span>
                        <span>₹{Math.round(total)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Promo Code */}
                  <div className="mt-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Promo Code
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value);
                          setPromoApplied(false);
                        }}
                      />
                      <button
                        className="bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-3 rounded-r-xl font-semibold transition-colors"
                        onClick={handlePromoCode}
                      >
                        Apply
                      </button>
                    </div>
                    {promoApplied && (
                      <div className="mt-3 text-green-600 text-sm flex items-center">
                        <Check className="h-4 w-4 mr-1" />
                        Promo code applied successfully!
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Try "FIRST10" for 10% off your first order
                    </p>
                  </div>
                  
                  {/* Checkout Button */}
                  <div className="mt-8">
                    <button className="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center text-lg shadow-lg">
                      Proceed to Checkout
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </button>
                  </div>
                  
                  {/* Delivery Address */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Delivery Address
                    </h3>
                    <div className="flex">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">
                        1234 Main St, Apt 5B, Mumbai, Maharashtra 400001
                      </span>
                    </div>
                  </div>
                  
                  {/* Payment Methods */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Payment Methods
                    </h3>
                    <div className="flex">
                      <CreditCard className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">
                        Visa ending in 4242
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;