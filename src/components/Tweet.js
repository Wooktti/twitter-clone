import { dbService, storageService } from 'fbase';
import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
    <div className="nweet">
      {
        editing ? (
          <>
            {isOwner && 
            <>
            <form onSubmit={onSubmit} className="container nweetEdit">
              <input 
                type="text" 
                placeholder="Edit your tweet" 
                value={newTweet} 
                required
                onChange={onChange}
                className="formInput"
              />
              <input type="submit" value="Update Tweet" className="formBtn"/>
            </form>
            <button onClick={toggleEditing} className="formBtn cancelBtn">Cancel</button>
            </>}
          </>
        ) : (
          <>
          <h4>{tweetObj.text}</h4>
          {tweetObj.attachmentUrl && <img src={tweetObj.attachmentUrl} alt=""/>}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
          <div style={{marginTop:" 10px", fontSize: "10px"}}>by {tweetObj.creatorDisplayName || 'Anonymous'}</div>
          <div style={{marginTop:" 10px", fontSize: "10px"}}>{new Date(tweetObj.createdAt.toDate()).toLocaleDateString()} {new Date(tweetObj.createdAt.toDate()).toLocaleTimeString()}</div>
          </>
        )
      }
    </div>
  )
}

export default Tweet;
