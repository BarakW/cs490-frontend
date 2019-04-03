const levenshtein = require('js-levenshtein');

const searchHelper = (key, list, string) => {
    const outputList = [];
    for (const item of list) {
        const comparison = Object.assign({}, item, {
            distance: levenshtein(string, item[key].substr(0, string.length))
        });
        outputList.push(comparison);
    }
    outputList.sort((a, b) => a.distance > b.distance ? 1 : -1);
    return outputList;
};

export const searcher = (key, list) => {
    return ({
        list: list,
        key: key,
        search: (text) => searchHelper(key, list, text)
    });
}