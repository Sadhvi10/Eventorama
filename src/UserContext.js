import React, { createContext, useState, useContext } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // sets the user role in application
  const [userCode, setUserCode] = useState(null);
  // sets the organizer role in tournament
  const [isOrganizer, setIsOrganizer] = useState(false);  
  
  return (
    <UserContext.Provider value={{ userCode, setUserCode, isOrganizer, setIsOrganizer }}>
      {children}
    </UserContext.Provider>
  );
};

