import React, { Component } from 'react';
import { Box, Text, RadioButtonGroup, Heading } from "grommet";
import { addRating } from "../utils/db-functions.js"
import { convertNumToColor } from "../utils/color-gradient.js"

export class EditRating extends Component {
    constructor (props) {
        super(props);

        this.state = {
            score: this.props.score,
            selectedValue: null
        }
    }

    updateRating = (newRatingString) => {
        const ratingsMap = {
            'unwatchable': 1,
            'bad': 25,
            'meh': 50,
            'good': 75,
            'wow': 100
        }
        const newRating = ratingsMap[newRatingString];
        addRating(this.props.userId, this.props.movieId, newRating, this.props.db);
        this.setState({
            score: newRating,
            selectedValue: newRatingString
        });
    }

    render () {
        return (
            <Box
                margin="small"
            >
                <Heading level={2}>{this.props.name}</Heading>
                <Text>{this.props.date}</Text>
                <Text>{this.props.scoreType + ": "}<span style={{color: convertNumToColor(this.state.score)}}>{this.state.score}</span></Text>
                <Text margin={{'top': 'small'}}>How was the movie?</Text>
                <RadioButtonGroup
                    name="doc"
                    options={['unwatchable', 'bad', 'meh', 'good', 'wow']}
                    value={this.state.selectedValue}
                    onChange={(event) => this.updateRating(event.target.value)}
                />
            </Box>
        );
    }
}