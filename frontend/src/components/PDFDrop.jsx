
import React, { useState, useCallback, useRef } from 'react';

const PdfDropzone = ({ onFilesDrop }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null); 

  
  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  
  const handleDragOver = useCallback((e) => {
    preventDefaults(e);
    setIsDragging(true); 
  }, []);

  
  const handleDragLeave = useCallback((e) => {
    preventDefaults(e);
    setIsDragging(false); 
  }, []);

  
  const handleDrop = useCallback((e) => {
    preventDefaults(e);
    setIsDragging(false); 

    const files = Array.from(e.dataTransfer.files); 
    processFiles(files); 
  }, [onFilesDrop]); 

  
  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  
  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  }, [onFilesDrop]);

  
  const processFiles = useCallback((files) => {
    const pdfFiles = files.filter(file => file.type === 'application/pdf');

    if (pdfFiles.length > 0) {
      onFilesDrop(pdfFiles); 
    } else if (files.length > 0) {
      alert("Only PDF files are allowed. Please drop or select PDF documents.");
    }
  }, [onFilesDrop]);


  return (
    <div
      className={`
        border-2 border-dashed rounded-lg p-6 text-center flex flex-col justify-center
        cursor-pointer transition-colors duration-200 ease-in-out
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
        hover:border-blue-400 hover:bg-blue-100 h-[450px]
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        multiple
        accept=".pdf"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />
      <div className='flex justify-center scale-200'>
      <i class="ri-drag-drop-fill"></i>
      </div>
      <p className="mt-2 text-sm text-gray-600">
        <span className="font-semibold">Drag and drop your PDF here</span> or{' '}
        <span className="text-blue-600 font-semibold">click to browse</span>
      </p>
      <p className="text-xs text-gray-500 mt-1">Only PDF files are supported.</p>
    </div>
  );
};

export default PdfDropzone;