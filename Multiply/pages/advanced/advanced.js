﻿(function () {
    "use strict";

    var timeCtrl = null, fixed_num = -1;
    var appData = Windows.Storage.ApplicationData.current;
    var localSettings = appData.localSettings;
    var mistakeCount = 0, max_right = 11;

    WinJS.UI.Pages.define("/pages/advanced/advanced.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            mistakeCount = 0;
            max_right = 11;
            fixed_num = parseInt(options.toString());

            for (var var_num = 0; var_num <= 10; var_num++) {
                var row = document.createElement("tr");

                var fixed = document.createElement("td");
                fixed.innerText = fixed_num;

                var mult = document.createElement("td");
                mult.innerText = " x ";

                var numCol = document.createElement("td");
                numCol.innerText = var_num;

                var equals = document.createElement("td");
                equals.innerText = " = ";

                var result = document.createElement("td");
                result.innerText = var_num * fixed_num;

                row.appendChild(fixed);
                row.appendChild(mult);
                row.appendChild(numCol);
                row.appendChild(equals);
                row.appendChild(result);

                id('readTable').appendChild(row);
            }

            for (var var_num = 0; var_num <= 10; var_num++) {
                var row = document.createElement("tr");

                var fixed = document.createElement("td");
                fixed.innerText = fixed_num;

                var mult = document.createElement("td");
                mult.innerText = " x ";

                var numCol = document.createElement("td");
                numCol.innerText = var_num;

                var equals = document.createElement("td");
                equals.innerText = " = ";

                var result = document.createElement("td");
                var resBox = document.createElement("input");
                resBox.id = var_num * fixed_num;
                resBox.addEventListener("focusout", checkResult, false);
                resBox.size = 3;
                result.appendChild(resBox);

                row.appendChild(fixed);
                row.appendChild(mult);
                row.appendChild(numCol);
                row.appendChild(equals);
                row.appendChild(result);

                id('testTable').appendChild(row);
            }

            id('reset').addEventListener("click", resetTable, false);
            id('showTest').addEventListener("click", showTable, false);

            timeCtrl = setInterval(timer, 500);

        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
            clearInterval(timeCtrl);
        }
    });

    var mistakeCount = 0, max_right = 11;

    function checkResult(eventInfo) {
        if (this.value) {
            if (this.id == this.value) {
                id("mistakeCount").innerHTML = mistakeCount;
                document.getElementById(this.id).setAttribute("style", "background-color:white");
                if (!(--max_right)) {
                    clearInterval(timeCtrl);
                    //applaudAudio.volume = localSettings.values["volume"];
                    //applaudAudio.play();
                    var message = "Good Job, " + localSettings.values["usrName"] + "!!! You've completed this level in " +
                        (hours < 10 ? "0" : "") + hours + ":" + (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs +
                         " with " + mistakeCount + " mistakes. ";

                    if (localSettings.values["highscores"])
                        localSettings.values["highscores"] = localSettings.values["highscores"] + localSettings.values["usrName"] + "," + localSettings.values["level"] + "," + mistakeCount + "," + hours + ":" + mins + ":" + secs + ".";
                    else localSettings.values["highscores"] = localSettings.values["usrName"] + "," + localSettings.values["level"] + "," + mistakeCount + "," + hours + ":" + mins + ":" + secs + ".";
                    
                    if (mistakeCount > 5) {
                        message += "Why don't you try it again?";
                    }
                    else {
                        message += "You've been upgraded to the next level!!!";
                        upgradeLevel();
                    }
                    var msgBox = new Windows.UI.Popups.MessageDialog(message);
                    msgBox.showAsync();

                    
                }
            }
            else {
                mistakeCount++;
                id("mistakeCount").innerHTML = mistakeCount + ": Check that Again!";
                document.getElementById(this.id).setAttribute("style", "background-color:red");
            }
        }
    }

    function id(element) {
        return document.getElementById(element);
    }

    var hours = 0, mins = 0, secs = 0;
    var blink = true;
    var separator = ":";
    function timer() {
        blink ? (++secs, separator = " ", blink = false) : (separator = ":", blink = true);
        (secs == 60) ? (++mins, secs = 0) : true;
        (mins == 60) ? (++hours, mins = 0) : true;
        id('timeCounter').innerHTML = (hours < 10 ? "0" : "") + hours + separator + (mins < 10 ? "0" : "") + mins + separator + (secs < 10 ? "0" : "") + secs;
    }

    function resetTable() {
        for (var var_num = 0; var_num <= 10; var_num++) {
            id(var_num * fixed_num).value = "";
        }
        hours = 0, mins = 0, secs = 0;
    }

    function showTable() {
        id('readTable').style.visibility = "hidden";
        id('showTest').style.visibility = "hidden";
        id('testTable').style.visibility = "visible";
    }

    function upgradeLevel() {
        var new_level = fixed_num + 1;
        if (new_level > localSettings.values["level"])
            localSettings.values["level"] = new_level;
    }
})();