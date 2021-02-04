import Tweet from 'components/Tweet';
import TweetFactory from 'components/TweetFactory';
import { dbService } from 'fbase';
import React, { useState, useEffect } from 'react';
import "./Home.css";

const Home = ({ userObj }) => {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const unsub = dbService.collection("tweets").orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
      const tweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetArray);
    });

    return () => unsub();
  }, []);



  return (
    <div className="home">

      <div className="home__tweetGenerator">
        <TweetFactory userObj={userObj}/>
      </div>

      <div className="home__tweets">
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid} userObj={userObj}/>
        ))}
      </div>
      
    </div>
  );
};

export default Home;