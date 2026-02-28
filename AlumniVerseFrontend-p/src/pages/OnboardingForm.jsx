import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { updateUserProfile, uploadProfilePicture, completeOnboarding } from '../api';
import { Camera } from 'lucide-react';

const OnboardingForm = ({ onLogin }) => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    collegeName: '',
    graduationYear: '',
    currentCompany: '',
    jobTitle: '',
    expectedGraduationYear: '',
    major: '',
    careerGoals: '',
  });

  // Extract token and user data from URL parameters (for OAuth redirect)
  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    const name = searchParams.get('name');
    const email = searchParams.get('email');

    if (token && userId && name && email) {
      // Store authentication data from OAuth redirect
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userRole', role);
    }
  }, [searchParams, role]);

  const { name, collegeName, graduationYear, currentCompany, jobTitle, expectedGraduationYear, major, careerGoals } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const isAlumni = role === 'alumni';
  const roleDisplay = role.charAt(0).toUpperCase() + role.slice(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not authenticated. Please log in again.');
        return;
      }

      // 1. Prepare and send the text-based profile data
      const profileData = { name, collegeName, fromOnboarding: true };
      if (isAlumni) {
        Object.assign(profileData, { graduationYear, currentCompany, jobTitle });
      } else {
        Object.assign(profileData, { expectedGraduationYear, major, careerGoals });
      }
      await updateUserProfile(token, profileData);

      // 2. If an image was selected, upload it
      if (imageFile) {
        await uploadProfilePicture(token, imageFile);
      }

      // 3. Mark onboarding as complete
      await completeOnboarding(token);

      // 4. Update local state and navigate to home
      const userName = localStorage.getItem('userName');
      onLogin(role, userName);
      navigate('/home', { replace: true });

    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome to the Community!</h1>
        <p className="text-center text-gray-500 mb-8">Please complete your {roleDisplay} profile to continue.</p>

        {error && <p className="text-center text-red-500 bg-red-100 p-2 rounded-md my-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center mb-6">
            <label className="relative cursor-pointer">
              <img
                src={imagePreview || 'https://i.pravatar.cc/150'}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity">
                <Camera />
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={onImageChange} />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" name="name" value={name} onChange={onChange} required className="w-full mt-1 p-3 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">College/University Name</label>
              <input type="text" name="collegeName" value={collegeName} onChange={onChange} required className="w-full mt-1 p-3 border border-gray-300 rounded-lg" />
            </div>

            {isAlumni ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
                  <input type="number" name="graduationYear" value={graduationYear} onChange={onChange} required className="w-full mt-1 p-3 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Company</label>
                  <input type="text" name="currentCompany" value={currentCompany} onChange={onChange} required className="w-full mt-1 p-3 border border-gray-300 rounded-lg" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Job Title / Designation</label>
                  <input type="text" name="jobTitle" value={jobTitle} onChange={onChange} required className="w-full mt-1 p-3 border border-gray-300 rounded-lg" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expected Graduation Year</label>
                  <input type="number" name="expectedGraduationYear" value={expectedGraduationYear} onChange={onChange} required className="w-full mt-1 p-3 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Major / Field of Study</label>
                  <input type="text" name="major" value={major} onChange={onChange} required className="w-full mt-1 p-3 border border-gray-300 rounded-lg" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Career Goals</label>
                  <textarea rows="3" name="careerGoals" value={careerGoals} onChange={onChange} className="w-full mt-1 p-3 border border-gray-300 rounded-lg"></textarea>
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-8 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Complete Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingForm;