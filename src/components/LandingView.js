import React, { Component } from 'react';
import { Box, Heading } from "grommet";

export class LandingView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLogin: false,
            showSignup: false,
            completedSignup: false
        };
    }

    render() {
        return (
            <Box height="100%" background="url(./img/hero.jpg)">
                Yoy
                <Heading alignSelf="center">Movienite</Heading>
            </Box>
        )
    }
}