import Tweet from 'components/Tweet';
import TweetFactory from 'components/TweetFactory';
import { dbService } from 'fbase';
import React, { useState, useEffect } from 'react';

const Home = ({ userObj }) => {
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



  return (
    <div className="container">
      <TweetFactory userObj={userObj}/>
      <div style={{ marginTop: 30 }}>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid}/>
        ))}
      </div>
    </div>
  );
};

export default Home;