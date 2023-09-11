// Imports
import React from 'react';

function GameInformation({game, setGame}) {

    return (
        <div className="bg-yellow-300 rounded shadow-md w-2/3 mx-auto mt-4 font-inter">
            <h2 className="text-xl bg-green-800 shadow-lg text-yellow-200 p-4 font-semibold mb-4">Game Information</h2>
                    
            {/* Game */}
            <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
                <label className="block text-black flex flex-row mb-2 w-1/4"><p>Game</p><p className='text-red-600 ml-1 font-bold'>*</p></label>
                <input type="text" value={game} onChange={(e) => setGame(e.target.value)} className="p-2 bg-yellow-200 focus:outline-none rounded w-3/4 placeholder:text-xs placeholder:text-black" placeholder="Enter game name or search" required />
            </div>
        </div>
    );
}

export default GameInformation;



// BASELINE WORKING CODE 

// import React from 'react';

// function GameInformation({
//     game, setGame, tournamentType, setTournamentType, 
//     stageFormat, setStageFormat, doubleEliminationType, setDoubleEliminationType,
//     roundRobinPlayCount, setRoundRobinPlayCount, rankingMethod, setRankingMethod,
//     customPoints, setCustomPoints,participantsInGroup,setParticipantsInGroup,participantsAdvance,setParticipantsAdvance,isEdit
// }) {

//     return (
//         <div className="bg-yellow-300 rounded shadow-md w-2/3 mx-auto mt-4">
//                     <h2 className="text-xl bg-green-800 shadow-lg text-yellow-200 p-4 font-semibold mb-4">Game Information</h2>
                    
//                     {/* Game */}
//                     <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
//                         <label className="block text-black flex flex-row mb-2 w-1/4"><p>Game</p><p className='text-red-600 ml-1 font-bold'>*</p></label>
//                         <input type="text" value={game} onChange={(e) => setGame(e.target.value)} className="p-2 bg-yellow-200 focus:outline-none rounded w-3/4 placeholder:text-xs placeholder:text-black" placeholder="Enter game name or search" required />
//                     </div>

//                     {/* Tournament Type
//                     <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
//                         <label className="block text-black mb-2 w-1/4">Tournament Type</label>
//                         <div className="flex flex-row w-3/4 space-x-2">
//                             <label><input type="radio" name="tournamentType" value="single" checked={tournamentType === 'single'} onChange={(e) => setTournamentType(e.target.value)} disabled={isEdit} /> Single Stage</label>
//                             <label><input type="radio" name="tournamentType" value="two" checked={tournamentType === 'two'} onChange={(e) => setTournamentType(e.target.value)} disabled={isEdit}/> Two Stage</label>
//                         </div>
//                     </div>

//                     // If Single Stage is selected 
//                     {tournamentType === 'single' && (
//                         <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
//                             <label className="block text-black flex flex-row mb-2 w-1/4"><p>Format</p><p className='text-red-600 ml-1 font-bold'>*</p></label>
//                             <select value={stageFormat.single} onChange={e => setStageFormat({ ...stageFormat, single: e.target.value })} className="p-2 bg-yellow-200 focus:outline-none rounded w-3/4">
//                                 <option value="single-elimination">Single Elimination</option>
//                                 <option value="double-elimination">Double Elimination</option>
//                                 <option value="round-robin">Round Robin</option>
//                                 <option value="swiss">Swiss</option>
//                             </select>
//                         </div>
//                     )}

//                     //Options for Double Elimination 
//                     {tournamentType === 'single' && stageFormat.single === 'double-elimination' && (
//                         <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
//                             <label className="block text-black mb-2 w-1/4">Double Elimination Type</label>
//                             <div className="flex flex-row w-3/4 space-x-2">
//                                 <label>
//                                     <input type="radio" name="doubleEliminationType" value="1-2" checked={doubleEliminationType === '1-2'} onChange={(e) => setDoubleEliminationType(e.target.value)} /> 1-2 Matches
//                                 </label>
//                                 <label>
//                                     <input type="radio" name="doubleEliminationType" value="1" checked={doubleEliminationType === '1'} onChange={(e) => setDoubleEliminationType(e.target.value)} /> 1 Match
//                                 </label>
//                             </div>
//                         </div>
//                     )}

