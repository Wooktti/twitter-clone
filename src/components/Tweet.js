import { dbService, storageService } from 'fbase';
import React, { useEffect, useState } from 'react'
import "components/Tweet.css";
import { Button, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import CommentIcon from '@material-ui/icons/Comment';
import FavoriteIcon from '@material-ui/icons/Favorite';
import CancelIcon from '@material-ui/icons/Cancel';
import UpdateIcon from '@material-ui/icons/Update';
import Comment from './Comment';
import CommentFactory from './CommentFactory';

function Tweet({ tweetObj, isOwner, userObj }) {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const [liked, setLiked] = useState(tweetObj.likes.includes(userObj.uid));
  const [seeingComment, setSeeingComment] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setLiked(tweetObj.likes.includes(userObj.uid));
  }, [tweetObj, userObj]);

  useEffect(() => {
    const unsub = dbService
      .collection("tweets")
      .doc(tweetObj.id)
      .collection("comments")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
      setComments(snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })));
    });

    return () => unsub();
  }, [tweetObj.id]);

  const onCommentClick = () => {
    setSeeingComment(!seeingComment);
  }

  const onLikeClick =  () => {
    //console.log("current liked: ", liked);
    if (!liked) {
      dbService.doc(`tweets/${tweetObj.id}`).update({
        likes: [...tweetObj.likes, userObj.uid]
      });
      setLiked(!liked);
    } else {
      let updatedLikesArray = tweetObj.likes;
      const idx = updatedLikesArray.indexOf(tweetObj.uid);
      updatedLikesArray.splice(idx, 1);
      dbService.doc(`tweets/${tweetObj.id}`).update({
        likes: updatedLikesArray
      });
      setLiked(!liked);
    }
  }

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

  const onSubmit = async () => {
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
            <div className="tweet__edit">
              <textarea
                placeholder="Edit your tweet" 
                value={newTweet} 
                required
                onChange={onChange}
                maxLength={120}
                className="tweet__editTextInput"
              />
              <div className="tweet__editActions">
                <Button startIcon={<CancelIcon />} onClick={toggleEditing} className="tweet__editCancel">Cancel</Button>
                <Button startIcon={<UpdateIcon />} onClick={onSubmit} className="tweet__editUpdate">Update</Button>
              </div>
            </div>}
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
          <div className="tweet__footer">

            <Button onClick={onLikeClick} startIcon={liked ? <FavoriteIcon style={{color: "#04AAFF"}} /> : <FavoriteBorderIcon style={{color: "#04AAFF"}} />}>
              {tweetObj.likes.length} {tweetObj.likes.length === 1 ? 'Like' : 'Likes'}
            </Button>

            <Button onClick={onCommentClick} startIcon={<CommentIcon style={{color: "#04AAFF"}}/>}>
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </Button>

          </div>

          {seeingComment && (
            <div className="tweet__comments">
              {comments.map(({ id, description, timestamp, writerId, writerDisplayName, writerPhotoUrl }) => (
              <Comment
                key={id}
                description={description}
                timestamp={timestamp}
                writerDisplayName={writerDisplayName}
                writerPhotoUrl={writerPhotoUrl}
                writerId={writerId}
              />
              ))}
              {comments.length === 0 ? <span className="tweet__comments__memo">Write a First Comment!</span>: ""}
              <CommentFactory tweetObj={tweetObj} userObj={userObj}/>
            </div>
          )}
          
          </>
        )
      }
    </div>
  )
}

export default Tweet;
