import React, { useState, useEffect } from 'react';
import ApiSchool from '../../services/ApiSchool';
import ApiUser from '../../services/ApiUser';

const SchoolProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 1. Get current user to get their schoolId
      const userResponse = await ApiUser.getCurrentUser();
      const user = userResponse.data;
      const schoolId = user.schoolId;
      
      if (!schoolId) {
        throw new Error("You are not associated with any school profile.");
      }

      // 2. Get school details
      const schoolResponse = await ApiSchool.getSchool(schoolId);
      setProfile(schoolResponse.data);
      setFormData(schoolResponse.data);
    } catch (err) {
      console.error("Error fetching school profile:", err);
      setError(err.response?.data?.message || err.message || "Failed to load school profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleListChange = (key, index, value) => {
    const newList = [...formData[key]];
    newList[index] = value;
    setFormData(prev => ({
      ...prev,
      [key]: newList
    }));
  };

  const handleAddListItem = (key, defaultValue = "") => {
    setFormData(prev => ({
      ...prev,
      [key]: [...prev[key], defaultValue]
    }));
  };

  const handleRemoveListItem = (key, index) => {
    setFormData(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index)
    }));
  };

  const handleLeadershipChange = (index, field, value) => {
    const newLeadership = [...formData.leadership];
    newLeadership[index] = { ...newLeadership[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      leadership: newLeadership
    }));
  };

  const handleAddLeadership = () => {
    setFormData(prev => ({
      ...prev,
      leadership: [...prev.leadership, { name: "", position: "" }]
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Clean data for API
      const updateRequest = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        startedYear: parseInt(formData.startedYear),
        studentCount: parseInt(formData.studentCount),
        teachersCount: parseInt(formData.teachersCount),
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        contact: formData.contact,
        leadership: formData.leadership,
        academicStreams: formData.academicStreams,
        schoolFacilities: formData.schoolFacilities,
        clubsAndSocieties: formData.clubsAndSocieties,
        achievements: formData.achievements,
        sponsors: formData.sponsors,
        socialMediaUrls: formData.socialMediaUrls
      };

      const response = await ApiSchool.updateSchool(profile.id, updateRequest);
      setProfile(response.data);
      setIsEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile: " + (err.response?.data || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (type, file) => {
    if (!file) return;
    
    try {
      setSaving(true);
      const formDataObj = new FormData();
      if (type === 'logo') formDataObj.append('logo', file);
      else if (type === 'cover') formDataObj.append('cover', file);
      else if (type === 'gallery') formDataObj.append('gallery', file);

      const response = await ApiSchool.updateImages(profile.id, formDataObj);
      setProfile(response.data);
      setFormData(response.data);
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`);
    } catch (err) {
      console.error(`Error uploading ${type}:`, err);
      alert(`Failed to upload ${type}: ` + (err.response?.data || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading school profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card shadow-md border-red-100 bg-red-50 p-8 text-center text-red-600 rounded-3xl">
        <p className="mb-4">{error}</p>
        <button onClick={fetchProfile} className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-white shadow-sm border border-gray-100 mb-8">
        {/* Cover Image Placeholder */}
        <div className="h-48 md:h-72 bg-gray-100 relative group">
          {profile.coverImageUrl ? (
            <img src={profile.coverImageUrl} alt="School Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-blue-50 to-indigo-50">
               <span className="text-6xl">📸</span>
            </div>
          )}
          <div className="absolute top-4 right-4 flex gap-2">
            <label className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-sm font-medium text-gray-700 cursor-pointer shadow-sm hover:bg-white transition flex items-center gap-2">
              <span>📷 Update Cover</span>
              <input type="file" className="hidden" onChange={(e) => handleImageUpload('cover', e.target.files[0])} accept="image/*" />
            </label>
            {!isEditMode ? (
              <button 
                onClick={() => setIsEditMode(true)} 
                className="bg-blue-600 px-6 py-2 rounded-xl text-sm font-medium text-white shadow-md hover:bg-blue-700 transition flex items-center gap-2"
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditMode(false)} 
                  className="bg-gray-100 px-6 py-2 rounded-xl text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="bg-green-600 px-6 py-2 rounded-xl text-sm font-medium text-white shadow-md hover:bg-green-700 transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "💾 Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Identity */}
        <div className="px-6 pb-6 -mt-16 md:-mt-20 relative flex flex-col md:flex-row items-end gap-6">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-white p-2 shadow-xl border border-gray-100 overflow-hidden ring-4 ring-white">
              {profile.logoUrl ? (
                <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-300">
                  <span className="text-4xl font-bold">{profile.name?.charAt(0)}</span>
                </div>
              )}
            </div>
            <label className="absolute bottom-2 right-2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition ring-2 ring-white">
              <span className="text-lg">➕</span>
              <input type="file" className="hidden" onChange={(e) => handleImageUpload('logo', e.target.files[0])} accept="image/*" />
            </label>
          </div>
          
          <div className="flex-1 pb-2">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{profile.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">{profile.type}</span>
              {profile.isVerified && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">✓ Verified</span>}
              {!profile.isApproved && <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">Pending Approval</span>}
              <span className="text-gray-500 text-sm font-medium flex items-center gap-1">
                📍 {profile.contact.city}, {profile.contact.district}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 space-y-2">
          {[
            { id: 'general', label: 'General Information', icon: '🏫' },
            { id: 'contact', label: 'Contact & Location', icon: '📞' },
            { id: 'academic', label: 'Academic & Facilities', icon: '📚' },
            { id: 'administration', label: 'Leadership', icon: '👤' },
            { id: 'gallery', label: 'Media Gallery', icon: '🖼️' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 text-left ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-1' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-transparent'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="font-semibold text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-10">
            {activeTab === 'general' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h3 className="text-xl font-bold text-gray-900">General Information</h3>
                  {isEditMode && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold uppercase">Editing Mode</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">School Name</label>
                    <input 
                      type="text" 
                      name="name"
                      disabled={!isEditMode}
                      value={isEditMode ? formData.name : profile.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:text-gray-900 font-medium" 
                      placeholder="Enter school name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">School Type</label>
                    <select 
                      name="type"
                      disabled={!isEditMode}
                      value={isEditMode ? formData.type : profile.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:text-gray-900 font-medium appearance-none"
                    >
                      <option value="Government">Government</option>
                      <option value="Private">Private</option>
                      <option value="Semi-Government">Semi-Government</option>
                      <option value="International">International</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                  <textarea 
                    name="description"
                    disabled={!isEditMode}
                    rows="5"
                    value={isEditMode ? formData.description : profile.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:text-gray-900 font-medium resize-none leading-relaxed"
                    placeholder="Describe your school's mission, history, and values..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Started Year</label>
                    <input 
                      type="number" 
                      name="startedYear"
                      disabled={!isEditMode}
                      value={isEditMode ? formData.startedYear : profile.startedYear}
                      onChange={handleInputChange}
                      className="bg-transparent border-none outline-none font-bold text-lg text-gray-900 w-full p-0" 
                    />
                  </div>
                  <div className="space-y-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Student Count</label>
                    <input 
                      type="number" 
                      name="studentCount"
                      disabled={!isEditMode}
                      value={isEditMode ? formData.studentCount : profile.studentCount}
                      onChange={handleInputChange}
                      className="bg-transparent border-none outline-none font-bold text-lg text-gray-900 w-full p-0" 
                    />
                  </div>
                  <div className="space-y-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Teachers Count</label>
                    <input 
                      type="number" 
                      name="teachersCount"
                      disabled={!isEditMode}
                      value={isEditMode ? formData.teachersCount : profile.teachersCount}
                      onChange={handleInputChange}
                      className="bg-transparent border-none outline-none font-bold text-lg text-gray-900 w-full p-0" 
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Contact & Location</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                    <input 
                      type="tel" 
                      name="contact.phone"
                      disabled={!isEditMode}
                      value={isEditMode ? formData.contact.phone : profile.contact.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition disabled:bg-gray-50 font-medium" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      name="contact.email"
                      disabled={!isEditMode}
                      value={isEditMode ? formData.contact.email : profile.contact.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition disabled:bg-gray-50 font-medium" 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Website URL</label>
                    <input 
                      type="url" 
                      name="contact.website"
                      disabled={!isEditMode}
                      value={isEditMode ? formData.contact.website : profile.contact.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition disabled:bg-gray-50 font-medium" 
                      placeholder="https://www.example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Street Address</label>
                  <input 
                    type="text" 
                    name="contact.address"
                    disabled={!isEditMode}
                    value={isEditMode ? formData.contact.address : profile.contact.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition disabled:bg-gray-50 font-medium" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">City</label>
                    <input 
                      type="text" 
                      name="contact.city"
                      disabled={!isEditMode}
                      value={isEditMode ? formData.contact.city : profile.contact.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition disabled:bg-gray-50 font-medium" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">District</label>
                    <input 
                      type="text" 
                      name="contact.district"
                      disabled={!isEditMode}
                      value={isEditMode ? formData.contact.district : profile.contact.district}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition disabled:bg-gray-50 font-medium" 
                    />
                  </div>
                </div>

                <div className="space-y-6 pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔗</span>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Social Media Links</h4>
                  </div>
                  <div className="space-y-4">
                    {(isEditMode ? formData.socialMediaUrls : profile.socialMediaUrls).map((url, idx) => (
                      <div key={idx} className="flex gap-2 group animate-in slide-in-from-left-4 duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                        <div className="flex-1 relative">
                          <input 
                            type="url" 
                            disabled={!isEditMode}
                            value={url}
                            onChange={(e) => handleListChange('socialMediaUrls', idx, e.target.value)}
                            className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition disabled:bg-gray-50 font-medium" 
                            placeholder="Link to social page"
                          />
                          {!isEditMode && url && (
                             <a href={url} target="_blank" rel="noopener noreferrer" className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700">
                               ↗
                             </a>
                          )}
                        </div>
                        {isEditMode && (
                          <button onClick={() => handleRemoveListItem('socialMediaUrls', idx)} className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition">
                            🗑️
                          </button>
                        )}
                      </div>
                    ))}
                    {isEditMode && (
                      <button onClick={() => handleAddListItem('socialMediaUrls')} className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-blue-600 font-bold hover:bg-blue-50 hover:border-blue-200 transition">
                        + Add Social Link
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'academic' && (
              <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Academic & Facilities</h3>
                
                {/* Academic Streams */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Academic Streams</label>
                  <div className="flex flex-wrap gap-3">
                    {(isEditMode ? formData.academicStreams : profile.academicStreams).map((stream, idx) => (
                      <div key={idx} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-3 animate-in zoom-in-95 duration-300">
                        {isEditMode ? (
                          <>
                            <input 
                              type="text" 
                              value={stream} 
                              onChange={(e) => handleListChange('academicStreams', idx, e.target.value)}
                              className="bg-transparent border-none outline-none text-sm w-32 focus:ring-0 p-0"
                            />
                            <button onClick={() => handleRemoveListItem('academicStreams', idx)} className="text-red-400 font-black hover:text-red-600">×</button>
                          </>
                        ) : (
                          <span>{stream}</span>
                        )}
                      </div>
                    ))}
                    {isEditMode && (
                      <button onClick={() => handleAddListItem('academicStreams')} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold border-2 border-dashed border-gray-200 hover:bg-gray-200 transition">+ Add Stream</button>
                    )}
                  </div>
                </div>

                {/* Facilities */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">School Facilities</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(isEditMode ? formData.schoolFacilities : profile.schoolFacilities).map((facility, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50/50 border border-gray-100 rounded-2xl group transition hover:border-blue-200 hover:bg-white">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </div>
                        {isEditMode ? (
                          <div className="flex-1 flex gap-2">
                            <input 
                              type="text" 
                              value={facility} 
                              onChange={(e) => handleListChange('schoolFacilities', idx, e.target.value)}
                              className="bg-transparent border-none outline-none text-sm font-medium flex-1 focus:ring-0 p-0"
                            />
                            <button onClick={() => handleRemoveListItem('schoolFacilities', idx)} className="text-red-400 opacity-0 group-hover:opacity-100 transition">🗑️</button>
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-gray-700">{facility}</span>
                        )}
                      </div>
                    ))}
                    {isEditMode && (
                      <button onClick={() => handleAddListItem('schoolFacilities')} className="py-4 border-2 border-dashed border-gray-200 rounded-2xl text-blue-600 font-bold hover:bg-blue-50 transition col-span-full">
                        + Add Facility
                      </button>
                    )}
                  </div>
                </div>

                {/* Clubs & Societies */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Clubs & Societies</label>
                   <div className="flex flex-wrap gap-3">
                    {(isEditMode ? formData.clubsAndSocieties : profile.clubsAndSocieties).map((club, idx) => (
                      <div key={idx} className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-3 animate-in zoom-in-95 duration-300">
                         {isEditMode ? (
                          <>
                            <input 
                              type="text" 
                              value={club} 
                              onChange={(e) => handleListChange('clubsAndSocieties', idx, e.target.value)}
                              className="bg-transparent border-none outline-none text-sm w-40 focus:ring-0 p-0"
                            />
                            <button onClick={() => handleRemoveListItem('clubsAndSocieties', idx)} className="text-red-400 font-black hover:text-red-600">×</button>
                          </>
                        ) : (
                          <span>{club}</span>
                        )}
                      </div>
                    ))}
                    {isEditMode && (
                      <button onClick={() => handleAddListItem('clubsAndSocieties')} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold border-2 border-dashed border-gray-200 hover:bg-gray-200 transition">+ Add Club</button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'administration' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">School Leadership</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(isEditMode ? formData.leadership : profile.leadership).map((member, idx) => (
                    <div key={idx} className="p-6 border border-gray-100 rounded-3xl bg-gray-50/30 space-y-4 relative group hover:shadow-lg hover:bg-white transition duration-300">
                      <div className="flex justify-between items-start">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg flex items-center justify-center text-2xl">
                          👤
                        </div>
                        {isEditMode && (
                          <button onClick={() => handleRemoveListItem('leadership', idx)} className="text-red-500 bg-red-50 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-100 transition">
                            REMOVE
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</label>
                          <input 
                            type="text" 
                            disabled={!isEditMode}
                            value={member.name}
                            onChange={(e) => handleLeadershipChange(idx, 'name', e.target.value)}
                            className="bg-transparent border-none outline-none w-full font-extrabold text-gray-800 text-lg p-0 focus:ring-0"
                            placeholder="Full Name"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Position</label>
                          <input 
                            type="text" 
                            disabled={!isEditMode}
                            value={member.position}
                            onChange={(e) => handleLeadershipChange(idx, 'position', e.target.value)}
                            className="bg-transparent border-none outline-none w-full text-base text-blue-600 font-bold p-0 focus:ring-0"
                            placeholder="e.g. Principal"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {isEditMode && (
                    <button 
                      onClick={handleAddLeadership} 
                      className="p-10 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-4 hover:bg-blue-50 hover:border-blue-200 transition-all group"
                    >
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition">➕</div>
                      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Add Board Member</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h3 className="text-xl font-bold text-gray-900">Photo Gallery</h3>
                  <label className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold cursor-pointer hover:bg-blue-700 transition shadow-lg shadow-blue-100">
                    <span>📤 Upload Photos</span>
                    <input type="file" multiple className="hidden" onChange={(e) => handleImageUpload('gallery', e.target.files[0])} accept="image/*" />
                  </label>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {profile.photoGallery?.map((photo, idx) => (
                    <div key={idx} className="aspect-square rounded-[2rem] overflow-hidden bg-gray-100 relative group shadow-sm">
                      <img src={photo} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-6">
                        <button className="bg-white text-gray-900 px-4 py-2 rounded-xl text-xs font-bold w-full">🔍 Full View</button>
                      </div>
                    </div>
                  ))}
                  {profile.photoGallery?.length === 0 && (
                    <div className="col-span-full py-20 border-2 border-dashed border-gray-100 rounded-[2.5rem] text-center flex flex-col items-center gap-4">
                      <span className="text-5xl opacity-20">🖼️</span>
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No photos in gallery yet</p>
                    </div>
                  )}
                </div>
                
                <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-lg font-bold mb-2">Build Trust with Photos ✨</h4>
                    <p className="text-blue-100 text-sm leading-relaxed max-w-md">
                      High-quality photos of your school buildings, recent events, and student life significantly increase community engagement and trust.
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolProfile;