$(function () {
    var view = (function () {
        var $displayMessageElement = $("#messageArea");
        var orientationStyleMap = {
            "N": "rover-north",
            "E": "rover-east",
            "W": "rover-west",
            "S": "rover-south",
        }
        var eraseRoverOnScreen = function () {
            $("td").removeClass(function (index, className) {
                return (className.match(/(^|\s)rover-\S+/g) || []).join(' ');
            });
        };
        var showRoverInLocation = function (location, orientation) {
            eraseRoverOnScreen();
            $("#" + location).addClass(orientationStyleMap[orientation]);
        };
        var displayMessage = function (message) {
            $displayMessageElement.html(message);
        };
        return {
            displayMessage: displayMessage,
            showRoverInLocation: showRoverInLocation
        };
    })();
    var controller = (function () {

    })();
    var model = (function () {
        var gridSize = 6;
        var currentLocation = "";
        var currentOrientation = "";
        var placeRoverInLocation = function (location, orientation) {
            currentLocation = location;
            currentOrientation = orientation;
        };
        var getCurrentLocation = function () { return currentLocation; };
        var getCurrentOrientation = function () { return currentOrientation; };
        return {
            placeRoverInLocation: placeRoverInLocation,
            getCurrentLocation: getCurrentLocation,
            getCurrentOrientation: getCurrentOrientation
        };
    })();
    var parseRoverInstructions = function (roverInputText) {
        var validCommands = ["L", "R", "B", "F"];
        var formattedText = roverInputText.trim().toUpperCase();
        if (formattedText === null || formattedText === "") {
            return null;
        } else {
            var roverInstructionArray = formattedText.split(",");
            var currentLetter = "";
            for (var i = 0; i < roverInstructionArray.length; i++) {
                currentLetter = roverInstructionArray[i];
                if (validCommands.indexOf(currentLetter) === -1) { return null;}
            }
            return roverInstructionArray;
        }
    };
    var moveRoverWithInstructions = function (roverInstructions) { };
    var placeRoverInStartingPosition = function (location, orientation) {
        model.placeRoverInLocation(location, orientation);
        view.showRoverInLocation(model.getCurrentLocation(), model.getCurrentOrientation());

    };
    var processRoverInput = function (roverInputText) {
        var roverInstructions = parseRoverInstructions(roverInputText);
            if (roverInstructions) {
                moveRoverWithInstructions(roverInstructions);
            } else {
                view.displayMessage("Instructions are invalid. Please use only 'l', 'r', 'b', or 'f'")
            }

    };
    var setUpCommandForm = function () {
        $("#moveButton").on("click.move", function (e) {
            view.displayMessage("");
            var moveInstructionText = $("#roverInput").val();
            processRoverInput(moveInstructionText);
        });
    };
    var startPage = function () {
        var startingLocation = "00";
        var startingOrientation = "N";
        placeRoverInStartingPosition(startingLocation, startingOrientation);
        setUpCommandForm();
    };
    startPage();
});