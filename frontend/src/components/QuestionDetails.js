import React, { lazy, Suspense, useEffect, useState, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom";
import headers from './headers.json';
import { createPortal } from "react-dom";
import { SessionInfoContext } from "../App";
import Spinner from "./Spinner";
const Answers = lazy(() => import("./Answers"));
const AddAnswerComment = lazy(() => import("./AddAnswerComment"));
const EditItem = lazy(() => import("./EditItem"));
const Popup = lazy(() => import("./Popup"));

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const QuestionDetails = () => {
    const {id} = useParams();  //useParam is a hook 
    const [question,setQuestion] = useState(null);
    const [showAnswers, setShowAnswers] = useState(false);
    const [addAnswer, setAddAnswer] = useState(false);
    const [editQuestion, setEditQuestion] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const sessionInfo = useContext(SessionInfoContext).sessionInfo;
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchData = async()=>{
            const response = await fetch(`${backendUrl}/questions/${id}`,{
            credentials: 'include',
            method: 'GET',
            headers: {...headers, token:sessionInfo.token, email:sessionInfo.email, role:sessionInfo.role}
            });
            const result = await response.json();
            const isStatusCorrect = response.ok;   ///status === 200 or 201
            if(isStatusCorrect===true){
                setQuestion(result);
            }
        }
        fetchData();
    },[id, editQuestion])

    const deleteQuestion = async(questionId) => {
        const response = await fetch(`${backendUrl}/questions/${questionId}`,{
            credentials: 'include',
            method: 'DELETE',
            headers: {...headers, token:sessionInfo.token, email:sessionInfo.email, role:sessionInfo.role}
            });
        const result = await response.json();
        const isStatusCorrect = response.ok;   ///status === 200 or 201
        if(isStatusCorrect===true){
            navigate(`/questions`);
        }
    }

  return (
    <>
    { question &&
      <div className="card">
        <h5 className="card-header">Asked By : {question.userId.name} </h5>
        <div className="card-body">
        {(editQuestion===false) &&
            <>
            <h5 className="card-title"> 
                Question :
                {
                    (question.isActive === false) &&
                    (<div className="float-end">
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="30" fill="currentColor" className="bi bi-check" viewBox="0 0 16 16">
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"></path>
                    </svg>
                    Resolved
                    </div>)
                }
                {(question.isActive===true) &&
                <div className="btn-toolbar float-end" role="toolbar" aria-label="Toolbar with button groups">
                    <div className="btn-group me-2" role="group" aria-label="First group">
                    {
                        (sessionInfo && sessionInfo.id===question.userId._id) &&
                        (<button type="button" className="btn btn-secondary float-end" 
                        onClick={()=>setEditQuestion(true)}>Edit</button>)
                    }
                    </div>
                    <div className="btn-group me-2" role="group" aria-label="Second group">
                    {
                        (sessionInfo && sessionInfo.id===question.userId._id) &&
                        (<button type="button" className="btn btn-danger float-end"
                        onClick={()=>deleteQuestion(question._id)}>Delete</button>)
                    }
                    </div>
                </div>
                }
            </h5>
            <p className="card-text">{question.statement}</p>
            <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                {(question.isActive===true) &&
                <div className="btn-group me-2" role="group" aria-label="First group">
                    {
                        (sessionInfo!==null && sessionInfo.role==='user' && addAnswer===false) &&
                        <button type="button" className="btn btn-primary" onClick={()=>setAddAnswer(true)}>
                            Add an answer</button>
                    }
                </div>
                }
                <div className="btn-group me-2" role="group" aria-label="Second group">
                {
                    (showAnswers===false && question.approved===true) &&
                    (
                        <div className="btn-group me-2" role="group" aria-label="Second group">
                            <button type="button" className="btn btn-primary" onClick={()=>{setShowAnswers(true)}}>
                                Show answers</button>
                        </div>
                    )
                }
                {
                    (showAnswers===true && question.approved===true) &&
                    (
                        <div className="btn-group me-2" role="group" aria-label="Second group">
                            <button type="button" className="btn btn-primary" onClick={()=>{setShowAnswers(false)}}>
                            Hide answers</button>
                        </div>
                    )
                }
                </div>
            </div>
            </>
            }
            {
                (editQuestion===true) &&
                (
                    <Suspense fallback={<Spinner/>}>
                        <EditItem initialValue = {question.statement} rerender={()=>setEditQuestion(false)} 
                        updateUrl={`${backendUrl}/questions/statement/${question._id}`}/>
                    </Suspense>
                )
            }
            {
                (addAnswer===true) &&
                <Suspense fallback={<Spinner/>}>
                    <AddAnswerComment submitUrl={`${backendUrl}/answers/${question._id}`}
                    hideForm={()=>setAddAnswer(false)} setShowPopup={() => setShowPopup(true)}/>
                </Suspense>
            }
            {
                (showAnswers===true) &&
                (<Suspense fallback={<Spinner/>}><Answers questionId={question._id} rerender={addAnswer}/></Suspense>)
            }
            {
                (showPopup===true) &&
                (createPortal(<Suspense fallback={<Spinner/>}>
                    <Popup message={"Answer added successfully! Waiting for approval..."}
                onClose={() => setShowPopup(false)}/></Suspense>, document.body))
            }
        </div>
      </div>
    }
    </>
  )
};

export default QuestionDetails;
