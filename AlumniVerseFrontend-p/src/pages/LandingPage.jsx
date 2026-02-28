import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/background.jpg';
import ParticlesBackground from '../components/ParticlesBackground';

const LandingPage = () => {
  const navigate = useNavigate();

  // Ensure 'background.jpg' is placed inside your project's 'public' folder
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
      {/* Particles Animation */}
      <ParticlesBackground />

      {/* Glassmorphism Card:
        - bg-white/30: Semi-transparent
        - backdrop-blur-xl: The 'frosted glass' look
        - animate-in: Standard Tailwind entry animation
      */}
      <div className="bg-white/30 backdrop-blur-xl border border-white/40 p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md text-center transition-all duration-500 hover:shadow-white/20 relative z-10">

        <header className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight drop-shadow-sm">
            Welcome to <span className="text-blue-600">AlumniVerse</span>
          </h1>
          <p className="text-gray-800 font-bold opacity-90">
            Connect. Mentor. Grow.
          </p>
        </header>

        <div className="space-y-5">
          {/* Alumni Action */}
          <button
            onClick={() => navigate('/auth/alumni')}
            className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl hover:bg-blue-700 hover:scale-[1.03] active:scale-95 transition-all shadow-lg shadow-blue-500/40"
          >
            <span className="text-xl mr-3"></span>
            I am an Alumni
          </button>

          {/* Decorative Divider */}
          <div className="flex items-center py-2">
            <div className="flex-grow border-t border-gray-900/20"></div>
            <span className="px-4 text-gray-900 text-xs font-black uppercase tracking-widest">or</span>
            <div className="flex-grow border-t border-gray-900/20"></div>
          </div>

          {/* Student Action */}
          <button
            onClick={() => navigate('/auth/student')}
            className="w-full flex items-center justify-center bg-emerald-500 text-white font-bold py-4 px-6 rounded-2xl hover:bg-emerald-600 hover:scale-[1.03] active:scale-95 transition-all shadow-lg shadow-emerald-500/40"
          >
            <span className="text-xl mr-3"></span>
            I am a Student
          </button>
        </div>

        <footer className="mt-12">
          <p className="text-[10px] text-gray-900 uppercase tracking-[0.3em] font-bold opacity-50">
            AlumniVerse Network
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;