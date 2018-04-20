var bigL = [];
var bigFatString = "";

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
    })
};

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

//form response function
$(function() {
  // Get the form.
  var form = $('#artistSearch');

  // Set up an event listener for the contact form.
  $(form).submit(function(event) {
    // Stop the browser from submitting the form.
    event.preventDefault();
    // reset the data to be displayed
    var bigL = [];
    var bigFatString = "";

    //get the artist name
    let searchedArtist = $("#aritst").serialize().substr(7, $("#aritst").serialize().length)
    console.log("search form clicked, data submission was: " + searchedArtist);

    //run the getArtistLyrics function
    getArtistLyrics(searchedArtist);
  });
})

function getArtistLyrics(artistName) {
  $("#artistName").html(artistName);
  $.ajax({
      headers: {},
      url: "http://api.musixmatch.com/ws/1.1/artist.search?apikey=0980b0d4c04de99715efa813020dc6db&q_artist=" + artistName,
      dataType: "json",
    })
    .done(function(data) {
      console.log(data);
      let artistID = data.message.body.artist_list[0].artist.artist_id;
      console.log("artist ID is: " + artistID);
      getAlbums(artistID);
    })
    .fail(function() {
      console.log("error searched artist data");
    })
    .always(function() {
      console.log("search artist ran");
    })
}
