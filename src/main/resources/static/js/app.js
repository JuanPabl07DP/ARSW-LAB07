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

    const _drawBlueprint = function (blueprint) {
        const canvas = document.getElementById("blueprint-canvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const points = blueprint.points || [];

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (points.length > 0) {
            ctx.beginPath();
            ctx.strokeStyle = "#3498db";
            ctx.lineWidth = 2;

            ctx.moveTo(points[0].x, points[0].y);

            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }

            ctx.stroke();

            ctx.fillStyle = "#e74c3c"; // Red color
            for (let i = 0; i < points.length; i++) {
                ctx.beginPath();
                ctx.arc(points[i].x, points[i].y, 3, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    };

    return {
        setAuthor: function(authorName) {
            _author = authorName;
        },

        updateBlueprintsList: function() {
            apiclient.getBlueprintsByAuthor(_author, function(blueprints) {
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
                            <td>
                                <button class="btn btn-primary btn-sm open-blueprint" 
                                        data-blueprint="${bp.name}">Open</button>
                            </td>
                        </tr>
                    `);
                });

                $(".open-blueprint").click(function () {
                    const blueprintName = $(this).data("blueprint");
                    Blueprint.drawBlueprintByAuthorAndName(_author, blueprintName);
                });

                const totalPoints = _blueprintsList.reduce(function(total, bp) {
                    return total + bp.points;
                }, 0);

                $("#total-points-value").text(totalPoints);
            });
        },

        drawBlueprintByAuthorAndName: function (authorName, blueprintName) {
            apiclient.getBlueprintsByNameAndAuthor(authorName, blueprintName, function(blueprint) {
                if (blueprint) {
                    _currentBlueprint = blueprint;

                    $("#current-blueprint-name").text(blueprintName);

                    _drawBlueprint(blueprint);
                } else {
                    console.error("Blueprint not found:", blueprintName);
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