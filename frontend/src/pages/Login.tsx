import './Login.css'
import { useEffect } from 'react'

export default function Login() {
    useEffect(() => {
      document.title = "Login | PetLink";
    }, []);
  
    return (
      <>
        <div className="login-wrapper">
        <h1>Login Page</h1>
        <button className="login-button"> Sign in with 42</button>
        </div>
      </>
    )
}

