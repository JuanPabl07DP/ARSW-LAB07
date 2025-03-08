// API Client Module
const apiclient = (function() {
    const apiBaseURL = "/blueprints";

    return {
        getBlueprintsByAuthor: function(authorName, callback) {
            $.ajax({
                url: `${apiBaseURL}/${authorName}`,
                type: 'GET',
                contentType: "application/json",
                success: function(data) {
                    callback(data);
                },
                error: function(xhr, status, error) {
                    console.error('Error getting blueprints:', error);
                    alert("Error loading blueprints: " + xhr.responseText);
                }
            });
        },

        getBlueprintsByNameAndAuthor: function(authorName, bpname, callback) {
            $.ajax({
                url: `${apiBaseURL}/${authorName}/${bpname}`,
                type: 'GET',
                contentType: "application/json",
                success: function(data) {
                    callback(data);
                },
                error: function(xhr, status, error) {
                    console.error('Error getting blueprint:', error);
                    alert("Error loading blueprint: " + xhr.responseText);
                }
            });
        }
    };
})();