//                     // Options for Round Robin 
//                     {tournamentType === 'single' && stageFormat.single === 'round-robin' && (
//                         <>
//                             <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
//                                 <label className="block text-black mb-2 w-1/4">Participants playing each other</label>
//                                 <select value={roundRobinPlayCount} onChange={e => setRoundRobinPlayCount(e.target.value)} className="p-2 bg-yellow-200 focus:outline-none rounded w-3/4">
//                                     <option value="once">Once</option>
//                                     <option value="twice">Twice</option>
//                                 </select>
//                             </div>
//                             <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
//                                 <label className="block text-black mb-2 w-1/4">Ranking Method</label>
//                                 <select value={rankingMethod} onChange={e => setRankingMethod(e.target.value)} className="p-2 bg-yellow-200 focus:outline-none rounded w-3/4">
//                                     <option value="match-wins">Match Wins</option>
//                                     <option value="points-scored">Points Scored</option>
//                                     <option value="points-difference">Points Difference</option>
//                                     <option value="custom-points">Custom Points</option>
//                                 </select>
//                             </div>
//                             {rankingMethod === 'custom-points' && (
//                               <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
//                                   <label className="block text-black mb-2 w-1/4">Custom Points</label>
//                                   <div className="flex flex-col w-3/4 space-y-2">
//                                       <div className="flex items-center space-x-2">
//                                           <input type="number" value={customPoints.matchWin} onChange={e => setCustomPoints({ ...customPoints, matchWin: e.target.value })} className="p-2 bg-yellow-200 focus:outline-none rounded w-1/3" />
//                                           <label className="w-2/3 italic font-semibold">points scored per match win</label>
//                                       </div>
//                                       <div className="flex items-center space-x-2">
//                                           <input type="number" value={customPoints.matchTie} onChange={e => setCustomPoints({ ...customPoints, matchTie: e.target.value })} className="p-2 bg-yellow-200 focus:outline-none rounded w-1/3" />
//                                           <label className="w-2/3 italic font-semibold">points scored per match tie</label>
//                                       </div>
//                                       <div className="flex items-center space-x-2">
//                                           <input type="number" value={customPoints.gameSetWin} onChange={e => setCustomPoints({ ...customPoints, gameSetWin: e.target.value })} className="p-2 bg-yellow-200 focus:outline-none rounded w-1/3" />
//                                           <label className="w-2/3 italic font-semibold">points scored per game/set win</label>
//                                       </div>
//                                       <div className="flex items-center space-x-2">
//                                           <input type="number" value={customPoints.gameSetTie} onChange={e => setCustomPoints({ ...customPoints, gameSetTie: e.target.value })} className="p-2 bg-yellow-200 focus:outline-none rounded w-1/3" />
//                                           <label className="w-2/3 italic font-semibold">points scored per game/set tie</label>
//                                       </div>
//                                   </div>
//                               </div>
//                           )}
//                         </>
//                     )}

//                     // Options for Swiss with Custom Points 
//                     {tournamentType === 'single' && stageFormat.single === 'swiss' && (
//                         <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
//                             <label className="block text-black mb-2 w-1/4">Custom Points for Swiss</label>
//                             <div className="flex flex-col w-3/4 space-y-2">
//                                 <div className="flex items-center space-x-2">
//                                     <input type="number" value={customPoints.matchWin} onChange={e => setCustomPoints({ ...customPoints, matchWin: e.target.value })} className="p-2 bg-yellow-200 focus:outline-none rounded w-1/3" />
//                                     <label className="w-2/3 italic font-semibold">points scored per match win</label>
//                                 </div>
//                                 <div className="flex items-center space-x-2">
//                                     <input type="number" value={customPoints.matchTie} onChange={e => setCustomPoints({ ...customPoints, matchTie: e.target.value })} className="p-2 bg-yellow-200 focus:outline-none rounded w-1/3" />
//                                     <label className="w-2/3 italic font-semibold">points scored per match tie</label>
//                                 </div>
//                                 <div className="flex items-center space-x-2">
//                                     <input type="number" value={customPoints.gameSetWin} onChange={e => setCustomPoints({ ...customPoints, gameSetWin: e.target.value })} className="p-2 bg-yellow-200 focus:outline-none rounded w-1/3" />
//                                     <label className="w-2/3 italic font-semibold">points scored per game/set win</label>
//                                 </div>
//                                 <div className="flex items-center space-x-2">
//                                     <input type="number" value={customPoints.gameSetTie} onChange={e => setCustomPoints({ ...customPoints, gameSetTie: e.target.value })} className="p-2 bg-yellow-200 focus:outline-none rounded w-1/3" />
//                                     <label className="w-2/3 italic font-semibold">points scored per game/set tie</label>
//                                 </div>
//                             </div>
//                         </div>
//                     )}


