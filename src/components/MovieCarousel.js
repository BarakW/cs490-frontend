import React, { Component } from 'react';
import { Box } from "grommet";
import { MovieCard } from "./MovieCard.js";

export const MovieCarousel = (props) => {
    const movies = props.movies.slice();
    movies.sort((a, b) => b.score - a.score); // Sort movies from high to low

    const movieCards = movies.map((movie) => {
        return (
            <MovieCard 
                name={movie.name}
                date={movie.date}
                showScore={props.showScore}
                scoreType={props.scoreType}
                score={movie.score}
                posterUrl={movie.posterURL}
                key={movie.id}
                id={movie.id}
                handleClick={props.handleClick}
            />
        );
    });

    return (
        <Box className="movie-carousel" overflow="scroll" scrollbarWidth="none" direction="row">
            {movieCards}
        </Box>
    );
};