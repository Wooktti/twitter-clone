import { dbService } from 'fbase';
import React, { useState } from 'react';
import "./CommentFactory.css";

function CommentFactory({ tweetObj, userObj }) {
  const [description, setDescription] = useState("");

  const onChange = (event) => {
    const {target:{value}} = event;
    setDescription(value);
  };

  const onSubmit = async (event) => {
    if (description === "") {
      return;
    }
    event.preventDefault();

    const newCommentObj = {
      description: description,
      timestamp: new Date(),
      writerId: userObj.uid,
      writerDisplayName: userObj.displayName,
      writerPhotoUrl: userObj.photoUrl
    }
    await dbService.doc(`tweets/${tweetObj.id}`).collection("comments").add(newCommentObj);

    setDescription("");
  };

  return (
    <div className="commentFactory">
      <form onSubmit={onSubmit} className="commentFactory__form">
        <input 
          value={description}
          onChange={onChange}
          type="text" 
          placeholder="Write a comment!" 
          maxLength={120}
          className="commentFactory__input"
        />
        <input type="submit" value="&rarr;" className="commentFactory__submitBtn"/>
      </form>
    </div>
  )
}

export default CommentFactory;
