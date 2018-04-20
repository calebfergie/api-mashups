  //lexicons - overall, per-artist, and statistics about the lexical body
var lexicon = [];
var artistLexes = [];
var lexStats = [];

var LexStatsText = "";
var lyrics;
var boringWords = ["a", "an", "the", "and", "then", "are", "is", "it", "or", "that", "to", "in", "of", "", "i", "you", "my", "on", "your", "i'm", "with", "for", "this", "we", "but", "if","me","be","oh","do","like","got"];


//maestro div creator, lex initializer, and lookup function
function getArtistLyrics(artistName, slot) {
  $.ajax({
      headers: {
      },
      url: "http://api.musixmatch.com/ws/1.1/artist.search?apikey=0980b0d4c04de99715efa813020dc6db&q_artist=" + artistName,
      type: 'GET',
      dataType: 'json'
    })
    .done(function(data) {
      console.log(data);
      let artistID = data.message.body.artist_list[0].artist.artist_id;
      let artistName = data.message.body.artist_list[0].artist.artist_name;
      artistLexes.push([simpleName(artistName)]); //create an array for the artist specifically
      lexStats.push([artistName, [0, 0, 0]]); // create a line in a table of album, song, and word counts
      let lexPosition = artistLexes.length - 1;
      $("#artistsSpotlight").append($("<div class=\"artistBox\" id=\"artistBox"+artistLexes.length+"\" artistName=" +simpleName(artistName) +"><container class=\"artistName\" id=name" + simpleName(artistName) + "></container><container class=\"artistPhoto\" id=photo" + simpleName(artistName) + "></container><container class=\"artistWordcount\" id=wordCount" + simpleName(artistName) + "></br></container><container class=\"artistLexicon\" id=lex" + simpleName(artistName) + "><a href=''>Show Lexicon</a></container></div>"));
      $("#name" + simpleName(artistName)).append(artistName + "</br>");
      console.log("artist ID is: " + artistID + ", artist is: " + artistName);
      getAlbums(artistID, lexPosition);
    })
    .fail(function(data) {
      console.log("error searched artist data");
    })
    .always(function() {
      console.log("search artist ran");
    })
}

//API lookup triage: getAlbums -> getSongs -> getLyrics (separate API calls)
function getAlbums(artistID, lexPosition) {
  $.ajax({
      headers: {},
      url: "http://api.musixmatch.com/ws/1.1/artist.albums.get?apikey=0980b0d4c04de99715efa813020dc6db&artist_id=" + artistID,
      dataType: "json",
    })
    .done(function(data) {
      for (i = 0; i < data.message.body.album_list.length; i++) {
        let album = data.message.body.album_list[0].album.album_id;
        lexStats[lexPosition][1][0] = lexStats[lexPosition][1][0] + 1; //add one to the album counter for this artist
        getSongs(album, lexPosition);
      };
    })
    .fail(function() {
      console.log("error loading album data");
    })
    .always(function() {
      console.log("getAlbums ran");
    })
};

function getSongs(albumID, lexPosition) {
  $.ajax({
      headers: {},
      url: "http://api.musixmatch.com/ws/1.1/album.tracks.get?apikey=0980b0d4c04de99715efa813020dc6db&album_id=" + albumID,
      dataType: "json",
    })
    .done(function(data) {
      for (i = 0; i < data.message.body.track_list.length; i++) {
        let song = data.message.body.track_list[i].track.track_id;
        lexStats[lexPosition][1][1] = lexStats[lexPosition][1][1] + 1; //add one to the song counter for this artist
        getLyrics(song, lexPosition);
      };

    })
    .fail(function() {
      console.log("error loading song data");
    })
    .always(function() {
      console.log("getSongs ran");
    })
};

