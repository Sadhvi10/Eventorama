// MSc Project
// Name & Student ID : Sadhvi Pugaonkar - 201672582
// File name : App.js

// Imports
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {UserContext} from './UserContext';
import CommonView from './pages/CommonView';
import UserView from './pages/UserView';
import NoPage from './pages/NoPage';
import SetPassword from './pages/SetPassword';
import ConfirmPassword from './pages/ConfirmPassword';
import CreateTournament from './pages/CreateTournament';
import TournamentPage from './pages/TournamentPage';


function App() {
  // Universal code usestates
  const [userCode, setUserCode] = React.useState(null);
  const [isOrganizer, setIsOrganizer] = React.useState(false);

  return (
    <UserContext.Provider value={{userCode,setUserCode,isOrganizer,setIsOrganizer}}>
      <Router>
        <Routes>
          <Route exact path="/" element={<CommonView/>} />
          {/* Spectator View */}
          <Route path="/:code" element={<UserView/>} /> 
          {/* User View */}
          <Route path="/user/:code" element={<UserView/>} />
          <Route path="/set-password/:code" element={<SetPassword/>} />
          <Route path="/confirm-password/:code" element={<ConfirmPassword/>} />
          <Route path="/tournaments/new" element={<CreateTournament/>} />
          <Route path="/tournament/:code" element={<TournamentPage/>} />
          <Route path="/tournament/:code/:view" element={<TournamentPage />} />
          <Route path="*" element={<NoPage/>}/>
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;

