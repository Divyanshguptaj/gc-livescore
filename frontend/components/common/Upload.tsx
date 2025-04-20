// UploadSection.tsx
'use client';
import React, { useRef } from 'react';
import { FiUpload } from 'react-icons/fi';

interface UploadSectionProps {
  onImageUpload: (file: File) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-blue-600 hover:bg-blue-50"
      >
        <FiUpload className="mr-2" />
        Upload Image
      </button>
    </div>
  );
};

export default UploadSection;
