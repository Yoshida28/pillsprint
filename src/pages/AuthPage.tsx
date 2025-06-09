import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Key, Mail, ArrowRight, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn, signUp } from '../lib/supabase';
import Logo from '../components/shared/Logo';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate('/profile');
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        setSuccess('Account created successfully! Please check your email to confirm your account.');
        setTimeout(() => setMode('signin'), 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <motion.div 
            className="bg-white rounded-xl shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-primary-500 p-6 text-center">
              <Logo size="large" />
              <h1 className="text-2xl font-bold text-white mt-4">
                {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-primary-100 mt-1">
                {mode === 'signin' 
                  ? 'Sign in to access your emergency medicines and health recommendations' 
                  : 'Sign up to get started with PillSprint emergency medicine delivery'}
              </p>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-red-700 text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4 text-green-700 text-sm flex items-start">
                  <Check className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      className="input pl-10"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      type="password"
                      className="input pl-10"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                
                {mode === 'signup' && (
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        id="confirmPassword"
                        type="password"
                        className="input pl-10"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                )}
                
                {mode === 'signin' && (
                  <div className="mb-6 text-right">
                    <a href="#" className="text-sm text-primary-500 hover:text-primary-600">
                      Forgot your password?
                    </a>
                  </div>
                )}
                
                <button
                  type="submit"
                  className="btn-primary w-full flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {mode === 'signin' ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {mode === 'signin' ? (
                    <>
                      Don't have an account?{' '}
                      <button
                        onClick={() => setMode('signup')}
                        className="text-primary-500 hover:text-primary-600 font-medium"
                      >
                        Sign Up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        onClick={() => setMode('signin')}
                        className="text-primary-500 hover:text-primary-600 font-medium"
                      >
                        Sign In
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            By continuing, you agree to PillSprint's{' '}
            <Link to="/terms" className="text-primary-500 hover:text-primary-600">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary-500 hover:text-primary-600">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;