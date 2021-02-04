import { authService } from 'fbase';
import React, { useState } from 'react';
import "./AuthForm.css";

function AuthForm() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(false);
  const [error, setError] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');

  const onChange = (event) => {
    const {target: {name, value}} = event;
    if(name === "email") {
      setEmail(value);
    } else if(name === "password") {
      setPassword(value);
    } else if (name === "passwordCheck") {
      setPasswordCheck(value);
    }
  }


  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if(newAccount) {
        // create account
        if (password === passwordCheck) {
          await authService.createUserWithEmailAndPassword(email, password);
        } else {
          throw Error("Please Enter Same Password.")
        }
      } else {
        // log in
        await authService.signInWithEmailAndPassword(email, password);
      }
      //console.log(data);
    } catch(error) {
      setError(error.message);
    }
  }

  const toggleAccount = () => setNewAccount((prev) => !prev);

  return (
    <div className="authForm">
      <form onSubmit={onSubmit} className="authForm__container">
        <input 
          name="email"
          type="email" 
          placeholder="Email" 
          required 
          value={email}
          onChange={onChange}
          className="authForm__input"
        />
        <input 
          name="password"
          type="password" 
          placeholder="Password" 
          required 
          value={password}
          onChange={onChange}
          className="authForm__input"
        />
        {
          newAccount && (
            <>
              <input
                name="passwordCheck"
                type="password"
                placeholder="Password Check"
                required
                value={passwordCheck}
                onChange={onChange}
                className="authForm__input"
              />
            </>
          )
        }
        <input 
          type="submit" 
          value={newAccount ? "Create Account" : "Sign In"}
          className="authForm__submitBtn"
        />
        {error && <span className="authForm__error">{error}</span>}
      </form>

      <span onClick={toggleAccount} className="authForm__switch">
        {newAccount ? "Sign In" : "Create Account"}
      </span>

    </div>
  )
}

export default AuthForm;
