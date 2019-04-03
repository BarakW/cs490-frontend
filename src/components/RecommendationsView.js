import React, { Component } from "react";
import {Box, Text, TextInput} from "grommet";
import { getUser, getMovieDoc, getPoster } from "../utils/db-functions.js"

export class RecommendationsView extends Component {
    constructor (props) {
        super(props);
        this.user = this.props.user;
        this.db = this.props.db;
        this.storage = this.props.storage;
        this.state = {
            newMovies: [],
            allMovies: []
        }
        
    }

//name, date, posterURL, score

    getMoviesForUser (userDoc) {
        // predicted score
        for (let movie of userDoc.newRecommendations) {
            getMovieDoc(movie, this.db, this.getPosterForMovie, {score: user.score})
        }
        for (let movie of userDoc.allRecommendations) {
            getMovieDoc(movie, this.db, this.getPosterForMovie)
        }
    }

    getPosterForMovie (movieDoc) {
        // name, date
        getPoster(movieDoc, this.storage, )
    }

    componentDidMount() {
        let newMovies = [];
        let allMovies = [];

        getUser(this.user.uid, this.db, this.getMoviesForUser);
    } 

    render () {
        <Box>
            <Heading>New Movies</Heading>
            

            <Heading>All Movies</Heading>
        </Box>
    }
}