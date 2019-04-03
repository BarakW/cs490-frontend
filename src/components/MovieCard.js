import React, { Component } from 'react';
import { Box, Image, Text, ThemeContext } from "grommet";

const MovieCard = (props) => {
    let scoreText = null;
    if (props.showScore) {
        scoreText = <Text>{props.scoreType + ": "}<span style={{color: "#bb0000"}}>{props.score}</span></Text>
    }

    // TODO: convert movie times from unix time
    return (
        <ThemeContext.Extend
            value={{
                
            }}
        >
            <Box width="150px" 
             height="220px" 
             border={{ color: '#AA0000', size: 'small' }}
             round="small"
             margin="xsmall"
             flex="grow"
            >
                <Image fit="contain" src={props.posterUrl} />
                <Text>{props.name}</Text>
                <Text>{props.date}</Text>
                {scoreText}
            </Box>
        </ThemeContext.Extend>
    )
}

export default MovieCard;