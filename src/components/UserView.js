import React, { Component } from 'react';
import { Box, Button, Heading, Layer } from "grommet";
import { NewRatingsView } from "./NewRatingsView.js";
import MovieCard from "./MovieCard.js"
import firebase from "firebase";
import { RecommendationsView } from './RecommendationsView.js';
import { EditRating } from './EditRating.js'
import { addUserListener } from "../utils/db-functions.js"

export class UserView extends Component { 
    constructor(props) {
        super(props);
        this.db = this.props.firebaseApp.firestore(); // Firestore (documents)
        this.storageRef = this.props.firebaseApp.storage().ref(); // Blob storage (files)
        this.userToken = this.props.userToken;
        this.userRef = this.db.collection("users").doc(this.userToken.uid);
        this.editRatingModal = null;
        this.state = {
            movieMap: [], // List of movies containing movie name and movie id
            userDoc: null, // Data from the user document
            showEditRating: false
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

    showEditRatingOnClick = (name, date, score, movieId, scoreType) => {
        this.editRatingModal = <EditRating
                                    name={name}
                                    date={date}
                                    score={score}
                                    scoreType={scoreType}
                                    userId={this.userToken.uid}
                                    movieId={movieId}
                                    db={this.db}
                                />;
        this.setState({
            showEditRating: true
        });
    }

    updateUserDoc = (doc, args) => {
        // const { id, email, displayName } = args;
        console.log('document was updated!')
        if (!doc.exists) {
            this.userRef.set({
                email: this.userToken.email,
                displayName: this.userToken.displayName
            }, {merge: true}).catch(console.error);
        } else {
            console.log(doc.data())
            this.setState({userDoc: doc.data()});
        }
    }

    componentDidMount() {

        this.unregisterUserListener = addUserListener(this.userToken.uid, this.db, this.updateUserDoc, {})
        // Create user document if it doesn't exist
        // this.userRef.get().then((doc) => {
        //     if (!doc.exists) {
        //         this.userRef.set({
        //             email: this.userToken.email,
        //             displayName: this.userToken.displayName
        //         })
        //     }
        //     this.setState({userDoc: doc.data()});
        // });
    }

    componentWillUnmount () {
        // stop listening to changes on the userDoc
        this.unregisterUserListener();
    }

    render() {
        return (
            <Box>
                {this.state.showEditRating &&
                <Layer 
                    onEsc={() => this.setState({ showEditRating: false })}
                    onClickOutside={() => this.setState({ showEditRating: false })}
                    responsive={false}
                >
                    {this.editRatingModal}
                </Layer>
                }
                <Heading>Hi, {this.userToken.displayName}</Heading>
                <RecommendationsView
                    userDoc={this.state.userDoc}
                    db={this.db}
                    storageRef={this.storageRef}
                    handleClick={this.showEditRatingOnClick}
                />
                {/* <NewRatingsView firebaseDB={this.db} fbStorage={this.storageRef} movieMap={this.state.movieMap} /> */}
                <Button color="accent-4" margin="xsmall" label="Log out" onClick={() => firebase.auth().signOut()}/>
            </Box>
        )
    }
}