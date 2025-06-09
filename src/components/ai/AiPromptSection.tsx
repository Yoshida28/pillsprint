import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AiPromptSection: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to AI assistant page with the prompt
    window.location.href = `/ai-assistant?prompt=${encodeURIComponent(prompt)}`;
  };
  
  return (
    <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center bg-white bg-opacity-10 rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 mr-2 text-primary-200" />
              <span className="text-sm">AI-Powered Health Assistant</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Personalized Medicine Recommendations
            </h2>
            
            <p className="text-primary-100 mb-8 text-lg">
              Describe your symptoms or ask about medications. Our AI will analyze your needs and suggest the right solutions.
            </p>
          </motion.div>
          
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white p-2 rounded-full shadow-lg flex items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your symptoms or ask about medications..."
              className="flex-grow px-4 py-2 text-gray-800 focus:outline-none rounded-full"
            />
            <button 
              type="submit" 
              className="btn-primary !rounded-full flex items-center"
              disabled={!prompt.trim()}
            >
              Ask AI
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </motion.form>
          
          <motion.div 
            className="mt-8 text-sm text-primary-200"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p>
              Try asking about: "Recommend medicine for fever" or "What's the difference between paracetamol and ibuprofen?"
            </p>
            <p className="mt-2">
              <Link to="/ai-assistant" className="underline hover:text-white transition-colors">
                Or start a full AI consultation &rarr;
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AiPromptSection;