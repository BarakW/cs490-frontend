import React, { Component } from "react";
import { getUser, getMovieDoc, getPoster } from "../utils/db-functions.js"
import {Box, Heading, Text, TextInput} from "grommet";
import { MovieCarousel } from "./MovieCarousel";;

const shazam = {
    name: "Shazam",
    date: "4/5/19",
    posterURL: "https://resizing.flixster.com/lHdwiaC3RebWF4bzvLwLmlfMSbc=/fit-in/200x296.2962962962963/v1.bTsxMzAxODU5MTtqOzE4MDYwOzEyMDA7Mjc2NDs0MDk2",
    score: 100,
}

const movies = []
for (let i = 0; i < 20; i++) {
    movies.push(shazam);
}


export class RecommendationsView extends Component {
    constructor (props) {
        super(props);
        this.user = this.props.user;
        this.db = this.props.db;
        this.storage = this.props.storage;
        this.userDoc = this.props.userDoc;
        this.recommendationsObj = this.getRecsFromUser()
        this.state = {
            newMovies: [],
            allMovies: []
        }
        
    }

//name, date, posterURL, score
    getRecsFromUser() {
        let recs = {
            newRecommendations: {},
            allRecommendations: {}
        }
        for (let movieId in this.userDoc.newRecommendations) {
            recs.newRecommendations[movieId] = {
                id: movieId, 
                score: this.userDoc.newRecommendations[movieId]
            };
        }
        for (let movieId in this.userDoc.allRecommendations) {
            recs.allRecommendations[movieId] = {
                id: movieId, 
                score: this.userDoc.allRecommendations[movieId]
            };
        }
        return recs;
    }

    getMoviesForUser (recsObj) {
        for (let movieId in recsObj.newRecommendations) {
            getMovieDoc(
                movieId,
                this.db,
                this.updateMovieObj,
                recsObj
            )  
        }
        for (let movieId in recsObj.allRecommendations) {
            getMovieDoc(
                movieId,
                this.db,
                this.updateMovieObj,
                recsObj
            )  
        }
    }

    updateMovieObj (movieDoc, recsObj) {
        // name, date
        let movieId = movieDoc.id;
        let doc = movieDoc.data();
        if (recsObj.newRecommendations[movieId]) {
            recsObj.newRecommendations[movieId].name = doc.name;
            recsObj.newRecommendations[movieId].date = doc.date;
        } else {
            recsObj.allRecommendations[movieId].name = doc.name;
            recsObj.allRecommendations[movieId].date = doc.date;
        }
        getPoster(movieDoc, this.storage, this.buildMoviesList, {recsObj, movieId});
    }

    buildMoviesList (posterURL, args) {
        let {recsObj, movieId} = args;
        if (recsObj.newRecommendations[movieId]) {
            recsObj.newRecommendations[movieId].posterURL = posterURL;
        } else {
            recsObj.allRecommendations[movieId].posterURL = posterURL;
        }
        
        let newMovies = []
        for (let movieObj in recsObj.newRecommendations) {
            newMovies.push(movieObj);
        }
        let allMovies = []
        for (let movieObj in recsObj.allRecommendations) {
            allMovies.push(movieObj);
        }
        this.setState({newMovies, allMovies});
    }

    componentDidMount() {
        getMoviesForUser(this.recommendationsObj)
    } 

    render () {
        return (
        <Box>
            <Heading>New Movies</Heading>
            <MovieCarousel scoreType="Recommendation" showScore={true} movies={movies}/>

            <Heading>All Movies</Heading>
        </Box>
        );
    }
}