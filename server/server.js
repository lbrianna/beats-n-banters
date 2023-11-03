import express from "express";
const app = express();
import querystring from "query-string";
import request from "request";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";

const PORT = 5001;
var client_id = "22587a51ddb44d45ac62822b6013d144";
var client_secret = "fcbdd00791b84d08a2acc6ff84e6513e";
var redirect_uri = "http://localhost:5001/callback";

app.use(cors());

app.get("/login", function (req, res, next) {
  var scope =
    "user-read-private user-read-email playlist-read-collaborative playlist-modify-public playlist-read-private playlist-modify-private";
  const state = "abcdefghijklmnop";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

app.get("/callback", async function (req, res, next) {
  var code = req.query.code || null;
  var state = req.query.state || null;

  if (state === null) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          new Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };
  }
  request.post(authOptions, async function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token,
        refresh_token = body.refresh_token;

      var options = {
        url: "https://api.spotify.com/v1/me",
        headers: { Authorization: "Bearer " + access_token },
        json: true,
      };
      // use the access token to access the Spotify Web API
      let userdata;
      await fetch(options.url, {
        method: "GET",
        headers: options.headers,
      })
        .then((response) => response.json())
        .then((data) => {
          userdata = data;
        });

      // let merged = {
      //   ...body,
      //   ...userdata,
      //   ...{ url: "http://localhost:3000" },
      // };
      // res.send(merged);
      res.redirect("http://localhost:3000/redirect");
    } else {
      res.redirect(
        "/#" +
          querystring.stringify({
            error: "invalid_token",
          })
      );
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
