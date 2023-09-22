// MSc Project
// Name & Student ID : Sadhvi Pugaonkar - 201672582
// File name : RegistrationInformation.js

// Imports
import React from 'react';

function RegistrationInformation({maxParticipants, setMaxParticipants, startTime, setStartTime, provideList, setProvideList, requireTeam, setRequireTeam, specifyMax, setSpecifyMax, requireCheckIn, setRequireCheckIn, checkInTime, setCheckInTime, isEdit}) {
  return (
    <div className="bg-yellow-300 rounded shadow-md w-2/3 mx-auto mt-4 font-inter">
        <h2 className="text-xl bg-green-800 shadow-lg text-yellow-200 p-4 font-semibold mb-4">Registration</h2>

        {/* Registration */}
        <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
            <label className="block text-black flex flex-row mb-2 w-1/4"><p>Registration</p><p className='text-red-600 ml-1 font-bold'>*</p></label>
            <label>
              <input 
                  type="radio" 
                  name="provideList" 
                  checked={provideList} 
                  onChange={() => setProvideList(prev => !prev)} 
              /> Provide list of participants
            </label>
        </div>

        {/* Participants */}
        <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
            <label className="block text-black flex flex-row mb-2 w-1/4"><p>Participants</p><p className='text-red-600 ml-1 font-bold'>*</p></label>
            <div className="flex flex-col w-3/4 space-y-2">
                <label>
                    <input type="checkbox" checked={requireTeam} onChange={e => setRequireTeam(e.target.checked)} /> Require participants to register as team
                </label>
                <div className="flex space-x-2 items-center">
                    <label><input type="checkbox" checked={specifyMax} onChange={e => setSpecifyMax(e.target.checked)} /> Specify max no of participants</label>
                    {specifyMax && <input type="number" value={maxParticipants} onChange={e => setMaxParticipants(e.target.value)} className="p-2 bg-yellow-200 focus:outline-none rounded placeholder:text-xs placeholder:text-black" placeholder="Number" />}
                </div>
            </div>
        </div>

        {/* Start Time */}
        <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
            <label className="block text-black flex flex-row mb-2 w-1/4"><p>Start Time</p><p className='text-red-600 ml-1 font-bold'>*</p></label>
            <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} className="p-2 bg-yellow-200 focus:outline-none rounded w-3/4" disabled={isEdit} required />
        </div>

        {/* Check-In Requirement */}
        <div className="mb-4 p-4 flex flex-row space-x-4 items-center">
            <label className="block text-black mb-2 w-1/4">Check-In Requirement</label>
            <div className="flex flex-col w-3/4 space-y-2">
                <label>
                    <input type="checkbox" checked={requireCheckIn} onChange={e => setRequireCheckIn(e.target.checked)} /> Require participant check-in
                </label>
                {requireCheckIn && (
                    <div className="flex space-x-2 items-center">
                        <label>Check-in starts in: </label>
                        <input type="number" value={checkInTime} onChange={e => setCheckInTime(e.target.value)} className="p-2 bg-yellow-200 focus:outline-none rounded" disabled={isEdit} />
                        <p className='italic font-semibold'>minutes</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}

export default RegistrationInformation;

