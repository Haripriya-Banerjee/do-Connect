import './App.css';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { BrowserRouter } from 'react-router-dom';
import React, { useEffect, useState, createContext } from "react";
export const SessionInfoContext = createContext();

function App() {
  const [sessionInfo, setSessionInfo] = useState(JSON.parse(localStorage.getItem('sessionInfo')));
  // const [sessionInfo, setSessionInfo] = useState(JSON.parse(sessionStorage.getItem('sessionInfo')));

  useEffect(() => {
    localStorage.setItem('sessionInfo', JSON.stringify(sessionInfo));
    // sessionStorage.setItem('sessionInfo', JSON.stringify(sessionInfo));
  }, [sessionInfo])

  return (
    <>

    <BrowserRouter>
    <SessionInfoContext.Provider value={{sessionInfo, setSessionInfo}}>
      <Navbar/>
      </SessionInfoContext.Provider>
      <Footer/>
    </BrowserRouter>
    </>
  );
}

export default App;