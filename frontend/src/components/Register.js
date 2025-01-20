import React, {useState, useContext} from "react"
import { SessionInfoContext } from "../App";
import { Formik , Form , Field , ErrorMessage} from 'formik'
import * as Yup from 'yup'
import headers from './headers.json'
import './reg.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Register = () => {
    const [role, setRole] = useState('user');
    const [registerError, setRegisterError] = useState(null);
    const sessionInfo = useContext(SessionInfoContext).sessionInfo;

    const addAccount = async(accountData) => {
        const response = await fetch(`${backendUrl}/auth/register`, {
            credentials: 'include',
            method: 'POST',
            headers: {...headers, token:sessionInfo.token, email:sessionInfo.email, role:sessionInfo.role},
            body: JSON.stringify(accountData)
        });
        const result = await response.json();
        const isStatusCorrect = response.status===201;  //201-created
        if(isStatusCorrect===false) {
            setRegisterError(result.message);
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
    
    
      <div className="container3">
        {/* <div className="container4"> */}
        <Formik

        initialValues={{
            name: "",
            email: "",
            password: "",
            confirm_password: "",
            role: "user"
        }}

        validationSchema={
            Yup.object({
                name: Yup.string().required('Provide name')
                .min(1, 'Name should be more than 1 character')
                .max(50, 'Name should not be more than 50 characters'),

                email: Yup.string().email().required('Email is required'),

                password: Yup.string().required('Password is required')
                .min(4, 'Password should be more than 4 character')
                .max(15, 'Password should not be more than 15 characters'),
                
                confirm_password: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match')
            })
        }

        onSubmit={(data, {resetForm})=>{
            data.role = role;
            delete data.confirm_password;
            addAccount(data);
            resetForm();
        }}
        >
        <Form>
        <div className="mb-3">
            <label htmlFor="name" className="form-label">
                Name
            </label>
            <Field type="text" name="name" className="form-control" id="exampleInputName1"  placeholder="Name" aria-describedby="nameHelp"/>
            <ErrorMessage name = "name" component="div"/>
        </div>
        <div className="mb-3">
            <label htmlFor="email" className="form-label">
                Email address
            </label>
            <Field type="email" name="email" className="form-control" id="exampleInputEmail1"  placeholder="Email" aria-describedby="emailHelp"/>
            <ErrorMessage name = "email" component="div"/>
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label">
                Password
            </label>
            <Field type="password" name="password"  placeholder="Password" className="form-control" id="exampleInputPassword1"/>
            <ErrorMessage name = "password" component="div"/>
        </div>
        <div className="mb-3">
            <label htmlFor="confirm_password" className="form-label">
                Confirm password
            </label>
            <Field type="password" name="confirm_password" className="form-control"  placeholder="Confirm Password" id="exampleInputPassword2"/>
            <ErrorMessage name = "confirm_password" component="div"/>
        </div>

        <div className="form-check">
        <input className="form-check-input" type="radio" name="role" id="admin" checked = {role==='admin'}
         onChange={handleChange}/>
        <label className="form-check-label" htmlFor="admin">
            Register as admin
        </label>
        </div>
        <div className="form-check">
        <input className="form-check-input" type="radio" name="role" id="user" checked = {role==='user'}
         onChange={handleChange}/>
        <label className="form-check-label" htmlFor="user">
            Register as user
        </label>
        </div>
        <div>
          {(registerError) && (<p className="h6" id="register-alert">{registerError}!</p>)}
        </div>
        <div>
        <p className="h6">Already have an account! <span><a href="/login">Login here!</a></span></p>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
        </Form>
        </Formik>
        </div>
    {/* </div> */}
   
    </>
  )
};

export default Register;
