import React, { Component } from "react";
import { getMovieDoc, getPoster } from "../utils/db-functions.js"
import { Box, Heading } from "grommet";
import { MovieCarousel } from "./MovieCarousel";

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
        this.storageRef = this.props.storageRef;
        this.recommendationsObj = null;
        this.state = {
            newMovies: [],
            allMovies: []
        };
        
        this.buildMoviesList = this.buildMoviesList.bind(this);
        this.addMovieMetadata = this.addMovieMetadata.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        // make sure we don't create the recommendationsObj until we have the users info
        if (this.props.userDoc && !this.recommendationsObj) {
            this.recommendationsObj = this.getRecsFromUser();
            this.getMoviesForUser(this.recommendationsObj);
        }
    }

    // create recommendations object we can use to build up movie cards
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

    // get info about each movie we want to recommend to the user
    getMoviesForUser (recsObj) {
        for (let movieId in recsObj.newRecommendations) {
            getMovieDoc(
                movieId,
                this.db,
                this.addMovieMetadata,
                {
                    movieObj: recsObj.newRecommendations[movieId],
                    isNewMovie: true
                }
            );  
        }
        for (let movieId in recsObj.allRecommendations) {
            getMovieDoc(
                movieId,
                this.db,
                this.addMovieMetadata,
                {
                    movieObj: recsObj.allRecommendations[movieId],
                    isNewMovie: false
                }
            ); 
        }
        // console.log("Finished get movies");
    }

    // add name and date to this movie. get the img src of the movie poster
    addMovieMetadata (movieDoc, args) {
        const {movieObj, isNewMovie} = args;
        // get movieDoc from database function return
        movieDoc = movieDoc.data();

        movieObj.name = movieDoc.name;
        movieObj.date = movieDoc.date;
        
        getPoster(movieDoc.posterFile, this.storageRef, this.buildMoviesList, {movieObj, isNewMovie});
    }

    // add this movie to the state
    buildMoviesList (posterURL, args) {
        const {movieObj, isNewMovie} = args;
        movieObj.posterURL = posterURL;

        // check if movie is new so we can add it to the correct list
        if (isNewMovie) {
            let newMovies = this.state.newMovies;
            newMovies.push(movieObj);
            this.setState({newMovies});
        } else {
            let allMovies = this.allMovies;
            allMovies.push(movieObj);
            this.setState({allMovies});
        }

        // console.log(newMovies)
    }

    render () {
        return (
            <Box>
                <Heading>New Movies</Heading>
                <MovieCarousel scoreType="Prediction" showScore={true} movies={this.state.newMovies}/>
                <Heading>All Movies</Heading>
            </Box>
        );
    }
}