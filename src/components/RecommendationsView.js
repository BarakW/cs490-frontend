import React, { Component } from "react";
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
        this.state = {
            newMovies: [],
            allMovies: []
        }
        
    }

    render() {
        return (
        <Box>
            <Heading>New Movies</Heading>
            <MovieCarousel scoreType="Recommendation" showScore={true} movies={movies}/>

            <Heading>All Movies</Heading>
        </Box>
        );
    }
}