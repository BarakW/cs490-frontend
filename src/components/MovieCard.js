import React, { Component } from 'react';
import { Box, Image, Text, ThemeContext } from "grommet";
import { convertNumToColor } from "../utils/color-gradient.js"

export const MovieCard = (props) => {
    let scoreText = null;
    const color = convertNumToColor(props.score, 40);
    if (props.showScore) {
        scoreText = <Text className="text-on-image">{props.scoreType + ": "}<span style={{color: color}}>{props.score}</span></Text>
    }

    // TODO: convert movie times from unix time
    return (
        <ThemeContext.Extend
            value={{
                
            }}
        >
            <Box
             width="150px" 
             height="220px" 
             border={{ color: color, size: 'small' }}
             round="small"
             margin="xsmall"
             flex={false} // <-- this may not be working as intended. test this later
             background={{image: "url(" + props.posterUrl + ")"}}
             direction="column-reverse"
            >
                {/* {scoreText}
                <Text className="text-on-image">{props.date}</Text>
                <Text className="text-on-image">{props.name}</Text> */}
            </Box>
        </ThemeContext.Extend>
    )
}