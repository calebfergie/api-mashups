var bigL = [];
var bigFatString = "";
var lexicon = [["hello",1]];
var wordList = [];
var statsList = [];

//API lookup triage
function getAlbums(artistID) {
  $.ajax({
      headers: {},
      url: "http://api.musixmatch.com/ws/1.1/artist.albums.get?apikey=0980b0d4c04de99715efa813020dc6db&artist_id=" + artistID,
      dataType: "json",
    })
    .done(function(data) {
      for (i = 0; i < data.message.body.album_list.length; i++) {
        let album = data.message.body.album_list[i].album.album_id;
        getSongs(album);
        //displayLyrics(bigL);
      };
    })
    .fail(function() {
      console.log("error loading album data");
    })
    .always(function() {
      console.log("getAlbums ran");
    })
};

function getSongs(albumID) {
  $.ajax({
      headers: {},
      url: "http://api.musixmatch.com/ws/1.1/album.tracks.get?apikey=0980b0d4c04de99715efa813020dc6db&album_id=" + albumID,
      dataType: "json",
    })
    .done(function(data) {
      for (i = 0; i < data.message.body.track_list.length; i++) {
        let song = data.message.body.track_list[i].track.track_id;
        getLyrics(song);
      };

    })
    .fail(function() {
      console.log("error loading song data");
    })
    .always(function() {
      console.log("getSongs ran");
    })
};

function getLyrics(trackID) {
  $.ajax({
      headers: {},
      url: "http://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=0980b0d4c04de99715efa813020dc6db&track_id=" + trackID,
      dataType: "json",
    })
    .done(function(data) {
      let lyrics = data.message.body.lyrics.lyrics_body;
      lyrics = lyrics.substr(0, lyrics.length - 74);
      //console.log(lyrics);
      bigL.push(lyrics);
    })
    .fail(function() {
      console.log("error loading lyrics data");
    })
    .always(function() {
      console.log("getLyrics ran");
      bigFatString = "";
      for (i = 0; i < bigL.length; i++) {
        bigFatString = bigFatString + bigL[i];
      };
      $("#lyrics").html(bigFatString);
      processLyrics(bigFatString);
    })
};


//Single track lookup triage for testing
function getOneAlbum(artistID) {
  $.ajax({
      headers: {},
      url: "http://api.musixmatch.com/ws/1.1/artist.albums.get?apikey=0980b0d4c04de99715efa813020dc6db&artist_id=" + artistID,
      dataType: "json",
    })
    .done(function(data) {
      let album = data.message.body.album_list[0].album.album_id;
      getOneSong(album);
    })
    .fail(function() {
      console.log("error loading album data");
    })
    .always(function() {
      console.log("getOneAlbum ran");
    })
};

function getOneSong(albumID) {
  $.ajax({
      headers: {},
      url: "http://api.musixmatch.com/ws/1.1/album.tracks.get?apikey=0980b0d4c04de99715efa813020dc6db&album_id=" + albumID,
      dataType: "json",
    })
    .done(function(data) {
      let song = data.message.body.track_list[0].track.track_id;
      getLyrics(song);
    })
    .fail(function() {
      console.log("error loading song data");
    })
    .always(function() {
      console.log("getOneSong ran");
    })
};

//function called by button presses
function getArtistLyrics(artistName, slot) {
  $("#artistName"+slot).html(artistName);
  $.ajax({
      headers: {},
      url: "http://api.musixmatch.com/ws/1.1/artist.search?apikey=0980b0d4c04de99715efa813020dc6db&q_artist=" + artistName,
      dataType: "json",
    })
    .done(function(data) {
      console.log(data);
      let artistID = data.message.body.artist_list[0].artist.artist_id;
      console.log("artist ID is: " + artistID);
      getOneAlbum(artistID);
    })
    .fail(function() {
      console.log("error searched artist data");
    })
    .always(function() {
      console.log("search artist ran");
    })
}

function processLyrics(lyricsString) {
  console.log("processing lyrics");
  wordList = lyricsString.split(" ");
  let loopLength = lexicon.length;
  for (i = 0; i < wordList.length; i++) { // loop through the word list
    // console.log("word is: " + wordList[i]);
    //check if the word is already in the lexicon
    let existing = false;
    for (j = 0; j < lexicon.length; j++) { // loop through lexicon list
      //console.log("comparing " + lexicon[j][0] + " and " + wordList[i]);
      if (lexicon[j][0] == wordList[i]) { // if the word is already in the lexicon
        lexicon[j][1] = lexicon[j][1] + 1;
        console.log("word is in lexicon already, " + lexicon[j][1] + " time(s)");
        existing = true;
        break
      }
        //lexicon[lexicon.indexOf(j)][1] = lexicon[lexicon.indexOf(j)][1] + 1; // add a count of the word to the array
      }

      if (existing === false) {
        lexicon.push([wordList[i],1]);         // add it to lexicon with a count of 1;
        console.log("word added to lexicon");
      }
  }
lexicon.sort(compareNumbers);
analyzeLexicon(lexicon);
}

//modified comparison function (from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
function compareNumbers(a, b) {
  return b[1] - a[1];
}

// make the details appear
function analyzeLexicon(lexicon) {
  $("#stats").html("");
  console.log("running lexicon analyzer")
  for (i = 0; i< lexicon.length; i++) {
    if(lexicon[i][1] > 2) {
      statsList.push(lexicon[i])
    }
  }
  $("#stats").html(statsList);
}

//form1 response function
$(function() {
  // Get the form.
  var form = $('#artistSearch1');

  // Set up an event listener for the contact form.
  $(form).submit(function(event) {
    // Stop the browser from submitting the form.
    event.preventDefault();
    // reset the data to be displayed
    var bigL = [];
    var bigFatString = "";

    //get the artist name
    let searchedArtist = $("#aritst1").serialize().substr(7, $("#aritst1").serialize().length)
    console.log("search form clicked, data submission was: " + searchedArtist);

    //run the getArtistLyrics function
    getArtistLyrics(searchedArtist, 1);
  });
})

//form2 response function
$(function() {
  // Get the form.
  var form = $('#artistSearch2');

  // Set up an event listener for the contact form.
  $(form).submit(function(event) {
    // Stop the browser from submitting the form.
    event.preventDefault();
    // reset the data to be displayed
    var bigL = [];
    var bigFatString = "";

    //get the artist name
    let searchedArtist = $("#aritst2").serialize().substr(7, $("#aritst2").serialize().length)
    console.log("search form clicked, data submission was: " + searchedArtist);

    //run the getArtistLyrics function
    getArtistLyrics(searchedArtist, 2);
  });
})
