import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css'

function App() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function registerUser(event) {
        event.preventDefault();

        try {
            const response = await fetch('https://task-manager-new-aol9.onrender.com/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === 'ok') {
                navigate('/login');
            } else {
                alert(data.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Failed to register:', error);
            alert('Failed to register. Please check your server and network connection.');
        }
    }

    return (
        <div id='form_main'>
            <div id='form_content_main'>
            <h1 id='heading'>Register</h1>
            <form onSubmit={registerUser} id='content_form'>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Enter your name"
                    id='name_input'
                />
                <br />
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Enter your email"
                    id='email_input'
                />
                <br />
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Enter your password"
                    id='password_input'
                />
                <br />
                <input type="submit" value="Register" id='register_btn_form'/>
            </form>
            </div>
            
        </div>
    );
}

export default App;
