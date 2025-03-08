// Blueprints Module
const Blueprint = (function () {
    let _author = "";
    let _blueprintsList = []; // List of objects with {name, points}
    let _currentBlueprint = null;

    const _calculateTotalPoints = function () {
        if (!_blueprintsList || _blueprintsList.length === 0) return 0;

        return _blueprintsList.reduce(function (total, blueprint) {
            return total + blueprint.points;
        }, 0);
    };

    return {
        setAuthor: function(authorName) {
            _author = authorName;
        },

        updateBlueprintsList: function() {
            apimock.getBlueprintsByAuthor(_author, function(blueprints) {
                _blueprintsList = blueprints.map(function(bp) {
                    return {
                        name: bp.name,
                        points: bp.points ? bp.points.length : 0
                    };
                });

                $("#blueprints-body").empty();

                _blueprintsList.map(function(bp) {
                    $("#blueprints-body").append(`
                        <tr>
                            <td>${bp.name}</td>
                            <td>${bp.points}</td>
                        </tr>
                    `);
                });

                const totalPoints = _blueprintsList.reduce(function(total, bp) {
                    return total + bp.points;
                }, 0);

                $("#total-points-value").text(totalPoints);
            });
        },

        getBlueprint: function (blueprintName, callback) {
            apimock.getBlueprintsByNameAndAuthor(_author, blueprintName, function(blueprint) {
                _currentBlueprint = blueprint;
                if (callback) {
                    callback(blueprint);
                }
            });
        },

        getAuthor: function () {
            return _author;
        },

        getBlueprintsList: function () {
            return _blueprintsList;
        },

        getCurrentBlueprint: function () {
            return _currentBlueprint;
        },

        getTotalPoints: function () {
            return _calculateTotalPoints();
        }
    };
})();

$(document).ready(function () {
    $("#get-blueprints-btn").click(function () {
        const authorName = $("#author-input").val();

        if (!authorName) {
            alert("Please enter an author name");
            return;
        }

        // Set author
        Blueprint.setAuthor(authorName);

        // Update author name in the DOM
        $("#author-name").text(authorName);

        // Update blueprints list
        Blueprint.updateBlueprintsList();
    });
});