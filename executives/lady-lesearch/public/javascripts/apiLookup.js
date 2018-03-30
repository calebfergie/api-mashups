  console.log("script linked");
  getExecs()

  function getCompanyData(exec) {}

  function getExecs() {
    console.log("getExecs called");
    $.ajax({
        url: "../data/ciks.json",
        type: "GET",
        dataType: "json",
        async: "false",
      })
      .done(function(json) {
        for (i = 0; i < json.length; i++) {
          console.log(json[i]);
        }
      })

      // Code to run if the request fails; the raw request and
      // status codes are passed to the function
      .fail(function(xhr, status, errorThrown) {
        alert("Sorry, there was a problem!");
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
      })
      // Code to run regardless of success or failure;
      .always(function(xhr, status) {});

  }

  // function makeList(list) {
  //
  //   //.push(list[i])
  //   return list
  // }