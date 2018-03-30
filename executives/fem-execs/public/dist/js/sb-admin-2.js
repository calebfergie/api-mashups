/*!
 * Start Bootstrap - SB Admin 2 v3.3.7+1 (http://startbootstrap.com/template-overviews/sb-admin-2)
 * Copyright 2013-2016 Start Bootstrap
 * Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap/blob/gh-pages/LICENSE)
 */

// Built in jquery functions
$(function() {
  $('#side-menu').metisMenu();
});
//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function() {
  $(window).bind("load resize", function() {
    var topOffset = 50;
    var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
    if (width < 768) {
      $('div.navbar-collapse').addClass('collapse');
      topOffset = 100; // 2-row-menu
    } else {
      $('div.navbar-collapse').removeClass('collapse');
    }

    var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
    height = height - topOffset;
    if (height < 1) height = 1;
    if (height > topOffset) {
      $("#page-wrapper").css("min-height", (height) + "px");
    }
  });
  var url = window.location;
  // var element = $('ul.nav a').filter(function() {
  //     return this.href == url;
  // }).addClass('active').parent().parent().addClass('in').parent();
  var element = $('ul.nav a').filter(function() {
    return this.href == url;
  }).addClass('active').parent();

  while (true) {
    if (element.is('li')) {
      element = element.parent().addClass('in').parent();
    } else {
      break;
    }
  }
});

//Caleb function
var categoryList = [];
var categoryFreq = [];
var sectorList = [];
var sectorFreq = [];
var headcountList = [];
var companyList = [];
var donutJSON = [];
var donutJSON2 = [];
var sortHC = [];

var query;
var cikLength;
var spotlightNum = 1;


getDatas();

//Load data from JSON file of female execs and their CIKs, and get the data from
function getDatas() {
  //Get the JSON file with female exec names and CIKs
  $.getJSON("../data/ciks.json", function() {})
    // when done, use the resulting data
    .done(function(data) {
      //define the length of the list for comparison within the fuction
      var cikLength = data.length;

      // Create the project summary summary
      $("#project-summary").html("<i>The data on this page is pulled from multiple sources and API. The list of CEOs was defined by <a href=\"http://www.catalyst.org/knowledge/women-ceos-sp-500\">catalyst.org</a>. Each CEOs company is then searched in <a href=\"http://docs.intrinio.com/#u-s-fundamentals-and-stock-prices\">Intrinios U.S. Fundamentals and Stock Prices API</a>. The data from this API informs the charts below.<br><br>Finally, a search for a female CEO chosen at random is performed using the <a href=\"http://developer.nytimes.com/article_search_v2.json\"> New York Times Article API.</a></i>");
      // Create the male/female donut

      var mfJSON = [{
          label: "female",
          value: ((cikLength / 500) * 100).toFixed(0)
        },
        {
          label: "male",
          value: (((500 - cikLength) / 500) * 100).toFixed(0)
        }
      ];
      Morris.Donut({
        element: 'male-female-donut',
        data: mfJSON,
        colors: ["#0548D8", "#1BCFCF"],
        formatter: function(y, data) {
          return y + '%'
        },
        resize: true
      });

      //for each item in the data, do a bunch of stuff
      $.each(data, function(i, item) {
        //console.log(data[i]["CIK"]);
        var person = data[i]["Name"];
        var query = data[i]["CIK"];

        // lookup the CIK in the companies API and make charts
        $.ajax({
            url: "https://api.intrinio.com/companies?identifier=" + query,
            beforeSend: function(xhrObj) {
              // Request headers
              xhrObj.setRequestHeader("Authorization", "Basic MmNmMzFkN2JjYjk4Y2JkNDJjYTkyMGRhNDhlMGY3MWY6ZDRiYTNmNzQ3ZDk2NGUwY2M2MTc4YTFkN2U5OThjZjk=");
            },
            type: "GET",
            // Request body
            data: "{body}",
          })
          .done(function(data) {
            //collect information about each company
            var headcount = data["employees"];
            var ceo = data["ceo"];
            var name = data["name"];
            var category = data["industry_category"];
            var sector = data["sector"];
            console.log(ceo, name);
            var ceoList = ["Margaret M. Keane", "Marillyn A. Hewson", "Indra K. Nooyi", "Shira D. Goodman"];

            if (ceoList.indexOf(ceo) != -1 && spotlightNum < 5) {
              getSpotlight(spotlightNum, name, ceo, category);
              spotlightNum = spotlightNum + 1;
            }

            //create a headcount list
            headcountList.push(headcount);

            //create a company
            companyList.push(name);

            // and create frequency array for donut
            var present = categoryList.indexOf(category);
            // if the industry is
            if (present != -1) {
              var catCount = categoryFreq[present]["value"];
              catCount = catCount + 1;
              categoryFreq[present]["value"] = catCount;
            } else {
              categoryList.push(category);
              categoryFreq.push({
                "label": category,
                "value": 1
              });
            }
            var sectorExists = sectorList.indexOf(sector);
            if (sectorExists != -1) {
              var sectCount = sectorFreq[sectorList.indexOf(sector)]["value"];
              sectCount = sectCount + 1;
              sectorFreq[sectorList.indexOf(sector)]["value"] = sectCount;
            } else {
              sectorList.push(sector);
              sectorFreq.push({
                "label": sector,
                "value": 1
              });
            }

            // if this is the last item in the array, then load a donut chart and update the headcount
            if (i + 1 == cikLength) {
              //sort the data
              donutJSON = sectorFreq.sort(function(a, b) {
                return a.value > b.value;
              });

              donutJSON2 = categoryFreq.sort(function(a, b) {
                return a.value > b.value;
              });

              sortHC = headcountList.sort(function(a, b) {
                return a.value > b.value;
              });
              loadDonut(donutJSON, 'morris-donut-chart');
              loadDonut(donutJSON2, 'morris-donut-chart-2');
              getTextSummary(sortHC, companyList);
            }
            //console.log(JSON.stringify(donutJSON));
          })
          .fail(function() {
            alert("error loading company data");
          });
      });
      var randomSelection = Math.floor(Math.random() * (cikLength + 1))
      getArticles(data[randomSelection]["Name"]);
    })
    .fail(function() {
      console.log("error with step 1 - reading the");
    })
    .always(function() {
      console.log("complete");
    });
}

