// MSc Project
// Name & Student ID : Sadhvi Pugaonkar - 201672582
// File name : SpectatorEnable.js

// Imports
import React from 'react';

function SpectatorEnable({ allRoundResults, tournamentWinner }) {

    return (
        <div className="font-inter p-6 bg-gray-100">

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
                <div className="mt-6 text-xl text-black font-bold">
                    The winner of the tournament is: <span className="text-blue-600">{tournamentWinner}</span>
                </div>
            )}
        </div>
    );
}

export default SpectatorEnable;
