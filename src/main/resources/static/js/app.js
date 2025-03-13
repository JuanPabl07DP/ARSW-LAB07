// Blueprint App Module
const app = (function() {
    let _author = "";
    let _blueprints = [];
    let _currentBlueprint = null;
    let _module = apiclient;
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
        _ctx.strokeStyle = 'black';

        if (_currentBlueprint.points.length > 0) {
            _ctx.moveTo(_currentBlueprint.points[0].x, _currentBlueprint.points[0].y);

            for (let i = 1; i < _currentBlueprint.points.length; i++) {
                _ctx.lineTo(_currentBlueprint.points[i].x, _currentBlueprint.points[i].y);
            }

            _ctx.stroke();

            _ctx.fillStyle = 'red';
            for (let i = 0; i < _currentBlueprint.points.length; i++) {
                _ctx.beginPath();
                _ctx.arc(_currentBlueprint.points[i].x, _currentBlueprint.points[i].y, 3, 0, Math.PI * 2);
                _ctx.fill();
            }
        }
    };

    const _initCanvasEvents = function() {
        _canvas = document.getElementById("blueprint-canvas");
        _ctx = _canvas.getContext("2d");

        _canvas.addEventListener("pointerdown", function(event) {
            if (!_currentBlueprint) return;

            const rect = _canvas.getBoundingClientRect();
            const x = Math.round(event.clientX - rect.left);
            const y = Math.round(event.clientY - rect.top);

            const newPoint = { x, y };

            _currentBlueprint.points.push(newPoint);

            _renderBlueprint();

            console.log(`Point added to blueprint ${_currentBlueprint.name}: (${x}, ${y})`);
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
                _renderBlueprint();
            });
        }
    };
})();

$(document).ready(function() {
    app.init();
});