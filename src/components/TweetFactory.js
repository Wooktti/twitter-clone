import { dbService, storageService } from 'fbase';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import "./TweetFactory.css"
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

function TweetFactory({ userObj }) {
  const [tweet, setTweet] = useState("");
  const [attachment, setAttachment] = useState(null);

  const onSubmit = async (event) => {
    if (tweet === "") {
      return;
    }
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== null) {
      const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const newTweet = {
      text: tweet,
      createdAt: new Date(),
      creatorId: userObj.uid,
      attachmentUrl,
      creatorDisplayName: userObj.displayName,
      likes: [],
    }

    await dbService.collection("tweets").add(newTweet);
    setTweet("");
    setAttachment(null);
  };

  const onChange = (event) => {
    const { target: {value}} = event;
    setTweet(value);
  };


  const onFileChange = (event) => {
    const {target:{files}} = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const { currentTarget: { result }} = finishedEvent;
      setAttachment(result);
    };
    
    if (Boolean(theFile)) {
      reader.readAsDataURL(theFile);
    }

  };

  const onClearAttachment = () => setAttachment(null);

  return (
    <div className="tweetFactory">
      <form onSubmit={onSubmit} className="tweetFactory__form">
        <div className="tweetFactory__inputContainer">
          <input 
            value={tweet}
            onChange={onChange}
            type="text" 
            placeholder="What's on your mind?" 
            maxLength={120}
            className="tweetFactory__input"
          />
          <input type="submit" value="&rarr;" className="tweetFactory__submitBtn"/>
        </div>
        <label htmlFor="attach-file" className="tweetFactory__label">
          <span>Add photos</span>
          <AddIcon />
        </label>
        <input
          id="attach-file"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="tweetFactory__file"
        />
        {attachment && (
          <div className="tweetFactory__attachment">
            <img
              src={attachment}
              alt=""
            />
            <div className="tweetFactory__clear" onClick={onClearAttachment}>
              <span>Remove</span>
              <CloseIcon />
            </div>
          </div>
        )}
        </form>
      </div>
  )
}

export default TweetFactory;
