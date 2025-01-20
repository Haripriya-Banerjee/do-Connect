import React, { useEffect, useState, useContext } from "react"
import headers from './headers.json';
import { SessionInfoContext } from "../App";
import './user.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const SeeUsers = () => {
  const [users, setUsers] = useState ([]);
  const sessionInfo = useContext(SessionInfoContext).sessionInfo; //consume

  useEffect(()=>{
    const fetchUsers = async ()=>{
      const response = await fetch(`${backendUrl}/users`,{
        credentials: 'include',
        method: 'GET',
        headers: {...headers, token:sessionInfo.token, email:sessionInfo.email, role:sessionInfo.role}
      });
      const result = await response.json();
      const isStatusCorrect = response.ok;   ///status === 200 or 201
      if(isStatusCorrect===true){
        setUsers(result);
      }
    }
    fetchUsers();
  },[])

  const changeUserStatus =async(userId, status) => {
    const response = await fetch(`${backendUrl}/users/${userId}`,{
        credentials: 'include',
        method: 'PUT',
        headers: {...headers, token:sessionInfo.token, email:sessionInfo.email, role:sessionInfo.role},
        body : JSON.stringify({activated:status})
      });
      const result = await response.json();
      const isStatusCorrect = response.ok; //status===200 or 201 
      if(isStatusCorrect===true){
        const otherUsers = users.filter(user => user._id!==userId);
        setUsers([...otherUsers, result]);
      }
  }

  return (
    <>
    <div className="container6">
      <table className="table table-borderless">
        <thead>
          <tr>
            <th scope="col">Sl. No.</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
            <th scope="col">Status</th>
            <th scope="col">Change status</th>
          </tr>
        </thead>
        <tbody>
          {
            users.filter(user => user._id!==sessionInfo.id).map((user, index) => (
              <tr scope="row" key={index}>
                <td>{index+1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.activated===true?"Active":"Deactivated"}</td>
                <td>{user.activated===true?
                  <button className="btn btn-danger" type="button" style={{width:"100px"}}
                    onClick={()=>changeUserStatus(user._id, false)}>Deactivate
                  </button>:
                  <button className="btn btn-primary" type="button" style={{width:"100px"}}
                  onClick={()=>changeUserStatus(user._id, true)}>Activate
                </button>}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
    </>
  )
};

export default SeeUsers;
