// Imports
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import Header from '../components/Header';
import About from '../components/About';
import sportImage from '../images/sports.jpg';
import BasicInformation from '../components/BasicInformation';
import GameInformation from '../components/GameInformation';
import RegistrationInformation from '../components/RegistrationInformation';
import { db } from '../firebaseConfig';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';


function CreateTournament({isEdit = false , tournamentDetails = {}}) {
    // Basic Information usestate
    const { userCode, setIsOrganizer } = useContext(UserContext);
    const [generatedCode, setGeneratedCode] = useState("");
    const [generatedCodeError, setGeneratedCodeError] = useState('');
    const [tournamentName, setTournamentName] = useState("");
    const [description, setDescription] = useState("");
    // Game Information usestate
    const [game, setGame] = useState('');
    // Registration Information usestate
    const [maxParticipants, setMaxParticipants] = useState('');
    const [startTime, setStartTime] = useState('');
    const [provideList, setProvideList] = useState(false);
    const [requireTeam, setRequireTeam] = useState(false);
    const [specifyMax, setSpecifyMax] = useState(false);
    const [requireCheckIn, setRequireCheckIn] = useState(false);
    const [checkInTime, setCheckInTime] = useState('');
    // Navigation
    const navigate = useNavigate();

    // Fetch edited data of the tournament form
    useEffect(() => {
      if (isEdit) {
          // Populate the form with the provided tournamentDetails
          setTournamentName(tournamentDetails.tournamentName || "");
          setDescription(tournamentDetails.description || "");
          setGame(tournamentDetails.game || "");
          setMaxParticipants(tournamentDetails.maxParticipants || '');
          setStartTime(tournamentDetails.startTime || '');
          setProvideList(tournamentDetails.provideList || false);
          setRequireTeam(tournamentDetails.requireTeam || false);
          setSpecifyMax(tournamentDetails.specifyMax || false);
          setRequireCheckIn(tournamentDetails.requireCheckIn || false);
          setCheckInTime(tournamentDetails.checkInTime || '');
      }
    }, [isEdit, tournamentDetails]);

    // Function to handle save and continue action
    const handleSaveAndContinue = async () => {
      
      // Check if code is provided and there's no error
      if (generatedCode && !generatedCodeError) {

        let tournamentData = {
              userCode,
              generatedCode,
              tournamentName,
              description,
              game,
              maxParticipants,
              startTime,
              provideList,
              requireTeam,
              specifyMax,
              requireCheckIn,
              checkInTime
        };

        // Clean up the tournament data
        tournamentData = Object.fromEntries(Object.entries(tournamentData).filter(([key, value]) => value && value !== ""));

        try {
            const tournamentRef = doc(db, 'users', userCode, 'tournaments', generatedCode);
    
            // If in edit mode and the code has been changed, delete the old tournament
            if (isEdit && generatedCode !== tournamentDetails.generatedCode) {
                const oldTournamentRef = doc(db, 'users', userCode, 'tournaments', tournamentDetails.generatedCode);
                await deleteDoc(oldTournamentRef);
            }

            await setDoc(tournamentRef, tournamentData, { merge: true });

            // After successfully creating the tournament, set the flag
            setIsOrganizer(true);
    
            navigate(`/tournament/${generatedCode}`, { state: tournamentData });
        } catch (e) {
            console.error("Error adding/updating document: ", e);
        }
      } else {
        if (!generatedCode) {
            setGeneratedCodeError('Please provide a valid code or generate one.');
        }
      }
    };
  

    return (
      <div className='relative min-h-screen '>
        <div style={{backgroundImage :`url(${sportImage})`}} className="p-12 inset-0 opacity-80 object-fit absolute top-0 left-0 w-full h-full bg-cover bg-center z-[-1]"></div>
          <div className='relative z-10 p-12'>
              <div className='p-8 text-black font-inter'>  

                {/* Header Information */}
                <Header/>
                
                {/* Basic Information Form */}
                <BasicInformation 
                  userCode={userCode}
                  tournamentName={tournamentName}
                  setTournamentName={setTournamentName}
                  description={description}
                  setDescription={setDescription}
                  generatedCode={generatedCode}
                  setGeneratedCode={setGeneratedCode}
                  setGeneratedCodeError={setGeneratedCodeError}
                  generatedCodeError={generatedCodeError}
                />


                {/* Game Information Form */}
                <GameInformation 
                  game={game} setGame={setGame} 
                  isEdit={isEdit}
                />

                {/* Registration Form */}
                <RegistrationInformation
                  maxParticipants={maxParticipants} setMaxParticipants={setMaxParticipants}
                  startTime={startTime} setStartTime={setStartTime}
                  provideList={provideList} setProvideList={setProvideList}
                  requireTeam={requireTeam} setRequireTeam={setRequireTeam}
                  specifyMax={specifyMax} setSpecifyMax={setSpecifyMax}
                  requireCheckIn={requireCheckIn} setRequireCheckIn={setRequireCheckIn}
                  checkInTime={checkInTime} setCheckInTime={setCheckInTime}
                  isEdit={isEdit}
                />

                {/* Save and Continue Button */}
                <div className="w-2/3 mx-auto mt-4">
                    <button onClick={handleSaveAndContinue} className="bg-green-800 text-yellow-200 hover:text-yellow-300 p-4 rounded font-semibold hover:bg-green-700">Save and Continue</button>
                    {generatedCodeError && <p className='text-red-600 font-bold text-md text-center'>{generatedCodeError}</p>}
                </div>

                {/* Footer Information */}
                <About/>
            </div>
          </div>
        </div>
    );
}

export default CreateTournament;



