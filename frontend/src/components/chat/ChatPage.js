import React, { useState } from 'react';
import ChatBar from './ChatBar';
import ChatBody from './ChatBody';
import './chat.css';

const ChatPage = ({socket, currentUser, setCurrentUser}) => {
  const [myIndex, setMyIndex] = useState(-1);
  return (
    socket &&
    <div className="container">
      {
        (!currentUser) &&
        <div className='noActive'>
            <img src="https://tochato.com/wp-content/uploads/2023/01/talk-to-strangers_628-768x576.jpg" alt="No user"/>
        </div>
      }
      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card chat-app">
            <ChatBar socket={socket} currentUser={currentUser} setCurrentUser={setCurrentUser} myIndex={myIndex} setMyIndex={setMyIndex}/>
            <ChatBody socket={socket} currentUser={currentUser} myIndex={myIndex}/>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ChatPage;