import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchMedicines, fetchMedicines } from './supabase';

// Initialize the Google Generative AI client with the provided API key
const apiKey = 'AIzaSyBpDROmeZc_tr9J0iFCfn-YISh5PPixHvM';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Function to get medicine recommendations based on symptoms
export async function getMedicineRecommendations(symptoms: string) {
  try {
    console.log('🤖 AI: Getting medicine recommendations for:', symptoms);
    
    // First, get available medicines from the database
    const availableMedicines = await fetchMedicines();
    console.log('🤖 AI: Found', availableMedicines.length, 'medicines in database');
    
    if (!availableMedicines || availableMedicines.length === 0) {
      return {
        error: "No medicines available in database",
        message: "Please add medicines to the database first"
      };
    }

    // Create a comprehensive medicine catalog for the AI
    const medicinesCatalog = availableMedicines.map(med => ({
      id: med.id,
      name: med.name,
      category: med.category,
      description: med.description,
      dosage_form: med.dosage_form,
      manufacturer: med.manufacturer,
      price: Math.round(med.price),
      emergency: med.emergency,
      requires_prescription: med.requires_prescription,
      composition: med.composition,
      usage_instructions: med.usage_instructions,
      side_effects: med.side_effects,
      warnings: med.warnings,
      stock: med.stock
    }));

    const prompt = `
    You are an AI assistant for PillSprint, an emergency medicine delivery app in India. 
    A user is describing symptoms: "${symptoms}".
    
    Based on these symptoms, analyze the available medicines in our inventory and recommend the MOST SUITABLE ones.
    
    AVAILABLE MEDICINES IN OUR STORE:
    ${JSON.stringify(medicinesCatalog, null, 2)}
    
    INSTRUCTIONS:
    1. Analyze the user's symptoms carefully
    2. Match symptoms to appropriate medicine categories and compositions
    3. Select 3-5 medicines from OUR AVAILABLE INVENTORY that would help
    4. Consider factors like:
       - Symptom relevance to medicine purpose
       - Medicine category and composition
       - Emergency status if symptoms are severe
       - Stock availability
       - Prescription requirements
    5. Provide specific guidance on how each medicine helps the user's condition
    6. Include dosage and safety information
    
    Format your response as a structured JSON object like this:
    {
      "analysis": "Brief analysis of the symptoms and what type of treatment is needed",
      "recommendations": [
        {
          "id": "medicine_id_from_database",
          "name": "Medicine Name",
          "reason": "Specific explanation of why this medicine helps with the user's symptoms",
          "category": "Medicine Category",
          "dosage_form": "Form",
          "price": "Price in INR",
          "how_it_helps": "Detailed explanation of how this medicine addresses the specific symptoms",
          "usage": "How to use this medicine for the symptoms",
          "precautions": "Important precautions for this condition"
        }
      ],
      "emergency_note": "If symptoms suggest emergency, mention this",
      "general_advice": "General advice for the patient's condition",
      "disclaimer": "Medical disclaimer"
    }
    
    IMPORTANT: 
    - Only recommend medicines that exist in our inventory
    - Match medicines to symptoms intelligently
    - Explain WHY each medicine is suitable for the specific symptoms
    - Consider emergency medicines for severe symptoms
    - Always include proper medical disclaimer
    `;

    console.log('🤖 AI: Sending prompt to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('🤖 AI: Received response from Gemini');
    
    // Parse the JSON response
    try {
      // Extract JSON from the response if it's wrapped in markdown code blocks
      const jsonMatch = text.match(/```json\n([\s\S]*)\n```/) || 
                        text.match(/```\n([\s\S]*)\n```/) || 
                        [null, text];
      const jsonString = jsonMatch[1] || text;
      const parsedResponse = JSON.parse(jsonString);
      
      console.log('🤖 AI: Successfully parsed recommendations:', parsedResponse.recommendations?.length || 0, 'medicines');
      return parsedResponse;
    } catch (parseError) {
      console.error("🤖 AI: Error parsing JSON from Gemini response:", parseError);
      
      // Fallback: Try to extract medicine recommendations using keyword matching
      const fallbackRecommendations = await getFallbackRecommendations(symptoms, availableMedicines);
      
      return {
        analysis: `Based on your symptoms: "${symptoms}", here are some medicine options from our store.`,
        recommendations: fallbackRecommendations,
        general_advice: "These are general recommendations. Please consult a healthcare professional for proper diagnosis and treatment.",
        disclaimer: "This is not medical advice. Always consult with a healthcare professional before taking any medication.",
        fallback: true
      };
    }
  } catch (error) {
    console.error("🤖 AI: Error getting medicine recommendations:", error);
    
    // Try fallback recommendations
    try {
      const availableMedicines = await fetchMedicines();
      const fallbackRecommendations = await getFallbackRecommendations(symptoms, availableMedicines);
      
      return {
        analysis: `Based on your symptoms: "${symptoms}", here are some medicine options from our store.`,
        recommendations: fallbackRecommendations,
        general_advice: "These are general recommendations. Please consult a healthcare professional for proper diagnosis and treatment.",
        disclaimer: "This is not medical advice. Always consult with a healthcare professional before taking any medication.",
        fallback: true
      };
    } catch (fallbackError) {
      return {
        error: "Failed to get recommendations",
        message: error instanceof Error ? error.message : String(error)
      };
    }
  }
}

// Fallback function for intelligent medicine matching when AI fails
async function getFallbackRecommendations(symptoms: string, availableMedicines: any[]) {
  console.log('🤖 AI: Using fallback recommendation system');
  
  const symptomsLower = symptoms.toLowerCase();
  const recommendations = [];
  
  // Define symptom-to-medicine mappings
  const symptomMappings = {
    // Pain and fever
    'headache|head pain|migraine': ['Pain Relief'],
    'fever|temperature|hot': ['Pain Relief', 'Pediatric'],
    'pain|ache|hurt|sore': ['Pain Relief'],
    'muscle pain|body ache|joint pain': ['Pain Relief'],
    
    // Respiratory
    'cough|throat|cold|flu': ['Cough & Cold', 'Respiratory'],
    'asthma|breathing|wheeze': ['Respiratory', 'Emergency'],
    'congestion|blocked nose|stuffy': ['Cough & Cold'],
    
    // Digestive
    'stomach|nausea|vomit|diarrhea|constipation': ['Digestive'],
    'heartburn|acid|indigestion': ['Digestive'],
    
    // Allergy
    'allergy|allergic|rash|itch|hives': ['Allergy', 'Skin Care'],
    'runny nose|sneezing|hay fever': ['Allergy'],
    
    // Emergency conditions
    'emergency|urgent|severe|chest pain|difficulty breathing': ['Emergency', 'Cardiac'],
    'burn|wound|cut|injury': ['First Aid', 'Skin Care'],
    
    // Sleep and anxiety
    'sleep|insomnia|tired|restless': ['Sleep Aid'],
    
    // Women's health
    'pregnancy|prenatal|iron deficiency': ['Women\'s Health'],
    
    // Children
    'child|baby|kid|pediatric': ['Pediatric'],
    
    // Vitamins and supplements
    'vitamin|supplement|immunity|energy': ['Vitamins'],
    
    // Diabetes
    'diabetes|blood sugar|glucose': ['Diabetes'],
    
    // Eye care
    'eye|vision|dry eyes': ['Eye Care'],
    
    // Ear care
    'ear|hearing|wax': ['Ear Care']
  };
  
  // Find matching categories
  const matchingCategories = new Set();
  for (const [symptomPattern, categories] of Object.entries(symptomMappings)) {
    const regex = new RegExp(symptomPattern, 'i');
    if (regex.test(symptomsLower)) {
      categories.forEach(cat => matchingCategories.add(cat));
    }
  }
  
  console.log('🤖 AI: Matching categories:', Array.from(matchingCategories));
  
  // Filter medicines by matching categories
  let relevantMedicines = availableMedicines.filter(med => 
    matchingCategories.has(med.category) && med.stock > 0
  );
  
  // If no category matches, try text search
  if (relevantMedicines.length === 0) {
    console.log('🤖 AI: No category matches, trying text search');
    try {
      relevantMedicines = await searchMedicines(symptoms);
    } catch (error) {
      console.error('🤖 AI: Search failed, using general medicines');
      relevantMedicines = availableMedicines.filter(med => 
        ['Pain Relief', 'Vitamins', 'Digestive'].includes(med.category) && med.stock > 0
      );
    }
  }
  
  // Sort by relevance (emergency first, then by stock)
  relevantMedicines.sort((a, b) => {
    if (a.emergency && !b.emergency) return -1;
    if (!a.emergency && b.emergency) return 1;
    return b.stock - a.stock;
  });
  
  // Take top 4 medicines
  const selectedMedicines = relevantMedicines.slice(0, 4);
  
  console.log('🤖 AI: Selected medicines:', selectedMedicines.map(m => m.name));
  
  // Format recommendations
  return selectedMedicines.map(med => ({
    id: med.id,
    name: med.name,
    reason: getReasonForSymptoms(symptoms, med),
    category: med.category,
    dosage_form: med.dosage_form || 'Tablet',
    price: `₹${Math.round(med.price)}`,
    how_it_helps: getHowItHelps(symptoms, med),
    usage: med.usage_instructions || 'Follow package directions or consult healthcare provider',
    precautions: med.warnings?.join(', ') || 'Consult healthcare provider before use'
  }));
}

// Helper function to generate reason for medicine selection
function getReasonForSymptoms(symptoms: string, medicine: any): string {
  const symptomsLower = symptoms.toLowerCase();
  const medName = medicine.name.toLowerCase();
  const category = medicine.category;
  
  if (symptomsLower.includes('headache') && category === 'Pain Relief') {
    return `${medicine.name} is effective for headache relief and pain management`;
  }
  if (symptomsLower.includes('fever') && category === 'Pain Relief') {
    return `${medicine.name} helps reduce fever and associated discomfort`;
  }
  if (symptomsLower.includes('cough') && category === 'Cough & Cold') {
    return `${medicine.name} provides relief from cough and throat irritation`;
  }
  if (symptomsLower.includes('allergy') && category === 'Allergy') {
    return `${medicine.name} helps control allergic reactions and symptoms`;
  }
  if (symptomsLower.includes('stomach') && category === 'Digestive') {
    return `${medicine.name} helps with digestive issues and stomach discomfort`;
  }
  if (medicine.emergency) {
    return `${medicine.name} is an emergency medication suitable for urgent situations`;
  }
  
  return `${medicine.name} from our ${category} category may help with your symptoms`;
}

// Helper function to explain how medicine helps
function getHowItHelps(symptoms: string, medicine: any): string {
  if (medicine.description) {
    return medicine.description;
  }
  
  const category = medicine.category;
  switch (category) {
    case 'Pain Relief':
      return 'Reduces pain and inflammation, providing relief from discomfort';
    case 'Cough & Cold':
      return 'Soothes throat irritation and helps suppress cough';
    case 'Allergy':
      return 'Blocks histamine reactions that cause allergy symptoms';
    case 'Digestive':
      return 'Helps restore normal digestive function and reduces stomach discomfort';
    case 'Emergency':
      return 'Provides rapid relief in emergency situations';
    case 'Vitamins':
      return 'Supports overall health and immune system function';
    default:
      return 'Provides therapeutic benefit for your condition';
  }
}

// Function to analyze medicine composition
export async function analyzeMedicineComposition(composition: string, condition?: string) {
  try {
    const prompt = `
    Analyze this medicine composition: "${composition}"
    ${condition ? `The user is trying to treat: "${condition}"` : ''}
    
    Please provide:
    1. A breakdown of each active ingredient and its purpose
    2. Potential benefits of this medicine
    3. Possible side effects
    4. Any warnings or contraindications
    ${condition ? '5. How suitable this medicine is for the specified condition' : ''}
    
    Format your response as a JSON object with these sections.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    try {
      const jsonMatch = text.match(/```json\n([\s\S]*)\n```/) || 
                        text.match(/```\n([\s\S]*)\n```/) || 
                        [null, text];
      const jsonString = jsonMatch[1] || text;
      return JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Error parsing JSON from Gemini response:", parseError);
      return {
        error: "Failed to parse composition analysis",
        rawResponse: text
      };
    }
  } catch (error) {
    console.error("Error analyzing medicine composition:", error);
    return {
      error: "Failed to analyze composition",
      message: error instanceof Error ? error.message : String(error)
    };
  }
}

// Function to compare medicine prices and alternatives
export async function compareMedicineOptions(medicineName: string, composition?: string) {
  try {
    // Get available medicines from database for comparison
    const availableMedicines = await fetchMedicines();
    const similarMedicines = availableMedicines.filter(med => 
      med.name.toLowerCase().includes(medicineName.toLowerCase()) ||
      med.category === availableMedicines.find(m => m.name.toLowerCase().includes(medicineName.toLowerCase()))?.category
    );

    const prompt = `
    I want to compare prices and find alternatives for "${medicineName}"
    ${composition ? `with composition: "${composition}"` : ''}
    
    Available similar medicines in our database:
    ${JSON.stringify(similarMedicines.map(med => ({
      name: med.name,
      price: Math.round(med.price),
      manufacturer: med.manufacturer,
      composition: med.composition,
      category: med.category
    })), null, 2)}
    
    Please provide:
    1. Estimated price range for this medicine at common pharmacies in India (in INR)
    2. 3-4 alternative medicines from our available stock with similar effects
    3. Price comparison of alternatives (in INR)
    4. Any cheaper generic options from our inventory
    
    Format your response as a JSON object with these sections.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    try {
      const jsonMatch = text.match(/```json\n([\s\S]*)\n```/) || 
                        text.match(/```\n([\s\S]*)\n```/) || 
                        [null, text];
      const jsonString = jsonMatch[1] || text;
      return JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Error parsing JSON from Gemini comparison:", parseError);
      return {
        error: "Failed to parse medicine comparison",
        rawResponse: text
      };
    }
  } catch (error) {
    console.error("Error comparing medicine options:", error);
    return {
      error: "Failed to compare medicine options",
      message: error instanceof Error ? error.message : String(error)
    };
  }
}

// Function for general medical chat with improved formatting
export async function medicalChat(userMessage: string, chatHistory: Array<{role: string, content: string}> = []) {
  try {
    console.log('🤖 AI: Processing medical chat for:', userMessage);
    
    // Get available medicines for context
    const availableMedicines = await fetchMedicines();
    
    // Prepare the chat history in the format expected by the API
    const history = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));
    
    // Start a chat session
    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });
    
    // Send the user's message with context about available medicines
    const prompt = `
    Act as a helpful assistant for PillSprint, an emergency medicine delivery application in India.
    
    The user says: "${userMessage}"
    
    AVAILABLE MEDICINES IN OUR STORE:
    We have ${availableMedicines.length} medicines available including:
    - Emergency medicines: ${availableMedicines.filter(m => m.emergency).length}
    - Pain relief medicines: ${availableMedicines.filter(m => m.category === 'Pain Relief').length}
    - Vitamins & supplements: ${availableMedicines.filter(m => m.category === 'Vitamins').length}
    - Digestive medicines: ${availableMedicines.filter(m => m.category === 'Digestive').length}
    - Allergy medicines: ${availableMedicines.filter(m => m.category === 'Allergy').length}
    - And many more categories...
    
    INSTRUCTIONS:
    1. Respond helpfully, focusing on medicines available in our store
    2. If the user asks about specific symptoms, suggest relevant medicines from our inventory
    3. Use proper formatting with:
       - **Bold text** for medicine names and important points
       - Bullet points for lists
       - Clear sections with headings
       - Tables when comparing medicines (use markdown table format)
       - Proper spacing between sections
    4. When recommending medicines, explain WHY they help with the specific condition
    5. Include prices in Indian Rupees when relevant
    6. Consider emergency medicines for urgent symptoms
    
    When comparing medicines like Paracetamol vs Ibuprofen, format it clearly with:
    1. Individual medicine descriptions with proper headings
    2. A comparison table
    3. Key differences summary
    
    Always include a disclaimer that you are not providing medical advice and serious conditions require a doctor's consultation.
    
    Keep the response well-structured and easy to read.
    `;
    
    console.log('🤖 AI: Sending chat message to Gemini...');
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    console.log('🤖 AI: Received chat response from Gemini');
    return responseText;
  } catch (error) {
    console.error("🤖 AI: Error in medical chat:", error);
    return "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later, or browse our available medicines directly.";
  }
}