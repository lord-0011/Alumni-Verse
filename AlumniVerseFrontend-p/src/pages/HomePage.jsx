import React from 'react';
import StudentDashboard from './StudentDashboard';
import AlumniDashboard from './AlumniDashboard';

const HomePage = ({ user, userName }) => {
  // Handle race condition: if user prop is null, try to get from localStorage
  let currentUser = user;
  let currentUserName = userName;

  if (!currentUser) {
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');

    if (role && name) {
      currentUser = { type: role };
      currentUserName = name;
    } else {
      // No user data at all - show loading
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      );
    }
  }

  // Safety check for user.type
  if (!currentUser.type) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check the user's role and render the appropriate dashboard,
  // passing down the user and userName props to both.
  if (currentUser.type === 'alumni') {
    return <AlumniDashboard user={currentUser} userName={currentUserName} />;
  } else {
    return <StudentDashboard user={currentUser} userName={currentUserName} />;
  }
};

export default HomePage;