//                     // If Two Stage is selected 
//                     {tournamentType === 'two' && (
//                     <>
//                     // Group Stage 
//                     <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
//                         <label className="block text-black mb-2 w-1/4">Group Stage</label>
//                         <select value={stageFormat.group} onChange={e => setStageFormat({ ...stageFormat, group: e.target.value })} className="p-2 bg-yellow-200 focus:outline-none rounded w-3/4">
//                             <option value="single">Single Elimination</option>
//                             <option value="double">Double Elimination</option>
//                             <option value="round-robin">Round Robin</option>
//                         </select>
//                     </div>

//                     // Group Stage Options 
                
//                     {(stageFormat.group === 'single' || stageFormat.group === 'double') && (
//                       <>
//                         <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
//                             <label className="block text-black mb-2 w-1/4">Participants in Each Group</label>
//                             <input type="number" value={participantsInGroup} onChange={(e) => setParticipantsInGroup(e.target.value)} className="p-2 bg-yellow-200 focus:outline-none rounded w-3/2"/>
//                             <p className='w-3/2 italic font-semibold'>must be power of 2</p>
//                         </div>
//                         <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
//                             <label className="block text-black mb-2 w-1/4">Participants Advancing</label>
//                             <input type="number" value={participantsAdvance} onChange={(e) => setParticipantsAdvance(e.target.value)} className="p-2 bg-yellow-200 focus:outline-none rounded w-3/2" />
//                             <p className='w-3/2 italic font-semibold'>must be power of 2</p>
//                         </div>
//                       </>
//                     )}

//                     // Group Stage Options 

//                     {stageFormat.group === 'round-robin' && (
//                       <>
//                         <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
//                             <label className="block text-black mb-2 w-1/4">Participants in Each Group</label>
//                             <input type="number" value={participantsInGroup} onChange={(e) => setParticipantsInGroup(e.target.value)} className="p-2 bg-yellow-200 focus:outline-none rounded w-3/2" />
//                             <p className='w-3/2 italic font-semibold'>maximum 20</p>
//                         </div>
//                         <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
//                             <label className="block text-black mb-2 w-1/4">Participants Advancing</label>
//                             <input type="number" value={participantsAdvance} onChange={(e) => setParticipantsAdvance(e.target.value)} className="p-2 bg-yellow-200 focus:outline-none rounded w-3/2"/>
//                             <p className='w-3/2 italic font-semibold'>must be power of 2</p>
//                         </div>
//                         // ... (rest of the Round Robin options for Group Stage) 
//                       </>
//                     )}

//                     // Knockout Stage 
//                     <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
//                         <label className="block text-black flex flex-row mb-2 w-1/4"><p>Knockout Stage</p><p className='text-red-600 ml-1 font-bold'>*</p></label>
//                         <select value={stageFormat.knockout} onChange={e => setStageFormat({ ...stageFormat, knockout: e.target.value })} className="p-2 bg-yellow-200 focus:outline-none rounded w-3/4">
//                             <option value="single">Single Elimination</option>
//                             <option value="double">Double Elimination</option>
//                             <option value="round-robin">Round Robin</option>
//                             <option value="swiss">Swiss</option>
//                         </select>
//                     </div>

//                     // Knockout Stage Options 
//                     {stageFormat.knockout === 'double' && (
//                         <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
//                             <label className="block text-black mb-2 w-1/4">Double Elimination Type</label>
//                             <div className="flex flex-row w-3/4 space-x-2">
//                                 <label>
//                                     <input type="radio" name="doubleEliminationType" value="1-2" checked={doubleEliminationType === '1-2'} onChange={(e) => setDoubleEliminationType(e.target.value)} /> 1-2 Matches
//                                 </label>
//                                 <label>
//                                     <input type="radio" name="doubleEliminationType" value="1" checked={doubleEliminationType === '1'} onChange={(e) => setDoubleEliminationType(e.target.value)} /> 1 Match
//                                 </label>
//                             </div>
//                         </div>
//                     )}

