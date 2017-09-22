$(function () {
    var view = (function () {
        var $displayMessageElement = $("#messageArea");
        var orientationStyleMap = {
            "N": "rover-north",
            "E": "rover-east",
            "W": "rover-west",
            "S": "rover-south",
        }
        var showRoverInLocation = function (location, orientation) {
            //$(td[])
            $("#" + location).addClass(orientationStyleMap[orientation]);
        };
        var displayMessage = function (message) {
            $displayMessageElement.val(message);
        };
        return {
            displayMessage: displayMessage,
            showRoverInLocation: showRoverInLocation
        };
    })();
    var controller = (function () {

    })();
    var model = (function () {
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

    };
    var moveRoverWithInstructions = function (roverInstructions) { };
    var placeRoverInStartingPosition = function (location, orientation) {
        model.placeRoverInLocation(location, orientation);
        view.showRoverInLocation(location, orientation);

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
            var moveInstructionText = $("#roverInput").val();
            processRoverInput(moveInstructionText);
            
            
        });
    };
    var startPage = function () {
        var startingLocation = "01";
        var startingOrientation = "E";
        placeRoverInStartingPosition(startingLocation, startingOrientation);
        setUpCommandForm();
    };
    startPage();
});