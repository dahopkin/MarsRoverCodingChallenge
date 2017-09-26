$(function () {
    var view = (function () {
        var $displayMessageElement = $("#messageArea");
        var orientationStyleMap = {
            "N": "rover-north",
            "E": "rover-east",
            "W": "rover-west",
            "S": "rover-south",
        }
        var addClassToLocation = function (className, location) { $("#" + location).addClass(className); };
        var obstructionClass = "obstruction";
        var eraseRoverOnScreen = function () {
            $("td").removeClass(function (index, className) {
                return (className.match(/(^|\s)rover-\S+/g) || []).join(' ');
            });
        };
        var showRoverInLocation = function (location, orientation) {
            eraseRoverOnScreen();
            //$("#" + location).addClass(orientationStyleMap[orientation]);
            addClassToLocation(orientationStyleMap[orientation], location);
        };
        var displayMessage = function (message) {
            $displayMessageElement.html(message);
        };
        var displayObstructions = function (obstructionLocations) {
            var currentObstructionLocation;
            for (var i = 0; i < obstructionLocations.length; i++) {
                currentObstructionLocation = obstructionLocations[i];
                addClassToLocation(obstructionClass, currentObstructionLocation);
            }
        };
        return {
            displayMessage: displayMessage,
            showRoverInLocation: showRoverInLocation,
            displayObstructions: displayObstructions

        };
    })();
    var controller = (function () {
        var moveRoverWithInstructions = function (roverInstructions) {
            var currentInstruction = "";
            var errorMessageNotDisplayed = true;
            for (var i = 0; i < roverInstructions.length; i++) {
                (function (i) {
                    setTimeout(function () {
                        currentInstruction = roverInstructions[i];
                        if (model.roverCanMove(currentInstruction) && errorMessageNotDisplayed === true) {
                            model.moveRoverByInstruction(currentInstruction);
                            view.showRoverInLocation(model.getCurrentLocation(), model.getCurrentOrientation());
                        } else {
                            if (errorMessageNotDisplayed === true) { view.displayMessage("Rover cannot move past obstruction."); }
                            errorMessageNotDisplayed = false;
                        }
                    }, 1000 * i);
                }(i));
            }
        };
        var moveRoverWithInstructions_old = function (roverInstructions) {
            var currentInstruction = "";
            for (var i = 0; i < roverInstructions.length; i++) {
                currentInstruction = roverInstructions[i];
                if (model.roverCanMove(currentInstruction)) {
                    model.moveRoverByInstruction(currentInstruction);
                    view.showRoverInLocation(model.getCurrentLocation(), model.getCurrentOrientation());
                } else {
                    view.displayMessage("Rover cannot move past obstruction.")
                    break;
                }
            }
        };
        var placeRoverInLocation = function (location, orientation) {
            if (model.locationHasObstruction(location)) {
                view.displayMessage("Rover cannot be transported to a location with an obstruction.")
            } else {
                model.placeRoverInLocation(location, orientation);
                view.showRoverInLocation(model.getCurrentLocation(), model.getCurrentOrientation());
            }
        };
        return {
            moveRoverWithInstructions: moveRoverWithInstructions,
            placeRoverInLocation: placeRoverInLocation
        };
    })();
    var model = (function () {
        var gridSize = 7;
        var currentLocation = "";
        var currentOrientation = "";
        var obstructionLocations = ["06"];
        var obstructionLocations = ["06", "34", "51"];
        var placeRoverInLocation = function (location, orientation) {
            currentLocation = location;
            currentOrientation = orientation;
        };
        var instructionIsRotation = function (instruction) { return instruction === "R" || instruction === "L"; }
        var instructionIsMovement = function (instruction) { return instruction === "B" || instruction === "F"; }
        var wrap = function (step, wrapSize) {
            if (step < 0) { return wrapSize - 1; }
            if (step >= wrapSize) { return 0; }
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
            return obstructionLocations.indexOf(location) > -1;
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
        var getGridObstructionLocations = function(){ return obstructionLocations; }
        var getGridObstructionLocations = function () { return obstructionLocations; }
        return {
            placeRoverInLocation: placeRoverInLocation,
            getCurrentLocation: getCurrentLocation,
            getCurrentOrientation: getCurrentOrientation,
            roverCanMove: roverCanMove,
            moveRoverByInstruction: setNewLocationOrOrientationFromInstruction,
            getGridObstructionLocations: getGridObstructionLocations,
            locationHasObstruction : locationHasObstruction
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
            view.displayMessage("Instructions are invalid. Please use only 'l', 'r', 'b', or 'f' in uppercase or lowercase.")
        }

    };
    var stopFormSubmission = function () {
        $("form").submit(function (e) {
            e.preventDefault();
        });
    };
    var setUpCommandForm = function () {
        $("#moveButton").on("click.move", function (e) {
            view.displayMessage("");
            var moveInstructionText = $("#roverInput").val();
            processRoverInput(moveInstructionText);
        });
        $(document).on("keydown.move", function (e) {
            if (e.keyCode === 13) {
                $("#moveButton").trigger("click.move");
            }
        });

    };
    var setUpLocationForm = function () {
        $("#transportButton").on("click.transport", function (e) {
            var row = $("#roverLocationRow").val().toString();
            var column = $("#roverLocationColumn").val().toString();
            var newOrientation = $("#roverOrientation").val().toString();
            var newLocation = row + column;
            controller.placeRoverInLocation(newLocation, newOrientation);
        });
    };
    var startPage = function () {
        var startingLocation = "00";
        var startingOrientation = "N";
        var startingOrientation = "E";
        controller.placeRoverInLocation(startingLocation, startingOrientation);
        view.displayObstructions(model.getGridObstructionLocations());
        stopFormSubmission();
        setUpCommandForm();
        setUpLocationForm();
    };
    startPage();
});