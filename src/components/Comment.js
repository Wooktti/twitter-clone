import React from 'react';
import PersonIcon from '@material-ui/icons/Person';
import "./Comment.css";
import { Link } from 'react-router-dom';

function Comment({ description, timestamp, writerId, writerDisplayName, writerPhotoUrl }) {
  return (
    <div className="comment">
      <div className="comment__profileImg">
        {writerPhotoUrl ? <img src={writerPhotoUrl} alt="" /> : <PersonIcon />}
      </div>
      <div className="comment__contents">
        <Link to={`/profile/${writerId}`}>
          <h6>{writerDisplayName}</h6>
        </Link>
        <p>{description}</p>
        <span>{new Date(timestamp.toDate()).toLocaleDateString()} {new Date(timestamp.toDate()).toLocaleTimeString()}</span>
      </div>
    </div>
  )
}

export default Comment;
