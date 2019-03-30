import React, { Component } from 'react';
import { LandingView } from "./components/LandingView";
import { UserView } from "./components/UserView";
import { Grommet } from "grommet";
import { generate } from "grommet/themes/base";
import { deepMerge } from "grommet/utils";
import { dark } from "grommet/themes";
import "./css/App.css";

const myThemeMods = {
  global: {
    font: {
      family: "Catamaran"
    },
    colors: {
      text: {
        dark: "#F3F3F3"
      }
    }
  }
};

const theme = deepMerge(generate(24), myThemeMods);

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
      <Grommet theme={theme} full>
      {this.getView()}
      </Grommet>
    );
  }
}

export default App;
