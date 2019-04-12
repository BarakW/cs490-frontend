import React, { Component } from 'react';
import { Box, Text, RadioButtonGroup, Button, Layer } from "grommet";
import { addRating } from "../utils/db-functions.js"
import { convertNumToColor } from "../utils/color-gradient.js"

export class EditRating extends Component {
    constructor (props) {
        super(props);

        this.state = {
            color: convertNumToColor(props.score, 40),
            selectedValue: null
        }
    }

    updateRating = (newRatingString) => {
        const newRating = newRatingString === 'shit' ? 1 : 100;
        addRating(this.props.userId, this.props.movieId, newRating, this.props.db);
        // .then((newRating, newRatingString) => {
            this.setState({
                // color: convertNumToColor(newRating, 40),
                selectedValue: newRatingString
            });
        // });
    }

    render () {
        return (
            <Box
                // width="500px" 
                // height="500px"
                margin="small"
            >
                <Text>{this.props.name}</Text>
                <Text>{this.props.date}</Text>
                <Text>{this.props.scoreType + ": "}<span style={{color: this.state.color}}>{this.props.score}</span></Text>
                <RadioButtonGroup
                    name="doc"
                    options={['shit', 'good']}
                    value={this.state.selectedValue}
                    onChange={(event) => this.updateRating(event.target.value)}
                />
            </Box>
        );
    }
}