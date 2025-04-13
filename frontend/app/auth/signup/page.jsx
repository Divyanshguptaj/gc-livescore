'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setSignupData } from '../../../redux/signupSlice';
import axios from 'axios';
import Spinner from '../../../components/common/LoadingSpinner';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const SignupPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${BASE_URL}/auth/sendotp`, {
        email,
      });
      toast.success('OTP sent successfully!');
      if (!res.data.success) {
        toast.error(res.data.message || 'Failed to send OTP');
        return;
      }

      dispatch(setSignupData({ name, email, password }));
      router.push('/auth/verifyotp');
    } catch (error) {
      const errorMsg = error?.response?.data?.message || 'Something went wrong while sending OTP';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4">
      <div className="max-w-md w-full bg-neutral-900 p-8 rounded-lg shadow-lg relative z-10">
        <h2 className="text-3xl font-bold text-center mb-6">Create Account ✨</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
            } text-black font-semibold py-2 rounded-md transition`}
          >
            {loading ? 'Sending OTP...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-neutral-400">
          Already have an account?{' '}
          <a href="/auth/login" className="text-green-400 hover:underline">
            Login
          </a>
        </p>
      </div>

      {/* Full-page spinner overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default SignupPage;
