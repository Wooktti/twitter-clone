import AuthForm from 'components/AuthForm';
import { authService, firebaseInstance } from 'fbase';
import React from 'react';
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./Auth.css";

const Auth = () => {

  const onSocialClick = async (event) => {
    const {target:{name}} = event;
    let provider;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "github") {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }

    try{
      await authService.signInWithPopup(provider);
    } 
    catch(err) {
      alert(err.message);
    }

  };

  return (
    <div className="auth">
      <FontAwesomeIcon
        icon={faTwitter}
        color={"#04AAFF"}
        size="3x"
        style={{ marginBottom: 30 }}
      />
      <AuthForm />
      <span className="auth__memo">or you can continue with</span>
      <div className="auth__socialSignIn">
        <button onClick={onSocialClick} name="google" className="auth__btn">
          Google <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button onClick={onSocialClick} name="github" className="auth__btn">
          Github <FontAwesomeIcon icon={faGithub} />
        </button>
      </div>
    </div>
  );
}

export default Auth;