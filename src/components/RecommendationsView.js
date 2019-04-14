import React, { Component } from "react";
import { getMovieDoc, getPoster } from "../utils/db-functions.js"
import { Box, Heading } from "grommet";
import { MovieCarousel } from "./MovieCarousel";

export class RecommendationsView extends Component {
    constructor (props) {
        super(props);
        this.db = this.props.db;
        this.storageRef = this.props.storageRef;
        this.moviesToFetch = null;
        this.state = {
            newMovies: {},
            allMovies: {}
        };
        
        this.buildMoviesList = this.buildMoviesList.bind(this);
        this.addMovieMetadata = this.addMovieMetadata.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        // make sure we don't create the moviesToFetch until we have the users info
        const userDocHasChanged = JSON.stringify(this.props.userDoc) !== JSON.stringify(prevProps.userDoc) 
        if (this.props.userDoc && userDocHasChanged) {
            this.moviesToFetch = this.getRecsFromUser();
            this.getMoviesForUser(this.moviesToFetch);
        }
    }

    componentDidMount () {
        if (this.props.userDoc) {
            this.moviesToFetch = this.getRecsFromUser();
            this.getMoviesForUser(this.moviesToFetch);
        }
    }

    // fetch resources for movies that are not in current state
    getRecsFromUser() {
        const moviesToFetch = {
            newMovies: {},
            allMovies: {}
        }
        const moviesWithNewRatings = {
            newMovies: {},
            allMovies: {}
        }

        for (let movieId in this.props.userDoc.newRecommendations) {
            const movieScore = this.props.userDoc.newRecommendations[movieId];
            let movieInState = this.state.newMovies[movieId];

            if (movieInState) {
                movieInState = Object.assign({}, movieInState);
                movieInState.score = movieScore;
                moviesWithNewRatings.newMovies[movieId] = movieInState;
            } else {
                moviesToFetch.newMovies[movieId] = {
                    id: movieId, 
                    score: movieScore
                };
            }
        }

        for (let movieId in this.props.userDoc.allRecommendations) {
            const movieScore = this.props.userDoc.allRecommendations[movieId];
            let movieInState = this.state.allMovies[movieId];

            if (movieInState) {
                movieInState = Object.assign({}, movieInState);
                movieInState.score = movieScore;
                moviesWithNewRatings.allMovies[movieId] = movieInState;
            } else {
                moviesToFetch.allMovies[movieId] = {
                    id: movieId, 
                    score: movieScore
                };
            }
        }

        this.setState({
            newMovies: moviesWithNewRatings.newMovies,
            allMovies: moviesWithNewRatings.allMovies
        });
        return moviesToFetch;
    }

    // get info about each movie we want to recommend to the user
    getMoviesForUser (moviesToFetch) {
        for (let movieId in moviesToFetch.newMovies) {
            getMovieDoc(
                movieId,
                this.db,
                this.addMovieMetadata,
                {
                    movieObj: moviesToFetch.newMovies[movieId],
                    isNewMovie: true
                }
            );  
        }
        for (let movieId in moviesToFetch.allMovies) {
            getMovieDoc(
                movieId,
                this.db,
                this.addMovieMetadata,
                {
                    movieObj: moviesToFetch.allMovies[movieId],
                    isNewMovie: false
                }
            ); 
        }
    }

    // add name and date to this movie. get the img src of the movie poster
    addMovieMetadata (movieDoc, args) {
        const {movieObj, isNewMovie} = args;
        // database function doesn't return the actual movieDoc object.
        // need to call .data() to get the movieDoc
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
            const newMovies = Object.assign({}, this.state.newMovies);
            newMovies[movieObj.id] = movieObj
            this.setState({newMovies});
        } else {
            const allMovies = Object.assign({}, this.state.allMovies);
            allMovies[movieObj.id] = movieObj
            this.setState({allMovies});
        }
    }

    render () {
        return (
            <Box>
                <Heading>New Movies</Heading>
                <MovieCarousel
                    scoreType="Prediction"
                    showScore={true}
                    movies={Object.values(this.state.newMovies)}
                    handleClick={this.props.handleClick}
                />
                <Heading>All Movies</Heading>
                <MovieCarousel
                    scoreType="Prediction"
                    showScore={true}
                    movies={Object.values(this.state.allMovies)}
                    handleClick={this.props.handleClick}
                />
            </Box>
        );
    }
}