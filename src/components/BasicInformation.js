// Imports
import React, { useEffect } from 'react';
import {TiArrowShuffle}  from 'react-icons/ti';

function BasicInformation({ userCode, tournamentName, setTournamentName, description, setDescription, generatedCode, setGeneratedCode, generatedCodeError,setGeneratedCodeError }) {

    // Generate button handle to change random code 
    const handleUserCodeChange = (e) => {
        setGeneratedCode(e.target.value);
    };

    // Error handling for code 
    const validateUserCodeLength = () => {
        if (!generatedCode || generatedCode.length < 4 || generatedCode.length > 20) {
          setGeneratedCodeError('Code should be valid and between 6 to 8 characters.');
        } else {
          setGeneratedCodeError('');
        }
    };

    // Random code generation
    const generateCode = () => {
        const newCode = Math.random().toString(36).substr(2, 8).toUpperCase();
        setGeneratedCode(newCode);
    };

    // This function will run every time generatedCode changes
    useEffect(() => {
        validateUserCodeLength();
    }, [generatedCode]); // Dependency array with generatedCode
    

    return (
        <div className="bg-yellow-300 rounded shadow-md w-2/3 mx-auto font-inter">
            <h2 className="text-xl bg-green-800 shadow-lg text-yellow-200 p-4 font-semibold mb-4">Basic Information</h2>

                    {/* Host */}
                    <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
                        <label className="block text-black mb-2 w-1/4">Host</label>
                        <input type="text" value={userCode} readOnly className="p-2 bg-yellow-200 focus:outline-none rounded w-3/4 placeholder:text-xs" />
                    </div>

                    {/* Tournament Name */}
                    <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
                        <label className="block text-black flex flex-row mb-2 w-1/4">
                          <p>Tournament Name</p><p className='text-red-600 ml-1 font-bold'>*</p></label>
                        <input type="text" value={tournamentName} onChange={(e) => setTournamentName(e.target.value)} className="p-2 bg-yellow-200 focus:outline-none rounded w-3/4 placeholder:text-xs placeholder:text-black" placeholder="Enter tournament name" required />
                    </div>

                    {/* URL */}
                    <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
                        <label className="block text-black mb-2 w-1/4">URL</label>
                        <div className="flex flex-row w-3/4">
                            <p className="bg-green-800 text-yellow-200 p-2 font-semibold">eventorama-app.vercel.app/ </p>
                            <input
                                type="text"
                                className="p-2 outline-none bg-green-600 placeholder:text-xs placeholder:text-yellow-200 flex-grow"
                                value={generatedCode}
                                onChange={handleUserCodeChange}
                                onBlur={validateUserCodeLength}
                                placeholder="Enter or Generate Code"
                            />
                            <button onClick={generateCode}><TiArrowShuffle className="w-10 h-10 bg-green-800 text-yellow-200 p-2" /></button>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
                        <label className="block flex flex-row text-black mb-2 w-1/4"><p>Description</p><p className='text-red-600 ml-1 font-bold'>*</p></label>
                        <textarea rows="4" required value={description} onChange={(e) => setDescription(e.target.value)} className="p-2 bg-yellow-200 focus:outline-none rounded w-3/4 placeholder:text-xs placeholder:text-black" placeholder="Describe your tournament"></textarea>
                    </div>
                {generatedCodeError && <p className='text-red-600 font-bold text-md text-center'>{generatedCodeError}</p>}
        </div>
    );
}

export default BasicInformation;


