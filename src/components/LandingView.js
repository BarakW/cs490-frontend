import React, { Component } from 'react';
import { Box, Heading, Paragraph, Button, Layer } from "grommet";
import firebase from "firebase";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

export class LandingView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLogin: false,
            showSignup: false,
            completedSignup: false
        };

        this.uiConfig = {
            signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID 
            ],
            callbacks: {
                // Avoid redirects after sign-in.
                signInSuccessWithAuthResult: () => false
            },
            "credentialHelper": "none"
        };
    }

    render() {
        return (
            <Box height="100%" background="url(./img/hero.jpg)">
                {this.state.showLogin &&
                <Layer onClickOutside={() => this.setState({ showLogin: false })}>
                    <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
                </Layer>}
                {this.state.showSignup &&
                <Layer onClickOutside={() => this.setState({ showSignup: false })}>
                    Sign up
                </Layer>}
                <Box alignSelf="center" width="60%">
                    <Heading size="large" alignSelf="center">Movienite</Heading>
                    <Paragraph>
                        Lorem ipsum dolor asodidbaopisdvb paoiusdnbvpaoisdbi apoisdbapso.
                        apsodfbfapsoidbf paosiudbffapsoiudfb aposuidbfapousbdf apsodufbaspodu.
                        oiasndnfoiasndf aosidfn oinasoidfn oin asodifn oiansdf aoisdfn oiansdf.
                    </Paragraph>
                    <Box alignSelf="center" width="80%" direction="row-responsive" justify="center">
                        <Button primary alignSelf="center" margin="xsmall" label="Log in" onClick={() => this.setState({ showLogin: true })} />
                        <Button alignSelf="center" margin="xsmall" label="Sign up" onClick={() => this.setState({ showSignup: true })} />
                    </Box>
                </Box>
            </Box>
        )
    }
}