//text cleansing happens here
function getLyrics(trackID, lexPosition) {
  $.ajax({
      headers: {},
      url: "http://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=0980b0d4c04de99715efa813020dc6db&track_id=" + trackID,
      dataType: "json",
    })
    .done(function(data) {
      lyrics = data.message.body.lyrics.lyrics_body; //get the full lyrics_body field from the api
      lyrics = lyrics.substr(0, lyrics.length - 74); //remove legalese in the beginning
      lyrics = lyrics.trim(); // remove excess spaces
      lyrics = lyrics.replace(/\n|\r/g, " "); // replace line breaks with spaces
      lyrics = lyrics.replace(/\?|\,|\.|\!|\(|\)/g, "") // replace punctuation with nothing - based on https://stackoverflow.com/questions/4328500/how-can-i-strip-all-punctuation-from-a-string-in-javascript-using-regex
      lyrics = lyrics.split(" ");
      //more ambitions: pluralization, pop/shift etc. javascript issues

      //finally check to see if it is a boring word and add it to the lexicon if it isnt
      for (i = 0; i < lyrics.length; i++) {
        if (boringWords.indexOf(lowerCase(lyrics[i])) == -1) {
          //console.log(lyrics[i] + " is a not boring word");
          lexStats[lexPosition][1][2] = lexStats[lexPosition][1][2] + 1; //add one to the word/lyric counter
          lexicalize(lowerCase(lyrics[i]), lexPosition);
        }
      }
    })
    .fail(function() {
      console.log("error loading lyrics data");
    })
    .always(function() {
      console.log("getLyrics ran");
      showLexStats(lexStats);
    })
};

//Single lyric API lookup triage for testing: getOneAlbum -> getOneSong -> getLyrics (3 calls total)
function getOneAlbum(artistID, lexPosition) {
  $.ajax({
      headers: {},
      url: "http://api.musixmatch.com/ws/1.1/artist.albums.get?apikey=0980b0d4c04de99715efa813020dc6db&artist_id=" + artistID,
      dataType: "json",
    })
    .done(function(data) {
      let album = data.message.body.album_list[0].album.album_id;
      lexStats[lexPosition][1][0] = lexStats[lexPosition][1][0] + 1; //add one to the album counter for this artist
      getOneSong(album, lexPosition);
    })
    .fail(function() {
      console.log("error loading album data");
    })
    .always(function() {
      console.log("getOneAlbum ran");
    })
};

function getOneSong(albumID, lexPosition) {
  $.ajax({
      headers: {},
      url: "http://api.musixmatch.com/ws/1.1/album.tracks.get?apikey=0980b0d4c04de99715efa813020dc6db&album_id=" + albumID,
      dataType: "json",
    })
    .done(function(data) {
      let song = data.message.body.track_list[0].track.track_id;
      lexStats[lexPosition][1][1] = lexStats[lexPosition][1][1] + 1; //add one to the song counter for this artist
      getLyrics(song, lexPosition);
    })
    .fail(function() {
      console.log("error loading song data");
    })
    .always(function() {
      console.log("getOneSong ran");
    })
};

//DATA MGMT
//add word to lexicons
function lexicalize(word, lexPosition) {
  if (lexicon[word]) {
    //console.log("this word is not new to us");
    lexicon[word] = lexicon[word] + 1;
  } else {
    lexicon[word] = 1;
  }
  if (artistLexes[lexPosition][word]) {
    //console.log("this word is not new to us");
    artistLexes[lexPosition][word] = artistLexes[lexPosition][word] + 1;
  } else {
    artistLexes[lexPosition][word] = 1;
  }
}
//adapted from https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
function lowerCase(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}
//adapted from https://stackoverflow.com/questions/25500316/sort-a-dictionary-by-value-in-javascript
function sortDictByFreq(dict) {
  // Create topEntries array
  let topEntries = Object.keys(dict).map(function(key) {
    return [key, dict[key]];
  });

  // Sort the array based on the second element
  topEntries.sort(function(first, second) {
    return second[1] - first[1];
  });

  // Create a new array with only the 40 topEntries
  topEntries = topEntries.slice(0, 40);
  return topEntries;
};
//remove characters from artist names to prevent DOM errors
function simpleName(name) {
  name = name.replace(" ", "");
  name = name.replace(".", "");
  return name;
}

