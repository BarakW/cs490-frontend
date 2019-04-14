import React, { Component } from 'react';
import { Box, Heading } from "grommet";
import { SearchBox } from "./SearchBox.js";
import { getMovieDoc, getPoster } from "../utils/db-functions.js"
import { MovieCarousel } from "./MovieCarousel";

export class NewRatingsView extends Component {
    constructor (props) {
        super(props);
        this.db = this.props.db;
        this.storageRef = this.props.storageRef;
        this.moviesToFetch = null;
        this.state = {
            ratedMovies: {},
        };
        
        this.buildMoviesList = this.buildMoviesList.bind(this);
        this.addMovieMetadata = this.addMovieMetadata.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        // make sure we don't create the moviesToFetch until we have the users info
        const userDocHasChanged = this.props.userDoc && 
            JSON.stringify(this.props.userDoc.ratings) !== JSON.stringify(prevProps.userDoc.ratings)
        if (userDocHasChanged) {
            this.moviesToFetch = this.getRatingsFromUser();
            this.getMoviesForUser(this.moviesToFetch);
        }
    }

    componentDidMount () {
        // when doc is first mounted, fetch movies
        if (this.props.userDoc) {
            this.moviesToFetch = this.getRatingsFromUser();
            this.getMoviesForUser(this.moviesToFetch);
        }
    }

    // fetch resources for movies that are not in state
    getRatingsFromUser() {
        const moviesToFetch = {};
        const moviesWithNewRatings = {};

        for (let movieId in this.props.userDoc.ratings) {
            const movieScore = this.props.userDoc.ratings[movieId];
            let movieInState = this.state.ratedMovies[movieId];

            if (movieInState) {
                movieInState = Object.assign({}, movieInState);
                movieInState.score = movieScore;
                moviesWithNewRatings[movieId] = movieInState;
            } else {
                moviesToFetch[movieId] = {
                    id: movieId, 
                    score: movieScore
                };
            }
        }

        this.setState({ratedMovies: moviesWithNewRatings});
        return moviesToFetch;
    }

    // get info about each movie we want to recommend to the user
    getMoviesForUser (moviesToFetch) {
        for (let movieId in moviesToFetch) {
            getMovieDoc(
                movieId,
                this.db,
                this.addMovieMetadata,
                {
                    movieObj: moviesToFetch[movieId],
                }
            );  
        }
    }

    // add name and date to this movie. get the img src of the movie poster
    addMovieMetadata (movieDoc, args) {
        const { movieObj } = args;
        // database function doesn't return the actual movieDoc object.
        // need to call .data() to get the movieDoc
        movieDoc = movieDoc.data();

        movieObj.name = movieDoc.name;
        movieObj.date = movieDoc.date;
        
        getPoster(movieDoc.posterFile, this.storageRef, this.buildMoviesList, { movieObj });
    }

    // add this movie to the state
    buildMoviesList (posterURL, args) {
        const { movieObj } = args;
        movieObj.posterURL = posterURL;

        const ratedMovies = Object.assign({}, this.state.ratedMovies);
        ratedMovies[movieObj.id] = movieObj
        this.setState({ratedMovies});
    }

    render() {
        return (
            <Box>
                <SearchBox
                    movieMap={this.props.movieMap}
                    handleClick={this.props.handleClick}
                    db={this.props.db}
                />
                <Heading>Your Rated Movies</Heading>
                <MovieCarousel
                    scoreType="Current Rating"
                    showScore={true}
                    movies={Object.values(this.state.ratedMovies)}
                    handleClick={this.props.handleClick}
                />
            </Box>
        )
    }
}