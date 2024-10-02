import React from 'react'
import './welcome.css'
import {useNavigate} from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
  return (
    <div id='main'>
      <div id='content'>
      <h1 id='heading'>Welcome to Task Manager</h1>
      <div id='btn_container'>
      <button id='login-btn' onClick={()=>navigate('/login')}>Login</button>
      <button id='register-btn' onClick={()=>navigate('/register')}>Register</button>
      </div>
      </div>
      
    </div>
  )
}

export default Welcome
