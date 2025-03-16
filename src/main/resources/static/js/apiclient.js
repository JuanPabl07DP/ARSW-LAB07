// API Client Module with Promises
const apiclient = (function() {
    const apiBaseURL = "/blueprints";

    return {
        getBlueprintsByAuthor: function(authorName) {
            return $.ajax({
                url: `${apiBaseURL}/${authorName}`,
                type: 'GET',
                contentType: "application/json"
            });
        },

        getBlueprintsByNameAndAuthor: function(authorName, bpname) {
            return $.ajax({
                url: `${apiBaseURL}/${authorName}/${bpname}`,
                type: 'GET',
                contentType: "application/json"
            });
        },

        updateBlueprint: function(authorName, bpname, blueprint) {
            return $.ajax({
                url: `${apiBaseURL}/${authorName}/${bpname}`,
                type: 'PUT',
                data: JSON.stringify(blueprint),
                contentType: "application/json"
            });
        },

        createBlueprint: function(blueprint) {
            return $.ajax({
                url: apiBaseURL,
                type: 'POST',
                data: JSON.stringify(blueprint),
                contentType: "application/json"
            });
        },

        deleteBlueprint: function(authorName, bpname) {
            return $.ajax({
                url: `${apiBaseURL}/${authorName}/${bpname}`,
                type: 'DELETE',
                contentType: "application/json"
            });
        }
    };
})();