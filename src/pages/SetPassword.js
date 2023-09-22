// MSc Project
// Name & Student ID : Sadhvi Pugaonkar - 201672582
// File name : SetPassword.js

// Imports
import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { db, auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { setDoc, doc, updateDoc } from 'firebase/firestore';
import {AiFillEye, AiFillEyeInvisible} from 'react-icons/ai';
import sportImage from '../images/sports.jpg';
import About from '../components/About';

function SetPassword() {
  // Location state for reset password
  const location = useLocation();
  const isResettingPassword = location.state?.resettingPassword || false;
  // Navigation and User Code
  const navigate = useNavigate();
  const { code } = useParams();
  // Password usestates
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // Security data usestates
  const [selectedQuestions, setSelectedQuestions] = useState(['', '', '']);
  const [selectedAnswers, setSelectedAnswers] = useState(['', '', '']);
  const [securityQuestions] = useState([
    'Who was your childhood best friend?',
    'What is the name of the street where you grew up?',
    'What is your favorite cuisine?',
    'What is your all-time favorite TV show?',
    'If you needed a new first name, what would it be?',
  ]);
  // Error Handling usestates
  const [passwordValidationResult, setPasswordValidationResult] = useState(null);
  const [questionsValidationResult, setQuestionsValidationResult] = useState(null);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };  

  // Error Handling of Entered Password 
  const validatePassword = (password) => {
    if (!/(?=.*[A-Z])/.test(password)) return 'Password should contain at least 1 uppercase letter.';
    if (!/(?=.*[a-z])/.test(password)) return 'Password should contain at least 1 lowercase letter.';
    if (!/(?=.*[0-9])/.test(password)) return 'Password should contain at least 1 number.';
    if (!/(?=.*[!@#\$%\^&\*])/.test(password)) return 'Password should contain at least 1 symbol.';
    return null;
  };

  // Handling the submit of registration form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Error handling result
    const validationResult = validatePassword(password);
    if (validationResult) {
        setPasswordValidationResult(validationResult);
        return;
    }

    // Condition to recheck entered password  
    if (password !== confirmedPassword) {
      setPasswordValidationResult('Passwords do not match. Please try again.');
      return;
    }

    if (!code) {
      setPasswordValidationResult('Please generate or enter a valid code before proceeding.');
      return;
    }

    // Condition to render security questions while resetting the password
    if(!isResettingPassword) {
      if (selectedQuestions.some(question => !question) || selectedAnswers.some(answer => !answer)) {
        setQuestionsValidationResult('Please select and answer all security questions.');
        return;
      }
      if (selectedAnswers.some(answer => answer.length < 4 || answer.length > 20)) {
        setQuestionsValidationResult('All security answers should be between 4-20 characters.');
        return;
      }
    }
     
    try {
      const userCredential = await signInWithEmailAndPassword(auth, `${code}@example.com`, password);

      // If we're here, the sign-in was successful. If we're setting a new password, delete the user and recreate them.
      if (!isResettingPassword) {
          await deleteUser(userCredential.user);
          const authResult = await createUserWithEmailAndPassword(auth, `${code}@example.com`, password);
          const uid = authResult.user.uid;
          await setUserDataInFirestore(uid, code);
      }
      navigate(`/user/${code}`);
    } catch (error) {
      console.log('error caught');
      if (error.code === 'auth/user-not-found' && !isResettingPassword) {
          // If the user doesn't exist and we're setting a new password, create them.
          const authResult = await createUserWithEmailAndPassword(auth, `${code}@example.com`, password);
          const uid = authResult.user.uid;
          await setUserDataInFirestore(uid, code);
          navigate(`/user/${code}`);
      } else if (error.code === 'auth/wrong-password') {
          setPasswordValidationResult('The provided code is associated with another password. If you forgot your password, please reset it.');
      } else {
          console.error('Error setting password:', error);
          setPasswordValidationResult('Error setting password. Please try again later.');
      }
    }
  };

  // Function to store user's data in Firebase
  const setUserDataInFirestore = async (uid, code) => {
    const userRef = doc(db, 'users', code);

    const updateData = {
      lastActivity: new Date(),
    };

    try {
      if (isResettingPassword) {
          // Only update common data for existing users resetting password
          await updateDoc(userRef, updateData);
      } else {
          // Set all data including security questions and answers for new users
          const newData = {
              ...updateData,
              uid: uid,
              createdAt: new Date(), // Only set for new users
              securityQuestions: selectedQuestions,
              securityAnswers: selectedAnswers.map(answer => answer.toLowerCase())
          };
          await setDoc(userRef, newData, {merge : true});
      }
      console.log('User data stored in Firestore.');
  } catch (error) {
      console.error('Error storing user data:', error);
  }
  };

  // Function to handle the security questions being selected by the user
  const handleQuestionSelect = (index, e) => {
    const selected = e.target.value;
    setSelectedQuestions((prevQuestions) =>
      prevQuestions.map((question, i) => (i === index ? selected : question))
    );
  };

  // Function to handle the user's answer to questions
  const handleAnswerChange = (index, e) => {
    const answer = e.target.value;
    setSelectedAnswers((prevAnswers) =>
      prevAnswers.map((prevAnswer, i) => (i === index ? answer : prevAnswer))
    );
  };

  return (
    <div className='relative min-h-screen'>
      <div style={{backgroundImage : `url(${sportImage})`}} className='absolute inset-0 bg-cover bg-center opacity-70'></div>
        <div className='z-10 relative'>
          <div className='flex flex-col space-y-8 pt-10 shadow-lg font-inter'>

          {/* Header Information */}
          <Header/>

            {/* Registration Form */}
            <div className='flex flex-row items-center justify-around pt-4'>
              <form className='flex flex-col shadow-lg bg-yellow-400 p-10 space-y-4 rounded text-black' onSubmit={handleSubmit}>
                {passwordValidationResult && <p className="text-red-900 font-bold text-md text-center">{passwordValidationResult}</p>}
                <h1 className='font-semibold text-xl text-center'>
                  {isResettingPassword ? "Set Password for Existing User:" : "Complete Registration for New User:"}
                </h1>

                {/* Password field */}
                <div className="flex flex-col space-y-2 w-full">
                  <div className='relative'>
                    <label className="font-semibold">Password:</label>
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
                </div>

                {/* Confirm Password Field */}
                <div className="flex flex-col space-y-2 w-full">
                  <div className='relative'>
                    <label className="font-semibold">Confirm Password:</label>
                    <input
                      type={isPasswordVisible? "text" : "password"}
                      className='bg-yellow-200 p-2 outline-none rounded w-full'
                      value={confirmedPassword}
                      onChange={(e) => setConfirmedPassword(e.target.value)}
                      required
                    />
                    <button 
                        onClick={togglePasswordVisibility} 
                        className="absolute right-2 top-2/3 transform -translate-y-1/2"
                    >
                    {isPasswordVisible ? <AiFillEye className='w-6 h-6'/> : <AiFillEyeInvisible className='w-6 h-6'/>}
                    </button>
                  </div>
                </div>

                {/* Security questions for new users */}
                {!isResettingPassword && (
                  <>
                  {questionsValidationResult && <p className="text-red-900 text-md text-center font-bold">{questionsValidationResult}</p>}
                    <h1 className='font-semibold text-xl text-center'>Security Questions:</h1>
                      {selectedQuestions.map((selectedQuestion, index) => (
                        <div key={index} className='space-y-2 w-full'>

                          {/* Security question field */}
                          <div className="flex flex-col space-y-1">
                            <label className="font-bold">Security Question {index + 1}:</label>
                              <select
                                className='bg-yellow-200 p-2 outline-none rounded w-full'
                                value={selectedQuestion}
                                onChange={(e) => handleQuestionSelect(index, e)}
                                required
                              >
                              <option value='' disabled>
                              Select a question
                              </option>
                              {securityQuestions
                              .filter(
                                (question) =>
                                !selectedQuestions.includes(question) ||
                                selectedQuestion === question
                              )
                              .map((question) => (
                                <option key={question} value={question}>
                                  {question}
                                </option>
                              ))}
                              </select>
                          </div>

                          {/* Security answer field */}
                          <div className="flex flex-col space-y-1">
                            <label className="font-bold">Answer {index + 1}:</label>
                              <input
                                  type='text'
                                  className='bg-yellow-200 p-2 outline-none rounded w-full'
                                  value={selectedAnswers[index]}
                                  onChange={(e) => handleAnswerChange(index, e)}
                                  required
                              />
                          </div>
                        </div>
                      ))}
                      </>
                    )}

                {/* Submit Button */}
                <button onClick={handleSubmit} className='bg-green-800 hover:bg-green-700 px-3 py-2 text-yellow-200 hover:text-black font-medium rounded' type='submit'>
                  {isResettingPassword ? "Set Password" : "Complete Registration"}
                </button>
              </form>
            </div>

            {/* Footer Information */}
            <About/>
        </div>
      </div>
    </div>
  );
}

export default SetPassword;