//Fill the donut with specifically formatted JSON data
function loadDonut(donutJSON, chart) {
  //console.log("loadDonut called - JSON look-a like-a dis: " + JSON.stringify(donutJSON));
  //add the data to the donut element or whatever
  Morris.Donut({
    element: chart,
    data: donutJSON,
    colors: ["#0548D8", "#0056D5", "#2BF686", "#90F0BF", "#1BCFCF"],
    resize: true
  });

};

// get 1 articles from NYT about person
function getArticles(person) {
  console.log("getArticles looking up " + person);
  $("#searchedPerson").html("Here are the ten most recent articles about " + person);
  // lookup one piece of news
  $.ajax({
      type: "GET",
      url: "https://api.nytimes.com/svc/search/v2/articlesearch.json",
      data: {
        'q': person,
        'response-format': "jsonp",
        'api-key': "97eacc19c3464813afb94c598c5849f8",
        'callback': 'svc_search_v2_articlesearch'
      },
    })
    .done(function(data) {
      //specify the part of the response we care about
      var articleList = data.response.docs
      //$("#newslist").html(articleList.headline);

      //try to find the most relevant article among the
      for (i = 0; i < articleList.length; i++) {
        $("#newslist" + i).html("<a href=" + articleList[i].web_url + ">" + articleList[i].headline.main + "</a>");
        console.log(articleList[i].headline);
        if (articleList[i].headline.main.indexOf(person) != -1) {
          //console.log("relevant article found: " + articleList[i].headline.main)
          var relevant = articleList[i].headline.main;
          break
        }
        //otherwise just take the first one
        else {
          //console.log("no especially relevant articles found. Using: " + articleList[0].headline.main);
          var relevant = articleList[0].headline.main;
        }

      }

    })
    .fail(function(data) {})
}

//get the highest and lowest headcount values
function getTextSummary(sortHC, companyList) {
  var listLength = sortHC.length - 1;
  var hcMin = sortHC[0];
  var hcMax = sortHC[listLength];
  var company1 = companyList[Math.round(listLength / 2)];
  var company2 = companyList[Math.round(1 + listLength / 2)];
  var company3 = companyList[Math.round(2 + listLength / 2)];
  $("#text-summary").html("This tab shows information about female CEOs in some of the largest companies in the United States. The S&P 500 is an index of the 500 largest companies (market capitalization) in the US. <b>Of these 500 companies, " + cikLength + " have female CEOs.</b><br><br>These executives preside over companies with employee headcounts between " + hcMin + " and " + hcMax + " people. They lead companies like <b>" + company1 + ", " + company2 + ", and " + company3 + "</b>.<br><br>Who are these women and what companies do they lead? This tab shows some details about them.<br><br>");
}

function getSpotlight(spotlightNum, name, ceo, category) {
  $("#spotlight" + spotlightNum).html(name);
  $("#exec" + spotlightNum).html(ceo);
  $("#industry" + spotlightNum).html(category);
}