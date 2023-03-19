import React from 'react'
import { signGoog, useAuth } from '../firebase'
import {useNavigate} from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'

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
        <div className='px-4 py-3 '>
            <p className='font-mono'>Welcome user,</p>
            <p className='font-mono'>To Continue using the NotesApp, kindly signin with your account so that all your notes and data can be secured and limited to you </p> <br />
            <div className=''>
                <div style={{fontFamily:'Montserrat'}}>Click here to signin</div>
                <div >
                    <button className='border flex px-6 py-3 shadow-sm rounded-full hover:ease-in-out duration-500 hover:bg-black hover:text-white' onClick={signGoog}>Signin  <FaArrowRight /> </button>
                </div>

            </div>
        </div>
    </>
  )
}

export default Login