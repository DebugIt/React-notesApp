import React from 'react'
import { signGoog, useAuth } from '../firebase'
import {useNavigate} from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate();
    const currentUser = useAuth();

    if(currentUser){
        navigate('/home')
    }
    else{
        navigate('/')
    }


  return (
    <>
        <div>
            Click here to signin <br/>
            <button onClick={signGoog}>Signin</button>
        </div>
    </>
  )
}

export default Login