import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Heart, Zap } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { icon: Pill, text: "Loading medicines...", color: "text-primary-500" },
    { icon: Heart, text: "Preparing health assistance...", color: "text-accent-500" },
    { icon: Zap, text: "Ready for emergency delivery!", color: "text-emergency-500" }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setTimeout(onComplete, 800);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete, steps.length]);

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center text-white">
        {/* Logo */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <Pill size={40} className="text-primary-500 transform rotate-45" />
          </div>
          <h1 className="text-4xl font-bold mb-2">PillSprint</h1>
          <p className="text-primary-100 text-lg">Emergency Medicine Delivery</p>
        </motion.div>

        {/* Loading Steps */}
        <div className="space-y-4 mb-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={`flex items-center justify-center space-x-3 ${
                index === currentStep ? 'opacity-100' : 'opacity-30'
              }`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ 
                x: 0, 
                opacity: index <= currentStep ? 1 : 0.3 
              }}
              transition={{ delay: index * 0.2 }}
            >
              <step.icon 
                className={`h-6 w-6 ${index === currentStep ? step.color : 'text-white'}`} 
              />
              <span className="text-lg">{step.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-white bg-opacity-20 rounded-full mx-auto mb-8">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Project Attribution */}
        <motion.div
          className="text-primary-100 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <p>A project by <span className="font-semibold text-white">Priyakshi Baruah</span></p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;