import React, { Component } from 'react';
import { Box, Button } from "grommet";
import firebase from "firebase";

export class UserView extends Component {
    render() {
        return (
            <Box>
                <Button margin="xsmall" label="Log out" onClick={() => firebase.auth().signOut()}/>
            </Box>
        )
    }
}