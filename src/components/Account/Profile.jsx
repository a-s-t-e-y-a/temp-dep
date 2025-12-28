import React, { useState } from 'react';
import { PiPencilSimpleLine } from 'react-icons/pi';
import { LuCalendarDays } from 'react-icons/lu';
import { assets } from '../../assets/assets';

const Profile = ({
  name,
  setName,
  email,
  setEmail,
  dob,
  setDob,
  isEditing,
  setIsEditing,
  loading,
  handleSaveChanges,
  dateInputRef,
  handleCalendarClick
}) => {
  const [emailError, setEmailError] = useState('');
  const validateEmail = (value) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(value);
  };
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (isEditing && value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };
  return (
    <>
    {/* Mobile sheet */}
    <div className="lg:hidden md:hidden fixed top-0 right-0 w-full h-full z-50 bg-white transform transition-transform duration-300 ease-in-out translate-x-0">
      <div className="text-[20px] font-[700] px-3 py-3">
        <div className="flex ml-0 pl-0 gap-2 py-2">
          <button onClick={() => setIsEditing(false)} className="ml-0 pl-0 mr-2">
            {/* Back button handled in parent */}
          </button>
          <div>My Profile</div>
        </div>
        <form
          className="flex flex-col gap-3 border-2 border-[#D9D9D9] rounded-[10px] p-3 mx-2 mt-2"
          onSubmit={e => {
            e.preventDefault();
            handleSaveChanges();
          }}
        >
          {/* Full Name */}
          <div>
            <label className="text-[14px] font-[500] text-black mb-1 block">Full Name</label>
            <div className="relative">
              <input
                type="text"
                value={name ?? ''}
                readOnly={!isEditing}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                onFocus={e => {
                  if (isEditing) e.target.select();
                }}
                className={`w-full px-2 py-1 font-[600] border border-[#D9D9D9] text-[14px] ${
                  isEditing
                    ? 'bg-white text-black'
                    : 'bg-[#F1F1F1] text-[#4D4D4D] pointer-events-none'
                } rounded-[5px] pr-10 placeholder:text-gray-400 placeholder:opacity-100`}
              />
              <PiPencilSimpleLine
                onClick={() => setIsEditing(true)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black text-sm cursor-pointer"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-[14px] font-[500] text-black mb-1 block">Email</label>
            <div className="relative">
              <input
                type="email"
                value={email ?? ''}
                readOnly={!isEditing}
                onChange={handleEmailChange}
                placeholder="yourname@gmail.com"
                onFocus={e => {
                  if (isEditing) e.target.select();
                }}
                autoComplete="email"
                className={`w-full px-2 py-1 font-[600] border border-[#D9D9D9] text-[14px] ${
                  isEditing
                    ? 'bg-white text-black'
                    : 'bg-[#F1F1F1] text-[#4D4D4D] pointer-events-none'
                } rounded-[5px] pr-10 placeholder:text-gray-400 placeholder:opacity-100`}
              />
              <PiPencilSimpleLine
                onClick={() => setIsEditing(true)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black text-sm cursor-pointer"
              />
            </div>
            {emailError && (
              <div className="text-red-500 text-xs mt-1">{emailError}</div>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="text-[14px] font-[500] text-black mb-1 block">Date of birth</label>
            <div className="relative">
              {isEditing ? (
                <input
                  type="date"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  className="w-full px-2 py-1 font-[600] border border-[#D9D9D9] text-[14px] bg-white text-black rounded-[5px] pr-10"
                />
              ) : (
                <input
                  type="text"
                  value={dob ? new Date(dob).toLocaleDateString() : ''}
                  readOnly
                  placeholder="dd-mm-yyyy"
                  className="w-full px-2 py-1 font-[600] border border-[#D9D9D9] text-[14px] bg-[#F1F1F1] text-[#4D4D4D] rounded-[5px] pr-10"
                />
              )}
              <LuCalendarDays
                onClick={() => {
                  if (isEditing && dateInputRef?.current) dateInputRef.current.showPicker?.();
                }}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-black text-base ${isEditing ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-[14px] font-[500] text-black mb-1 block">Phone Number</label>
            <input
              type="text"
              value={localStorage.getItem('userPhone') || 'N/A'}
              disabled
              className="w-full px-2 py-1 bg-[#F1F1F1] font-[600] border border-[#D9D9D9] text-[14px] text-[#959595] rounded-[5px] pr-10"
            />
          </div>

          {isEditing && (
            <button
              type="submit"
              className="bg-[#005f78] lg:hover:bg-[#004a5d] text-white text-sm font-medium py-2 rounded-md mt-2"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </form>
      </div>
    </div>
    {/* Desktop card */}
    <div className="lg:w-full md:w-[470px] max-w-2xl hidden lg:block md:block bg-white border-2 border-[#D9D9D9] rounded-[15px]">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-8 mt-3 ml-2">
          <img src={assets.profile} alt="Profile" loading="lazy" className="max-w-full lg:h-16 h-8 rounded-full" />
          <div>
            <div className="text-[14px] lg:text-[17px] font-semibold">{name || 'Your name'}</div>
            <div className="text-[14px] lg:text-[17px] text-black">{email || 'yourname@gmail.com'}</div>
          </div>
          <div className="ml-auto mr-4">
            <img
              src={assets.edit}
              alt="Edit"
              className="max-w-full lg:h-8 h-4 cursor-pointer"
              onClick={() => setIsEditing(true)}
            />
          </div>
        </div>
        <div className="space-y-5 text-[16px] font-[400]">
          <div className="flex justify-between items-center w-full">
            <div className="text-black ml-4 w-[200px]">Full Name</div>
            {isEditing ? (
              <input
                type="text"
                value={name ?? ''}
                placeholder="Your name"
                onChange={e => setName(e.target.value)}
                onFocus={e => e.target.select()}
                className="mr-4 border rounded px-2 py-1 w-[60%] placeholder:text-gray-400 placeholder:opacity-100"
              />
            ) : (
              <span className="text-[#7B7B7B] mr-4 text-right">{name || 'Your name'}</span>
            )}
          </div>
          <hr className="mb-3 mx-3" />
          <div className="flex justify-between items-center w-full">
            <div className="text-black ml-4 w-[150px]">Email Account</div>
            {isEditing ? (
              <div className="flex flex-col w-[70%]">
                <input
                  type="email"
                  value={email ?? ''}
                  placeholder="yourname@gmail.com"
                  onChange={handleEmailChange}
                  onFocus={e => e.target.select()}
                  autoComplete="email"
                  className="mr-4 border rounded px-2 py-1 placeholder:text-gray-400 placeholder:opacity-100"
                  required
                />
                {emailError && (
                  <span className="text-red-500 text-xs mt-1">{emailError}</span>
                )}
              </div>
            ) : (
              <span className="text-[#7B7B7B] mr-4 underline text-right">{email || 'yourname@gmail.com'}</span>
            )}
          </div>
          <hr className="mb-3 mx-3" />
          <div className="flex justify-between items-center w-full">
            <div className="text-black ml-4 w-[320px]">Mobile Number</div>
            <span className="text-[#7B7B7B] mr-4 text-right">
              {localStorage.getItem('userPhone') || 'N/A'}
            </span>
          </div>
          <hr className="mb-3 mx-3" />
          <div className="flex justify-between items-center w-full">
            <div className="text-black ml-4 w-[200px]">Date Of Birth</div>
            {isEditing ? (
              <input
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                className="mr-4 border rounded px-2 py-1 w-[60%]"
              />
            ) : (
              <span className="text-[#7B7B7B] mr-4 text-right">
                {dob ? new Date(dob).toLocaleDateString() : 'Not set'}
              </span>
            )}
          </div>
          {isEditing && (
            <div className="mt-12 ml-4 text-left">
              <button
                className="bg-[#0C5273] text-white font-semibold text-[16px] sm:text-[18px] md:text-[20px] px-8 sm:px-10 py-2 rounded-[10px]"
                onClick={handleSaveChanges}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </>
  );
};

export default Profile;
