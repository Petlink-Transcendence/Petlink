import './Login.css'
import { useEffect } from 'react'

export default function Login() {
    useEffect(() => {
      document.title = "Login | PetLink";
    }, []);
  
    return (
      <>
        <div className="login-page-container">

          {/*Welcome message*/}
          <h1 className="welcome-message">Welcome to <span className="welcome-message-petlink">PetLink</span>
          </h1>

          {/*Centered Login box */}
          <div className="login-box">

            <h2 className="login-title">Login</h2>

            <h2 className="sign-in-message">Sign in to continue</h2>

            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="youremail@email.com" />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input type="password" placeholder="***************" />
            </div>


            <h2 className="sign-up-message"> Don't have a <span className="sign-up-message-petlink">PetLink</span> account yet? </h2>
            <button className="login-button"> Sign up here </button>
          </div>
        </div>
      </>
    )
}

