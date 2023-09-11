// Imports
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';
import sportImage from '../images/sports.jpg';
import {AiFillEye, AiFillEyeInvisible} from 'react-icons/ai';
import About from '../components/About';

function ConfirmPassword() {
  // Password usestates
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // Security related data usestates
  const [userData, setUserData] = useState(null);
  const [randomQuestionIndex, setRandomQuestionIndex] = useState(null);
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  // Error handling usestate
  const [errorMessage, setErrorMessage] = useState('');
  // Navigation and User code 
  const navigate = useNavigate();
  const { code } = useParams();

  // Fetches user data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'users', code);
        const userSnapshot = await getDoc(docRef);

        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [code]);


  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };  

  // Handles reset password functionality
  const handleForgotPassword = async () => {
    try {
      const docRef = doc(db, 'users', code);
      const userSnapshot = await getDoc(docRef);

      if (userSnapshot.exists()) {
        const fetchedUserData = userSnapshot.data();

        if (fetchedUserData.securityQuestions && fetchedUserData.securityQuestions.length > 0) {
          const randomIndex = Math.floor(Math.random() * fetchedUserData.securityQuestions.length);
          setRandomQuestionIndex(randomIndex);
          setSecurityQuestion(fetchedUserData.securityQuestions[randomIndex]);
        } else {
          setErrorMessage('No security questions found for this user.');
        }
      } else {
        setErrorMessage('User data not found. Please check your code.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setErrorMessage('Error fetching security question. Please try again later.');
    }
  };

  // Handles security data functionality
  const handleSubmitAnswer = () => {
    if (userData && userData.securityAnswers && userData.securityAnswers[randomQuestionIndex]) {
      const storedAnswer = userData.securityAnswers[randomQuestionIndex].toLowerCase();
      if (securityAnswer && securityAnswer.toLowerCase() === storedAnswer) {
        navigate(`/set-password/${code}`, { state: { resettingPassword: true } });
      } else {
        setErrorMessage('Incorrect answer. Please try again.');
      }
    }
  };

  // Handles submit button
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, `${code}@example.com`, password);
      navigate(`/user/${code}`);
    } catch (error) {
      setErrorMessage('Incorrect password. Please try again.');
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className='relative min-h-screen'>
      <div style={{backgroundImage : `url(${sportImage})`}} className='absolute inset-0 bg-cover bg-center opacity-70'></div>
      <div className='z-10 relative'>
        <div className='flex flex-col items-center justify-center space-y-8 pt-10 font-inter'>

          {/* Header Information */}
          <Header className='self-stretch' />

          {/* Confirm Password Functionality */}
          <form className='flex flex-col bg-yellow-400 shadow-lg p-10 space-y-6 rounded text-black w-96' onSubmit={handleSubmit}>
          <h1 className='font-semibold text-lg text-center'>Confirm Password for Existing User:</h1>
          <div className='relative'>
            <label className='font-semibold space-y-2'>Password:</label>
              <input
                type={isPasswordVisible? "text" : "password"}
                className='bg-yellow-200 p-2 outline-none rounded w-full'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            <button 
                  onClick={togglePasswordVisibility} 
                  className="absolute right-2 top-2/3 transform -translate-y-1/2"
              >
                  {isPasswordVisible ? <AiFillEye className='w-6 h-6'/> : <AiFillEyeInvisible className='w-6 h-6'/>}
            </button>
          </div>
            <button className='bg-green-800 hover:bg-green-700 px-3 py-2 text-yellow-200 hover:text-black font-medium rounded w-full' type='submit'>Confirm Password</button>
            {errorMessage && <p className='text-red-900 font-bold text-md text-center'>{errorMessage}</p>}
          </form>

          {/* Forgot Password Functionality */}
          <button  className="text-yellow-200 px-3 py-2 rounded hover:text-red-700" onClick={handleForgotPassword}>Forgot Password?</button>
          {securityQuestion && (
            <div className='flex flex-col bg-yellow-400 shadow-lg p-10 space-y-6 rounded text-black w-96'>
              <label className='space-y-2 text-center'>
                <p className='font-semibold text-lg text-center'>Security Question:</p>
                {securityQuestion}
                <input
                  type='text'
                  className='bg-yellow-200 p-2 outline-none rounded w-full'
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  required
                />
              </label>
              <button className='bg-green-800 hover:bg-green-700 px-3 py-2 text-yellow-200 hover:text-black font-medium rounded w-full' onClick={handleSubmitAnswer}>
                Submit Answer
              </button>
              {errorMessage && <p className='text-red-900 font-bold text-md text-center'>{errorMessage}</p>}
            </div>
          )}

          {/* Footer Information */}
          <About/>
        </div>
      </div>
    </div>
  );
}

export default ConfirmPassword;







