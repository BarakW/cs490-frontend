import React, { Component } from 'react';
import { Box, Text, RadioButtonGroup, Heading, Layer } from "grommet";
import { addRating } from "../utils/db-functions.js"
import { convertNumToColor } from "../utils/color-gradient.js"

export class EditRating extends Component {
    constructor (props) {
        super(props);

        this.ratingToString = {
            1: 'unwatchable',
            25: 'bad',
            50: 'meh',
            75: 'good',
            100: 'wow'
        }

        this.stringToRating = {
            'unwatchable': 1,
            'bad': 25,
            'meh': 50,
            'good': 75,
            'wow': 100
        }

        this.state = {
            score: this.props.score,
            scoreType: this.props.scoreType,
            selectedRating: false,
            movieWasUnrated: this.props.scoreType === 'Prediction'
        }
    }

    updateRating = () => {
        const isNewRating = this.state.score !== this.props.score;

        if ((isNewRating || this.state.movieWasUnrated) && this.state.selectedRating) {
            addRating(this.props.userId, this.props.movieId, this.state.score, this.props.db);
        }
        this.props.hideEditRating();
    }

    updateModal = (newRatingString) => {
        const newRating = this.stringToRating[newRatingString];
        this.setState({
            score: newRating,
            scoreType: 'Current Rating',
            selectedRating: true
        });
    }

    render () {
        return (
            <Layer 
                onEsc={() => this.updateRating()}
                onClickOutside={() => this.updateRating()}
                responsive={false}
            >
                <Box margin="small">
                    <Heading level={2}>{this.props.name}</Heading>
                    <Text>{this.props.date}</Text>
                    <Text>{this.state.scoreType + ": "}<span style={{color: convertNumToColor(this.state.score)}}>{this.state.score}</span></Text>
                    <Text margin={{'top': 'small'}}>How was the movie?</Text>
                    <RadioButtonGroup
                        name="doc"
                        options={['unwatchable', 'bad', 'meh', 'good', 'wow']}
                        value={this.state.scoreType === 'Prediction' ? null : this.ratingToString[this.state.score]}
                        onChange={(event) => this.updateModal(event.target.value)}
                    />
                </Box>
            </Layer>
        );
    }
}