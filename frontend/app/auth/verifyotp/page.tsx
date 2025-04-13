'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { clearSignupData } from '../../../redux/signupSlice';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import type { RootState } from '../../../redux/store';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const VerifyOtpPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const { name, email, password } = useSelector((state: RootState) => state.signup);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/auth/signup`, {
        name,
        email,
        password,
        otp,
      });

      if (res.data && res.data.success) {
        toast.success('Account created successfully!');
        dispatch(clearSignupData());
        router.push('/auth/login');
      } else {
        const msg = res.data?.message || 'Invalid OTP or server error';
        toast.error(msg);
      }
    } catch (err: any) {
      console.error('Signup verification error:', err);
      const message =
        err?.response?.data?.message || 'Something went wrong while verifying OTP';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error('Missing email. Please return to signup.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/auth/sendotp`, {
        email,
      });

      if (res.data && res.data.success) {
        toast.success('OTP resent successfully!');
      } else {
        const msg = res.data?.message || 'Failed to resend OTP';
        toast.error(msg);
      }
    } catch (err: any) {
      console.error('Resend OTP error:', err);
      const message =
        err?.response?.data?.message ||
        'An error occurred while trying to resend the OTP';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4">
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}

      <div className="max-w-md w-full bg-neutral-900 p-8 rounded-lg shadow-lg relative z-10">
        <h2 className="text-3xl font-bold text-center mb-6">Verify OTP 🔐</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="otp" className="block text-sm mb-1">
              Enter OTP sent to{' '}
              <span className="text-green-400">{email || 'your email'}</span>
            </label>
            <input
              type="text"
              name="otp"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded-md transition"
          >
            {loading ? 'Verifying...' : 'Verify & Create Account'}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-neutral-400">
          Didn’t receive OTP?{' '}
          <span
            onClick={handleResend}
            className="text-green-400 hover:underline cursor-pointer"
          >
            Resend
          </span>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
