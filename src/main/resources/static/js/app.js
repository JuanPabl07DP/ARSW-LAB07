// Blueprint App Module
const app = (function() {
    // Private variables
    let _author = "";
    let _blueprints = [];
    let _currentBlueprint = null;
    let _module = apiclient; // By default use the real API client
    let _points = [];

    let _canvas = null;
    let _ctx = null;

    const _renderBlueprintTable = function() {
        $("#blueprints-body").empty();
        let totalPoints = 0;

        _blueprints.forEach(function(blueprint) {
            $("#blueprints-body").append(
                `<tr>
                    <td><a href="#" class="blueprint-link" data-blueprint="${blueprint.name}">${blueprint.name}</a></td>
                    <td>${blueprint.points.length}</td>
                </tr>`
            );
            totalPoints += blueprint.points.length;
        });

        $("#total-points-value").text(totalPoints);
        $("#author-name").text(_author);

        $(".blueprint-link").on("click", function(event) {
            event.preventDefault();
            const blueprintName = $(this).data("blueprint");
            app.getBlueprintByAuthorAndName(_author, blueprintName);
        });
    };

    const _renderBlueprint = function() {
        if (!_currentBlueprint) return;

        _ctx.clearRect(0, 0, _canvas.width, _canvas.height);

        $("#current-blueprint-name").text(_currentBlueprint.name);

        _ctx.beginPath();

        if (_currentBlueprint.points.length > 0) {
            _ctx.moveTo(_currentBlueprint.points[0].x, _currentBlueprint.points[0].y);

            for (let i = 1; i < _currentBlueprint.points.length; i++) {
                _ctx.lineTo(_currentBlueprint.points[i].x, _currentBlueprint.points[i].y);
            }

            _ctx.stroke();
        }

        if (_points.length > 0) {
            _ctx.beginPath();
            _ctx.strokeStyle = 'blue';

            if (_currentBlueprint.points.length > 0) {
                const lastOrigPoint = _currentBlueprint.points[_currentBlueprint.points.length - 1];
                _ctx.moveTo(lastOrigPoint.x, lastOrigPoint.y);
            } else if (_points.length > 0) {
                _ctx.moveTo(_points[0].x, _points[0].y);
                if (_points.length === 1) {
                    _ctx.arc(_points[0].x, _points[0].y, 2, 0, Math.PI * 2);
                }
            }

            for (let i = 0; i < _points.length; i++) {
                _ctx.lineTo(_points[i].x, _points[i].y);
            }

            _ctx.stroke();
        }
    };

    const _initCanvasEvents = function() {
        _canvas = document.getElementById("blueprint-canvas");
        _ctx = _canvas.getContext("2d");

        _canvas.addEventListener("pointerdown", function(event) {
            if (!_currentBlueprint) return;

            const rect = _canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            _points.push({ x, y });

            _renderBlueprint();

            console.log(`Point added: (${x}, ${y})`);
        });
    };

    return {
        setAPIModule: function(module) {
            _module = module || apiclient;
        },

        init: function() {
            $("#get-blueprints-btn").click(function() {
                const authorName = $("#author-input").val();
                if (authorName) {
                    app.getBlueprintsByAuthor(authorName);
                } else {
                    alert("Please enter an author name");
                }
            });

            _initCanvasEvents();
        },

        getBlueprintsByAuthor: function(author) {
            _author = author;
            _module.getBlueprintsByAuthor(author, function(blueprints) {
                _blueprints = blueprints;
                _renderBlueprintTable();
                _currentBlueprint = null;
                _points = [];
                _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
                $("#current-blueprint-name").text("");
            });
        },

        getBlueprintByAuthorAndName: function(author, blueprintName) {
            _module.getBlueprintsByNameAndAuthor(author, blueprintName, function(blueprint) {
                _currentBlueprint = blueprint;
                _points = [];
                _renderBlueprint();
            });
        }
    };
})();

$(document).ready(function() {
    app.init();
});