'use client';

import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { toast } from "react-hot-toast";
import { setUser } from "../../../redux/userSlice"; 

// inside if(success)

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }
    
    try {
      toast.loading("Logging in...", { id: "login" });
      
      const res = await axios.post(`${BASE_URL}/auth/login`, formData, {
        withCredentials: true, // crucial for receiving cookies
      });
      // console.log(res.data)
      const { success, user, message, token} = res.data;
      
      if (success) {
        dispatch(setUser(user));
        localStorage.setItem("token", JSON.stringify(token));
        // localStorage.setItem("user", JSON.stringify(user));
        // Decode token to get user info
  
        toast.success("Login successful!", { id: "login" });
        router.push("/");
        router.refresh();
      } else {
        toast.error(message || "Login failed", { id: "login" });
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong", { id: "login" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4">
      <div className="max-w-md w-full bg-neutral-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back 👋</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-neutral-800 text-white border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-neutral-800 text-white border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex justify-end text-sm">
            <a href="#" className="text-green-400 hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded-md transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-neutral-400">
          Don't have an account?{' '}
          <a href="/auth/signup" className="text-green-400 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
