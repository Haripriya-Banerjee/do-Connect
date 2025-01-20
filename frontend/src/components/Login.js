import React,{useState,useContext} from "react"
import { Formik , Form , Field , ErrorMessage} from 'formik';
import * as Yup from 'yup'; //validation
import { SessionInfoContext } from "../App";
import { useNavigate } from "react-router-dom";
import headers from './headers.json';
import './log.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Login = ({socket}) => {
  const [role, setRole] = useState('user');
  const [loginError, setLoginError] = useState(null);
  const setSessionInfo = useContext(SessionInfoContext).setSessionInfo; //consume
  const navigate = useNavigate();  //hook

  const login = async(data) =>{
    const response = await fetch(`${backendUrl}/auth/login`, {
      credentials: 'include',
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });
    const result = await response.json();
    const isStatusCorrect = response.ok;  //200-ok 
    if(isStatusCorrect===false) {
      setLoginError(result.message);
    }
    else {
      const userDataResponse = await fetch(`${backendUrl}/users/email/${data.email}`, {
        credentials: 'include',
        method: 'GET',
        headers: {...headers, token:result.token, email:data.email, role:data.role}
      });
      const user = await userDataResponse.json();
      //console.log(user)
      var newSessionInfo = {
        role: role,
        id: user._id,
        userName: user.name,
        token:result.token,
        email:data.email
      };
      setSessionInfo(newSessionInfo);
      navigate(`/`);
    }
  }

  const handleChange = () => {
    if(role==='admin') {
      setRole('user')
    }
    else {
      setRole('admin')
    }
  }

  return (
    <>
      <div className="container2">
    <Formik
    initialValues={{
      email: "",
      password: "",
      role: "user"
    }}

    validationSchema={
      Yup.object({
        email: Yup.string().email().required('Email is required'),
        password: Yup.string().required('Password is required')
        .min(4, 'Password should be more than 4 character')
        .max(15, 'Password should not be more than 15 characters')
      })
    }
    
    onSubmit={(data) => {
      data.role=role;
      login(data);
    }}
    >
      {/* <div className="lg"> */}
      <Form>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address :
          </label>
          <Field type="email" name="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
            <ErrorMessage name = "email" component="div"/>
        </div>

        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password :
          </label>
          <Field type="password" name="password" className="form-control" id="exampleInputPassword1"/>
          <ErrorMessage name = "password" component="div"/>
        </div>
        <div className="mb-3">

        </div>
        <div className="form-check">
        <input className="form-check-input" type="radio" name="role" id="admin" checked = {role==='admin'} 
        onChange={handleChange}/>
        <label className="form-check-label" htmlFor="admin">
            Login as admin
        </label>
        </div>
        <div className="form-check">
        <input className="form-check-input" type="radio" name="role" id="user" checked = {role==='user'} 
        onChange={handleChange}/>
        <label className="form-check-label" htmlFor="user">
            Login as user
        </label>
        </div>
        <div>
          {(loginError) && (<p className="h6" id="login-alert">{loginError}!</p>)}
        </div>
        <div>
        <p className="h6">Don't have an account! <span><a href="/register">Register here!</a></span></p>
        </div>
          <button type="submit" className="btn btn-primary">Submit</button>
      </Form>
      {/* </div> */}
    </Formik>
    </div>
    </>
  )
};

export default Login;
