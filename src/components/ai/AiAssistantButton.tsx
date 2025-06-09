import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, ExternalLink, Zap } from 'lucide-react';

const AiAssistantButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          className="btn-primary !p-0 h-14 w-14 rounded-full shadow-lg flex items-center justify-center"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Bot className="h-6 w-6" />
          )}
        </motion.button>
      </div>

      {/* Quick Access Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 bg-white rounded-lg shadow-xl p-4 w-72 z-40"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-3 text-primary-600 flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              AI Health Assistant
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              Ask about symptoms, get medicine recommendations, or analyze compositions.
            </p>
            
            <div className="space-y-3 mb-4">
              <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                <span className="text-primary-500 font-medium">Recommend medicine for headache</span>
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                <span className="text-primary-500 font-medium">Compare allergy medications</span>
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                <span className="text-primary-500 font-medium">Find alternatives to Ibuprofen</span>
              </button>
            </div>
            
            <div className="flex justify-between">
              <Link 
                to="/emergency" 
                className="flex items-center text-emergency-500 text-sm font-medium hover:text-emergency-600 transition-colors"
              >
                <Zap className="h-4 w-4 mr-1" />
                Emergency Options
              </Link>
              
              <Link 
                to="/ai-assistant" 
                className="flex items-center text-primary-500 text-sm font-medium hover:text-primary-600 transition-colors"
              >
                Full Consultation
                <ExternalLink className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiAssistantButton;