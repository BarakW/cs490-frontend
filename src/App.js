import React, { Component } from 'react';
import { LandingView } from "./components/LandingView";
import { UserView } from "./components/UserView";
import { Grommet } from "grommet";
import "./css/App.css";

class App extends Component {
  // What state should we save?
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  changeUser(newUser) {
    this.setState({user: newUser});
  }

  getView() {
    if (this.state.user) {
      return <UserView/>;
    } else {
      return <LandingView loginHandler={this.changeUser}/>
    }
  }
  
  render() {
    return (
      <Grommet className="App">
      {this.getView()}
      </Grommet>
    );
  }
}

export default App;
