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

const myTheme = {
  global: {
    font: {
      family: "Catamaran"
    },
    colors: {
      background: "#333333",
      text: {
        dark: "#F3F3F3"
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
      user: void(0),
    };
  }

  getView() {
    if (this.state.user) {
      return <UserView user={this.state.user} firebaseApp={firebaseApp}/>;
    } else if (this.state.user === null) {
      return <LandingView firebaseApp={firebaseApp}/>
    }
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebaseApp.auth().onAuthStateChanged((user) => {
      this.setState({user: user});
    });
  }

  componentWillUnmount() {
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
