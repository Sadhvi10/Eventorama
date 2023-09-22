// MSc Project
// Name & Student ID : Sadhvi Pugaonkar - 201672582
// File name : GameInformation.js

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



