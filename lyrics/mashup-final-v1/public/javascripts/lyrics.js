let tempdata; // debugging dataset

let lexicon = [];
let artistLexes = [];
let lexStats = [];

searchArtist("Cardi B");


function searchArtist(artistQuery) {
  $.ajax({
    type: "GET",
    data: {
      apikey: "0980b0d4c04de99715efa813020dc6db",
      q_artist: artistQuery,
      format: "jsonp",
      callback: "jsonp_callback"
    },
    url: "https://api.musixmatch.com/ws/1.1/artist.search",
    dataType: "jsonp",
    jsonpCallback: 'jsonp_callback',
    contentType: 'application/json',
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    }
  }).done(function(data) {
    let artistID = data.message.body.artist_list[0].artist.artist_id;
    let artistName = data.message.body.artist_list[0].artist.artist_name;
    console.log(artistName)
    artistLexes.push(artistName, []);
    getAlbums(artistID, artistLexes.length);
  });
};

function getAlbums(aritstID) {
  $.ajax({
    type: "GET",
    data: {
      apikey: "0980b0d4c04de99715efa813020dc6db",
      artist_id: aritstID,
      format: "jsonp",
      callback: "jsonp_callback"
    },
    url: "https://api.musixmatch.com/ws/1.1/artist.albums.get",
    dataType: "jsonp",
    jsonpCallback: 'jsonp_callback',
    contentType: 'application/json',
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    }
  }).done(function(data) {
    let albumList = data.message.body.album_list;
    console.log(albumList)
    let albumID;
    for (i in albumList) {
      albumID = albumList[i].album.album_id;
      getSongs(albumID);
    }


  });
};

function getSongs(albumID) {
  // http://api.musixmatch.com/ws/1.1/album.tracks.get?apikey=0980b0d4c04de99715efa813020dc6db&album_id=28578970
  $.ajax({
    type: "GET",
    data: {
      apikey: "0980b0d4c04de99715efa813020dc6db",
      album_id: albumID,
      format: "jsonp",
      // callback: "jsonp_callback"
    },
    url: "https://api.musixmatch.com/ws/1.1/album.tracks.get",
    dataType: "jsonp",
    // jsonpCallback: 'jsonp_callback',
    contentType: 'application/json',
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    }
  }).done(function(data) {
    console.log(data.message.body)
    let songlist = data.message.body;
    tempdata = songlist;
  });
};

// function getAlbums(artistID, lexPosition) {
//   $.ajax({
//     type: "GET",
//     data: {
//       apikey: "0980b0d4c04de99715efa813020dc6db",
//       artist_id: artistID,
//       format: "jsonp",
//       callback: "jsonp_callback"
//     },
//     url: "https://api.musixmatch.com/ws/1.1/artist.albums.get",
//     dataType: "jsonp",
//     jsonpCallback: 'jsonp_callback',
//     contentType: 'application/json',
//     success: function(data) {
//       let albumList = data.message.body.album_list;
//       for (i in albumList) {
//         let albumID = data.message.body.album_list[i].album.album_id;
//         getSongs(albumID, lexPosition);
//       };
//     },
//     error: function(jqXHR, textStatus, errorThrown) {
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     }
//   });
// };
//
// function getSongs(albumID, lexPosition) {
//   console.log("Looking up album no.  " + albumID);
//   $.ajax({
//     type: "GET",
//     data: {
//       apikey: "0980b0d4c04de99715efa813020dc6db",
//       album_id: albumID,
//       format: "jsonp",
//       callback: "jsonp_callback"
//     },
//     url: "https://api.musixmatch.com/ws/1.1/album.tracks.get",
//     dataType: "jsonp",
//     jsonpCallback: 'jsonp_callback',
//     contentType: 'application/json',
//     success: function(data) {
//       tempdata = data;
//     },
//     error: function(jqXHR, textStatus, errorThrown) {
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     }
//   });
// };
