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

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
