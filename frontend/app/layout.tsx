'use client';

import { Navbar } from "@/components/core/Navbar";
import "./globals.css";
import { Provider } from 'react-redux';
import {store} from '../redux/store'; // ✅ Corrected path to your actual store file
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Toaster } from "react-hot-toast";
import ChatBotIcon from "@/components/core/ChatBot/ChatBot";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className="h-full w-full">
      <body className="h-full w-full">
        <Toaster position="top-center"/>
        <Provider store={store}>
          <Navbar />
          {/* <ChatBotIcon /> */}
          {children}
        </Provider>
        {/* You can optionally include LoadingSpinner globally if needed */}
      </body>
    </html>
  );
}
