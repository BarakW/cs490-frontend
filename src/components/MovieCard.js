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
             flex={false}
             background={{image: "url(" + props.posterUrl + ")"}}
             direction="column-reverse"
             onClick={() => props.handleClick(props.name, props.date, props.score, props.id, props.scoreType)}
            // onClick={() => console.log('clicked!')}
            >
                {/* {scoreText}
                <Text className="text-on-image">{props.date}</Text>
                <Text className="text-on-image">{props.name}</Text> */}
            </Box>
        </ThemeContext.Extend>
    )
}