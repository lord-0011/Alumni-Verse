import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile, uploadProfilePicture } from '../api';
import { Camera } from 'lucide-react';

const ProfileEditPage = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await getUserProfile(token);
          setFormData(data);
          setImagePreview(data.profilePicture || `https://ui-avatars.com/api/?name=${data.name}&background=0D8ABC&color=fff`);
        } catch (err) {
          setError('Could not load profile data.');
        }
      }
    };
    fetchProfile();
  }, []);
  
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await updateUserProfile(token, formData);
      
      if (imageFile) {
        const newPictureData = await uploadProfilePicture(token, imageFile);
        localStorage.setItem('userProfilePicture', newPictureData.profilePicture);
        // This triggers the Navbar and other components to update the image immediately
        window.dispatchEvent(new Event("storage"));
      }
      
      navigate('/profile');
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto mt-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Your Profile</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="flex flex-col items-center">
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
          <label className="relative cursor-pointer group">
            <img 
              src={imagePreview} 
              alt="Profile Preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-sm"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={24} />
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={onImageChange} />
          </label>
          <p className="text-xs text-gray-400 mt-2">Click image to change</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <p className="w-full mt-1 p-3 bg-gray-100 text-gray-500 rounded-lg">{formData.name || ''}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">College Name</label>
          <p className="w-full mt-1 p-3 bg-gray-100 text-gray-500 rounded-lg">{formData.collegeName || ''}</p>
        </div>

        {formData.role === 'alumni' ? (
           <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
              <input type="number" name="graduationYear" value={formData.graduationYear || ''} onChange={onChange} className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Company</label>
              <input type="text" name="currentCompany" value={formData.currentCompany || ''} onChange={onChange} className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <input type="text" name="jobTitle" value={formData.jobTitle || ''} onChange={onChange} className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
           </>
        ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Expected Graduation</label>
                <input type="number" name="expectedGraduationYear" value={formData.expectedGraduationYear || ''} onChange={onChange} className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Major</label>
                <input type="text" name="major" value={formData.major || ''} onChange={onChange} className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Career Goals</label>
                <textarea rows="3" name="careerGoals" value={formData.careerGoals || ''} onChange={onChange} className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
              </div>
            </>
        )}
        <button type="submit" className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileEditPage;