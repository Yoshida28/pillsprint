import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

console.log('🔧 SUPABASE CONFIGURATION');
console.log('URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : '❌ MISSING');
console.log('Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : '❌ MISSING');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Test connection function
export async function testConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');
    const { data, error } = await supabase.from('medicines').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
    
    console.log('✅ Connection test successful');
    return true;
  } catch (error) {
    console.error('❌ Connection test error:', error);
    return false;
  }
}

// Medicine-related functions
export async function fetchMedicines(filters = {}) {
  console.log('\n🔍 === FETCHING MEDICINES ===');
  console.log('📊 Filters applied:', filters);
  
  try {
    console.log('🔗 Building database query...');
    let query = supabase.from('medicines').select(`
      id,
      name,
      description,
      price,
      image_url,
      emergency,
      manufacturer,
      dosage_form,
      strength,
      package_size,
      requires_prescription,
      stock,
      category,
      composition,
      alternatives,
      side_effects,
      warnings,
      usage_instructions,
      storage_instructions,
      expiry_months,
      created_at,
      updated_at
    `);

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        console.log(`🔍 Applying filter: ${key} = ${value}`);
        query = query.eq(key, value);
      }
    });

    console.log('⚡ Executing database query...');
    const { data, error } = await query.order('name');
    
    if (error) {
      console.error('❌ Database query error:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log('📦 Raw database response:', data);
    console.log(`📊 Number of records: ${data?.length || 0}`);
    
    // Process and format data if it exists
    if (data && data.length > 0) {
      console.log(`✅ Successfully fetched ${data.length} medicines from database`);
      
      const formattedData = data.map(medicine => ({
        id: medicine.id,
        name: medicine.name,
        description: medicine.description,
        price: medicine.price * 83, // Convert to INR
        image_url: medicine.image_url,
        emergency: medicine.emergency || false,
        manufacturer: medicine.manufacturer,
        dosage_form: medicine.dosage_form,
        strength: medicine.strength,
        package_size: medicine.package_size,
        requires_prescription: medicine.requires_prescription || false,
        stock: medicine.stock || 0,
        category: medicine.category,
        composition: medicine.composition || [],
        alternatives: medicine.alternatives || [],
        side_effects: medicine.side_effects || [],
        warnings: medicine.warnings || [],
        usage_instructions: medicine.usage_instructions,
        storage_instructions: medicine.storage_instructions,
        expiry_months: medicine.expiry_months || 24,
        created_at: medicine.created_at,
        updated_at: medicine.updated_at
      }));
      
      console.log('🎯 Sample formatted medicine:', formattedData[0]);
      return formattedData;
    }
    
    console.log('⚠️ No data returned from database');
    return [];
    
  } catch (error) {
    console.error('💥 Database connection error:', error);
    throw error;
  }
}

export async function fetchMedicineById(id: string) {
  console.log(`\n🔍 === FETCHING MEDICINE BY ID: ${id} ===`);
  
  try {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('❌ Error fetching medicine details:', error);
      throw new Error(`Failed to fetch medicine: ${error.message}`);
    }
    
    if (data) {
      console.log('✅ Successfully fetched medicine from database:', data.name);
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price * 83, // Convert to INR
        image_url: data.image_url,
        emergency: data.emergency || false,
        manufacturer: data.manufacturer,
        dosage_form: data.dosage_form,
        strength: data.strength,
        package_size: data.package_size,
        requires_prescription: data.requires_prescription || false,
        stock: data.stock || 0,
        category: data.category,
        composition: data.composition || [],
        alternatives: data.alternatives || [],
        side_effects: data.side_effects || [],
        warnings: data.warnings || [],
        usage_instructions: data.usage_instructions,
        storage_instructions: data.storage_instructions,
        expiry_months: data.expiry_months || 24,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    }
    
    throw new Error('Medicine not found');
  } catch (error) {
    console.error('💥 Database connection error:', error);
    throw error;
  }
}

export async function fetchEmergencyMedicines() {
  console.log('\n🚨 === FETCHING EMERGENCY MEDICINES ===');
  
  try {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('emergency', true)
      .order('name');
      
    if (error) {
      console.error('❌ Error fetching emergency medicines:', error);
      throw new Error(`Failed to fetch emergency medicines: ${error.message}`);
    }
    
    // Convert and format data if it exists
    if (data && data.length > 0) {
      console.log(`✅ Successfully fetched ${data.length} emergency medicines from database`);
      return data.map(medicine => ({
        id: medicine.id,
        name: medicine.name,
        description: medicine.description,
        price: medicine.price * 83, // Convert to INR
        image_url: medicine.image_url,
        emergency: medicine.emergency || false,
        manufacturer: medicine.manufacturer,
        dosage_form: medicine.dosage_form,
        strength: medicine.strength,
        package_size: medicine.package_size,
        requires_prescription: medicine.requires_prescription || false,
        stock: medicine.stock || 0,
        category: medicine.category,
        composition: medicine.composition || [],
        alternatives: medicine.alternatives || [],
        side_effects: medicine.side_effects || [],
        warnings: medicine.warnings || [],
        usage_instructions: medicine.usage_instructions,
        storage_instructions: medicine.storage_instructions,
        expiry_months: medicine.expiry_months || 24,
        created_at: medicine.created_at,
        updated_at: medicine.updated_at
      }));
    }
    
    return [];
  } catch (error) {
    console.error('💥 Database connection error:', error);
    throw error;
  }
}

export async function searchMedicines(query: string) {
  if (!query.trim()) {
    return [];
  }

  console.log(`\n🔍 === SEARCHING MEDICINES FOR: "${query}" ===`);

  try {
    // Search in multiple fields using text search and full-text search
    const searchTerm = query.trim();
    
    console.log('🔍 Executing search query...');
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,manufacturer.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,dosage_form.ilike.%${searchTerm}%`)
      .order('name')
      .limit(50);

    if (error) {
      console.error('❌ Search error:', error);
      throw new Error(`Search failed: ${error.message}`);
    }

    console.log('📦 Search results:', data?.length || 0, 'medicines found');

    // Convert and format data if it exists
    if (data && data.length > 0) {
      console.log(`✅ Found ${data.length} medicines matching "${query}"`);
      return data.map(medicine => ({
        id: medicine.id,
        name: medicine.name,
        description: medicine.description,
        price: medicine.price * 83, // Convert to INR
        image_url: medicine.image_url,
        emergency: medicine.emergency || false,
        manufacturer: medicine.manufacturer,
        dosage_form: medicine.dosage_form,
        strength: medicine.strength,
        package_size: medicine.package_size,
        requires_prescription: medicine.requires_prescription || false,
        stock: medicine.stock || 0,
        category: medicine.category,
        composition: medicine.composition || [],
        alternatives: medicine.alternatives || [],
        side_effects: medicine.side_effects || [],
        warnings: medicine.warnings || [],
        usage_instructions: medicine.usage_instructions,
        storage_instructions: medicine.storage_instructions,
        expiry_months: medicine.expiry_months || 24,
        created_at: medicine.created_at,
        updated_at: medicine.updated_at
      }));
    }

    console.log(`⚠️ No medicines found matching "${query}"`);
    return [];
  } catch (error) {
    console.error('💥 Database search error:', error);
    throw error;
  }
}

// User-related functions
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
}

export async function signUp(email: string, password: string) {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: '',
        avatar_url: '',
      }
    }
  });
}

export async function signOut() {
  return await supabase.auth.signOut();
}