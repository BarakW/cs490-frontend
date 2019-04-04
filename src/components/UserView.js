import React, { Component } from 'react';
import { Box, Button, Heading } from "grommet";
import { NewRatingsView } from "./NewRatingsView.js";
import MovieCard from "./MovieCard.js"
import firebase from "firebase";
import { RecommendationsView } from './RecommendationsView.js';

export class UserView extends Component { 
    constructor(props) {
        super(props);
        this.db = this.props.firebaseApp.firestore(); // Firestore (documents)
        this.storageRef = this.props.firebaseApp.storage().ref(); // Blob storage (files)
        this.userToken = this.props.userToken;
        this.userRef = this.db.collection("users").doc(this.userToken.uid);
        this.state = {
            movieMap: [], // List of movies containing movie name and movie id
            userDoc: null // Data from the user document
        }
        this.getMovieMap();
    }

    // Pull the movies map asynchronously from storage
    getMovieMap() {
        const movieMapRef = this.storageRef.child('app-data/movies_map.json')
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
                    email: this.userToken.email,
                    displayName: this.userToken.displayName
                })
            }
            this.setState({userDoc: doc.data()});
        });
    }

    render() {
        return (
            <Box>
                <Heading>Hello {this.userToken.displayName}</Heading>
                <RecommendationsView userDoc={this.state.userDoc} db={this.db} storageRef={this.storageRef}/>
                {/* <NewRatingsView firebaseDB={this.db} fbStorage={this.storageRef} movieMap={this.state.movieMap} /> */}
                <Button color="accent-4" margin="xsmall" label="Log out" onClick={() => firebase.auth().signOut()}/>
            </Box>
        )
    }
}