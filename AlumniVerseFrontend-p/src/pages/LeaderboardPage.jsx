import React, { useState, useEffect } from 'react';
import { getLeaderboardData } from '../api';
import { Trophy, Briefcase, UserCheck, MessageSquare } from 'lucide-react';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState({ 
    topAlumniByPoints: [], 
    topMentors: [], 
    topJobPosters: [], 
    topPosters: [] 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await getLeaderboardData(token);
        setLeaderboard(data);
      } catch (err) {
        setError('Could not fetch leaderboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // Helper function for consistent image fallbacks
  const getAvatar = (user) => {
    return user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff`;
  };

  if (loading) return <div className="mt-20 text-center">Loading leaderboard...</div>;
  if (error) return <div className="mt-20 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto mt-1 px-4 space-y-12 pb-10">
      {/* Main Points Leaderboard */}
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <Trophy className="mx-auto h-16 w-16 text-yellow-500" />
        <h1 className="text-4xl font-bold text-gray-800 mt-4">Top Alumni Leaderboard</h1>
        <p className="text-gray-600 mt-2 text-lg">Ranking based on overall community contributions.</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="space-y-4">
            {leaderboard.topAlumniByPoints.map((alumnus, index) => (
              <div key={alumnus._id} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0 hover:bg-gray-50 transition p-2 rounded-lg">
                <div className="flex items-center">
                  <span className={`text-2xl font-bold w-10 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-400' : 'text-gray-300'}`}>
                    {index + 1}
                  </span>
                  <img 
                    src={getAvatar(alumnus)} 
                    alt={alumnus.name} 
                    className="h-12 w-12 rounded-full mx-4 object-cover border-2 border-gray-100" 
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${alumnus.name}`; }}
                  />
                  <div>
                    <p className="font-bold text-gray-800 text-lg">{alumnus.name}</p>
                    <p className="text-sm text-gray-500">{alumnus.jobTitle || 'Alumnus'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600 text-xl">{alumnus.points} pts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category-Specific Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Mentors */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <UserCheck className="mr-3 text-blue-500" /> Top Mentors
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md space-y-5">
            {leaderboard.topMentors.map((user, index) => (
              <div key={user._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-gray-400 w-5">{index + 1}.</span>
                  <img 
                    src={getAvatar(user)} 
                    className="h-8 w-8 rounded-full object-cover" 
                    alt={user.name}
                  />
                  <p className="font-semibold text-gray-700">{user.name}</p>
                </div>
                <p className="font-bold text-blue-600">{user.count} Mentees</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Job Posters */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Briefcase className="mr-3 text-green-500" /> Top Job Posters
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md space-y-5">
            {leaderboard.topJobPosters.map((user, index) => (
              <div key={user._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-gray-400 w-5">{index + 1}.</span>
                  <img 
                    src={getAvatar(user)} 
                    className="h-8 w-8 rounded-full object-cover" 
                    alt={user.name}
                  />
                  <p className="font-semibold text-gray-700">{user.name}</p>
                </div>
                <p className="font-bold text-green-600">{user.count} Jobs</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Posters */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <MessageSquare className="mr-3 text-yellow-500" /> Top Posters
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md space-y-5">
            {leaderboard.topPosters.map((user, index) => (
              <div key={user._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-gray-400 w-5">{index + 1}.</span>
                  <img 
                    src={getAvatar(user)} 
                    className="h-8 w-8 rounded-full object-cover" 
                    alt={user.name}
                  />
                  <p className="font-semibold text-gray-700">{user.name}</p>
                </div>
                <p className="font-bold text-yellow-600">{user.count} Posts</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;