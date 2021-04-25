var unirest = require("unirest");

var req = unirest("GET", "https://community-open-weather-map.p.rapidapi.com/weather");

req.query({
    "q": "74700",
    "lat": "0",
    "lon": "0",
    // "callback": "test",
    "id": "2172797",
    "lang": "null",
    "units": "\"metric\" or \"imperial\"",
    // "mode": "xml, html"
});

req.headers({
    "x-rapidapi-key": "9ec041d35bmsh8d61a075a2dc489p15c201jsn1aa6b2498965",
    "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
    "useQueryString": true
});


req.end(function (res) {
    if (res.error) throw new Error(res.error);

    console.log(JSON.stringify(res.body, null, 2));
    // console.log(res.body);
});