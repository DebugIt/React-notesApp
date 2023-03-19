import React, {useState} from 'react'
import { useAuth } from '../firebase'
import {UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap' 
import { logout } from '../firebase'


const Nav = () => {
    const currentUser = useAuth()

    


  return (
    <div className='md:flex px-3 py-5 bg-white shadow'>
        <div className='flex-1 font-mono font-medium text-xl ' style={{fontFamily:'Major Mono Display'}}>Debug's Notes App</div>
        {
           currentUser && <div className='sm:flex text-xs pt-2' style={{fontFamily:'Montserrat'}}>
                <p>Signed in as: <span>{currentUser?.email}</span></p>
                <button className='border py-1 px-3 rounded-md mt-1 hover:ease-in-out duration-500 hover:bg-black hover:text-white' onClick={logout}>Logout</button>
           </div>
           
        }
    </div>
  )
}

export default Nav