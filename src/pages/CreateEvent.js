import React from 'react';
import Header from '../components/Header';
import About from '../components/About';


function CreateEvent() {
  return (
    <div className='flex flex-col min-h-screen items-center justify-center space-y-8 p-10 bg-black text-white'>
        <Header/>
        <About/>
    </div>
  )
}

export default CreateEvent