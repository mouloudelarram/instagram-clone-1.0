import './App.css';
import Post from './Post';
import React, { useEffect, useState } from "react";
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Model from '@material-ui/core/Modal';
import {Button, Input} from '@material-ui/core';
import ImageUpload from './ImageUpload';
function getModalStyle() {
  const top = 50 ;
  const left = 50 ;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%,-${left}%`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: `${50}%`,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSingIn] =useState(false);


  useEffect (() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) =>{
      if(authUser) {
          //log in
          console.log(authUser);
          setUser(authUser);
          if (authUser.displayName){
              // dont update username
          } else {
            return authUser.updateProfile({
              displayName: username,
            })
          }
      } else {
          //log out
          setUser(null);
      }
    })
    return () => {
      unsubscribe();
    }
  }, [user, username]);


  useEffect(() => {
    // code 
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
        // every time
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()})));
    })
  }, []);


  const signUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message))
    setOpen(false);
  }


  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))
    setOpenSingIn(false);

  }

  return (
    <div className="App">
      <Model
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img 
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input 
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}></Input>
            <Input 
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}/>
              <Input 
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}/>
              <Button type="submit" onClick={signUp}>Sing up</Button>
          </form>
        </div> 
      </Model>
      <Model
        open={openSignIn}
        onClose={() => setOpenSingIn(false)}
      > 
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img 
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input 
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}/>
              <Input 
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}/>
              <Button type="submit" onClick={signIn}>Sign in</Button>
          </form>
        </div> 
      </Model>
      <div className="app_header">
        <img 
            className="app_headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
            />
            {user ? (
              <Button onClick={() => auth.signOut()}>Logout</Button>
            
            ) : (
              <div>
                <Button onClick={() => setOpenSingIn(true)}>Sign in</Button>
                <Button onClick={() => setOpen(true)}>Sign up</Button>
              </div>
            )}
      </div>
      {/** Upload image part */}
      {user?.displayName ? (  <ImageUpload  username={user.displayName} /> ) : (
        <center><h5 className="ImageUpload_error"> To add a post you need to log in/up</h5></center>
         )
      }

      <div className="app-posts">
        <div className="app_postsleft">
        {
          posts.map(({id, post}) => (
            <Post postId={id} user={user} username={post.username} caption={post.caption} imageURL={post.imageURL} />
          ))
        } 
        </div>
      <iframe  className="app_postsright" src="https://mouloudelarram.github.io/profil-mouloud-elarram/#about" height="" width="" title="Iframe Example"></iframe>
      </div>
    </div>
  );
}

export default App;