// DATA VIZ
function showLexStats(lexStats) {
  let totalWords = 0;
  for (i = 0; i < lexStats.length; i++) {
    let elementName = "#wordCount" + simpleName(lexStats[i][0]);
    $(elementName).html("");
    $(elementName).append(lexStats[i][1][2] + " words<br/>")
    //let artistLine = lexStats[i][0] + ": " + lexStats[i][1][0] + " albums, " + lexStats[i][1][1] + " songs, and " + ;
    //LexStatsText = LexStatsText + artistLine;
    totalWords = totalWords + lexStats[i][1][2]
    $("#wordCountAllAritsts").html("");
    $("#wordCountAllAritsts").append(totalWords + " total words");
  }

  //$('#lexStats').html(LexStatsText + "<br/>Press \"analyze\" when ready");
}

// D3 stuff
function showAnalysis(dataSet,domElement,topX) {
  let start = 0;
  let shortList = dataSet;
  if(domElement != '#artistBox0') {
    shortList.splice(0,1);            ////whyyyy does it splice the regular thing???
  };
  shortList = sortDictByFreq(shortList);
  let valuesList = [];
  let labelsList = [];
  for (i = 0; i < topX; i++) {
    valuesList.push(shortList[i][1]);
    labelsList.push(shortList[i][0]);
  }

  //check to see if there is already data loaded
  if (d3.select("#"+domElement+"svg")) {
    d3.select("#"+domElement+"svg").remove();
  }
  //make the canvas and draw the data
  var svg = d3.select("#"+domElement).append("svg")
    .attr("height", "100%")
    .attr("width", "100%")
    .attr("id",domElement+"svg")

  svg.selectAll("rect")
    .data(valuesList)
    .enter().append("rect")
    .attr("height", "15")
    .attr("width", function(d, i) {
      return (d / valuesList.length + 1)
    }) //will need to adjust for size of dataset
    .attr("x", "100")
    .attr("y", function(d, i) {
      return (i * 20) + 15
    });

  svg.selectAll("text")
    .data(labelsList)
    .enter().append("text")
    .text(function(d) {
      return d
    })
    .attr("x", "0")
    .attr("y", function(d, i) {
      return (i * 20) + 23
    });
}

// PAGE RESPONSE STUFF
//artist 1 search response function
$(function() {
  var form = $('#artistSearch1'); // Get the form
  var analyzeButton = $('#analyzeButton'); // Get the analyze button
  // Set up an event listeners for the forms and buttons
  $(form).submit(function(event) {
    // Stop the browser from submitting the form.
    event.preventDefault();
    let searchedArtist = $("#aritst1").serialize().substr(7, $("#aritst1").serialize().length)
    getArtistLyrics(searchedArtist, 1);

  });
  $('#artistBox0').click(function(event) {
    sortDictByFreq(lexicon);
    showAnalysis(lexicon,'artistBox0',40);
  });
  $(resetButton).click(function(event) {
    lexicon = [];
    topEntries = [];
    $("#artistsSpotlight").html("<div class=\"artistBox\" id=\"artistBox0\" artistName=\"allArtists\"><container class=\"artistName\" id=\"nameAllAritsts\">All Aritsts</container></br><container class=\"artistPhoto\" id=\"photoAllAritsts\"></container><container class=\"artistWordcount\" id=\"wordCountAllAritsts\">0 words</container></br><container class=\"artistLexicon\" id=\"lexiconAllAritsts\"><a href=''>Show Lexicon</a></container></div>");
    console.log("lexicons cleared")
  });
})

// pretty interaction stuff on the page

$("#artistsSpotlight").on("mouseover", '.artistBox',function() {
  $(this).addClass("highlight");
  $(this).on("click", '.artistBox', function() {
    console.log("clickyboy" + " | " + this.name);
  }
)}
);

  $("#artistsSpotlight").on("mouseleave",'.artistBox',function() {
    $(this).removeClass("highlight");
    $(this).on("click", function() {console.log("clicked on " + $(this).attr('artistName'))
    for (i=0; i < artistLexes.length; i++) {
      if (artistLexes[i][0] == $(this).attr('artistName')) {
        showAnalysis(artistLexes[i],$(this).attr('id'),10);
      }
    }
  })

  });
