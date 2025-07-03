import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast"

function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(true);
  const mockEmail = 'mock_user@gmail.com';
  const mockPassword = 'CarRental#123';
  const navigate = useNavigate()

  const handleLogin = () => {
    if (email === mockEmail && password === mockPassword) {
      localStorage.setItem('user', JSON.stringify({ email }));
      setIsLoading(false);
      toast.success("You are log in!!")
      setShowLogin(false);
      setShowLogin(false);
    } else {
      toast.error('Invalid mock credentials.');
    }
  };

  const checkAuthAndNavigate = (path) => {
    const user = localStorage.getItem('user');
    if (!user) {
      toast.error('Please login to continue.');
      return;
    }
    navigate(path);
  };

  const fillDemoCredentials = () => {
    setEmail(mockEmail);
    setPassword(mockPassword);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white relative">
      {/* Enhanced Login Modal - unchanged */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl text-black space-y-6 relative transform transition-all duration-300 scale-100">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              ×
            </button>
            
            {/* Demo Credentials Info */}
            {showCredentials && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 relative">
                <button
                  onClick={() => setShowCredentials(false)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-sm"
                >
                  ×
                </button>
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-sm font-semibold text-blue-800">Demo Credentials</span>
                </div>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>Email:</strong> {mockEmail}</p>
                  <p><strong>Password:</strong> {mockPassword}</p>
                </div>
                <button
                  onClick={fillDemoCredentials}
                  className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                >
                  Auto-fill credentials
                </button>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading || !email || !password}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="text-center text-sm text-gray-500">
              This is a demo login system for testing purposes
            </div>
          </div>
        </div>
      )}

      {/* Navigation Bar - unchanged */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center space-x-2 cursor-pointer">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
          </svg>
          <span className="text-2xl font-bold">CarRental</span>
        </div>
      </nav>

      {/* Hero Banner - modified section */}
      <section className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-6 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold text-blue-200 mb-2">Premium Car Rentals</h2>
            <h1 className="text-5xl font-bold text-white mb-6">
              Drive <span className="text-blue-300">luxury</span> with ease
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Experience seamless car rentals with our premium collection. Instant booking, 24/7 support, and competitive pricing for your perfect journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => checkAuthAndNavigate('/browse')}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                Browse & Book
              </button>
              <button
                onClick={() => setShowLogin(true)}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Login (Mock User)
              </button>
              <button
                onClick={() => checkAuthAndNavigate('/my-bookings')}
                className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-blue-900 transition-colors duration-200 font-medium"
              >
                My Bookings
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - unchanged */}
      <footer className="bg-black bg-opacity-20 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
              <span className="text-xl font-bold">CarRental Rentals</span>
            </div>
            <div className="flex space-x-6">
              <button onClick={() => alert('Please login to browse cars')} className="text-white hover:text-blue-300 transition-colors duration-200">
                Browse
              </button>
              <button onClick={() => setShowLogin(true)} className="text-white hover:text-blue-300 transition-colors duration-200">
                Login
              </button>
              <button onClick={() => alert('Please login to view bookings')} className="text-white hover:text-blue-300 transition-colors duration-200">
                Bookings
              </button>
              <button onClick={() => alert('Contact feature coming soon!')} className="text-white hover:text-blue-300 transition-colors duration-200">
                Contact
              </button>
            </div>
          </div>
          <div className="border-t border-blue-900 mt-6 pt-6 text-center text-blue-200">
            <p>© 2025 CarRental Rentals. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;