import React, { Component } from 'react';
import { Box } from "grommet";
import MovieCard from "./MovieCard.js";

export const MovieCarousel = (props) => {
    const movies = props.movies;
    const movieCards = props.movies.map((movie) => {
        return <MovieCard name={movie.name}
                          date={movie.date}
                          showScore={props.showScore}
                          scoreType={props.scoreType}
                          score={movie.score}
                          posterUrl={movie.posterURL}
                          />;
    });

    return (
        <Box overflow="scroll" direction="row-responsive">
            {movieCards}
        </Box>
    );
};