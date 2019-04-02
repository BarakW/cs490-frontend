import React, { Component } from "react";
import {Box, Text, TextInput} from "grommet";

export class RecommendationsView extends Component {
    constructor (props) {
        super(props);
        this.state = {
            newMovies: [],
            allMovies: []
        }
        
    }

    render () {
        <Box>
            <Heading>New Movies</Heading>
            

            <Heading>All Movies</Heading>
        </Box>
    }
}