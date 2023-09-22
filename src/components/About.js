// MSc Project
// Name & Student ID : Sadhvi Pugaonkar - 201672582
// File name : About.js

// Imports
import React from 'react';
import {FaCameraRetro, FaUnsplash} from 'react-icons/fa';

function About() {
  return (
    <footer className='bg-black fixed bottom-0 left-0 w-full p-2 text-center text-yellow-200 font-semibold text-md'>
      <div className='flex flex-row items-center justify-center space-x-2'>
        <div className='flex flex-row items-center space-x-2'>
          <FaCameraRetro className='w-6 h-6'/> 
          <a href="https://unsplash.com/@kevinmueller?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Kevin Mueller</a>
        </div>
        <p>on</p> 
        <a href="https://unsplash.com/photos/Q-fL04RhuMg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
        <FaUnsplash className='w-6 h-6'/></a>
      </div>
    </footer>
  );
}

export default About;