import React, { useState, useEffect } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase';
import "components/App.css"

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    const unsub = authService.onAuthStateChanged((user) => {
      if(user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          photoUrl: user.photoURL,
          updateProfile: (args) => user.updateProfile(args)
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
    return () => unsub();
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      photoUrl: user.photoURL,
      updateProfile: (args) => user.updateProfile(args)
    });
  };

  return (
    <>
      {init ? (
        <AppRouter 
          refreshUser={refreshUser} 
          isLoggedIn={Boolean(userObj)} 
          userObj={userObj}
        />
      ) : (
        "Loading...."
      )}
      <footer className="footer">&copy; {new Date().getFullYear()} Twitter Clone Practice</footer>
    </>
  );
}

export default App;
