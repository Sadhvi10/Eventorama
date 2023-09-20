// Imports
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import ReactDOM from 'react-dom';
import { doc, getDoc,collection, addDoc, onSnapshot, deleteDoc, updateDoc} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { UserContext } from '../UserContext';
import Header from '../components/Header';
import CreateTournament from './CreateTournament';
import { formatDateTime } from '../utils/formatHelper';
import {MdDelete, MdModeEdit, MdSave} from 'react-icons/md';
import SpectatorEnable from './SpectatorEnable';

// Tournament Helper Functions
const nextPowerOf2 = (n) => {
    let count = 0;
    if (n && !(n & (n - 1))) return n;
    while (n !== 0) {
      n >>= 1;
      count += 1;
    }
    return 1 << count;
};
  
const calculateRounds = (n) => {
  return Math.log2(nextPowerOf2(n));
};
  
const calculateByes = (n) => {
  return nextPowerOf2(n) - n;
};


function TournamentPage() {
    // Basic viewing of the page 
    const { userCode } = useContext(UserContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [tournamentDetails, setTournamentDetails] = useState(location.state?.tournamentDetails || {});
    const [view, setView] = useState('bracket'); // Default view
    // Participants view states
    const [shuffledParticipants, setShuffledParticipants] = useState([]);
    const [participantsList, setParticipantsList] = useState([]); 
    const [bulkParticipants, setBulkParticipants] = useState(''); // For bulk entry
    const [participantName, setParticipantName] = useState(''); // For individual participant entry
    const [currentlyEditing, setCurrentlyEditing] = useState(null); // Participant ID being edited
    const [showBulkAdd, setShowBulkAdd] = useState(false); // Flag to determine if bulk add textarea is shown
    // Bracket view states
    const [matchScores, setMatchScores] = useState({}); // Stores scores for each match
    const [currentRound, setCurrentRound] = useState(1);
    const [nextRoundParticipants, setNextRoundParticipants] = useState([]);
    const [totalRounds, setTotalRounds] = useState(0);
    const [tournamentWinner, setTournamentWinner] = useState(null);
    const [allRoundResults, setAllRoundResults] = useState([]);

    console.log('Current Round:', currentRound);
    console.log('Next Round Participants:', nextRoundParticipants);

    
    // Fetch the tournament details 
    useEffect(() => {
        if (!location.state?.tournamentDetails) {
            const fetchTournamentDetails = async () => {
                const generatedCode = location.pathname.split('/').pop();
                if (!userCode || !generatedCode) return;
                const docRef = doc(db, 'users', userCode, 'tournaments', generatedCode);
                const tournamentSnapshot = await getDoc(docRef);
                if (tournamentSnapshot.exists()) {
                    setTournamentDetails(tournamentSnapshot.data());
                }
            };
            fetchTournamentDetails();
        }
    }, [location.state, userCode]);

    // Fetch view details 
    useEffect(() => {
        const currentView = location.pathname.split('/').pop();
        if (['bracket','participants', 'spectator','settings'].includes(currentView)) {
            setView(currentView);
        }
    }, [location.pathname]);

    // Initialise tournament details
    const { 
        userCode: tournamentUserCode,
        generatedCode,
        tournamentName,
        game,
        startTime,
        checkInTime,
    } = tournamentDetails;

    // Fetch participants list from Firebase
    useEffect(() => {
        if (view === 'participants' && generatedCode) {
            const participantsRef = collection(db, 'users', userCode, 'tournaments', generatedCode, 'participants');
            const unsubscribe = onSnapshot(participantsRef, (snapshot) => {
                const fetchedParticipants = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setParticipantsList(fetchedParticipants);
            });

            // Cleanup the subscription on component unmount
            return () => unsubscribe();
        }

    }, [view, userCode, generatedCode, db]);

    
    // Shuffle the participants only once when the component is mounted
    useEffect(() => {
        const shuffledList = [...participantsList].sort(() => 0.5 - Math.random());
        setShuffledParticipants(shuffledList);
        const calculatedRounds = calculateRounds(participantsList.length);
        setTotalRounds(calculatedRounds);
    }, [participantsList]);


    /* Participant view helper functions */

    // Function to delete a participant
    const handleDeleteParticipant = async (id) => {
        if (id) {
            const participantRef = doc(db, 'users', userCode, 'tournaments', generatedCode, 'participants', id);
            await deleteDoc(participantRef);
        }
    };

    // Function to edit participant's name
    const handleParticipantNameChange = (e, id) => {
        // Update the local participant name without saving to Firebase yet
        const updatedParticipantsList = participantsList.map(participant =>
            participant.id === id ? { ...participant, name: e.target.value } : participant
        );
        setParticipantsList(updatedParticipantsList);
    };

    // Function to save participant's name
    const handleUpdateParticipant = async (id) => {
        // Save the updated participant name to Firebase
        const participant = participantsList.find(participant => participant.id === id);
        if (participant) {
            const docRef = doc(db, 'users', userCode, 'tournaments', generatedCode, 'participants', id);
            await updateDoc(docRef, { name: participant.name });
            setCurrentlyEditing(null);  // Exit edit mode
        }
    };

    // Function to add a participant
    const handleAddParticipant = async () => {
        if (participantName) {
            // Add participant to Firebase
            const participantsRef = collection(db, 'users', userCode, 'tournaments', tournamentDetails.generatedCode, 'participants');
            await addDoc(participantsRef, { name: participantName });
            setParticipantName(''); // Clear the input
        }
    };

    // Function to add multiple participants at once
    const handleBulkAddParticipants = async () => {
        const newParticipantsList = bulkParticipants.split('\n'); // Assuming each name is separated by a new line

        const participantsRef = collection(db, 'users', userCode, 'tournaments', generatedCode, 'participants');
        for (const name of newParticipantsList) {
            if (name.trim()) {
                await addDoc(participantsRef, { name: name.trim() });
            }
        }
        setBulkParticipants(''); // Clear the textarea
    }; 

    // Fetch next round participants
    useEffect(() => {
        console.log("Updated nextRoundParticipants:", nextRoundParticipants);
    }, [nextRoundParticipants]);
      

    /* Bracket view helper functions */

    // Generate the tournament bracket
    const generateBracket = () => {
        let participantsForThisRound = currentRound === 1 ? shuffledParticipants : nextRoundParticipants;
        //const numByes = calculateByes(shuffledParticipants.length);
        let bracket = [];
        let matchCounter = 1;

        console.log("participantsForThisRound:", participantsForThisRound);

        // Add byes to the beginning of the shuffled list
        //let participantsWithByes = [...Array(numByes).fill({ name: "BYE" }), ...shuffledParticipants];

        // for (let i = 0; i < participantsWithByes.length; i += 2) {
        //   const participant1 = participantsWithByes[i];
        //   const participant2 = participantsWithByes[i + 1] || { name: "BYE" };
        //   const currentMatchId = matchCounter++;

        for (let i = 0; i < participantsForThisRound.length; i += 2) {
            const participant1 = participantsForThisRound[i] || { name: "Unknown" };
            const participant2 = participantsForThisRound[i + 1] || { name: "BYE" };
            const currentMatchId = matchCounter++;

            console.log(`Match ${currentMatchId}: ${participant1.name} vs ${participant2.name}`);

            bracket.push(
            <div key={currentMatchId} className="p-2 space-x-4 flex flex-row items-center bg-green-800 text-black font-inter">
                <p>Match {currentMatchId}:</p>
                    <div className='flex flex-col items-center text-yellow-200 focus:outline-none'>
                        <div>
                            <span>{participant1.name}</span>
                        </div>
                        <p className='text-black'>vs</p>
                        <div>
                            <span>{participant2.name}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center space-y-4">
                        <input type="number" className='bg-yellow-200 focus:outline-none text-center placeholder:text-sm placeholder:text-black-700' placeholder={`Score for ${participant1.name}`} onChange={(e) => handleScoreChange(e, currentMatchId, 'participant1',i)} value={matchScores[currentMatchId]?.participant1 || ''} />
                        <input type="number" className='bg-yellow-200 focus:outline-none text-center placeholder:text-sm placeholder:text-black-700' placeholder={`Score for ${participant2.name}`} onChange={(e) => handleScoreChange(e, currentMatchId, 'participant2', i+1)} value={matchScores[currentMatchId]?.participant2 || ''} />
                    </div>
                    <div className="p-4 bg-yellow-200">
                        {matchScores[currentMatchId] ? determineWinner(matchScores[currentMatchId], participant1, participant2) : "Awaiting Score"}
                    </div>
            </div>
            );
        }
        return bracket;
    };

    // Function to handle scores entered by the user during tournament 
    const handleScoreChange = (event, matchId, participant, index) => {
        const score = +event.target.value;
        setMatchScores(prev => ({
          ...prev,
          [matchId]: {
            ...prev[matchId],
            [participant]: score,
            [`index${participant}`]: index  // Storing the index with a key like 'indexparticipant1'
          }
        }));
    };
      
    // Function to determine winer of the match as well as the overall tournament
    const determineWinner = (score, participant1, participant2) => {
        // Ensure scores are treated as numbers
        const score1 = +score.participant1;
        const score2 = +score.participant2;

        // Check if both scores are available
        if (typeof score1 === "undefined" || typeof score2 === "undefined") {
            return "Awaiting Score";
        }

        if (score1 > score2) {
            return `${participant1.name} vs ${participant2.name}, ${participant1.name} is the winner of this match!`;
        } else if (score1 < score2) {
            return `${participant1.name} vs ${participant2.name}, ${participant2.name} is the winner of this match!`;
        } else {
            return `${participant1.name} vs ${participant2.name}, The match is a tie!`;
        }
    };

    // Function that handles next rounds data
    const proceedToNextRound = () => {
        let winners = [];
        let participantsForThisRound = currentRound === 1 ? shuffledParticipants : nextRoundParticipants;
    
        console.log("Participants for this round before proceeding:", participantsForThisRound);
        console.log("Match Scores:", matchScores);

        const newResults = []; // To store the results of the current round
    
        // Identify winners based on scores
        for (const matchId in matchScores) {
            const scores = matchScores[matchId];

            const index1 = scores.indexparticipant1; // Access the stored index
            const index2 = scores.indexparticipant2; // Access the stored index

            const participant1 = participantsForThisRound[index1];
            const participant2 = participantsForThisRound[index2];
    
            console.log(`Checking match ${matchId} scores:`, scores);


            const result = determineWinner(scores, participant1, participant2);
            newResults.push(`${result}`);

            if (Number(scores.participant1) > Number(scores.participant2)) {
                winners.push(participant1);
            } else if (Number(scores.participant2) > Number(scores.participant1)) {
                winners.push(participant2);
            }
        }

        setAllRoundResults(prevResults => [...prevResults, newResults]); // Update the allRoundResults state

        // Check if the tournament has reached the final round
        if (winners.length === 1 || currentRound === totalRounds) {
            console.log(`The winner of the tournament is: ${winners[0].name}`);
            setTournamentWinner(winners[0].name);  // <-- Set the winner here
            // You can add more logic here to handle the end of the tournament
            return;
        }
    
        console.log("Identified Winners:", winners);
    
        setNextRoundParticipants(winners);
        setCurrentRound(currentRound + 1);
        setMatchScores({}); // Reset scores for new round
    
        console.log("Participants for next round after proceeding:", nextRoundParticipants);
    };
  
    // Function to handle spectator view of the tournament
    function SpectatorView({ allRoundResults, tournamentWinner }) {
            
        const handleEnableClick = () => {
        // Pass the data as props to the new window
        const newWindow = window.open('', '_blank');
        newWindow.document.title = 'Spectator Enable';

        newWindow.document.body.innerHTML = `
        <h1>Spectator Results</h1>
        <div id="spectator-results"></div>
        `;

        const spectatorResultsDiv = newWindow.document.getElementById('spectator-results');

        // Render the SpectatorResults component with the data in the new window
        if(newWindow) {
            ReactDOM.render(
            <SpectatorEnable allRoundResults={allRoundResults} tournamentWinner={tournamentWinner} />,
            spectatorResultsDiv
            );
        }
        };

        return (
            <div className="font-inter p-6 bg-black space-y-4">
                <button onClick={handleEnableClick} className="bg-green-800 text-yellow-200 px-4 py-2 rounded">Enable</button>

                <table className="min-w-full bg-white text-black border border-gray-300 divide-y divide-gray-300">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Round</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant1</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant2</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                        {allRoundResults.map((round, roundIndex) => 
                            round.map((result, index) => {
                                const participantNames = result.match(/^(.+) vs (.+),/);
                                const participant1 = participantNames ? participantNames[1] : "N/A";
                                const participant2 = participantNames ? participantNames[2] : "N/A";
                                const resultMessage = result.split(', ')[1];

                                return (
                                    <tr key={`${roundIndex}-${index}`} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{roundIndex + 1}</td>
                                        <td className="px-6 py-4">{participant1}</td>
                                        <td className="px-6 py-4">{participant2}</td>
                                        <td className="px-6 py-4">{resultMessage}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
                {tournamentWinner && (
                    <div className="mt-6 text-xl text-yellow-200 font-bold">
                        The winner of the tournament is : <span className="text-green-800">{tournamentWinner}</span>
                    </div>
                )}
            </div>
        );
    }
    
    // Page view styling
    const activeViewStyle = (currentView) => {
        return view === currentView ? "underline font-bold" : "";
    };
   

    return (
        
        <div className='bg-black min-h-screen pt-16 text-white font-inter'>

            {/* Header Information */}
            <Header />

            {/* Tournament Information */}
            <div className='bg-green-800 p-10 space-y-4 text-yellow-200'>
                <h1 className='text-2xl font-bold'>{tournamentName}</h1>
                <div className='flex flex-row space-x-4'>    
                    <p>Game: {game}</p>
                    <p>Start Time: {formatDateTime(startTime)}</p>
                    {checkInTime ? <p>Check In: {checkInTime} minutes</p> : '' }
                    <p>Organized by {tournamentUserCode}</p>
                </div>
            </div>

            {/* Tournament View Options */}
            <div className="mt-6 mb-10 flex items-center justify-around">
                <div onClick={() => { setView('bracket'); navigate(`/tournament/${generatedCode}/bracket`); }} className={`mr-4 cursor-pointer text-yellow-300 font-semibold tracking-wider  ${activeViewStyle('bracket')}`}>Bracket</div>
                <div onClick={() => { setView('participants'); navigate(`/tournament/${generatedCode}/participants`); }} className={`mr-4 cursor-pointer text-yellow-300 font-semibold tracking-wider ${activeViewStyle('participants')}`}>Participants</div>
                <div onClick={() => { setView('spectator'); navigate(`/tournament/${generatedCode}/spectator`); }} className={`mr-4 cursor-pointer text-yellow-300 font-semibold tracking-wider ${activeViewStyle('spectator')}`}>Spectator View</div>
                <div onClick={() => { setView('settings'); navigate(`/tournament/${generatedCode}/settings`); }} className={`mr-4 cursor-pointer text-yellow-300 font-semibold tracking-wider ${activeViewStyle('settings')}`}>Settings</div>
            </div>

            {/* Bracket view option */}
            {view === 'bracket' && (
            <div className="flex flex-col items-center justify-center mx-16 my-32 space-y-4">
                <p className='text-xl text-yellow-200'>Number of Rounds: {calculateRounds(shuffledParticipants.length)}</p>
                {/* <p>Number of Byes: {calculateByes(shuffledParticipants.length)}</p> */}
                {generateBracket()}
                <button  className='bg-green-800 font-semibold text-yellow-200 hover:bg-green-700 hover:text-yellow-300 p-2 rounded' onClick={proceedToNextRound}>Proceed to Next Round</button>

                {/* Display the winner when the tournament is over */}
                {tournamentWinner && (
                <div className="mt-4">
                    <h2 className="text-2xl font-bold">The winner of the tournament is: {tournamentWinner}</h2>
                </div>
                )}
            </div>
            )}

            {/* Participant view option */}
            {view === 'participants' && (
            <div className='bg-yellow-300 text-black mx-80 my-32 space-y-2'>
                <h1 className='bg-green-800 text-yellow-200 text-xl font-semibold p-5 '>Participants</h1>
                <div className='flex flex-col items-center space-y-4'>

                    {/* Input for single participant is always visible */}
                    <div className='flex flex-row items-center'>
                        <input
                            className='text-black p-2 bg-yellow-200 focus:outline-none placeholder:text-xs placeholder:text-blackrounded-tl-md rounded-bl-md placeholder:italic'
                            type="text"
                            value={participantName}
                            onChange={(e) => setParticipantName(e.target.value)}
                            placeholder="Enter player/team name"
                        />
                        <button className='bg-green-800 font-semibold text-yellow-200 hover:bg-green-700 hover:text-yellow-300 p-2 rounded-tr-md rounded-br-md' onClick={handleAddParticipant}>Add Participant</button>
                    </div>

                    {/* Button to toggle bulk add */}
                    <button className='bg-green-800 font-semibold text-yellow-200 hover:bg-green-700 hover:text-yellow-300 p-2rounded' onClick={() => setShowBulkAdd(!showBulkAdd)}>Add in Bulk</button>

                    {/* Conditionally render bulk add textarea */}
                    {showBulkAdd && (
                        <>
                            <textarea
                                className='text-black bg-yellow-200 w-1/3 h-32 focus:outline-none placeholder:text-xs placeholder:text-black placeholder:italic rounded p-2'
                                value={bulkParticipants}
                                onChange={(e) => setBulkParticipants(e.target.value)}
                                placeholder="Add names seperated by new line"
                            ></textarea>
                            <button className='bg-green-800 text-yellow-200 hover:bg-green-700 hover:text-yellow-300 p-2 rounded font-semibold' onClick={handleBulkAddParticipants}>Submit</button>
                        </>
                    )}
                </div>

                <div className='space-y-2 '>
                    {participantsList.map(participant => (
                    <div key={participant.id} className='bg-yellow-200 p-1 rounded flex items-start justify-between mx-80'>
                        {currentlyEditing === participant.id ? (
                            <input
                                className='text-black'
                                type="text"
                                value={participant.name}
                                onChange={(e) => handleParticipantNameChange(e, participant.id)}
                            />
                        ) : (
                            <span>{participant.name}</span>
                        )}
                        <div>
                            {currentlyEditing === participant.id ? (
                                <button onClick={() => handleUpdateParticipant(participant.id)}><MdSave className='w-6 h-6 hover:text-green-800' /></button>
                            ) : (
                                <>
                                    <button onClick={() => setCurrentlyEditing(participant.id)}><MdModeEdit className='w-6 h-6 hover:text-green-800'/></button>
                                    <button onClick={() => handleDeleteParticipant(participant.id)}><MdDelete className='w-6 h-6 hover:text-green-800' /></button>
                                </>
                            )}
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            )}

            {/* Spectator view option */}
            {view === 'spectator' && (
            <SpectatorView allRoundResults={allRoundResults} tournamentWinner={tournamentWinner} />
            )}

            {/* Settings view option */}
            {view === 'settings' && (
            <div>
                {/* Embed the CreateTournament form with certain fields non-editable */}
                <CreateTournament isEdit={true} tournamentDetails={tournamentDetails} />
            </div>
            )}
        </div>
    );
}

export default TournamentPage;


