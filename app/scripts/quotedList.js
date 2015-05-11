function quoteList (terminal) {

    return function (items) {
        let start = '"' + lodash.initial(items).join('", "') + '"';
        return start + ' ' + terminal + ' "' + lodash.last(items) + '"';
    };

}

var orList = quoteList('or');
var andList = quoteList('and');