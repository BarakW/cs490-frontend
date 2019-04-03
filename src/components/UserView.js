import React, { Component } from 'react';
import { Box, Button, Heading } from "grommet";
import { NewRatingsView } from "./NewRatingsView.js";
import firebase from "firebase";

export class UserView extends Component {
    constructor(props) {
        super(props);
        this.db = this.props.firebaseApp.firestore(); // Firestore (documents)
        this.storage = this.props.firebaseApp.storage(); // Blob storage (files)
        this.user = this.props.user; // User token (not user document, change this?)
        this.userRef = this.db.collection("users").doc(this.user.uid);
        this.state = {
            movieMap: [], // List of movies containing movie name and movie id
        }
        this.getMovieMap();
    }

    // Pull the movies map asynchronously from storage
    getMovieMap() {
        const movieMapRef = this.storage.ref().child('app-data/movies_map.json')
        movieMapRef.getDownloadURL().then((url) => {
            fetch(url).then((response) => {
                return response.json();
            }).then((data) => {
                this.setState({movieMap: data});
            });
        }).catch((e) => {
            console.error(e);
        });
    }

    componentDidMount() {
        // Create user document if it doesn't exist
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
                <NewRatingsView firebaseDB={this.db} fbStorage={this.storage} movieMap={this.state.movieMap} />
            </Box>
        )
    }
}