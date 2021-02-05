import React from 'react';
import PersonIcon from '@material-ui/icons/Person';
import "./Comment.css";
import { Link } from 'react-router-dom';
import { Delete } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import { dbService } from 'fbase';

function Comment({ id, description, timestamp, writerId, writerDisplayName, writerPhotoUrl, userObj, tweetObj }) {

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this comment?");
    if (ok) {
      // delete
      await dbService.doc(`tweets/${tweetObj.id}`).collection("comments").doc(id).delete();
    }
  };


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

      {userObj.uid === writerId && (
        <div className="comment__actions">
          <IconButton onClick={onDeleteClick}>
            <Delete />
          </IconButton>
        </div>
      )}
    </div>
  )
}

export default Comment;
