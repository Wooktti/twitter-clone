import { authService } from 'fbase';
import React, { useState } from 'react';

function AuthForm() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);
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
    <>
    <form onSubmit={onSubmit} className="container">
        <input 
          name="email"
          type="email" 
          placeholder="Email" 
          required 
          value={email}
          onChange={onChange}
          className="authInput"
        />
        <input 
          name="password"
          type="password" 
          placeholder="Password" 
          required 
          value={password}
          onChange={onChange}
          className="authInput"
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
                className="authInput"
              />
            </>
          )
        }
        <input 
          type="submit" 
          value={newAccount ? "Create Account" : "Sign In"}
          className="authInput authSubmit"
        />
        {error && <span className="authError">{error}</span>}
      </form>
      <span onClick={toggleAccount} className="authSwitch">
        {newAccount ? "Sign In" : "Create Account"}
      </span>
    </>
  )
}

export default AuthForm;
