import React, { Component } from 'react';
import { Box, Button, Heading } from "grommet";
import { SearchBox } from "./SearchBox.js";
import firebase from "firebase";

export class NewRatingsView extends Component {
    constructor(props) {
        super(props);
        this.db = props.firebaseDB;
        this.storage = props.fbStorage;
    }

    getMovie(id) {
        const name = this.props.movieMap[id];
    }

    rateMovie(id, rating) {
        return;
    }

    render() {
        return (
            <Box>
                <SearchBox movieMap={this.props.movieMap}/>
            </Box>
        )
    }
}