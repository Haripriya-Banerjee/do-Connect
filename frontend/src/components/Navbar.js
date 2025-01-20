import React, {useState, useEffect, lazy , Suspense, useContext} from "react"
import './nav.css';
import {
    Routes,
    Route,
  } from "react-router-dom";
import { SessionInfoContext } from "../App";
import { useNavigate } from "react-router-dom";
import headers from './headers.json' 
import Spinner from "./Spinner";
import socketIO from 'socket.io-client';
const Home = lazy(() => import('./Home'));
const Question = lazy(() => import("./Question"));
const AddQuestion = lazy(() => import("./AddQuestion"));
const Register = lazy(() => import("./Register"));
const Login = lazy(() => import("./Login"));
const SeeUsers = lazy(() => import("./SeeUsers"));
const QuestionDetails = lazy(() => import("./QuestionDetails"));
const ChatPage = lazy(()=>import("./chat/ChatPage"));

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Navbar = () => {
  const [socket, setSocket] = useState(null);
  const {sessionInfo, setSessionInfo} = useContext(SessionInfoContext);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if(sessionInfo && sessionInfo.role==='user') {
      setSocket(socketIO.connect(`${backendUrl}`));
    }
  },[])

  useEffect(()=> {
    if(socket) {
      socket.emit('newUser', { userId:sessionInfo.id, socketId: socket.id, userName:sessionInfo.userName });
    }
  }, [socket]);

  const logOut =async () => {
    const response = await fetch(`${backendUrl}/auth/logout`, {
            credentials: 'include',
            method: 'POST',
            headers: {...headers, token:sessionInfo.token, email:sessionInfo.email, role:sessionInfo.role},
            body: JSON.stringify()
        });
        const result = await response.json();
    if(sessionInfo && sessionInfo.role==='user' && socket) {
      socket.disconnect();
      setSocket(null);
      setCurrentUser(null);
    }
    setSessionInfo(null);
    navigate(`/login`);
  }

  return (
    <>
    <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">DoConnect</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation" >
            <span className="navbar-toggler-icon"></span>
            </button>
            
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/">Home</a>
              </li>
              {(sessionInfo!==null) &&
              (<>
                <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/questions">Questions</a>
                </li>
                {(sessionInfo.role==='user') &&
                <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/add-questions">Add Questions</a>
                </li>
                }
                {(sessionInfo.role==='admin') &&
                <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/see-users">Users</a>
                </li>
                }
                {(sessionInfo.role==='user') &&
                <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/chat">Chat</a>
                </li>
                }
              </>)
                }
                {(sessionInfo===null) &&
                <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Login/Register
                </a>
                <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="/login">Login</a></li>
                    <li><a className="dropdown-item" href="/register">Register</a></li>
                </ul>
                </li>
                }
                {(sessionInfo!==null) &&
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button className="btn btn-danger" type="button" width="" onClick={logOut}>Logout</button>
              </div>
              }
            </ul>
            </div>
        </div>
    </nav>
    <Routes>
        <Route path="/" element={<Suspense fallback={<Spinner/>}><Home/></Suspense>}/>
        <Route path="/questions" element={<Suspense fallback={<Spinner/>}><Question/></Suspense>}/>
        <Route path="/add-questions" element={<Suspense fallback={<Spinner/>}><AddQuestion/></Suspense>}/>
        <Route path="/see-users" element={<Suspense fallback={<Spinner/>}><SeeUsers/></Suspense>}/>
        <Route path="/register" element={<Suspense fallback={<Spinner/>}><Register/></Suspense>}/>
        <Route path="/login" element={<Suspense fallback={<Spinner/>}><Login/></Suspense>}/>
        <Route path="/question-details/:id" element={<Suspense fallback={<Spinner/>}><QuestionDetails/></Suspense>}/>
        <Route path="/chat" element={<Suspense fallback={<Spinner/>}>
          <ChatPage socket={socket} currentUser={currentUser} setCurrentUser={setCurrentUser}/></Suspense>}/>
    </Routes>
    </>
  )
};

export default Navbar;
