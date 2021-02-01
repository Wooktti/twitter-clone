import Tweet from 'components/Tweet';
import { dbService, storageService } from 'fbase';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const Home = ({ userObj }) => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);
  const [attachment, setAttachment] = useState();

  useEffect(() => {
    const unsub = dbService.collection("tweets").onSnapshot((snapshot) => {
      const tweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetArray);
    });

    return () => unsub();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== null) {
      const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const newTweet = {
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl
    }

    await dbService.collection("tweets").add(newTweet);
    setTweet("");
    setAttachment(null);
  };

  const onChange = (event) => {
    const { target: {value}} = event;
    setTweet(value);
  };

  //console.log(tweets);

  const onFileChange = (event) => {
    const {target:{files}} = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const { currentTarget: { result }} = finishedEvent;
      setAttachment(result);
    };

    reader.readAsDataURL(theFile);

  };

  const onClearAttachment = () => setAttachment(null);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input 
          value={tweet}
          onChange={onChange}
          type="text" 
          placeholder="What's on your mind?" 
          maxLength={120} 
        />
        <input type="file" accept="image/*" onChange={onFileChange}/>
        <input type="submit" value="Tweet" />
        {attachment && (
          <div>
            <img alt="attachment" src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>

      <div>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid}/>
        ))}
      </div>
    </div>
  );
};

export default Home;