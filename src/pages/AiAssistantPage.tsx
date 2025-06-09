import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Send, AlertCircle, Info, X, Copy, Check, ExternalLink, ShoppingBag, Star, Sparkles, RefreshCw } from 'lucide-react';
import { medicalChat, getMedicineRecommendations } from '../lib/gemini';
import { useLocation, Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  recommendations?: MedicineRecommendation[];
  analysis?: string;
  emergency_note?: string;
  general_advice?: string;
}

interface MedicineRecommendation {
  id: string;
  name: string;
  reason: string;
  category: string;
  dosage_form: string;
  price: string;
  how_it_helps: string;
  usage: string;
  precautions: string;
}

const AiAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null);
  const [isGettingRecommendations, setIsGettingRecommendations] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const addToCart = useCartStore(state => state.addItem);

  useEffect(() => {
    // Add initial welcome message
    if (messages.length === 0) {
      setMessages([
        {
          role: 'ai',
          content: "Hello! I'm your PillSprint AI health assistant. I can help you find the right medications from our store, understand symptoms, or learn about drug interactions. I have access to our complete medicine inventory and can provide personalized recommendations. How can I assist you today?",
          timestamp: new Date()
        }
      ]);
    }
    
    // Check for URL params to pre-fill the chat
    const searchParams = new URLSearchParams(location.search);
    const promptParam = searchParams.get('prompt');
    if (promptParam) {
      setInputValue(promptParam);
      handleSendMessage(promptParam);
    }
  }, []);

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageIndex(index);
      setTimeout(() => setCopiedMessageIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleAddToCart = (recommendation: MedicineRecommendation) => {
    // Extract price number from string like "₹25"
    const priceMatch = recommendation.price.match(/\d+/);
    const price = priceMatch ? parseInt(priceMatch[0]) : 0;
    
    addToCart({
      id: recommendation.id,
      name: recommendation.name,
      price: price / 83, // Convert INR to USD for consistency
      image_url: null,
      is_emergency: recommendation.category === 'Emergency',
      manufacturer: undefined,
      dosage_form: recommendation.dosage_form
    });
  };

  const formatMessage = (content: string) => {
    // Convert markdown-style formatting to HTML
    let formatted = content
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-6 mb-3 text-gray-800 border-b border-gray-200 pb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-6 mb-3 text-gray-800 border-b border-gray-200 pb-2">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-3 text-gray-800 border-b border-gray-200 pb-2">$1</h1>')
      // Bullet points
      .replace(/^\* (.*$)/gm, '<li class="ml-4 mb-1">$1</li>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 mb-1">$1</li>')
      // Line breaks
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>');

    // Wrap in paragraphs and handle lists
    formatted = '<p class="mb-4">' + formatted + '</p>';
    
    // Handle lists properly
    formatted = formatted.replace(/(<li class="ml-4 mb-1">.*?<\/li>)/gs, (match) => {
      return '<ul class="list-disc list-inside mb-4 space-y-1 bg-gray-50 p-3 rounded-lg">' + match + '</ul>';
    });

    // Handle tables (basic markdown table support)
    const tableRegex = /\|(.+)\|\n\|[-\s|]+\|\n((?:\|.+\|\n?)+)/g;
    formatted = formatted.replace(tableRegex, (match, header, rows) => {
      const headerCells = header.split('|').map((cell: string) => cell.trim()).filter(Boolean);
      const rowsArray = rows.trim().split('\n').map((row: string) => 
        row.split('|').map((cell: string) => cell.trim()).filter(Boolean)
      );

      const headerHtml = headerCells.map((cell: string) => 
        `<th class="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-semibold">${cell}</th>`
      ).join('');

      const rowsHtml = rowsArray.map((row: string[]) => 
        '<tr>' + row.map((cell: string) => 
          `<td class="border border-gray-300 px-4 py-2">${cell}</td>`
        ).join('') + '</tr>'
      ).join('');

      return `
        <div class="overflow-x-auto my-6">
          <table class="w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-sm">
            <thead>
              <tr>${headerHtml}</tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      `;
    });

    return formatted;
  };

  const getSmartRecommendations = async (userMessage: string) => {
    console.log('🤖 Getting smart recommendations for:', userMessage);
    setIsGettingRecommendations(true);
    
    try {
      const recommendations = await getMedicineRecommendations(userMessage);
      console.log('🤖 Received recommendations:', recommendations);
      
      if (recommendations.error) {
        console.error('🤖 Recommendation error:', recommendations.error);
        return null;
      }
      
      return recommendations;
    } catch (error) {
      console.error('🤖 Error getting recommendations:', error);
      return null;
    } finally {
      setIsGettingRecommendations(false);
    }
  };

  const handleSendMessage = async (messageText: string = inputValue) => {
    if (!messageText.trim()) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Check if this looks like a symptom description or medicine request
      const isSymptomQuery = /\b(pain|ache|fever|cough|cold|headache|stomach|nausea|allergy|rash|tired|sleep|anxiety|depression|diabetes|asthma|burn|cut|wound|emergency|urgent|help|recommend|suggest|medicine|medication|drug|pill|tablet|syrup|cream|gel|inhaler)\b/i.test(messageText);
      
      let aiResponse = '';
      let recommendations = null;
      
      if (isSymptomQuery) {
        console.log('🤖 Detected symptom query, getting smart recommendations');
        
        // Get smart recommendations first
        recommendations = await getSmartRecommendations(messageText);
        
        if (recommendations && recommendations.recommendations) {
          // Create a response that includes the analysis
          aiResponse = `${recommendations.analysis || 'Based on your symptoms, here are some medicine recommendations from our store:'}\n\n`;
          
          if (recommendations.emergency_note) {
            aiResponse += `⚠️ **Emergency Note:** ${recommendations.emergency_note}\n\n`;
          }
          
          aiResponse += `I've found ${recommendations.recommendations.length} suitable medicines from our inventory that can help with your condition. Each recommendation is specifically chosen based on your symptoms and our available stock.\n\n`;
          
          if (recommendations.general_advice) {
            aiResponse += `**General Advice:** ${recommendations.general_advice}\n\n`;
          }
          
          aiResponse += `**Important:** ${recommendations.disclaimer || 'This is not medical advice. Always consult with a healthcare professional before taking any medication.'}`;
        }
      }
      
      // If no recommendations or not a symptom query, use regular chat
      if (!aiResponse) {
        console.log('🤖 Using regular chat response');
        
        // Convert existing messages to the format expected by the API
        const chatHistory = messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));
        
        // Get response from Gemini AI
        aiResponse = await medicalChat(messageText, chatHistory);
      }
      
      const aiMessage: ChatMessage = {
        role: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        recommendations: recommendations?.recommendations || undefined,
        analysis: recommendations?.analysis,
        emergency_note: recommendations?.emergency_note,
        general_advice: recommendations?.general_advice
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error communicating with AI:', error);
      
      const errorMessage: ChatMessage = {
        role: 'ai',
        content: "I'm sorry, I encountered an error while processing your request. Please try again later or browse our medicines directly.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
    handleSendMessage(prompt);
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-4">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold">AI Health Assistant</h1>
                  <p className="text-primary-100 text-sm">
                    Powered by Google's Gemini AI • Connected to our medicine inventory • Get personalized recommendations
                  </p>
                </div>
              </div>
            </div>
            
            {/* Disclaimer Banner */}
            {showDisclaimer && (
              <div className="bg-blue-50 p-4 flex items-start border-b">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="ml-3 pr-8">
                  <p className="text-sm text-blue-800">
                    <strong>Medical Disclaimer:</strong> The information provided by this AI assistant is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have.
                  </p>
                </div>
                <button 
                  onClick={() => setShowDisclaimer(false)}
                  className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                  aria-label="Dismiss"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            
            {/* Chat Messages */}
            <div className="h-[600px] overflow-y-auto p-6 bg-gray-50">
              {messages.map((message, index) => (
                <div key={index} className="mb-6">
                  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`ai-chat-bubble ${message.role === 'user' ? 'user' : 'ai'} relative group max-w-4xl`}>
                      <div className="flex items-center mb-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          message.role === 'user' ? 'bg-primary-100 text-primary-600' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {message.role === 'user' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </div>
                        <span className="text-xs text-gray-500 ml-3">
                          {message.role === 'user' ? 'You' : 'AI Assistant'} • {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                        {message.role === 'ai' && (
                          <button
                            onClick={() => copyToClipboard(message.content, index)}
                            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                            title="Copy message"
                          >
                            {copiedMessageIndex === index ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                        )}
                      </div>
                      <div 
                        className="text-gray-800 prose prose-sm max-w-none leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                      />
                    </div>
                  </div>

                  {/* Medicine Recommendations Section */}
                  {message.role === 'ai' && message.recommendations && message.recommendations.length > 0 && (
                    <motion.div
                      className="mt-6 ml-12"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6 border border-primary-100">
                        <div className="flex items-center mb-4">
                          <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 ml-3">
                            Personalized Medicine Recommendations
                          </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {message.recommendations.map((recommendation, recIndex) => (
                            <motion.div
                              key={recIndex}
                              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
                              whileHover={{ y: -2 }}
                            >
                              <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-semibold text-gray-800 text-base">
                                    {recommendation.name}
                                  </h4>
                                  <span className="text-sm bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                                    {recommendation.category}
                                  </span>
                                </div>
                                
                                <p className="text-sm text-primary-600 mb-2 font-medium">
                                  {recommendation.reason}
                                </p>
                                
                                <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                                  {recommendation.how_it_helps}
                                </p>
                                
                                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                                  <div className="text-xs text-gray-700">
                                    <div className="mb-1"><strong>Usage:</strong> {recommendation.usage}</div>
                                    <div><strong>Precautions:</strong> {recommendation.precautions}</div>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <span className="font-bold text-primary-600 text-lg">
                                    {recommendation.price}
                                  </span>
                                  <div className="flex space-x-2">
                                    <Link
                                      to={`/medicines/${recommendation.id}`}
                                      className="text-xs text-primary-500 hover:text-primary-600 flex items-center"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </Link>
                                    <button
                                      onClick={() => handleAddToCart(recommendation)}
                                      className="bg-primary-500 text-white text-xs px-3 py-1.5 rounded hover:bg-primary-600 transition-colors flex items-center"
                                    >
                                      <ShoppingBag className="h-3 w-3 mr-1" />
                                      Add to Cart
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        
                        <div className="mt-4 text-center">
                          <Link
                            to="/medicines"
                            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm"
                          >
                            View all medicines in our store
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
              
              {(isLoading || isGettingRecommendations) && (
                <div className="flex justify-start mb-6">
                  <div className="ai-chat-bubble ai">
                    <div className="flex items-center mb-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <span className="text-xs text-gray-500 ml-3">
                        AI Assistant is {isGettingRecommendations ? 'analyzing medicines' : 'thinking'}...
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      {isGettingRecommendations && (
                        <span className="text-xs text-gray-500 ml-2">
                          Searching our medicine inventory...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div ref={endOfMessagesRef} />
            </div>
            
            {/* Input Area */}
            <div className="p-6 border-t border-gray-200 bg-white">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    placeholder="Describe your symptoms or ask about medications..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    rows={2}
                  />
                </div>
                <button
                  className="bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <button 
                  className="px-4 py-2 bg-primary-50 text-primary-600 text-sm rounded-full hover:bg-primary-100 transition-colors"
                  onClick={() => handleQuickPrompt("I have a severe headache and fever, what medicine can help?")}
                >
                  Headache & fever medicine
                </button>
                <button 
                  className="px-4 py-2 bg-primary-50 text-primary-600 text-sm rounded-full hover:bg-primary-100 transition-colors"
                  onClick={() => handleQuickPrompt("I have a persistent cough and sore throat, recommend something")}
                >
                  Cough & throat relief
                </button>
                <button 
                  className="px-4 py-2 bg-primary-50 text-primary-600 text-sm rounded-full hover:bg-primary-100 transition-colors"
                  onClick={() => handleQuickPrompt("I'm having stomach pain and nausea, what should I take?")}
                >
                  Stomach problems
                </button>
                <button 
                  className="px-4 py-2 bg-primary-50 text-primary-600 text-sm rounded-full hover:bg-primary-100 transition-colors"
                  onClick={() => handleQuickPrompt("I need emergency medicine for an asthma attack")}
                >
                  Emergency asthma help
                </button>
                <button 
                  className="px-4 py-2 bg-primary-50 text-primary-600 text-sm rounded-full hover:bg-primary-100 transition-colors"
                  onClick={() => handleQuickPrompt("Compare different pain relief medicines available in your store")}
                >
                  Compare pain medicines
                </button>
              </div>
            </div>
          </motion.div>
          
          <div className="mt-6 p-6 bg-white rounded-xl shadow-sm">
            <div className="flex items-start">
              <Info className="h-6 w-6 text-primary-500 mt-0.5 flex-shrink-0" />
              <div className="ml-4">
                <h3 className="font-semibold text-gray-800 mb-2">How Our Smart AI Assistant Works</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Our AI assistant uses Google's Gemini technology and has direct access to our complete medicine inventory. It analyzes your symptoms, matches them with appropriate medications from our store, and provides personalized recommendations with detailed explanations of why each medicine is suitable for your condition.
                </p>
                <div className="text-sm text-gray-500">
                  <strong>Features:</strong> Real-time inventory access • Symptom analysis • Personalized recommendations • Price comparisons • Usage instructions • Safety warnings
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  <strong>Note:</strong> While our AI is trained on medical information and connected to our inventory, it's not a substitute for professional medical advice. Always consult a healthcare professional for serious conditions.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistantPage;