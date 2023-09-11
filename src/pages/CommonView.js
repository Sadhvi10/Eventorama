// Imports 
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, getDocs, query, where, deleteDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {TiArrowShuffle} from 'react-icons/ti';
import {TiUser} from 'react-icons/ti';
import {LiaHandPointRight} from 'react-icons/lia';
import Header from '../components/Header';
import About from '../components/About';
import sportImage from '../images/sports.jpg';


function CommonView() {
  // User Code usestates
  const [generatedCode, setGeneratedCode] = useState('');
  const [userCode, setUserCode] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  // Error Handling usestates
  const [codeValidationResult, setCodeValidationResult] = useState(null);
  const [consentError, setConsentError] = useState('');
  const [generatedCodeError, setGeneratedCodeError] = useState('');
  // Login Reference and Navigation
  const loginRef = useRef(null);
  const navigate = useNavigate();


  /* Common view helper functions */

  // Random code generation
  const generateCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const codeLength = 8; // Code length
    let code = '';
  
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
  
    setGeneratedCode(code);
  };

  // Generate button handle to change random code
  const handleUserCodeChange = (e) => {
    setGeneratedCode(e.target.value);
  };

  // Error handling for code 
  const validateUserCodeLength = () => {
    const length = generatedCode.length;
    if (length < 6 || length > 8) {
      setGeneratedCodeError('Code should be between 6 to 8 characters.');
    } else {
      setGeneratedCodeError('');
    }
  };

  // Redirection after user's registration 
  const goToSetPassword = () => {
    if (!generatedCode || generatedCode.length < 6 || generatedCode.length > 8) {
      setGeneratedCodeError('Please enter a valid code of length 6 to 8 characters or generate a new one.');
      return;
    }

    if(consentGiven){
      navigate(`/set-password/${generatedCode}`);
    } else {
      setConsentError('Please tick the consent box before proceeding.');
    }
  };

  // Redirection after user's login 
  const goToConfirmPassword = async() => {
    if(consentGiven){
      const docRef = doc(db, 'users', userCode);
      const codeSnapshot = await getDoc(docRef);
      if (codeSnapshot.exists()) {
        navigate(`/confirm-password/${userCode}`);
      } else {
        setCodeValidationResult('Invalid code. Please check and try again.');
      }
    } else {
      setConsentError('Please tick the consent box before proceeding.');
    }
  };

  const scrollToLogin = () => {
    loginRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  // Deletes users after 7 days of inactivity in the app
  useEffect(() => {
    generateCode(); // Generate the code when the component is mounted

      // Check and delete old records based on lastActivity
      const deleteOldUsers = async () => {
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);  // 7 days in milliseconds
      const olderThanSevenDays = new Date(sevenDaysAgo);
      
      const oldUsersSnapshot = await getDocs(query(collection(db, 'users'), where('lastActivity', '<=', olderThanSevenDays)));
      oldUsersSnapshot.forEach(async (doc) => {
          if (doc.exists()) {
              await deleteDoc(doc.ref);
          }
      });
    };
    

    deleteOldUsers();
  }, []);

  return (
    <div className='relative min-h-screen font-inter'>
      <div style={{backgroundImage : `url(${sportImage})`}} className='absolute inset-0 bg-cover bg-center flex flex-col opacity-80'></div>
      <div className='z-10 relative'>
        
        {/* Header information */}
        <div>
          <Header />
          <div className='fixed top-2 right-2 z-50 flex flex-row items-end justify-end space-x-4'>
            <button className='hover:bg-green-800 px-2 py-3 text-yellow-300 hover:text-yellow-200 font-medium rounded' onClick={scrollToLogin}>Sign Up</button>
            <button className='hover:bg-green-800 px-2 py-3 text-yellow-300 hover:text-yellow-200 font-medium rounded' onClick={scrollToLogin}>Log in</button>
          </div>
        </div>

        {/* Introduction */}
        <div className='flex flex-row items-center justify-between p-8'>
          <div className='p-12 w-2/3'>
            <p className='text-yellow-400 font-playfair font-medium text-2xl p-16 -mb-12'>EVENTORAMA : A PRIVACY-CENTRIC SOLUTION</p>
            <p className='bg-black text-yellow-300 p-12 tracking-wider rounded shadow-xl hover:scale-110 transition-transform duration-500 ease-in'>Our Tournament Managing App is designed to revolutionize the way sporting events and competitive tournaments are managed, all while prioritizing user privacy. Unlike other tournament management platforms that rely heavily on collecting user data, our app is engineered to provide the best user experience without storing any personal information.</p>
          </div>
          <div className='p-12 w-1/3 '>
            <p className='text-black font-playfair font-medium text-xl p-16 -mb-12'>IMPORTANT LINKS TO USE</p>
            <div className='bg-yellow-400 text-black p-12 tracking-wider rounded space-y-4 shadow-xl hover:scale-110 transition-transform duration-500 ease-in'>
              <div className='flex flex-col items-center justify-start space-y-2'>
                <p className='text-sm'>Homepage URL starts with : </p>  
                <p className='bg-yellow-300 p-2 font-semibold'>localhost:3000/ </p>
              </div>
              <div className='flex flex-col items-center justify-start space-y-2'>
                <p className='text-sm'>Spectators can view tournaments with : </p>  
                <p className='bg-yellow-300 p-2 font-semibold'>localhost:3000/'userCode'</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className='p-12 -mt-16'>
          <p className='text-yellow-400 font-playfair font-medium mx-16 text-4xl p-16 -mb-12'>KEY FEATURES</p>
          <ol className='bg-black text-yellow-300 p-12 mx-32 tracking-wider rounded space-y-4'>
            <li className='space-y-2'>
                <strong className='font-playfair text-2xl tracking-wider'>No Personal Data Storage</strong>
                <p className='ml-6'>No need for email, phone number, or social media accounts to register or participate.</p>
            </li>
            <li className='space-y-2'>
                <strong className='font-playfair text-2xl tracking-wider'>Anonymous Participation</strong>
                <p className='ml-6'>Unique identifiers or QR codes for participants, ensuring complete anonymity.</p>
            </li>
            <li className='space-y-2'>
                <strong className='font-playfair text-2xl tracking-wider'>Easy Setup</strong>
                <p className='ml-6'>Intuitive, user-friendly interface for setting up tournaments, brackets, and scheduling.</p>
            </li>
        </ol>
        </div>

        {/* Signup Container */}
        <div ref={loginRef} className='pt-10 pl-10 pr-10 -mb-20'>
          <div className='flex flex-row items-center justify-center space-x-6 '>
            <div className='w-1/2 bg-yellow-400 p-10 space-y-4 text-black flex flex-col items-center shadow-xl rounded'>
              <div className='flex flex-row items-center'>
                <TiUser className='w-6 h-6'/>
                <h2 className='font-semibold font-playfair text-xl'>SIGNUP</h2>
              </div>
              <p className='font-medium'>Please generate code or enter your alias code below.</p>
              <div className='flex flex-row bg-yellow-200 space-x-4 items-center'>
                  <p className='bg-yellow-300 p-2 font-semibold'>localhost:3000/ </p>
                  <input
                    type='text'
                    className='p-2 outline-none bg-yellow-200 placeholder:text-xs placeholder:text-black '
                    value={generatedCode}
                    onChange={handleUserCodeChange} // Update code as the user types
                    onBlur={validateUserCodeLength}
                    placeholder='Enter or Generate Code'
                  />
                  <button onClick={generateCode}><TiArrowShuffle className='w-10 h-10 bg-yellow-300 p-2'/></button>
              </div>
              {generatedCodeError && <p className='text-red-900 font-bold text-md text-center'>{generatedCodeError}</p>}
              <button className='bg-green-800 hover:bg-green-700 p-2 text-yellow-200 hover:text-black font-medium rounded' onClick={goToSetPassword}>Confirm</button>
            </div>

            {/* Login Container */}
            <div className='w-1/2 bg-yellow-400 p-10 space-y-4 text-black flex flex-col items-center shadow-xl rounded'>
              <div className='flex flex-row items-center'>
                <TiUser className='w-6 h-6'/>
                <h2 className='font-semibold font-playfair text-xl'>LOGIN</h2>
              </div>
              <p className='font-medium'>Please enter your code below to login.</p>
              <input
                type='text'
                className='p-2 outline-none bg-yellow-200 placeholder:text-xs placeholder:text-black '
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                placeholder='Enter Code'
              />
              <button className='bg-green-800 hover:bg-green-700 p-2 text-yellow-200 hover:text-black font-medium rounded' onClick={goToConfirmPassword} disabled={!userCode}>
                Login
              </button>
              {codeValidationResult && <p className='text-red-900 font-bold text-md text-center'>{codeValidationResult}</p>}
            </div>
          </div>
          <div className='flex flex-row items-center space-x-2 p-12 mx-64'>
            <input type="checkbox" onChange={() => setConsentGiven(!consentGiven)} /> 
            <p className='text-black font-semibold text-sm tracking-tight'>By using this app, you agree not to share any personal data, including but not limited to your name, email address, phone number, or social media accounts. This app is designed to operate without collecting any personal data to ensure maximum privacy and security.</p>
          </div>
          {consentError && <p className='text-red-900 font-bold text-md text-center'>{consentError}</p>}
        </div>

        {/* Information about the app */}
        <div className='flex flex-row justify-evenly space-x-4 p-8'>

          <div className='w-1/4 hover:scale-110 transition-transform duration-500 ease-in'>
              <p className='text-yellow-400 font-playfair font-medium text-2xl p-16 -mb-12'>TARGET AUDIENCE</p>
              <ul className='bg-black text-yellow-300 p-12 tracking-wider rounded space-y-4'>
                <div className='flex flex-row items-center space-x-4 '>
                  <LiaHandPointRight className='w-6 h-6'/>
                  <li>Sports organizations</li>
                </div>
                <div className='flex flex-row items-center space-x-4 '>
                  <LiaHandPointRight className='w-8 h-8'/>
                  <li>Competitive gaming communities</li>
                </div>
                <div className='flex flex-row items-center space-x-4 '>
                  <LiaHandPointRight className='w-8 h-8'/>
                  <li>Schools and educational institutions</li>
                </div>
                <div className='flex flex-row items-center space-x-4 '>
                  <LiaHandPointRight className='w-6 h-6'/>
                  <li>Corporate event planners</li>
                </div>
              </ul>
          </div>

          <div className='w-1/4 hover:scale-110 transition-transform duration-500 ease-in'>
            <p className='text-yellow-400 font-playfair font-medium text-2xl p-16 -mb-12'>WHY CHOOSE US?</p>
            <ul className='bg-black text-yellow-300 p-12 tracking-wider rounded space-y-4'>
                <li>
                    <strong className='font-playfair text-md tracking-wider'>User Privacy:</strong>
                    <p className='ml-6'>No other tournament app offers the level of privacy we do.</p>
                </li>
                <li>
                    <strong className='font-playfair text-md tracking-wider'>Easy to Use:</strong>
                    <p className='ml-6'>Intuitive design makes it simple for both organizers and participants.</p>
                </li>
                <li>
                    <strong className='font-playfair text-md tracking-wider'>Versatile:</strong>
                    <p className='ml-6'>Suitable for a wide range of sports and competitive activities.</p>
                </li>
            </ul>
          </div>

          <div className='w-1/4 hover:scale-110 transition-transform duration-500 ease-in'>
            <p className='text-yellow-400 font-playfair font-medium text-2xl p-16 -mb-12'>HOW IT WORKS</p>
            <ol className='bg-black text-yellow-300 p-12 tracking-wider rounded space-y-4'>
              <li className='space-y-2'>
                  <strong className='font-playfair text-md tracking-wider'>Enter & Browse:</strong>
                  <p className='ml-6'>Users can enter the desired URL and browse app without entering personal data.</p>
              </li>
              <li className='space-y-2'>
                  <strong className='font-playfair text-md tracking-wider'>Create or Join:</strong>
                  <p className='ml-6'>Easily create a new tournament or join an existing one using a unique code.</p>
              </li>
              <li className='space-y-2'>
                  <strong className='font-playfair text-md tracking-wider'>Set Up:</strong>
                  <p className='ml-6'>The organizer can set up matches, brackets, and schedules through a user-friendly dashboard.</p>
              </li>
              <li className='space-y-2'>
                  <strong className='font-playfair text-md tracking-wider'>Invite:</strong>
                  <p className='ml-6'>Use unique identifiers or QR codes to invite participants anonymously.</p>
              </li>
            </ol>
          </div>
        </div>

        {/* Footer Information */}
        <About/>
      </div>
    </div>
  );
}

export default CommonView;



