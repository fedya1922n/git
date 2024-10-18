
import React, { createContext, useState, useContext } from 'react';

const NotesContext = createContext();


export const NotesProvider = ({ children }) => {


  return (
    <NotesContext.Provider value={{}}>
      {children}
    </NotesContext.Provider>
  );
};
export default NotesProvider