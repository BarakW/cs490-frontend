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
        this.ratingsObj = null;
        this.state = {
            ratedMovies: [],
        };
        
        this.buildMoviesList = this.buildMoviesList.bind(this);
        this.addMovieMetadata = this.addMovieMetadata.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        // make sure we don't create the ratingsObj until we have the users info
        const userDocHasChanged = JSON.stringify(this.props.userDoc) !== JSON.stringify(prevProps.userDoc) 
        if (this.props.userDoc && userDocHasChanged) {
            this.ratingsObj = this.getRatingsFromUser();
            // TODO: only rerender the movie that has changed. this is going to rerender everything.
            this.setState({ratedMovies: []});
            this.getMoviesForUser(this.ratingsObj);
        }
    }

    componentDidMount () {
        // when doc is first mounted, fetch movies
        if (this.props.userDoc) {
            this.ratingsObj = this.getRatingsFromUser();
            this.getMoviesForUser(this.ratingsObj);
        }
    }

    // create ratings object we can use to build up movie cards
    getRatingsFromUser() {
        let ratings = {}
        for (let movieId in this.props.userDoc.ratings) {
            ratings[movieId] = {
                id: movieId, 
                score: this.props.userDoc.ratings[movieId]
            };
        }
        return ratings;
    }

    // get info about each movie we want to recommend to the user
    getMoviesForUser (ratingsObj) {
        for (let movieId in ratingsObj) {
            getMovieDoc(
                movieId,
                this.db,
                this.addMovieMetadata,
                {
                    movieObj: ratingsObj[movieId],
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

        let ratedMovies = [...this.state.ratedMovies, movieObj];
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
                    movies={this.state.ratedMovies}
                    handleClick={this.props.handleClick}
                />
            </Box>
        )
    }
}