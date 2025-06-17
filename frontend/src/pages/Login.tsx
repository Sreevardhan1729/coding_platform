import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Code, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { login } from '../api';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData);
      toast.success('Welcome back! Redirecting to your dashboard...');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <div className="flex items-center mb-8 group">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
              <Code className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold">CodeJudge</h1>
          </div>
          
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Master Your Coding Skills</h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Practice coding problems, improve your algorithms, and compete with developers worldwide in our interactive coding platform.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            <div className="group cursor-pointer">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 group-hover:bg-white/20 transition-colors duration-300">
                <Sparkles className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">500+ Problems</span>
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 group-hover:bg-white/20 transition-colors duration-300">
                <Code className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">3 Languages</span>
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 group-hover:bg-white/20 transition-colors duration-300">
                <ArrowRight className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Real-time Judge</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex lg:hidden items-center justify-center mb-6">
              <div className="p-2 bg-blue-600 rounded-xl mr-3">
                <Code className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">CodeJudge</h1>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to continue your coding journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}