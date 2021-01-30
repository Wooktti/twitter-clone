import Tweet from 'components/Tweet';
import { dbService } from 'fbase';
import React, { useState, useEffect } from 'react';

const Home = ({ userObj }) => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);

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
    await dbService.collection("tweets").add({
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setTweet("");
  };

  const onChange = (event) => {
    const { target: {value}} = event;
    setTweet(value);
  };

  //console.log(tweets);

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
        <input type="submit" value="Tweet" />
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