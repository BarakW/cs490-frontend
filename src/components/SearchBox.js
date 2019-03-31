import React, { Component } from "react";
import {Box, Text, TextInput} from "grommet";
import Fuse from "fuse.js";

const options = {
    shouldSort: true,
    threshold: 0.2,
    location: 0,
    distance: 10,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ["name"]
};

export class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.searcher = new Fuse(this.props.movieMap, {
            shouldSort: true,
            threshold: 0.2,
            location: 0,
            distance: 10,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: ["name"]
        });
        this.state = {
            text: ""
        };
    }

    makeMoviesList(text) {
        const results = this.searcher.search(text);
        const displayedResults = results.slice(0, 10);
        console.log(displayedResults);
        const suggestions = displayedResults.map((result) => {
            return (
            <Box>
                <Text>{result}</Text>
            </Box>
            );
        });
        return suggestions;
    }

    onChangeHandler(event) {
        this.setState({text: event.target.value});
    }

    render() {
        return (
            <Box>
                <TextInput placeholder="search for a movie"
                            value={this.state.text}
                            onChange={e => this.onChangeHandler(e)}/>
                {this.makeMoviesList(this.state.text)}
            </Box>
        );
    }
}