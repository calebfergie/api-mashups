//var apiKey = require('../config/apiKeys.js');
var playerTable = [];
var nbaKey;

//load a table of every players name and corresponding ID
$(function createPlayerTable() {
  // $.get('../config/apiKeys.js', function(data) {
  //   console.log(data.NBA);
  //   //var nbaKey = data.NBA
  // });
  $.ajax({
      url: "https://api.fantasydata.net/v3/nba/stats/JSON/Players",
      beforeSend: function(xhrObj) {
        // Request headers
        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "eb52dd05503e4a1fb0881d1f4f7e807d");
      },
      type: "GET",
      // Request body
      data: "{body}",
    })
    .done(function(data) {
      console.log("success - loaded " + data.length + " records");
      for (let i = 0; i < data.length; i++) {
        var fullName = data[i]["FirstName"] + " " + data[i]["LastName"];
        var playerID = data[i]["PlayerID"];
        playerTable.push([fullName, playerID]);
        //console.log(fullName + " :" + playerID);
      };
      // if user.firstname == i["FirstName"] && user.lastname = i["LastName"]
      //   playerID = i["PlayerID"]
      // };
      console.log("success creating player table");
    })
    .fail(function() {
      alert("error loading player table");
    });
});


// Search and display stats of player after search button is clicked
$('.nbaSearch').click(function getStats() {

  //find the players ID
  let playerID;
  let query = $('#playerName').val();
  for (let i = 0; i < playerTable.length; i++) {
    if (playerTable[i][0] == query) {
      playerID = playerTable[i][1];
      console.log("Match found. " + query + "'s player ID is: " + playerID);
    }

    //create the API request
  }
  let searchURL = "https://api.fantasydata.net/v3/nba/stats/JSON/Player/" + playerID;
  $.ajax({
      url: searchURL,
      beforeSend: function(xhrObj) {
        // Request headers
        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "eb52dd05503e4a1fb0881d1f4f7e807d");
      },
      type: "GET",
      // Request body
      data: "{body}",
    })
    .done(function(data) {
      $('.results').replaceWith("Team: " + data["Team"] + "  | Position: " + data["Position"]);
      $('.results').collapse('show');
    })
    .fail(function() {
      alert("error getting data - check the name spelling");
      $('.results').replaceWith("Team: None  | Position: None");
    });
});