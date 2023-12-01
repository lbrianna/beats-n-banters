import express from "express";
const app = express();
import querystring from "query-string";
import request from "request";
import cors from "cors";
import mongoose from "mongoose";

const PORT = 5001;
var client_id = "22587a51ddb44d45ac62822b6013d144";
var client_secret = "fcbdd00791b84d08a2acc6ff84e6513e";
var redirect_uri = "http://localhost:5001/callback";

mongoose.set("strictQuery", false);
const mongoDB =
  "mongodb+srv://raquelgr:3hz5SZ7xZ8AQ9WJI@cluster0.qxk9qv0.mongodb.net/?retryWrites=true&w=majority";

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  console.log("Successful");
}

const corsOptions = {
  origin: "http://localhost:3000", // Update with your React app's origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  optionsSuccessStatus: 204,
  headers: {
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Origin": "http://localhost:3000",
  },
};
app.use(cors());
app.options("*", cors()); // include before other routes

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

//Schema
const sch = {
  token: String,
  refresh: String,
  username: String,
};
const monmodel = mongoose.model("USER", sch);

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
        Authorization:
          "Basic " +
          new Buffer.from(client_id + ":" + client_secret).toString("base64"),
        "content-type": "application/x-www-form-urlencoded",
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
        headers: {
          Authorization: "Bearer " + access_token,
        },
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

      //Look for username
      if (await monmodel.findOne({ username: userdata.id }).exec()) {
        let user = userdata.id;
        let newToken = body.access_token;
        let newRefresh = body.refresh_token;
        request.post("/put", async (req, res) => {
          const update = await monmodel.updateOne(
            { username: user },
            { token: newToken, refresh: newRefresh },
            { new: true }
          );
        });
      } else {
        //Post request to DATABASE
        request.post("/post", async (req, res) => {
          const usertoken = new monmodel({
            token: body.access_token,
            refresh: body.refresh_token,
            username: userdata.id,
          });
          const val = await usertoken.save();
        });
      }
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

app.get("/playlist/:user/:title/:sentence", async function (req, res, next) {
  //Start by creating playlist
  const userr = req.params.user;
  const tokens = await monmodel.findOne({ username: userr }).exec();
  const titlePlaylist = req.params.title;
  const sentence = req.params.sentence;

  let playlistID;
  let playlistLink;

  const postOptions = {
    url: `https://api.spotify.com/v1/users/${userr}/playlists`,
    body: JSON.stringify({ name: titlePlaylist, public: false }),
    dataType: "json",
    headers: {
      Authorization: "Bearer " + tokens.token,
      "Content-Type": "application/json",
    },
  };

  request.post(postOptions, function (error, response, body) {
    const results = JSON.parse(body);
    playlistID = results.id;
    playlistLink = results.external_urls.spotify;
  });

  //Iterate through each word in sentence
  let arr = sentence.split(" ");

  for (let i = 0; i < arr.length; i++) {
    //Search song
    let songID;

    await fetch(
      `https://api.spotify.com/v1/search?q=${arr[i]}&type=track&limit=10&offset=10`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + tokens.token,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        songID = data.tracks.items[0].uri;
      });

    //Adding song to playlist
    const postParams = {
      url: `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
      body: JSON.stringify({ uris: [songID] }),
      dataType: "json",
      headers: {
        Authorization: "Bearer " + tokens.token,
        "Content-Type": "application/json",
      },
    };
    request.post(postParams, function (error, response, body) {});
  }

  res.redirect(playlistLink);
});



app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
