// Blueprints Module
const Blueprint = (function () {
    let _author = "";
    let _blueprintsList = [];
    let _currentBlueprint = null;
    let _canvasInitialized = false;
    let _isNewBlueprint = false;

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
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (blueprint && blueprint.points && blueprint.points.length > 0) {
            const points = blueprint.points;

            ctx.beginPath();
            ctx.strokeStyle = "#3498db";
            ctx.lineWidth = 2;

            ctx.moveTo(points[0].x, points[0].y);

            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }

            ctx.stroke();

            ctx.fillStyle = "#e74c3c";
            for (let i = 0; i < points.length; i++) {
                ctx.beginPath();
                ctx.arc(points[i].x, points[i].y, 3, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    };

    const _clearCanvas = function() {
        const canvas = document.getElementById("blueprint-canvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        $("#current-blueprint-name").text("");
    };

    const _initCanvasEvents = function() {
        if (_canvasInitialized) return;

        const canvas = document.getElementById("blueprint-canvas");
        if (!canvas) return;

        const handleCanvasClick = function(event) {
            event.preventDefault();

            if (!_currentBlueprint) {
                console.warn("No blueprint selected");
                return;
            }

            const rect = canvas.getBoundingClientRect();
            const x = Math.round(event.clientX - rect.left);
            const y = Math.round(event.clientY - rect.top);

            console.log(`Point added: (${x}, ${y})`);

            if (!_currentBlueprint.points) {
                _currentBlueprint.points = [];
            }

            _currentBlueprint.points.push({x: x, y: y});

            _drawBlueprint(_currentBlueprint);
        };

        if (window.PointerEvent) {
            canvas.addEventListener("pointerdown", handleCanvasClick);
        } else {
            canvas.addEventListener("mousedown", handleCanvasClick);
            canvas.addEventListener("touchstart", function(e) {
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent("mousedown", {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                handleCanvasClick(mouseEvent);
            });
        }

        _canvasInitialized = true;
    };

    const _updateBlueprintsUI = function(blueprints) {
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
    };

    return {
        setAuthor: function(authorName) {
            _author = authorName;
        },

        updateBlueprintsList: function() {
            apiclient.getBlueprintsByAuthor(_author)
                .done(function(blueprints) {
                    _updateBlueprintsUI(blueprints);
                })
                .fail(function(xhr, status, error) {
                    console.error('Error getting blueprints:', error);
                    alert("Error loading blueprints: " + xhr.responseText);
                });
        },

        saveCurrentBlueprint: function() {
            if (!_currentBlueprint) {
                alert("No blueprint selected!");
                return;
            }

            if (_isNewBlueprint) {
                apiclient.createBlueprint(_currentBlueprint)
                    .done(function() {
                        console.log("Blueprint created successfully");
                        _isNewBlueprint = false;

                        apiclient.getBlueprintsByAuthor(_author)
                            .done(function(blueprints) {
                                if (Array.isArray(blueprints)) {
                                    _updateBlueprintsUI(blueprints);
                                } else {
                                    console.error("Error: Response is not an array", blueprints);
                                    Blueprint.updateBlueprintsList();
                                }
                            })
                            .fail(function(xhr, status, error) {
                                console.error('Error getting blueprints after creation:', error);
                                alert("Error retrieving updated blueprints: " + (xhr.responseText || error));
                            });
                    })
                    .fail(function(xhr, status, error) {
                        console.error('Error in create operation:', error);
                        alert("Error creating blueprint: " + (xhr.responseText || error));
                    });
            }
        },

        deleteCurrentBlueprint: function() {
            if (!_currentBlueprint) {
                alert("No blueprint selected!");
                return;
            }

            $("#delete-blueprint-name").text(_currentBlueprint.name);
            $("#deleteConfirmModal").modal('show');
        },

        confirmDeleteBlueprint: function() {
            if (!_currentBlueprint) {
                return;
            }

            $("#deleteConfirmModal").modal('hide');

            apiclient.deleteBlueprint(_author, _currentBlueprint.name)
                .done(function() {
                    console.log("Blueprint deleted successfully");

                    _clearCanvas();
                    _currentBlueprint = null;

                    apiclient.getBlueprintsByAuthor(_author)
                        .done(function(blueprints) {
                            if (Array.isArray(blueprints)) {
                                _updateBlueprintsUI(blueprints);
                            } else {
                                console.error("Error: Received data is not an array", blueprints);
                                Blueprint.updateBlueprintsList();
                            }
                        })
                        .fail(function(xhr, status, error) {
                            console.error('Error getting updated blueprints:', error);
                            alert("Error retrieving updated blueprints: " + (xhr.responseText || error));
                        });
                })
                .fail(function(xhr, status, error) {
                    console.error('Error in delete operation:', error);
                    alert("Error deleting blueprint: " + (xhr.responseText || error));
                });
        },

        drawBlueprintByAuthorAndName: function (authorName, blueprintName) {
            _isNewBlueprint = false;

            apiclient.getBlueprintsByNameAndAuthor(authorName, blueprintName)
                .done(function(blueprint) {
                    if (blueprint) {
                        _currentBlueprint = blueprint;
                        $("#current-blueprint-name").text(blueprintName);
                        _drawBlueprint(blueprint);
                    }
                })
                .fail(function(xhr, status, error) {
                    console.error("Blueprint not found:", error);
                    alert("Error loading blueprint: " + xhr.responseText);
                });
        },

        createNewBlueprint: function(blueprintName) {
            if (!_author) {
                alert("Please select an author first!");
                return;
            }

            _clearCanvas();

            _currentBlueprint = {
                author: _author,
                name: blueprintName,
                points: []
            };

            $("#current-blueprint-name").text(blueprintName + " (New)");

            _isNewBlueprint = true;
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
        },

        initCanvas: function() {
            _initCanvasEvents();
        }
    };
})();

$(document).ready(function () {
    Blueprint.initCanvas();

    $("#get-blueprints-btn").click(function () {
        const authorName = $("#author-input").val();

        if (!authorName) {
            alert("Please enter an author name");
            return;
        }

        Blueprint.setAuthor(authorName);

        $("#author-name").text(authorName);

        Blueprint.updateBlueprintsList();
    });

    $("#save-update-btn").click(function() {
        Blueprint.saveCurrentBlueprint();
    });

    $("#create-blueprint-btn").click(function() {
        $("#newBlueprintModal").modal('show');
    });

    $("#create-confirm-btn").click(function() {
        const blueprintName = $("#new-blueprint-name").val();

        if (!blueprintName) {
            alert("Please enter a name for the blueprint");
            return;
        }

        $("#newBlueprintModal").modal('hide');

        $("#new-blueprint-name").val("");

        Blueprint.createNewBlueprint(blueprintName);
    });

    $("#delete-btn").click(function() {
        Blueprint.deleteCurrentBlueprint();
    });

    $("#delete-confirm-btn").click(function() {
        Blueprint.confirmDeleteBlueprint();
    });
});