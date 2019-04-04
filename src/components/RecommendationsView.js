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
        this.recommendationsObj = null;
        this.state = {
            newMovies: [],
            allMovies: []
        };
        
        this.buildMoviesList = this.buildMoviesList.bind(this);
        this.getStorage = this.getStorage.bind(this);
    }

    getStorage() {
        return this.storage;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.userDoc && !this.recommendationsObj) {
            this.recommendationsObj = this.getRecsFromUser();
        }
    }

//name, date, posterURL, score
    getRecsFromUser() {
        let recs = {
            newRecommendations: {},
            allRecommendations: {}
        }
        for (let movieId in this.props.userDoc.newRecommendations) {
            recs.newRecommendations[movieId] = {
                id: movieId, 
                score: this.props.userDoc.newRecommendations[movieId]
            };
        }
        for (let movieId in this.props.userDoc.allRecommendations) {
            recs.allRecommendations[movieId] = {
                id: movieId, 
                score: this.props.userDoc.allRecommendations[movieId]
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
        console.log("Finished get movies");
        
    }

    updateMovieObj (movieDoc, recsObj) {
        // name, date
        console.log("UMO recObj: ", recsObj);
        
        let movieId = movieDoc.id;
        let doc = movieDoc.data();
        if (recsObj.newRecommendations[movieId]) {
            recsObj.newRecommendations[movieId].name = doc.name;
            recsObj.newRecommendations[movieId].date = doc.date;
        } else {
            recsObj.allRecommendations[movieId].name = doc.name;
            recsObj.allRecommendations[movieId].date = doc.date;
        }
        console.log("Crashed after getPoster?");
        getPoster(movieDoc.posterFile, this.getStorage(), this.buildMoviesList, {recsObj, movieId});
        console.log("UMO recObj after: ", recsObj);
        console.log("Finished updateMovieObj");
    }

    buildMoviesList (posterURL, args) {
        const {recsObj, movieId} = args;
        
        if (recsObj.newRecommendations[movieId]) {
            recsObj.newRecommendations[movieId].posterURL = posterURL;
        } else {
            recsObj.allRecommendations[movieId].posterURL = posterURL;
        }
        
        const newMovies = []
        for (let movieObj in recsObj.newRecommendations) {
            newMovies.push(movieObj);
        }
        const allMovies = []
        for (let movieObj in recsObj.allRecommendations) {
            allMovies.push(movieObj);
        }
        this.setState({newMovies, allMovies});
    }

    render () {
        if (this.props.userDoc && this.recommendationsObj) {
            this.getMoviesForUser(this.recommendationsObj);
        }

        return (
        <Box>
            <Heading>New Movies</Heading>
            <MovieCarousel scoreType="Recommendation" showScore={true} movies={this.state.newMovies}/>
            <Heading>All Movies</Heading>
        </Box>
        );
    }
}