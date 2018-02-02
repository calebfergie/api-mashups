/* written based on https://www.kirupa.com/html5/making_http_requests_js.htm*/
var cryptoData = {};

function getCryptoData(url) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", url, false);
  xmlHttp.send();
  var response = JSON.parse(xmlHttp.responseText);
  return response;
}

function showCryptoData(data) {
  console.log(data[0].percent_change_1h);
  if (data[0].percent_change_1h > 0) {
    var direction = "positive";
    var dirVerb = "increased"
    var operator = "+"
    var color = "green"
  } else {
    var direction = "negative"
    var dirVerb = "decreased"
    var operator = "-"
    var color = "red"
  };
  console.log(direction);
  var oneHourLine = document.getElementById('liveText');
  oneHourLine.innerHTML = "In the past hour, the value of Ethereum has " + dirVerb + " by: " + operator + data[0].percent_change_1h + "%";
  oneHourLine.style.color = color;
}


cryptoData = getCryptoData("https://api.coinmarketcap.com/v1/ticker/ethereum/");
showCryptoData(cryptoData);