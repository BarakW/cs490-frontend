import React, { Component } from 'react';
import { Box, Button, Heading } from "grommet";
import firebase from "firebase";

export class UserView extends Component {
    constructor(props) {
        super(props);
        this.db = this.props.firebaseApp.firestore();
        this.user = this.props.user;
        this.userRef = this.db.collection("users").doc(this.user.uid);
    }

    componentDidMount() {
        this.userRef.get().then((doc) => {
            if (!doc.exists) {
                this.userRef.set({
                    email: this.user.email,
                    displayName: this.user.displayName
                })
            }
        });
    }

    render() {
        return (
            <Box>
                <Heading>Hello {this.user.displayName}</Heading>
                <Button color="accent-4" margin="xsmall" label="Log out" onClick={() => firebase.auth().signOut()}/>
            </Box>
        )
    }
}