// MSc Project
// Name & Student ID : Sadhvi Pugaonkar - 201672582
// File name : NoPage.js

// Imports
import React from 'react';
import Header from '../components/Header';

function NoPage() {
  return (
    <div className='flex flex-col min-h-screen items-center justify-center text-2xl font-inter space-y-8 p-10 bg-black text-white'>
    {/* Header Information */}
    <Header/>
    <h1>No Page</h1>
    <p>Error 404: Not found</p>
    </div>
  );
}

export default NoPage;