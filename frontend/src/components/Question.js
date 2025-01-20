import React, { useEffect, useState, useContext } from "react"
import './qsn.css';
import headers from './headers.json';
import { SessionInfoContext } from "../App";

const backendUrl = process.env.REACT_APP_BACKEND_URL;


const Question = () => {
  const [questions,setQuestions] = useState ([]);
  const [statement, setStatement] = useState("");
  const sessionInfo = useContext(SessionInfoContext).sessionInfo; //consume

  useEffect(()=>{
    const fetchQuestions = async ()=>{
      const response = await fetch(`${backendUrl}/questions?statement=${statement}`,{
        credentials: 'include',
        method: 'GET',
        headers: {...headers, token:sessionInfo.token, email:sessionInfo.email, role:sessionInfo.role}
      });
      const result = await response.json();
      const isStatusCorrect = response.ok;   ///status === 200 or 201
      if(isStatusCorrect===true){
        setQuestions(result)
      }
    }
    fetchQuestions();
  },[statement])

  const renderOnScreen = (id,result)=>{ 
    const unChangedQuestions = questions.filter((question)=>question._id!==id);
    setQuestions([...unChangedQuestions,result])
  }

  const approveQuestion = async (id)=>{
    const response = await fetch(`${backendUrl}/questions/status/${id}`,{
        credentials: 'include',
        method: 'PUT',
        headers: {...headers, token:sessionInfo.token, email:sessionInfo.email, role:sessionInfo.role},
        body : JSON.stringify({approved:true})
      });
      const result = await response.json();
      const isStatusCorrect = response.ok; //status===200 or 201 
      if(isStatusCorrect===true){
        renderOnScreen(id,result)
      }

  }
  const resolveQuestion= async(id)=>{
    const response = await fetch(`${backendUrl}/questions/status/${id}`,{
        credentials: 'include',
        method: 'PUT',
        headers: {...headers, token:sessionInfo.token, email:sessionInfo.email, role:sessionInfo.role},
        body : JSON.stringify({isActive:false})
      });
      const result = await response.json();
      const isStatusCorrect = response.ok; //status===200 or 201 
      if (isStatusCorrect===true){
        renderOnScreen(id,result)
      }
  }
  return (
    <>
    <nav className="navbar bg-body-tertiary">
      <div className="container-fluid">
        <form className="d-flex" role="search"

        onSubmit={(e) => {
          e.preventDefault();  //for update the statement's value
          setStatement(e.target[0].value);
         
        }}>

          <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
          <button className="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </nav>
    <div className="container1">
    <div className="list-group"> 
          <ol className="list-group list-group-numbered">
            {
              questions.map((question,index) => (
                ((sessionInfo!==null) && (sessionInfo.role==='admin' || (sessionInfo.role==='user'
                 && question.approved === true))) &&
                (<li className="list-group-item list-group-item-action" key={index}>
                  <a href={`/question-details/${question._id}`}>{question.statement}</a>
                  {(sessionInfo.role==='admin') && 
                    <>
                    {(question.approved===false)&&
                      <button className="btn btn-primary float-end" type="button" onClick={()=>approveQuestion(question._id)}>Approve</button>
                    }
                    {(question.approved===true && question.isActive === true) &&
                      <button className="btn btn-success float-end" type="button" onClick={()=>resolveQuestion(question._id)} >Resolve</button>
                    } 
                    </>
                  }
                  {
                    (question.isActive === false) &&
                    (<svg xmlns="http://www.w3.org/2000/svg" width="80" height="30" fill="currentColor" className="bi bi-check float-end" viewBox="0 0 16 16">
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"></path>
                  </svg>)
                  }
                </li>)
              ))
            }

          </ol>
        </div>
        </div>
      
    </>
  )
};

export default Question;
