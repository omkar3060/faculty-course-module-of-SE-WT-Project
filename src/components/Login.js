import React from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { Navigate } from 'react-router-dom';
import './Login.css'; // Import the Login.css file

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      redirectToWelcome: false // Add a state to track redirection
    };
  }

  componentDidMount() {
    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyAq0HSgQOTCtQGiX9Smi0BzxB5xdx6KFxo",
        authDomain: "faculty-course-details.firebaseapp.com",
        projectId: "faculty-course-details",
        storageBucket: "faculty-course-details.appspot.com",
        messagingSenderId: "238778337247",
        appId: "1:238778337247:web:82674e85673f04eab5666a",
        measurementId: "G-1W2DR081B0"
      });
    } else {
      firebase.app(); // if already initialized, use that one
    }

    // Check if user is already signed in
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.setState({ user });
      } else {
        // No user is signed in.
        this.setState({ user: null });
      }
    });
  }

  signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = result.credential;
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        this.setState({ user, redirectToWelcome: true }); // Set state to redirect to WelcomePage
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential;
        console.error(errorCode, errorMessage);
      });
  }

  signOut = () => {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      this.setState({ user: null });
    }).catch((error) => {
      // An error happened.
      console.error(error);
    });
  }

  render() {
    const { user, redirectToWelcome } = this.state;

    // Redirect to WelcomePage if redirectToWelcome is true
    if (redirectToWelcome) {
      return <Navigate to='/welcome' />;
    }

    return (
      <div className="loginContainer"> {/* Add the 'loginContainer' class here */}
        {user ? (
          <div>
            <p>Thank you for using our Services</p>
            <button className="buttonBase" onClick={this.signOut}>Sign out</button> {/* Add the 'buttonBase' class here */}
          </div>
        ) : (
          <div>
            <h1>Welcome to Faculty-Course details Module</h1>
            <h2>Services offered:</h2>
            <p>Please sign in:</p>
            <button className="buttonBase" onClick={this.signInWithGoogle}>Sign in with Google</button> {/* Add the 'buttonBase' class here */}
          </div>
        )}
      </div>
    );
  }
}

export default Login;
