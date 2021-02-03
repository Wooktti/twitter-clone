import { dbService, storageService } from 'fbase';
import React, { useState } from 'react'
import "components/Tweet.css";
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';

function Tweet({ tweetObj, isOwner }) {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this tweet?");
    if (ok) {
      // delete
      await dbService.doc(`tweets/${tweetObj.id}`).delete();
      if(tweetObj.attachmentUrl !== ""){
        await storageService.refFromURL(tweetObj.attachmentUrl).delete();
      }
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`tweets/${tweetObj.id}`).update({
      text: newTweet
    });
    setEditing(false);
  };
  const onChange = (event) => {
    const {target:{value}} = event;
    setNewTweet(value);
  };
  return (
    <div className="tweet">
      {
        editing ? (
          <>
            {isOwner && 
            <>
            <form onSubmit={onSubmit} className="tweet__editContainer">
              <input 
                type="text" 
                placeholder="Edit your tweet" 
                value={newTweet} 
                required
                onChange={onChange}
                className="tweet__editTextInput"
              />
              <input type="submit" value="Update Tweet" className="tweet__editSubmitBtn"/>
            </form>
            <button onClick={toggleEditing} className="tweet__editCancelBtn">Cancel</button>
            </>}
          </>
        ) : (
          <>
          <div className="tweet__header" >
            <div className="tweet__metaInfos">

              <img src="https://avatars.dicebear.com/4.5/api/male/.svg" alt="" className="tweet__creatorProfileImg" />

              <div className="tweet__nameAndTime">
                <Link to={`/profile/${tweetObj.creatorId}`}>
                <h4 className="tweet__creatorDisplayName">{tweetObj.creatorDisplayName || 'Anonymous'}</h4>
                </Link>
                <div className="tweet__createdTime">
                  {new Date(tweetObj.createdAt.toDate()).toLocaleDateString()} {new Date(tweetObj.createdAt.toDate()).toLocaleTimeString()}
                </div>
              </div>

            </div>
            <div className="tweet__actions">
              {isOwner && (
              <>
                <IconButton onClick={onDeleteClick}>
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={toggleEditing}>
                  <EditIcon />
                </IconButton>
              </>
              )}
            </div>
          </div>
          <div className="tweet__content">
            {tweetObj.attachmentUrl && <img src={tweetObj.attachmentUrl} alt="" className="tweet__tweetImg"/>}
            <div className="tweet__text">
              <span>{tweetObj.text}</span>
            </div>
          </div>
          <div className="tweet__comments">
            This is test comment.
          </div>
          
          </>
        )
      }
    </div>
  )
}

export default Tweet;
