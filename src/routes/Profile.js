import Tweet from 'components/Tweet';
import { authService, dbService } from 'fbase';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import "./Profile.css";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';

const Profile = ({ refreshUser, userObj }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [myTweets, setMyTweets] = useState([]);
  const [changingDisplayName, setChangingDisplayName] = useState(false);

  useEffect(() => {
    const unsub = dbService.collection("tweets").orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
      const tweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyTweets(tweetArray);
    });

    return () => unsub();
  }, []);

  const onLogoutClick = () => {
    authService.signOut();
    history.push("/");
  };

  const onChange = (event) => {
    const {target: {value}} = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    setChangingDisplayName(false);
    event.preventDefault();
    if(userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };

  const onChangeDisplayNameClick = () => setChangingDisplayName(!changingDisplayName);

  return (
    <div className="profile">
      {changingDisplayName && (
        <div className="profile__nameEdit">
          <form onSubmit={onSubmit} className="profile__form">
            <input
              onChange={onChange}
              type="text"
              autoFocus
              placeholder="Display name"
              value={newDisplayName}
              className="profile__input"
            />
            <input
              type="submit"
              value="&rarr;"
              className="profile__submitBtn"
            />
          </form>
        </div>
      )}

    <div className="profile__actions">
      <Button startIcon={changingDisplayName ? <ClearIcon /> : <EditIcon />} onClick={onChangeDisplayNameClick}>
        {changingDisplayName ? "Cancel" : "CHANGE DISPLAY NAME"}
      </Button>
      <Button startIcon={<ExitToAppIcon />} onClick={onLogoutClick}>
        LOGOUT
      </Button>
    </div>

    <div className="profile__myTweets">
      <h2>Your Tweets</h2>
      {myTweets.map((tweet) => (
        tweet.creatorId === userObj.uid ? 
          <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid} userObj={userObj}/> : null)
        )}
    </div>
  </div>
  );
};

export default Profile;