import React from 'react';
import { Link } from 'react-router-dom';
import TwitterIcon from '@material-ui/icons/Twitter';
import PersonIcon from '@material-ui/icons/Person';
import "./Navigation.css";

const Navigation = ({ userObj }) => {
  return (
    <nav className="nav">
      <ul>
        <li>
          <Link to="/">
            <TwitterIcon />
            <span>
              Home
            </span>
          </Link>
        </li>
        <li>
          <Link to="/profile">
            {userObj.photoUrl ? (
              <img src={userObj.photoUrl} alt="" />
            ) : (
              <PersonIcon />
            )}
            <span>
              {userObj.displayName ? `${userObj.displayName}'s Profile` : `My Profile`}
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;