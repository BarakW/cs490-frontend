import React, { Component } from "react";
import {Box, Text, TextInput} from "grommet";
import { searcher } from "../utils/fuzzy-search.js";

export class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.searcher = searcher("name", props.movieMap); // Object which handles generating suggestions
        this.searchTimer = null; // Keep track of how long it's been since a user has typed into the search box
        this.state = {
            text: "", // Text in the search field
            suggestions: [] // Suggested autocomplete items
        };
    }

    makeMoviesList(text) {
        if (!text) {
            this.setState({suggestions: []});
            return;
        }

        const results = this.searcher.search(text);
        const displayedResults = results.slice(0, 6);
        const suggestions = displayedResults.map((result, index) => {
            return (
            <Box key={result.id}>
                <Text>{result.name}, distance: {result.distance}</Text>
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
        this.searchTimer = setTimeout(() => this.makeMoviesList(newText), 500);
    }

    componentWillUnmount() {
        clearTimeout(this.searchTimer);
    }

    render() {
        if (!this.searcher.list.length) {
            this.searcher = searcher("name", this.props.movieMap); // Update the searching object with the new movieMap
        }

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