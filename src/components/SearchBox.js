import React, { Component } from "react";
import {Box, Text, TextInput} from "grommet";
import { searcher } from "../utils/fuzzy-search.js";

export class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.searcher = searcher("name", props.movieMap);
        this.searchTimer = null;
        this.state = {
            text: "",
            suggestions: []
        };
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.movieMap.length) {
            this.searcher = searcher("name", this.props.movieMap);
        }
    }

    makeMoviesList(text) {
        if (!text) {
            this.setState({suggestions: []});
            return;
        }

        const results = this.searcher.search(text);
        const displayedResults = results.slice(0, 10);
        const suggestions = displayedResults.map((result, index) => {
            return (
            <Box key={index}>
                <Text>{result.name}</Text>
            </Box>
            );
        });
        this.setState({suggestions: suggestions});
    }

    onChangeHandler(event) {
        const newText = event.target.value;
        this.setState({text: newText});

        // Only execute search if the user hasn't typed in 1s
        clearTimeout(this.searchTimer);
        this.searchTimer = setTimeout(() => this.makeMoviesList(newText), 200);
    }

    componentWillUnmount() {
        clearTimeout(this.searchTimer);
    }

    render() {
        return (
            <Box>
                <TextInput placeholder="search for a movie"
                            value={this.state.text}
                            onChange={e => this.onChangeHandler(e)}/>
                {this.state.suggestions}
            </Box>
        );
    }
}