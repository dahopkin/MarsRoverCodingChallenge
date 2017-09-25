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
        var moveRoverWithInstructions = function (roverInstructions) {
            var currentInstruction = "";
            for (var i = 0; i < roverInstructions.length; i++) {
                currentInstruction = roverInstructions[i];
                if (model.roverCanMove(currentInstruction)) {
                    model.moveRoverByInstruction(currentInstruction);
                    view.showRoverInLocation(model.getCurrentLocation(), model.getCurrentOrientation());
                } else {
                    view.displayMessage("Model cannot move past obstruction.")
                    break;
                }
            }
        };

        return { moveRoverWithInstructions: moveRoverWithInstructions };
    })();
    var model = (function () {
        var gridSize = 7;
        var currentLocation = "";
        var currentOrientation = "";
        var placeRoverInLocation = function (location, orientation) {
            currentLocation = location;
            currentOrientation = orientation;
        };
        var instructionIsRotation = function (instruction) { return instruction === "R" || instruction === "L"; }
        var instructionIsMovement = function (instruction) { return instruction === "B" || instruction === "F"; }
        var wrap = function (step, maximumSize) {
            if (step < 0) { return maximumSize - 1; }
            if (step > maximumSize) { return 0; }
            return step;
        };
        var getNewLocationFromInstruction = function (instruction) {
            var currentLocationRow = currentLocation.charAt(0);
            var currentLocationColumn = currentLocation.charAt(1);
            var oneColumnRightWithWrap = wrap(Number(currentLocationColumn) + 1, gridSize);
            var oneColumnLeftWithWrap = wrap(Number(currentLocationColumn) - 1, gridSize);
            var oneRowUpWithWrap = wrap(Number(currentLocationRow) - 1, gridSize);
            var oneRowDownWithWrap = wrap(Number(currentLocationRow) + 1, gridSize);
            switch (instruction) {
                case "B":
                    if (currentOrientation === "N") { currentLocationRow = oneRowDownWithWrap.toString(); }
                    else if (currentOrientation === "E") { currentLocationColumn = oneColumnLeftWithWrap.toString(); }
                    else if (currentOrientation === "S") { currentLocationRow = oneRowUpWithWrap.toString(); }
                    else if (currentOrientation === "W") { currentLocationColumn = oneColumnRightWithWrap.toString(); }
                    break;
                case "F":
                    if (currentOrientation === "N") { currentLocationRow = oneRowUpWithWrap.toString(); }
                    else if (currentOrientation === "E") { currentLocationColumn = oneColumnRightWithWrap.toString(); }
                    else if (currentOrientation === "S") { currentLocationRow = oneRowDownWithWrap.toString(); }
                    else if (currentOrientation === "W") { currentLocationColumn = oneColumnLeftWithWrap.toString(); }
                    break;
                default:
                    return currentLocation;
                    break;

            }
            return currentLocationRow + currentLocationColumn;
        };
        var getNewOrientationFromInstruction = function (instruction) {
            var clockwiseOrientations = ["N", "E", "S", "W"];
            var clockwiseOrientationsLength = clockwiseOrientations.length;
            var currentOrientationIndexInClockwise = clockwiseOrientations.indexOf(currentOrientation);
            var rotateLeft = wrap(currentOrientationIndexInClockwise - 1, clockwiseOrientationsLength)
            var rotateRight = wrap(currentOrientationIndexInClockwise + 1, clockwiseOrientationsLength)
            var newOrientation;
            switch (instruction) {
                case "L":
                    var newOrientationIndex = rotateLeft;
                    newOrientation = clockwiseOrientations[newOrientationIndex];
                    break;
                case "R":
                    var newOrientationIndex = rotateRight;
                    newOrientation = clockwiseOrientations[newOrientationIndex];
                    break;
                default:
                    return currentOrientation;
                    break;
            }
            return newOrientation;
        };
        var locationHasObstruction = function (location) {
            return false;
        };
        var roverCanMove = function (instruction) {
            if (instructionIsRotation(instruction)) return true;
            var newLocation = getNewLocationFromInstruction(instruction);
            return !locationHasObstruction(newLocation);
        };
        var setNewLocationOrOrientationFromInstruction = function (instruction) {
            if (instructionIsRotation(instruction)) { currentOrientation = getNewOrientationFromInstruction(instruction); }
            else if (instructionIsMovement(instruction)) { currentLocation = getNewLocationFromInstruction(instruction); }
        };
        var getCurrentLocation = function () { return currentLocation; };
        var getCurrentOrientation = function () { return currentOrientation; };
        return {
            placeRoverInLocation: placeRoverInLocation,
            getCurrentLocation: getCurrentLocation,
            getCurrentOrientation: getCurrentOrientation,
            roverCanMove: roverCanMove,
            moveRoverByInstruction: setNewLocationOrOrientationFromInstruction
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
                currentLetter = roverInstructionArray[i].trim();
                if (validCommands.indexOf(currentLetter) === -1) { return null;}
            }
            return roverInstructionArray;
        }
    };
    
    var placeRoverInStartingPosition = function (location, orientation) {
        model.placeRoverInLocation(location, orientation);
        view.showRoverInLocation(model.getCurrentLocation(), model.getCurrentOrientation());

    };
    var processRoverInput = function (roverInputText) {
        var roverInstructions = parseRoverInstructions(roverInputText);
            if (roverInstructions) {
                controller.moveRoverWithInstructions(roverInstructions);
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