//                     {stageFormat.knockout === 'round-robin' && (
//                         <>
//                             <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
//                                 <label className="block text-black mb-2 w-1/4">Participants playing each other</label>
//                                 <select value={roundRobinPlayCount} onChange={e => setRoundRobinPlayCount(e.target.value)} className="p-2 bg-yellow-200 focus:outline-none rounded w-3/4">
//                                     <option value="once">Once</option>
//                                     <option value="twice">Twice</option>
//                                 </select>
//                             </div>
//                             <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
//                                 <label className="block text-black mb-2 w-1/4">Ranking Method</label>
//                                 <select value={rankingMethod} onChange={e => setRankingMethod(e.target.value)} className="p-2 bg-yellow-200 focus:outline-none rounded w-3/4">
//                                     <option value="match-wins">Match Wins</option>
//                                     <option value="points-scored">Points Scored</option>
//                                     <option value="points-difference">Points Difference</option>
//                                     <option value="custom-points">Custom Points</option>
//                                 </select>
//                             </div>
//                             {rankingMethod === 'custom-points' && (
//                                 // ... (Custom Points JSX - same as in the Single Stage section)
//                                 <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
//                                       <label className="block text-black mb-2 w-1/4">Custom Points</label>
//                                       <div className="flex flex-col w-3/4 space-y-2">
//                                           <div className="flex items-center space-x-2">
//                                               <input type="number" value={customPoints.matchWin} onChange={e => setCustomPoints({ ...customPoints, matchWin: e.target.value })} className="p-2 bg-yellow-200 focus:outline-none rounded w-1/3" />
//                                               <label className="w-2/3 italic font-semibold">points scored per match win</label>
//                                           </div>
//                                           <div className="flex items-center space-x-2">
//                                               <input type="number" value={customPoints.matchTie} onChange={e => setCustomPoints({ ...customPoints, matchTie: e.target.value })} className="p-2 bg-yellow-200 focus:outline-none rounded w-1/3" />
//                                               <label className="w-2/3 italic font-semibold">points scored per match tie</label>
//                                           </div>
//                                           <div className="flex items-center space-x-2">
//                                               <input type="number" value={customPoints.gameSetWin} onChange={e => setCustomPoints({ ...customPoints, gameSetWin: e.target.value })} className="p-2 bg-yellow-200 focus:outline-none rounded w-1/3" />
//                                               <label className="w-2/3 italic font-semibold">points scored per game/set win</label>
//                                           </div>
//                                           <div className="flex items-center space-x-2">
//                                               <input type="number" value={customPoints.gameSetTie} onChange={e => setCustomPoints({ ...customPoints, gameSetTie: e.target.value })} className="p-2 bg-yellow-200 focus:outline-none rounded w-1/3" />
//                                               <label className="w-2/3 italic font-semibold">points scored per game/set tie</label>
//                                           </div>
//                                       </div>
//                                   </div>
//                             )}
//                         </>
//                     )}

//                     {stageFormat.knockout === 'swiss' && (
//                         <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
//                         <label className="block text-black mb-2 w-1/4">Custom Points</label>
//                         <div className="flex flex-col w-3/4 space-y-2">
//                             <div className="flex items-center space-x-2">
//                                 <input type="number" value={customPoints.matchWin} onChange={e => setCustomPoints({ ...customPoints, matchWin: e.target.value })} className="p-2 bg-yellow-200 focus:outline-none rounded w-1/3" />
//                              <label className="w-2/3 italic font-semibold">points scored per match win</label>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <input type="number" value={customPoints.matchTie} onChange={e => setCustomPoints({ ...customPoints, matchTie: e.target.value })} className="p-2 bg-yellow-200 focus:outline-none rounded w-1/3" />
//                              <label className="w-2/3 italic font-semibold">points scored per match tie</label>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <input type="number" value={customPoints.gameSetWin} onChange={e => setCustomPoints({ ...customPoints, gameSetWin: e.target.value })} className="p-2 bg-yellow-200 focus:outline-none rounded w-1/3" />
//                                 <label className="w-2/3 italic font-semibold">points scored per game/set win</label>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <input type="number" value={customPoints.gameSetTie} onChange={e => setCustomPoints({ ...customPoints, gameSetTie: e.target.value })} className="p-2 bg-yellow-200 focus:outline-none rounded w-1/3" />
//                                 <label className="w-2/3 italic font-semibold">points scored per game/set tie</label>
//                             </div>
//                         </div>
//                     </div>
//                     )}
//                   </>
//                 )} */}
//               </div>
//     );
// }

// export default GameInformation;
