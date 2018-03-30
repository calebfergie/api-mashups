getAlbums(29013475);

function getAlbums(artistID) {
  $.ajax({
      headers: {},
      url: "http://api.musixmatch.com/ws/1.1/artist.albums.get?apikey=0980b0d4c04de99715efa813020dc6db&artist_id=" + artistID,
    })
    .done(function(data) {
      console.log(data);
      for i in data[albums].length;
      getSongs(data[album][i]);
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
    })
    .done(function(data) {
      console.log(data);
      for i in data[songs].length;
      getLyrics(data[song][i]);
    })
    .fail(function() {
      console.log("error loading song data");
    })
    .always(function() {
      console.log("getSongs ran");
    })
};

function getLyrics(songID) {
  $.ajax({
      headers: {},
      url: "http://api.musixmatch.com/ws/1.1/album.tracks.get?apikey=0980b0d4c04de99715efa813020dc6db&album_id=" + songID,
    })
    .done(function(data) {
      console.log(data);
      //collect and display the data
    })
    .fail(function() {
      console.log("error loading lyrics data");
    })
    .always(function() {
      console.log("getLyrics ran");
    })
};