import React, { Component } from 'react';
import { LandingView } from "./components/LandingView";
import { UserView } from "./components/UserView";
import { Grommet } from "grommet";
import firebase from "firebase";
import "./css/App.css";

const firebaseConfig = {
  apiKey: "AIzaSyBMaFHkNKEe6IgzvVHM-aZahW0_9iD7-FM",
  authDomain: "movie-night-232923.firebaseapp.com",
  databaseURL: "https://movie-night-232923.firebaseio.com",
  projectId: "movie-night-232923",
  storageBucket: "movie-night-232923.appspot.com",
  messagingSenderId: "1066424388142"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Grommet theme object, merges with default theme
const myTheme = {
  global: {
    font: {
      family: "Catamaran"
    },
    colors: {
      background: "#111111",
      text: {
        dark: "#CCCCCC"
      }
    }
  },
  paragraph: {
    medium: {
      maxWidth: "100%"
    }
  },
  button: {
    color: "#F3F3F3"
  }
};

class App extends Component {
  // What state should we save?
  constructor(props) {
    super(props);
    this.state = {
      userToken: void(0),
    };
  }

  // Selects the landing page for being logged in or logged out
  getView() {
    if (this.state.userToken) {
      return <UserView userToken={this.state.userToken} firebaseApp={firebaseApp}/>;
    } else if (this.state.userToken === null) {
      return <LandingView firebaseApp={firebaseApp}/>
    }
  }

  componentDidMount() {
    // save listener unsubscriber so we can unsubscribe in componentWillUnmount
    this.unregisterAuthObserver = firebaseApp.auth().onAuthStateChanged((userToken) => {
      this.setState({userToken: userToken});
    });
  }

  componentWillUnmount() {
    // Stop listening to authentication changes
    this.unregisterAuthObserver();
  }

  render() {
    return (
      <Grommet theme={myTheme} full>
        {this.getView()}
      </Grommet>
    );
  }
}

export default App;
