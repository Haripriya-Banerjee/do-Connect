import React, { useState, useEffect, useContext } from 'react';
import './chat.css';
import { SessionInfoContext } from "../../App";

const ChatBar = ({socket, currentUser, setCurrentUser, myIndex, setMyIndex}) => {
    const [users, setUsers] = useState([]);
    const sessionInfo = useContext(SessionInfoContext).sessionInfo; //consume
    useEffect(()=> {
        socket.on('userJoined', (usersData) => {
            const otherUsers = usersData.filter(user => user.userId!==sessionInfo.id);
            setUsers(otherUsers);
            if(myIndex===-1) {
                let ind = usersData.findIndex((user)=>user.userId===sessionInfo.id);
                setMyIndex(usersData[ind].index);
            }
        })
        if(currentUser===null && users.length>0) {
            setCurrentUser(users[0]);
        }
    }, [socket, users])

    useEffect(() => {
        socket.on('userLeft', (users) => {
            const otherUsers = users.filter(user => user.userId!==sessionInfo.id);
            setUsers(otherUsers);
            if(otherUsers.length>0) {
                setCurrentUser(otherUsers[0]);
            }
            else {
                setCurrentUser(null);
            }
        })
    },[socket, users])

    useEffect(() => {
        if(currentUser) {
            socket.emit('changedCurrentUser', {from:sessionInfo.id, to:currentUser.userId});
        }
    }, [currentUser])
    
    return (
        
        <div id="plist" className="people-list">
                <ul className="list-unstyled chat-list mt-2 mb-0">
                    {
                        users.map((user, index) => (
                            <li className="clearfix" key={index} onClick={()=>{
                                setCurrentUser(users[index]);
                                }}>
                                <img src={`https://bootdey.com/img/Content/avatar/avatar${user.index+1}.png`} alt="avatar"/>
                                <div className="about">
                                    <div className="name">{user.userName}</div>
                                    <div className="status"> <i className="fa fa-circle online"></i> online </div>                                            
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
    );
  };
  
  export default ChatBar;