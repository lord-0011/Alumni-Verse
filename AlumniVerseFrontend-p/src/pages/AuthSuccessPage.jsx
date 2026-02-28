import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthSuccessPage = ({ onLogin }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    const name = searchParams.get('name');
    const role = searchParams.get('role');
    const email = searchParams.get('email');
    const isOnboarded = searchParams.get('isOnboarded') === 'true';

    if (token && userId && name && role && email) {
      // Store authentication data
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', name);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userEmail', email);

      // Call the onLogin callback
      onLogin(role, name, false);

      // Redirect based on onboarding status
      if (isOnboarded) {
        // User completed onboarding → go to home
        setIsProcessing(false);
        // Force a hard reload to ensure state is correctly initialized from localStorage
        // This fixes the blank screen issue on redirect
        window.location.href = '/home';
      } else {
        // If not onboarded, redirect to onboarding page with the role and original params
        setIsProcessing(false);
        navigate(`/onboarding/${role}?${searchParams.toString()}`);
      }
    } else {
      setIsProcessing(false);
      setError('Authentication failed. Missing required data.');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [searchParams, navigate, onLogin]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-700">{error}</p>
          <p className="text-sm text-gray-500 mt-4">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  // Show minimal loading screen
  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthSuccessPage;
