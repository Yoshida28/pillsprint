import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Droplet, Thermometer, Settings as Lungs, Pill, Merge as Allergens, Clock3, Ban as Bandage } from 'lucide-react';

const categories = [
  {
    id: 'cardiac',
    name: 'Cardiac Emergencies',
    icon: Heart,
    color: 'accent-500',
    bgColor: 'accent-100',
    description: 'Emergency medicines for heart conditions'
  },
  {
    id: 'allergic',
    name: 'Allergic Reactions',
    icon: Allergens,
    color: 'secondary-500',
    bgColor: 'secondary-100',
    description: 'Quick-acting allergy medications'
  },
  {
    id: 'respiratory',
    name: 'Respiratory',
    icon: Lungs,
    color: 'primary-500',
    bgColor: 'primary-100',
    description: 'Asthma inhalers and breathing treatments'
  },
  {
    id: 'pain',
    name: 'Pain Relief',
    icon: Pill,
    color: 'emergency-500',
    bgColor: 'emergency-100',
    description: 'Fast-acting pain relief medications'
  },
  {
    id: 'fever',
    name: 'Fever Reducers',
    icon: Thermometer,
    color: 'yellow-600',
    bgColor: 'yellow-100',
    description: 'Medications to reduce fever quickly'
  },
  {
    id: 'diabetes',
    name: 'Diabetes',
    icon: Droplet,
    color: 'blue-600',
    bgColor: 'blue-100',
    description: 'Insulin and glucose management'
  },
  {
    id: 'first-aid',
    name: 'First Aid',
    icon: Bandage,
    color: 'red-600',
    bgColor: 'red-100',
    description: 'Essential first aid medications'
  },
  {
    id: 'time-sensitive',
    name: 'Time-Sensitive',
    icon: Clock3,
    color: 'purple-600',
    bgColor: 'purple-100',
    description: 'Medications that must be taken quickly'
  }
];

const EmergencyCategories: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <Link 
            to={`/emergency/${category.id}`}
            className={`block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 h-full`}
          >
            <div className={`bg-${category.bgColor} rounded-full h-12 w-12 flex items-center justify-center mb-3`}>
              <category.icon className={`h-6 w-6 text-${category.color}`} />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>
            <p className="text-sm text-gray-600">{category.description}</p>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default EmergencyCategories;