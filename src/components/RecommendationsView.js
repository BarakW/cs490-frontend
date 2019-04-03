import React, { Component } from "react";
import {Box, Text, TextInput} from "grommet";
import {} from "../utils/db-functions.js"

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