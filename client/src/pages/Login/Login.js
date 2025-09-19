import { useState } from 'react';
import './Login.css';

function App() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	async function loginUser(event) {
		event.preventDefault()

		const response = await fetch('https://task-manager-new-aol9.onrender.com/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				password,
			}),
		})

		const data = await response.json()

		if (data.user) {
			localStorage.setItem('token', data.user)
			alert('Login successful')
			window.location.href = '/dashboard'
		} else {
			alert('Please check your username and password')
		}
	}

	return (
		<div id='form_main'>
			<div id='form_content_main'>
			<h1 id='heading'>Login</h1>
			<form onSubmit={loginUser} id='content_form'>
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
				<input type="submit" value="Login" id='login_btn_form'/>
			</form>
			</div>
			
		</div>
	)
}

export default App