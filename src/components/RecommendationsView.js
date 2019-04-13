import React, { Component } from "react";
import { getMovieDoc, getPoster } from "../utils/db-functions.js"
import { Box, Heading } from "grommet";
import { MovieCarousel } from "./MovieCarousel";

export class RecommendationsView extends Component {
    constructor (props) {
        super(props);
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
        const userDocHasChanged = JSON.stringify(this.props.userDoc) !== JSON.stringify(prevProps.userDoc) 
        if (this.props.userDoc && userDocHasChanged) {
            this.recommendationsObj = this.getRecsFromUser();
            // TODO: only rerender the movie that has changed. this is going to rerender everything.
            this.setState({newMovies: [], allMovies: []});
            this.getMoviesForUser(this.recommendationsObj);
        }
    }

    componentDidMount () {
        if (this.props.userDoc) {
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
            let newMovies = [...this.state.newMovies, movieObj];
            this.setState({newMovies});
        } else {
            let allMovies = [...this.state.allMovies, movieObj];
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
                    movies={this.state.newMovies}
                    handleClick={this.props.handleClick}
                />
                <Heading>All Movies</Heading>
                <MovieCarousel
                    scoreType="Prediction"
                    showScore={true}
                    movies={this.state.allMovies}
                    handleClick={this.props.handleClick}
                />
            </Box>
        );
    }
}