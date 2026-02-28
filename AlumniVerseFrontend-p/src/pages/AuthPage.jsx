import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, User, Mail, Lock } from 'lucide-react';
import { BASE_URL } from "../api";
import backgroundImage from '../assets/background.jpg';
import ParticlesBackground from '../components/ParticlesBackground';

const AuthPage = ({ onLogin }) => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleAuth = () => {
    // Redirect to backend Google OAuth endpoint with role
    window.location.href = `${BASE_URL}/auth/google?role=${role}`;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    const config = { headers: { 'Content-Type': 'application/json' } };

    if (isLoginView) {
      try {
        const body = { email, password, role };
        const res = await axios.post(`${BASE_URL}/auth/login`, body, config);

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userName', res.data.name);
        localStorage.setItem('userRole', res.data.role);
        localStorage.setItem('userId', res.data._id);

        // Check if user has completed onboarding
        if (!res.data.isOnboarded) {
          // New user or incomplete onboarding → go to onboarding
          navigate(`/onboarding/${role}`);
        } else {
          // Existing user → go to home
          onLogin(res.data.role, res.data.name);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Login failed');
      }
    } else {
      try {
        const body = { name, email, password, role };
        const res = await axios.post(`${BASE_URL}/auth/register`, body, config);

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userName', res.data.name);
        localStorage.setItem('userRole', res.data.role);
        localStorage.setItem('userId', res.data._id);
        localStorage.setItem('userProfilePicture', res.data.profilePicture || "");

        // New signup always goes to onboarding
        navigate(`/onboarding/${role}`);
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed');
      }
    }
  };

  const title = isLoginView ? 'Login' : 'Sign Up';
  const roleDisplay = role.charAt(0).toUpperCase() + role.slice(1);

  // Background style (same as Landing Page)
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-start p-6 md:pl-[10%] lg:pl-[15%] relative overflow-hidden"
      style={backgroundStyle}
    >
      <ParticlesBackground />
      {/* Glassmorphism Card */}
      <div className="bg-white/40 backdrop-blur-xl border border-white/40 p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md transition-all duration-300 relative z-10">

        <header className="mb-8 text-center">
          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
            {roleDisplay} {title}
          </h1>
          <p className="text-gray-800 text-sm font-medium opacity-80">
            Welcome back! Please enter your details.
          </p>
        </header>

        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-900 text-sm font-medium text-center backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLoginView && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={name}
                onChange={onChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-500 text-gray-900"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={onChange}
              required
              className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-500 text-gray-900"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={onChange}
              required
              className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-500 text-gray-900"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center group"
          >
            {title}
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-900/10"></div>
          <span className="px-4 text-xs font-bold text-gray-800 uppercase tracking-widest">OR</span>
          <div className="flex-1 border-t border-gray-900/10"></div>
        </div>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleAuth}
          className="w-full bg-white/70 backdrop-blur-sm text-gray-700 font-bold py-3 px-4 rounded-xl border border-white/50 hover:bg-white hover:shadow-lg transition-all flex items-center justify-center gap-3 group"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {isLoginView ? 'Sign in' : 'Sign up'} with Google
        </button>

        <p className="text-center text-sm text-gray-800 mt-8 font-medium">
          {isLoginView ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => {
              setIsLoginView(!isLoginView);
              setError('');
            }}
            className="font-bold text-blue-700 hover:underline ml-2 transition-all"
          >
            {isLoginView ? 'Sign Up' : 'Login'}
          </button>
        </p>

        <footer className="mt-8 text-center">
          <button
            onClick={() => navigate('/landing')}
            className="text-xs text-gray-700 font-bold uppercase tracking-widest hover:text-gray-900 opacity-60 hover:opacity-100 transition-opacity"
          >
            ← Back to Home
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AuthPage;