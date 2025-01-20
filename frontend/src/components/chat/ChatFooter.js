import React, {useState, useContext} from 'react';
import { SessionInfoContext } from "../../App";

const ChatFooter = ({ socket, currentUser, messages, setMessages }) => {
    const [message, setMessage] = useState('');
    const sessionInfo = useContext(SessionInfoContext).sessionInfo; //consume

    const handleSubmit = (e) => {
        e.preventDefault();
        if(message.length>0) {
            socket.emit('sendMessage', {from:sessionInfo.id, to:currentUser.userId, message})
            setMessages([...messages, {fromSelf:true, message:message}])
            setMessage('');
        }
      };
  return (
    <div className="chat-message clearfix">
        <form className="input-group mb-0" onSubmit={handleSubmit}>
            <div className="input-group-prepend">
                <button className="input-group-text"><i className="fa fa-send"></i></button>
            </div>
            <input type="text" className="form-control" value = {message} placeholder="Enter text here..." 
            onChange={(e) => setMessage(e.target.value)}/>                                    
        </form>
    </div>
  );
};

export default ChatFooter;